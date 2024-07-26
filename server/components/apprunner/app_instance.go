package apprunner

import (
	"bytes"
	"context"
	_ "embed"
	"encoding/base64"
	"errors"
	"fmt"
	"net/http"
	"reflect"
	"runtime/debug"
	"strings"
	"sync"
	"sync/atomic"
	"time"

	"regexp"

	disgohookapi "github.com/DisgoOrg/disgohook/api"
	"github.com/bytedance/sonic"
	"github.com/clarkmcc/go-typescript"
	"github.com/dop251/goja"
	"github.com/dop251/goja_nodejs/console"
	"github.com/dop251/goja_nodejs/eventloop"
	"github.com/dop251/goja_nodejs/require"
	gonano_wallet "github.com/hectorchu/gonano/wallet"
	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/server/auth"
	"github.com/tnyim/jungletv/server/components/apprunner/gojautil"
	"github.com/tnyim/jungletv/server/components/apprunner/modules"
	"github.com/tnyim/jungletv/server/components/apprunner/modules/chat"
	"github.com/tnyim/jungletv/server/components/apprunner/modules/configuration"
	"github.com/tnyim/jungletv/server/components/apprunner/modules/db"
	"github.com/tnyim/jungletv/server/components/apprunner/modules/ipc"
	"github.com/tnyim/jungletv/server/components/apprunner/modules/keyvalue"
	"github.com/tnyim/jungletv/server/components/apprunner/modules/pages"
	"github.com/tnyim/jungletv/server/components/apprunner/modules/points"
	"github.com/tnyim/jungletv/server/components/apprunner/modules/process"
	"github.com/tnyim/jungletv/server/components/apprunner/modules/profile"
	"github.com/tnyim/jungletv/server/components/apprunner/modules/queue"
	"github.com/tnyim/jungletv/server/components/apprunner/modules/rpc"
	"github.com/tnyim/jungletv/server/components/apprunner/modules/spectators"
	"github.com/tnyim/jungletv/server/components/apprunner/modules/wallet"
	authinterceptor "github.com/tnyim/jungletv/server/interceptors/auth"
	"github.com/tnyim/jungletv/types"
	"github.com/tnyim/jungletv/utils"
	"github.com/tnyim/jungletv/utils/event"
	"github.com/tnyim/jungletv/utils/transaction"
	"golang.org/x/exp/maps"
	"golang.org/x/exp/slices"
	"google.golang.org/grpc"
)

type transpiledFilesMapKey struct {
	fileName   string
	forBrowser bool
}

type appInstance struct {
	state              *appInstanceState
	applicationID      string
	applicationVersion types.ApplicationVersion
	applicationUser    auth.User
	applicationWallet  *gonano_wallet.Wallet

	mu                sync.RWMutex
	ranInitCode       bool
	exitCode          int
	runner            *AppRunner
	loop              *eventloop.EventLoop
	appLogger         *appLogger
	modules           *modules.Collection
	pagesModule       pages.PagesModule
	rpcModule         rpc.RPCModule
	ipcModule         ipc.IPCModule
	userSerializer    *gojautil.UserSerializerImplementation
	transpiledFiles   map[transpiledFilesMapKey][]byte
	transpiledFilesMu sync.Mutex

	modLogWebhook    disgohookapi.WebhookClient
	auditEntryAddedU func()

	// promisesWithoutRejectionHandler are rejected promises with no handler,
	// if there is something in this map at an end of an event loop then it will exit with an error.
	// It's similar to what Deno and Node do.
	promisesWithoutRejectionHandler map[*goja.Promise]struct{}

	// context for this instance's current execution: derives from the context passed in StartOrResume(), lives as long as each execution of this instance does
	ctx                context.Context
	ctxCancel          context.CancelCauseFunc
	executionWaitGroup sync.WaitGroup
	stopWatchdog       func()
	feedWatchdog       func()
	vmInterrupt        func(v any)
	vmClearInterrupt   func()
}

type panicResult struct {
	recoverResult interface{}
	stack         []byte
}

func (p panicResult) String() string {
	return fmt.Sprintf("%v, stack trace: %v", p.recoverResult, string(p.stack))
}

var ErrApplicationInstanceAlreadyRunning = errors.New("application instance already running")
var ErrApplicationInstanceAlreadyPaused = errors.New("application instance already paused")
var ErrApplicationInstanceTerminated = errors.New("application instance terminated")
var ErrApplicationFileNotFound = errors.New("application file not found")
var ErrApplicationFileTypeMismatch = errors.New("unexpected type for application file")

// ErrApplicationInstanceNotRunning is returned when the specified application is not running
var ErrApplicationInstanceNotRunning = errors.New("application instance not running")

func (r *AppRunner) newAppInstance(applicationID string, applicationVersion types.ApplicationVersion, applicationWallet *gonano_wallet.Wallet) (*appInstance, error) {
	d := r.moduleDependencies
	instance := &appInstance{
		state: &appInstanceState{
			onPaused:     event.NewNoArg(),
			onTerminated: event.NewNoArg(),
		},
		applicationID:                   applicationID,
		applicationVersion:              applicationVersion,
		applicationWallet:               applicationWallet,
		runner:                          r,
		modules:                         &modules.Collection{},
		appLogger:                       NewAppLogger(applicationID),
		promisesWithoutRejectionHandler: make(map[*goja.Promise]struct{}),
		userSerializer:                  gojautil.NewUserSerializer(d.UserCache),
		transpiledFiles:                 make(map[transpiledFilesMapKey][]byte),
		modLogWebhook:                   d.ModLogWebhook,
	}

	accountIndex := uint32(0)
	account, err := applicationWallet.NewAccount(&accountIndex)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	instance.applicationUser = auth.NewApplicationUser(account.Address(), instance.applicationID)

	instance.modules.RegisterNativeModule(keyvalue.New(instance))
	instance.modules.RegisterNativeModule(process.New(instance))
	instance.modules.RegisterNativeModule(points.New(instance, d.PointsManager))
	instance.modules.RegisterNativeModule(db.New(instance))
	walletModule := wallet.New(instance, applicationWallet, d.PaymentAccountPool, d.DefaultAccountRepresentative)
	instance.modules.RegisterNativeModule(walletModule)
	instance.pagesModule = pages.New(instance)
	instance.modules.RegisterNativeModule(instance.pagesModule)
	instance.modules.RegisterNativeModule(chat.New(instance, d.ChatManager, instance.pagesModule, instance.userSerializer))
	instance.modules.RegisterNativeModule(queue.New(instance, d.PointsManager, d.MediaQueue, d.MediaProviders, d.Pricer, d.SkipManager, d.OtherMediaQueueMethods, instance.pagesModule, walletModule, instance.userSerializer))
	instance.rpcModule = rpc.New(instance.userSerializer)
	instance.modules.RegisterNativeModule(instance.rpcModule)
	instance.modules.RegisterNativeModule(configuration.New(instance, r.configManager, r.notifManager, instance.pagesModule))
	instance.modules.RegisterNativeModule(profile.New(instance, instance.userSerializer, d.ChatManager))
	instance.modules.RegisterNativeModule(spectators.New(instance, d.RewardsHandler, d.StatsRegistry, instance.userSerializer))
	instance.ipcModule = ipc.New(instance)
	instance.modules.RegisterNativeModule(instance.ipcModule)

	registry := instance.modules.BuildRegistry(instance.sourceLoader)
	registry.RegisterNativeModule(console.ModuleName, console.RequireWithPrinter(instance.appLogger))
	instance.loop = eventloop.NewEventLoop(eventloop.WithRegistry(registry))

	instance.appLogger.RuntimeLog("application instance created")

	return instance, nil
}

// Terminated returns the event that is fired when the application instance is terminated
func (a *appInstance) Terminated() event.NoArgEvent {
	return a.state.Terminated()
}

// Paused returns the event that is fired when the application instance is paused. Fired before Terminated
func (a *appInstance) Paused() event.NoArgEvent {
	return a.state.Paused()
}

func (a *appInstance) getMainFile() (*types.ApplicationFile, bool, error) {
	ctx, err := transaction.Begin(a.ctx)
	if err != nil {
		return nil, false, stacktrace.Propagate(err, "")
	}
	defer ctx.Commit() // read-only tx

	files, err := types.GetApplicationFilesWithNamesForApplicationAtVersion(ctx, a.applicationID, a.applicationVersion, []string{MainFileName, MainFileNameTypeScript})
	if err != nil {
		return nil, false, stacktrace.Propagate(err, "")
	}
	file, ok := files[MainFileName]
	tsFile, tsok := files[MainFileNameTypeScript]
	if !ok && !tsok {
		return nil, false, stacktrace.Propagate(ErrApplicationFileNotFound, "main application file not found")
	}
	if ok {
		if !slices.Contains(validServerScriptMIMETypes, file.Type) {
			return nil, false, stacktrace.Propagate(ErrApplicationFileTypeMismatch, "main application file has wrong type")
		}
		return file, false, nil
	}
	if !slices.Contains(validServerTypeScriptMIMETypes, tsFile.Type) {
		return nil, false, stacktrace.Propagate(ErrApplicationFileTypeMismatch, "main application file has wrong type")
	}
	return tsFile, true, nil
}

// StartOrResume starts or resumes the application instance, returning an error if it is already running
func (a *appInstance) StartOrResume(ctx context.Context) error {
	a.mu.Lock()
	defer a.mu.Unlock()

	state := a.state.Snapshot()
	if state.IsTerminated() {
		return stacktrace.Propagate(ErrApplicationInstanceTerminated, "")
	}
	if state.IsRunning() {
		return stacktrace.Propagate(ErrApplicationInstanceAlreadyRunning, "")
	}

	a.ctx, a.ctxCancel = context.WithCancelCause(ctx)
	a.userSerializer.SetContext(a.ctx)

	if a.vmClearInterrupt != nil {
		a.vmClearInterrupt()
	}
	a.loop.Start()
	a.state.MarkAsRunning()
	a.stopWatchdog, a.feedWatchdog = a.startWatchdog(30 * time.Second)

	if !a.ranInitCode {
		// ensure that the nicknames table has the applicationID associated with this application,
		// such that loading the application user (e.g. via UserCache) always returns an user associated with the ID of this application
		// types.GetApplicationWalletAddress relies on this, which in turn is relied upon to resolve application profiles based on their ID
		// (quite messy, but works for now)
		nickname := a.runner.moduleDependencies.ChatManager.GetNickname(ctx, a.applicationUser)
		err := a.runner.moduleDependencies.ChatManager.SetNickname(ctx, a.applicationUser, nickname, true)
		if err != nil {
			return stacktrace.Propagate(err, "")
		}

		mainFile, isTypeScript, err := a.getMainFile()
		if err != nil {
			return stacktrace.Propagate(err, "")
		}

		a.loop.RunOnLoop(func(r *goja.Runtime) {
			r.SetPromiseRejectionTracker(a.promiseRejectionTracker)

			// in its infinite wisdom, the eventloop doesn't expose any way to interrupt a running script
			// and the approach used in e.g. runOnLoopWithInterruption doesn't work for e.g. infinite loops
			// scheduled by JS functions in a JS setTimeout call.
			// so we do something we theoretically shouldn't do here, which is bring the values from the loop VM out of the
			// context of RunOnLoop, but which after a "whitebox excursion" into the event loop code, should be fine
			a.vmInterrupt = r.Interrupt
			a.vmClearInterrupt = r.ClearInterrupt

			_, err = r.RunScript("", runtimeBaseCode)

			a.modules.ExecutionResumed(a.ctx, &a.executionWaitGroup)
			a.modules.EnableModules(r)
			a.appLogger.RuntimeLog("application instance started")
		})

		mainSource := string(mainFile.Content)
		if isTypeScript {
			a.Schedule(func(vm *goja.Runtime) error {
				mainSourceBytes, err := a.transpileTS(mainFile.Name, mainFile.Content, false)
				if err != nil {
					return err
				}
				err = vm.Set("exports", vm.NewObject())
				if err != nil {
					return stacktrace.Propagate(err, "")
				}
				mainSource = string(mainSourceBytes)
				return nil
			})
		}

		a.Schedule(func(vm *goja.Runtime) error {
			_, err = vm.RunScript(MainFileName, mainSource)
			return err // do not propagate, user code, there's no need to make the stack trace more confusing
		})

		if a.modLogWebhook != nil {
			a.auditEntryAddedU = a.appLogger.AuditEntryAdded().SubscribeUsingCallback(event.BufferAll, a.sendLogEntryToModLog)
		}
		a.ranInitCode = true
	} else {
		a.loop.RunOnLoop(func(r *goja.Runtime) {
			a.modules.ExecutionResumed(a.ctx, &a.executionWaitGroup)
		})
	}

	return nil
}

func (a *appInstance) sendLogEntryToModLog(entry ApplicationLogEntry) {
	_, err := a.modLogWebhook.SendContent(
		fmt.Sprintf("Application `%s` %s",
			a.applicationID, entry.Message()))
	if err != nil {
		a.appLogger.RuntimeError(fmt.Sprint("Failed to send mod log webhook:", err))
	}
}

func (a *appInstance) startWatchdog(tolerateEventLoopStuckFor time.Duration) (func(), func()) {
	doneCh := make(chan struct{})
	feedCh := make(chan struct{})
	feedWatchdog := func() {
		select {
		case feedCh <- struct{}{}:
		default:
		}
	}
	interval := a.loop.SetInterval(func(vm *goja.Runtime) {
		feedWatchdog()
		for promise := range a.promisesWithoutRejectionHandler {
			value := promise.Result()
			if !goja.IsUndefined(value) && !goja.IsNull(value) {
				if obj := value.ToObject(vm); obj != nil {
					if stack := obj.Get("stack"); stack != nil {
						value = stack
					}
				}
			}
			a.appLogger.RuntimeError(fmt.Sprintf("Uncaught (in promise) %s", value))
		}
		maps.Clear(a.promisesWithoutRejectionHandler)
	}, 1*time.Second)
	go func() {
		timer := time.NewTimer(tolerateEventLoopStuckFor)
		defer timer.Stop()
		for {
			select {
			case <-doneCh:
				return
			case <-feedCh:
				if !timer.Stop() {
					<-timer.C
				}
				timer.Reset(tolerateEventLoopStuckFor)
			case <-timer.C:
				a.appLogger.RuntimeError(fmt.Sprintf("application event loop stuck for at least %v, terminating", tolerateEventLoopStuckFor))
				a.Terminate(true, 0*time.Second, false)
				return
			}
		}
	}()

	return func() {
		select {
		case doneCh <- struct{}{}:
		default:
		}
		a.loop.ClearInterval(interval)
	}, feedWatchdog
}

func (a *appInstance) ExecutionContext() context.Context {
	return a.ctx
}

func (a *appInstance) Schedule(f func(vm *goja.Runtime) error) {
	a.runOnLoopWithInterruption(a.ctx, func(vm *goja.Runtime) {
		err := f(vm)
		if err != nil {
			a.appLogger.RuntimeError(err.Error())
		}
	}, func(p panicResult) {
		a.appLogger.RuntimeError(p.String())
	})
}

func (a *appInstance) ScheduleNoError(f func(vm *goja.Runtime)) {
	a.runOnLoopWithInterruption(a.ctx, f, func(x panicResult) {
		a.appLogger.RuntimeError(fmt.Sprint(x))
	})
}

func (a *appInstance) runOnLoopWithInterruption(ctx context.Context, f func(*goja.Runtime), panicCb func(panicResult)) bool {
	return a.loop.RunOnLoop(func(vm *goja.Runtime) {
		a.feedWatchdog() // if we got scheduled then the loop is not stuck
		ranChan := make(chan struct{}, 1)
		waitGroup := sync.WaitGroup{}
		waitGroup.Add(1)
		go func() {
			select {
			case <-ctx.Done():
				vm.Interrupt(appInstanceInterruptValue)
			case <-ranChan:
			}
			waitGroup.Done()
		}()

		func() {
			defer func() {
				if x := recover(); x != nil {
					if panicCb != nil {
						panicCb(panicResult{x, debug.Stack()})
					}
				}
			}()
			f(vm)
		}()

		ranChan <- struct{}{}
		waitGroup.Wait()
		vm.ClearInterrupt()
	})
}

func (a *appInstance) promiseRejectionTracker(promise *goja.Promise, operation goja.PromiseRejectionOperation) {
	// See https://tc39.es/ecma262/#sec-host-promise-rejection-tracker for the semantics
	// There is no need to synchronize accesses to this map because this function and the only function that reads it
	// (the watchdog function) run inside the event loop
	switch operation {
	case goja.PromiseRejectionReject:
		a.promisesWithoutRejectionHandler[promise] = struct{}{}
	case goja.PromiseRejectionHandle:
		delete(a.promisesWithoutRejectionHandler, promise)
	}
}

var appInstanceInterruptValue = struct{}{}

// Pause pauses the application instance.
// If waitUntilStopped is true and the application is already paused, ErrApplicationInstanceAlreadyPaused will be returned
func (a *appInstance) Pause(force bool, after time.Duration, waitUntilStopped bool) error {
	p := func() error {
		a.mu.Lock()
		defer a.mu.Unlock()
		return stacktrace.Propagate(a.pause(force, after, false), "")
	}
	if waitUntilStopped {
		return stacktrace.Propagate(p(), "")
	}
	go p()
	return nil
}

// Terminate permanently stops the application instance and signals for it to be destroyed.
// If waitUntilTerminated is true and the application is already terminated, ErrApplicationInstanceTerminated will be returned
func (a *appInstance) Terminate(force bool, after time.Duration, waitUntilTerminated bool) error {
	t := func() error {
		a.mu.Lock()
		defer a.mu.Unlock()

		if a.state.IsTerminated() {
			return stacktrace.Propagate(ErrApplicationInstanceTerminated, "")
		}
		err := a.pause(force, after, true)
		if err != nil {
			return stacktrace.Propagate(err, "")
		}

		a.state.MarkAsTerminated()

		if a.auditEntryAddedU != nil {
			a.auditEntryAddedU()
		}

		return nil
	}
	if waitUntilTerminated {
		return stacktrace.Propagate(t(), "")
	}
	go t()
	return nil
}

// pause must run within write mutex
func (a *appInstance) pause(force bool, after time.Duration, toTerminate bool) error {
	if a.state.IsPaused() {
		return stacktrace.Propagate(ErrApplicationInstanceAlreadyPaused, "")
	}

	a.state.MarkAsPausing()

	a.stopWatchdog()
	a.stopWatchdog = nil

	verbPresent, verbPast := "pausing", "paused"
	if toTerminate {
		verbPresent, verbPast = "terminating", "terminated"
	}

	if force {
		a.appLogger.RuntimeLog(fmt.Sprintf("%s application instance, interrupting after %s", verbPresent, after.String()))
	} else {
		a.appLogger.RuntimeLog(fmt.Sprintf("%s application instance", verbPresent))
	}

	var interruptTimer *time.Timer
	if force {
		interrupt := func() {
			a.appLogger.RuntimeLog(fmt.Sprintf("interrupting execution after waiting %s", after.String()))
			a.vmInterrupt(appInstanceInterruptValue)
			a.ctxCancel(stacktrace.NewError("application execution interrupted"))
			a.appLogger.RuntimeLog("execution interrupted")
		}
		if after == 0 {
			interrupt()
		} else {
			interruptTimer = time.AfterFunc(after, interrupt)
		}
	}

	jobs := a.loop.Stop()
	if toTerminate {
		a.loop.Terminate()
	}
	if interruptTimer != nil {
		interruptTimer.Stop()
	}
	a.ctxCancel(stacktrace.NewError("application execution interrupted"))
	a.executionWaitGroup.Wait()
	plural := "s"
	if jobs == 1 {
		plural = ""
	}
	exitCodeMsg := ""
	if toTerminate {
		exitCodeMsg = fmt.Sprintf(" and exit code %d", a.exitCode)
	}
	a.appLogger.RuntimeLog(fmt.Sprintf("application instance %s with %d job%s remaining%s", verbPast, jobs, plural, exitCodeMsg))
	a.state.MarkAsPaused()
	return nil
}

func (a *appInstance) Running() (bool, types.ApplicationVersion, time.Time) {
	// it's important that this doesn't lock a.mu to avoid deadlocks on termination
	snapshot := a.state.Snapshot()
	return snapshot.IsRunning(), a.applicationVersion, snapshot.StartedOrTerminatedAt()
}

func (a *appInstance) sourceLoader(vm *goja.Runtime, filename string) ([]byte, error) {
	if filename == "node_modules/tslib" {
		return tslibCode, nil
	}
	ctx, err := transaction.Begin(a.ctx)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	defer ctx.Commit() // read-only tx

	filenames := []string{filename}
	if !strings.HasSuffix(filename, ".js") {
		filenames = append(filenames, filename+".ts")
	}

	files, err := types.GetApplicationFilesWithNamesForApplicationAtVersion(ctx, a.applicationID, a.applicationVersion, filenames)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	for f, file := range files {
		isJSON := file.Type == "application/json"
		isTypeScript := slices.Contains(validServerTypeScriptMIMETypes, file.Type)
		if !isJSON && !isTypeScript && !slices.Contains(validServerScriptMIMETypes, file.Type) {
			return nil, stacktrace.Propagate(ErrApplicationFileTypeMismatch, "source file has wrong type")
		}

		if isTypeScript {
			transpiled, err := a.transpileTS(f, file.Content, false)
			if err != nil {
				return nil, stacktrace.Propagate(err, "")
			}
			return []byte(transpiled), nil
		}

		return file.Content, nil
	}
	return nil, errors.Join(require.ModuleFileDoesNotExistError, stacktrace.Propagate(ErrApplicationFileNotFound, "required file not found"))
}

var sourceMappingRegex = regexp.MustCompile(`//# sourceMappingURL=data:application/json;base64,(.*)`)

func (a *appInstance) transpileTS(filename string, source []byte, forBrowser bool) ([]byte, error) {
	a.transpiledFilesMu.Lock()
	defer a.transpiledFilesMu.Unlock()

	mapKey := transpiledFilesMapKey{
		fileName:   filename,
		forBrowser: forBrowser,
	}

	if js, ok := a.transpiledFiles[mapKey]; ok {
		return js, nil
	}

	moduleName := strings.TrimSuffix(filename, ".ts")

	compilerOptions := typeScriptCompilerOptions
	if forBrowser {
		compilerOptions = typeScriptCompilerOptionsForBrowser
		a.appLogger.RuntimeLog("transpiling TypeScript file " + filename + " for browser context")
	} else {
		a.appLogger.RuntimeLog("transpiling TypeScript file " + filename)
	}

	transpiled, err := typescript.TranspileCtx(
		a.ctx,
		bytes.NewReader(source),
		typescript.WithCompileOptions(compilerOptions),
		typescript.WithVersion(TypeScriptVersion),
		typescript.WithModuleName(moduleName))
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	// fix filename in source mapping, unfortunately always comes out as module.ts despite us setting the module name correctly
	transpiled = utils.ReplaceAllStringSubmatchFunc(sourceMappingRegex, transpiled, func(groups []string) string {
		decoded, err := base64.StdEncoding.DecodeString(groups[1])
		if err != nil {
			return groups[1]
		}
		// in our case the "name of the compiled file" is the same as the source file, as there's no actual compiled file being created at any point, it's all in-memory
		n := fmt.Sprintf(`"%s"`, filename)
		replacer := strings.NewReplacer(`"module.ts"`, n, `"module.js"`, n)
		decoded = []byte(replacer.Replace(string(decoded)))
		return `//# sourceMappingURL=data:application/json;base64,` + base64.StdEncoding.EncodeToString(decoded)
	})

	if forBrowser {
		// work around "works as intended" TypeScript problem
		// https://github.com/microsoft/TypeScript/issues/41567
		// https://github.com/microsoft/TypeScript/issues/41562
		// https://github.com/microsoft/TypeScript/issues/41513
		// this allows us to use "import type" in browser scripts without the whole thing going into module mode
		// a better approach might be to check if the original code really intends to be a module and only destroy the module aspect of the resulting TS code,
		// if and only if the original code did not intend to be a module (namely, if it only contains `import type` but no `import` and no `export`).
		transpiled = strings.Replace(transpiled, `Object.defineProperty(exports, "__esModule", { value: true });`, "", 1)

		a.appLogger.RuntimeLog("transpiled TypeScript file " + filename + " for browser context")
	} else {
		a.appLogger.RuntimeLog("transpiled TypeScript file " + filename)
	}
	a.transpiledFiles[mapKey] = []byte(transpiled)
	return []byte(transpiled), nil
}

func (a *appInstance) EvaluateExpression(ctx context.Context, expression string) (bool, string, time.Duration, error) {
	type evalResult struct {
		result     string
		successful bool
	}
	result, executionTime, err := runOnLoopSynchronouslyAndGetResult(ctx, a, func(vm *goja.Runtime) (evalResult, error) {
		result, err := vm.RunString(expression)
		if err != nil {
			return evalResult{
				successful: false,
				result:     err.Error(),
			}, nil
		}
		return evalResult{
			result:     resultString(vm, result, 0),
			successful: true,
		}, nil
	})
	return result.successful, result.result, executionTime, stacktrace.Propagate(err, "")
}

func runOnLoopSynchronouslyAndGetResult[T any](ctx context.Context, a *appInstance, cb func(vm *goja.Runtime) (T, error)) (T, time.Duration, error) {
	if !a.state.IsRunning() {
		return *new(T), 0, stacktrace.Propagate(ErrApplicationInstanceNotRunning, "")
	}

	type result[T any] struct {
		value         T
		err           error
		executionTime time.Duration
	}
	resultChan := make(chan result[T], 1)
	panicChan := make(chan panicResult, 1)
	couldHavePaused := &atomic.Int32{}
	couldHavePaused.Store(1)
	submitted := a.runOnLoopWithInterruption(ctx, func(vm *goja.Runtime) {
		couldHavePaused.Store(0)
		start := time.Now()
		value, err := cb(vm)
		resultChan <- result[T]{
			value:         value,
			err:           err,
			executionTime: time.Since(start),
		}
	}, func(p panicResult) {
		panicChan <- p
	})

	if !submitted {
		return *new(T), 0, stacktrace.Propagate(ErrApplicationInstanceTerminated, "")
	}

	onPaused, pausedU := a.Paused().Subscribe(event.BufferFirst)
	defer pausedU()

	for {
		select {
		case result := <-resultChan:
			return result.value, result.executionTime, stacktrace.Propagate(result.err, "")
		case reason := <-panicChan:
			var z T
			return z, 0, stacktrace.NewError(reason.String())
		case <-onPaused:
			if couldHavePaused.Load() == 1 {
				// application paused before our loop function could run / before our expression returned
				return *new(T), 0, stacktrace.Propagate(ErrApplicationInstanceNotRunning, "")
			}
			// otherwise: application paused but we are still going to get a result
			// (even if it's an error due to the interrupt still being set)
			// so wait for resultChan
		}
	}
}

var maxResultStringDepth = 1

func resultString(vm *goja.Runtime, v goja.Value, depth int) string {
	if v == nil {
		return ""
	}
	t := v.ExportType()
	if t == nil {
		return v.String()
	}
	switch t.Kind() {
	case reflect.String:
		j, _ := sonic.Marshal(v.String())
		return string(j)
	case reflect.Slice:
		var arr []goja.Value
		err := vm.ExportTo(v, &arr)
		if err != nil {
			return "[...]"
		}
		if depth == maxResultStringDepth {
			if len(arr) == 0 {
				return "[]"
			} else {
				return "[...]"
			}
		}
		results := []string{}
		for i, e := range arr {
			if i == 10 {
				results = append(results, "...")
				break
			}
			results = append(results, resultString(vm, e, depth+1))
		}
		return fmt.Sprintf("[%s]", strings.Join(results, ", "))
	case reflect.Map:
		if depth == maxResultStringDepth {
			return "{...}"
		}
		obj := v.ToObject(vm)
		keys := obj.Keys()
		hadMore := len(keys) > 10
		if hadMore {
			keys = keys[:10]
		}
		results := []string{}
		for _, key := range keys {
			results = append(results, fmt.Sprintf("%s: %s", key, resultString(vm, obj.Get(key), depth+1)))
		}
		if hadMore {
			results = append(results, "...")
		}
		return fmt.Sprintf("%s {%s}", obj.ClassName(), strings.Join(results, ", "))
	case reflect.Func:
		if depth == maxResultStringDepth {
			return "function {...}"
		}
		// otherwise use the normal complete representation
	}

	return v.String()
}

func (a *appInstance) ApplicationID() string {
	return a.applicationID
}
func (a *appInstance) ApplicationVersion() types.ApplicationVersion {
	return a.applicationVersion
}
func (a *appInstance) ApplicationStartTime() time.Time {
	running, _, since := a.Running()
	if running {
		return since
	}
	return time.Time{}
}
func (a *appInstance) RuntimeVersion() int {
	return RuntimeVersion
}

func (a *appInstance) LifecycleManager() modules.LifecycleManager {
	return a
}
func (a *appInstance) AbortProcess() {
	_ = a.Terminate(true, 0, false)
}
func (a *appInstance) ExitProcess(exitCode int) {
	a.exitCode = exitCode
	_ = a.Terminate(true, 0, false)
}

func (a *appInstance) ApplicationUser() auth.User {
	return a.applicationUser
}

func (a *appInstance) Logger() modules.ApplicationLogger {
	return a.appLogger
}

func (a *appInstance) ResolvePage(pageID string) (pages.PageInfo, types.ApplicationVersion, bool) {
	if !a.state.IsRunning() {
		return pages.PageInfo{}, types.ApplicationVersion{}, false
	}
	p, ok := a.pagesModule.ResolvePage(pageID)
	return p, a.applicationVersion, ok
}

func (a *appInstance) ApplicationMethod(ctx context.Context, pageID, method string, args []string) (string, error) {
	user := authinterceptor.UserFromContext(ctx)
	invResult, _, err := runOnLoopSynchronouslyAndGetResult(ctx, a, func(vm *goja.Runtime) (rpc.InvocationResult, error) {
		// check page status when we're actually in the loop (to ensure the page was not unregistered between the check and us getting scheduled)
		if _, ok := a.pagesModule.ResolvePage(pageID); !ok {
			return rpc.InvocationResult{}, stacktrace.NewError("page not available")
		}

		return a.rpcModule.HandleInvocation(vm, user, pageID, method, args), nil
	})
	if err != nil {
		return "", stacktrace.Propagate(err, "")
	}
	if invResult.Synchronous {
		return invResult.Value, nil
	}

	asyncResult := <-invResult.AsyncResult
	result, _, err := runOnLoopSynchronouslyAndGetResult(ctx, a, func(vm *goja.Runtime) (string, error) {
		if asyncResult.Rejected {
			panic(asyncResult.Value.String())
		}
		resultJSON, err := asyncResult.JSONMarshaller(goja.Undefined(), asyncResult.Value)
		if err != nil {
			panic(err)
		}
		return resultJSON.String(), nil
	})
	return result, stacktrace.Propagate(err, "")
}

func (a *appInstance) ApplicationEvent(ctx context.Context, trusted bool, pageID string, eventName string, eventArgs []string) error {
	a.mu.RLock()
	defer a.mu.RUnlock()

	if !a.state.IsRunning() {
		return stacktrace.Propagate(ErrApplicationInstanceNotRunning, "")
	}

	user := authinterceptor.UserFromContext(ctx)

	a.Schedule(func(vm *goja.Runtime) error {
		// check page status when we're actually in the loop (to ensure the page was not unregistered between the check and us getting scheduled)
		if _, ok := a.pagesModule.ResolvePage(pageID); !ok {
			return nil
		}
		a.rpcModule.HandleEvent(vm, user, trusted, pageID, eventName, eventArgs)
		return nil
	})
	return nil
}

func (a *appInstance) ConsumeApplicationEvents(ctx context.Context, stream grpc.ServerStream, pageID string) (<-chan *grpc.PreparedMsg, func()) {
	ctx, cancel := context.WithCancel(ctx)

	userStr := ""
	user := authinterceptor.UserFromContext(ctx)
	if user != nil && !user.IsUnknown() {
		userStr = user.Address()
	}

	eventCh := make(chan *grpc.PreparedMsg)

	go func() {
		defer close(eventCh)

		onGlobalEvent, globalEventU := a.rpcModule.GlobalEventEmitted().Subscribe(event.BufferAll)
		defer globalEventU()

		onPageEvent, pageEventU := a.rpcModule.PageEventEmitted().Subscribe(pageID, event.BufferAll)
		defer pageEventU()

		onUserEvent, userEventU := a.rpcModule.UserEventEmitted().Subscribe(userStr, event.BufferAll)
		defer userEventU()

		onPageUserEvent, pageUserEventU := a.rpcModule.PageUserEventEmitted().Subscribe(rpc.PageUserTuple{Page: pageID, User: userStr}, event.BufferAll)
		defer pageUserEventU()

		terminatedU := a.state.Terminated().SubscribeUsingCallback(event.BufferFirst, cancel)
		defer terminatedU()

		onPageUnpublished, pageUnpublishedU := a.pagesModule.OnPageUnpublished().Subscribe(event.BufferFirst)
		defer pageUnpublishedU()

		for {
			var data rpc.ClientEventData
			select {
			case d := <-onGlobalEvent:
				data = d
			case d := <-onPageEvent:
				data = d
			case d := <-onUserEvent:
				data = d
			case d := <-onPageUserEvent:
				data = d
			case unpublishedPageID := <-onPageUnpublished:
				if pageID == unpublishedPageID {
					return
				}
				continue
			case <-ctx.Done():
				return
			}

			preparedMsg := &grpc.PreparedMsg{}
			err := preparedMsg.Encode(stream, &proto.ApplicationEventUpdate{
				Type: &proto.ApplicationEventUpdate_ApplicationEvent{
					ApplicationEvent: &proto.ApplicationServerEvent{
						Name:      data.EventName,
						Arguments: data.EventArgs,
					},
				},
			})
			if err != nil {
				continue
			}
			eventCh <- preparedMsg
		}
	}()

	return eventCh, cancel
}

func (a *appInstance) ServeFile(ctxCtx context.Context, fileName string, w http.ResponseWriter, req *http.Request) error {
	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	defer ctx.Commit() //read-only tx

	running, version, _ := a.Running()
	if !running {
		http.NotFound(w, req)
		return nil
	}

	files, err := types.GetApplicationFilesWithNamesForApplicationAtVersion(ctx, a.applicationID, version, []string{fileName})
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	file, ok := files[fileName]
	if !ok || !file.Public {
		http.NotFound(w, req)
		return nil
	}

	fileContent := file.Content
	fileType := file.Type
	if slices.Contains(validTypeScriptMIMETypes, file.Type) {
		fileContent, err = a.transpileTS(file.Name, fileContent, true)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			a.appLogger.RuntimeError("failed to transpile TypeScript file: " + err.Error())
			return nil
		}
		fileType = javaScriptMIMEType
	}

	w.Header().Add("Content-Type", fileType)
	w.Header().Set("X-Frame-Options", "sameorigin")
	http.ServeContent(w, req, "", file.UpdatedAt, bytes.NewReader(fileContent))
	return nil
}

func (a *appInstance) SendMessageToApplication(destinationApplicationID string, eventName string, serializedArgs []string) error {
	return stacktrace.Propagate(a.runner.SendMessageToApplication(destinationApplicationID, a.applicationID, eventName, serializedArgs), "")
}

func (a *appInstance) ReceiveMessageFromApplication(sourceApplicationID, eventName string, serializedArgs []string) error {
	a.mu.RLock()
	defer a.mu.RUnlock()

	if !a.state.IsRunning() {
		return stacktrace.Propagate(ErrApplicationInstanceNotRunning, "")
	}

	a.Schedule(func(vm *goja.Runtime) error {
		a.ipcModule.HandleMessage(vm, sourceApplicationID, eventName, serializedArgs)
		return nil
	})
	return nil
}

const runtimeBaseCode = `true;` // no-op at the moment

//go:embed tslib.js
var tslibCode []byte
