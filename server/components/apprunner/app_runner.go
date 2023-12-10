package apprunner

import (
	"context"
	"errors"
	"log"
	"net/http"
	"sort"
	"sync"
	"time"

	"github.com/bytedance/sonic"
	"github.com/hectorchu/gonano/wallet"
	"github.com/palantir/stacktrace"
	"github.com/patrickmn/go-cache"
	"github.com/sethvargo/go-limiter"
	"github.com/sethvargo/go-limiter/memorystore"
	"github.com/tnyim/jungletv/buildconfig"
	"github.com/tnyim/jungletv/server/components/apprunner/modules"
	chatmodule "github.com/tnyim/jungletv/server/components/apprunner/modules/chat"
	"github.com/tnyim/jungletv/server/components/apprunner/modules/pages"
	"github.com/tnyim/jungletv/server/components/apprunner/modules/rpc"
	"github.com/tnyim/jungletv/server/components/configurationmanager"
	"github.com/tnyim/jungletv/server/interceptors/auth"
	"github.com/tnyim/jungletv/server/stores/chat"
	"github.com/tnyim/jungletv/types"
	"github.com/tnyim/jungletv/utils/event"
	"github.com/tnyim/jungletv/utils/transaction"
)

// RuntimeVersion is the version of the application runtime
const RuntimeVersion = 1

// MainFileName is the name of the application file containing the application entry point
const MainFileName = "main.js"

// MainFileNameTypeScript is the name of the application TypeScript file containing the application entry point
const MainFileNameTypeScript = "main.ts"

const javaScriptMIMEType = "text/javascript"

// ServerScriptMIMEType is the content type of the application scripts executed by the server
const ServerScriptMIMEType = javaScriptMIMEType

var validJavaScriptMIMETypes = []string{javaScriptMIMEType, "application/javascript", "application/x-javascript"}
var validServerScriptMIMETypes = validJavaScriptMIMETypes

var validTypeScriptMIMETypes = []string{"text/typescript", "application/typescript", "application/x-typescript"}
var validServerTypeScriptMIMETypes = validTypeScriptMIMETypes

// TypeScriptVersion currently used by the application runtime
const TypeScriptVersion = "v4.9.3"

// when updating to a newer TypeScript version, make sure to also check for updates to tslib.js

var typeScriptCompilerOptions = map[string]interface{}{
	// goja supports most es6 features; es6 modules is one of the notable exceptions
	// see https://github.com/miragespace/heresy#supported-ecmascript-features for a good notion of how to transpile
	// "The recommended transpile target is ES2017. However, if you run into problems, ES6 can be used as a fallback."
	"target": "es2017",
	"module": "commonjs",

	// without this, iterating over maps with `for (const value of someMap.values())` breaks
	"downlevelIteration": "false",

	// fixes the lack of a "default" when importing our native "modules" like so: `import rpc from "jungletv:rpc"`. Also fixes importing JSON files in this style
	"esModuleInterop": "true",
	"inlineSourceMap": "true",
	"importHelpers":   "true",
}

var typeScriptCompilerOptionsForBrowser = map[string]interface{}{
	"target": "es2021", // same as what we use when compiling our frontend code
	"module": "none",   // see also: workaround in transpileTS in app_instance.go
	"inlineSourceMap": func() string {
		if buildconfig.LAB || buildconfig.DEBUG {
			return "true"
		}
		return "false"
	}(),
	"removeComments": func() string {
		if buildconfig.LAB || buildconfig.DEBUG {
			return "false"
		}
		return "true"
	}(),
}

// ErrApplicationNotFound is returned when the specified application was not found
var ErrApplicationNotFound = errors.New("application not found")

// ErrApplicationNotEnabled is returned when the specified application is not allowed to launch
var ErrApplicationNotEnabled = errors.New("application not enabled")

// ErrApplicationNotInstantiated is returned when the specified application is not instantiated
var ErrApplicationNotInstantiated = errors.New("application not instantiated")

// ErrApplicationLogNotFound is returned when the log for the specified application, or the specified application, was not found
var ErrApplicationLogNotFound = errors.New("application log not found")

// AppRunner launches applications and manages their lifecycle
type AppRunner struct {
	workerContext                  context.Context
	log                            *log.Logger
	configManager                  *configurationmanager.Manager
	walletBuilder                  WalletBuilder
	instances                      map[string]*appInstance
	recentLogs                     *cache.Cache[string, ApplicationLog]
	instancesLock                  sync.RWMutex
	onRunningApplicationsUpdated   event.Event[[]RunningApplication]
	onApplicationLaunched          event.Event[RunningApplication]
	onApplicationStopped           event.Event[RunningApplication]
	moduleDependencies             modules.Dependencies
	incomingClientEventRateLimiter limiter.Store
}

// WalletBuilder builds wallets for an application
type WalletBuilder interface {
	BuildApplicationWallet(applicationID string, earliestVersion types.ApplicationVersion) (*wallet.Wallet, error)
}

// New returns a new initialized AppRunner
func New(
	workerContext context.Context,
	log *log.Logger,
	configManager *configurationmanager.Manager,
	walletBuilder WalletBuilder) *AppRunner {
	rateLimiter, err := memorystore.New(&memorystore.Config{
		Tokens:   60,
		Interval: 1 * time.Second,
	})
	if err != nil {
		panic(stacktrace.Propagate(err, "failed to create rate limiter"))
	}
	return &AppRunner{
		workerContext:                  workerContext,
		configManager:                  configManager,
		walletBuilder:                  walletBuilder,
		instances:                      make(map[string]*appInstance),
		recentLogs:                     cache.New[string, ApplicationLog](1*time.Hour, 10*time.Minute),
		log:                            log,
		onRunningApplicationsUpdated:   event.New[[]RunningApplication](),
		onApplicationLaunched:          event.New[RunningApplication](),
		onApplicationStopped:           event.New[RunningApplication](),
		incomingClientEventRateLimiter: rateLimiter,
	}
}

func (r *AppRunner) SetModuleDependencies(d modules.Dependencies) {
	r.moduleDependencies = d
	r.moduleDependencies.ChatManager.SetAttachmentLoaderForType("apppage", r.pageAttachmentLoader)
}

func (r *AppRunner) BuildApplicationWallet(ctxCtx context.Context, applicationID string) (*wallet.Wallet, error) {
	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	defer ctx.Commit() // read-only tx

	earliestVersion, err := types.GetEarliestVersionOfApplication(ctx, applicationID)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	w, err := r.walletBuilder.BuildApplicationWallet(applicationID, earliestVersion)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	return w, nil
}

// RunningApplicationsUpdated is the event that is fired when the list of running applications changes
func (r *AppRunner) RunningApplicationsUpdated() event.Event[[]RunningApplication] {
	return r.onRunningApplicationsUpdated
}

// ApplicationLaunched is the event that is fired when an application is launched
func (r *AppRunner) ApplicationLaunched() event.Event[RunningApplication] {
	return r.onApplicationLaunched
}

// ApplicationStopped is the event that is fired when an application is stopped
func (r *AppRunner) ApplicationStopped() event.Event[RunningApplication] {
	return r.onApplicationStopped
}

// LaunchApplication launches the most recent version of the specified application
func (r *AppRunner) LaunchApplicationAtVersion(applicationID string, applicationVersion types.ApplicationVersion) error {
	err := r.launchApplication(r.workerContext, applicationID, applicationVersion)
	return stacktrace.Propagate(err, "")
}

// LaunchApplication launches the most recent version of the specified application
func (r *AppRunner) LaunchApplication(applicationID string) error {
	err := r.launchApplication(r.workerContext, applicationID, types.ApplicationVersion{})
	return stacktrace.Propagate(err, "")
}

// LaunchAutorunApplications launches all the applications set to run on startup
func (r *AppRunner) LaunchAutorunApplications() error {
	ctx, err := transaction.Begin(r.workerContext)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	defer ctx.Commit() // read-only tx

	applications, _, err := types.GetApplications(ctx, "", nil)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	for _, application := range applications {
		if application.AllowLaunching && application.Autorun {
			err := r.launchApplication(ctx, application.ID, application.UpdatedAt)
			if err != nil {
				return stacktrace.Propagate(err, "")
			}
		}
	}

	return nil
}

func (r *AppRunner) launchApplication(ctxCtx context.Context, applicationID string, specificVersion types.ApplicationVersion) error {
	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	defer ctx.Commit() // read-only tx

	applications, err := types.GetApplicationsWithIDs(ctx, []string{applicationID})
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	application, ok := applications[applicationID]
	if !ok {
		return stacktrace.Propagate(ErrApplicationNotFound, "")
	}

	if !application.AllowLaunching {
		return stacktrace.Propagate(ErrApplicationNotEnabled, "")
	}

	if time.Time(specificVersion).IsZero() {
		specificVersion = application.UpdatedAt
	}

	r.instancesLock.Lock()
	defer r.instancesLock.Unlock()

	if _, ok := r.instances[applicationID]; ok {
		return stacktrace.NewError("an instance of this application already exists")
	}

	wallet, err := r.BuildApplicationWallet(ctx, application.ID)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	instance, err := newAppInstance(r, application.ID, specificVersion, wallet, r.moduleDependencies)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	r.instances[applicationID] = instance

	var startedAt time.Time
	var terminatedUnsub func()
	terminatedUnsub = instance.Terminated().SubscribeUsingCallback(event.BufferFirst, func() {
		r.instancesLock.Lock()
		defer r.instancesLock.Unlock()

		delete(r.instances, applicationID)

		r.configManager.RemoveApplicationConfigs(applicationID)

		r.recentLogs.SetDefault(applicationID, instance.appLogger)
		r.onApplicationStopped.Notify(RunningApplication{
			ApplicationID:      instance.applicationID,
			ApplicationVersion: instance.applicationVersion,
			StartedAt:          startedAt, // set below after the application starts
		}, false)
		r.onRunningApplicationsUpdated.Notify(r.runningApplicationsNoLock(), false)

		terminatedUnsub()
	})

	// this must not be the transaction context, this context will be used to derive the execution context for the duration of the application's execution
	err = instance.StartOrResume(ctx.WithoutTx())
	if err != nil {
		delete(r.instances, applicationID)
		terminatedUnsub()
		return stacktrace.Propagate(err, "")
	}

	_, _, startedAt = instance.Running()

	r.onApplicationLaunched.Notify(RunningApplication{
		ApplicationID:      instance.applicationID,
		ApplicationVersion: instance.applicationVersion,
		StartedAt:          startedAt,
	}, true)
	r.onRunningApplicationsUpdated.Notify(r.runningApplicationsNoLock(), false)
	return nil
}

// StopApplication stops the specified application
func (r *AppRunner) StopApplication(applicationID string) error {
	stopped, stoppedU := r.onApplicationStopped.Subscribe(event.BufferFirst)
	defer stoppedU()

	instance := func() *appInstance {
		r.instancesLock.Lock()
		defer r.instancesLock.Unlock()

		instance, ok := r.instances[applicationID]
		if ok {
			return instance
		}
		return nil
	}()
	if instance == nil {
		return stacktrace.Propagate(ErrApplicationNotInstantiated, "")
	}
	// releasing the lock up there means we might have concurrent Terminate requests,
	// but it's fine because instance.Terminate locks on the instance lock so in such a situation
	// this function will either return ErrApplicationNotInstantiated or ErrApplicationInstanceTerminated

	err := instance.Terminate(true, 10*time.Second, true)
	if err != nil && !errors.Is(err, ErrApplicationInstanceAlreadyPaused) {
		return stacktrace.Propagate(err, "")
	}

	// block until the application is evicted from the instances list by the subscriber to the instance's Terminated event
	// (see SubscribeUsingCallback call in launchApplication)
	// there should be no risk of us blocking forever because we know that the application was terminated successfully,
	// and the AtLeastOnceGuarantee on the event subscription ensures we'll be notified on the channel even if the
	// application termination event is fired before we get to this point
	for {
		s := <-stopped
		if s.ApplicationID == applicationID {
			return nil
		}
	}
}

// RunningApplication contains information about a running application
type RunningApplication struct {
	ApplicationID      string
	ApplicationVersion types.ApplicationVersion
	StartedAt          time.Time
}

// RunningApplications returns a list of running applications
func (r *AppRunner) RunningApplications() []RunningApplication {
	r.instancesLock.RLock()
	defer r.instancesLock.RUnlock()

	return r.runningApplicationsNoLock()
}

func (r *AppRunner) runningApplicationsNoLock() []RunningApplication {
	a := []RunningApplication{}
	for _, instance := range r.instances {
		running, version, startedAt := instance.Running()
		if running {
			a = append(a, RunningApplication{
				ApplicationID:      instance.applicationID,
				ApplicationVersion: version,
				StartedAt:          startedAt,
			})
		}
	}
	sort.Slice(a, func(i, j int) bool {
		return a[i].ApplicationID < a[j].ApplicationID
	})
	return a
}

// IsRunning returns whether the application with the given ID is running and if yes, also its running version and start time
func (r *AppRunner) IsRunning(applicationID string) (bool, types.ApplicationVersion, time.Time) {
	r.instancesLock.RLock()
	defer r.instancesLock.RUnlock()

	instance, ok := r.instances[applicationID]
	if !ok {
		return false, types.ApplicationVersion{}, time.Time{}
	}

	return instance.Running()
}

// ApplicationLog returns the log for a running or recently stopped application
func (r *AppRunner) ApplicationLog(applicationID string) (ApplicationLog, error) {
	r.instancesLock.RLock()
	defer r.instancesLock.RUnlock()

	instance, ok := r.instances[applicationID]
	if ok {
		return instance.appLogger, nil
	}

	l, ok := r.recentLogs.Get(applicationID)
	if ok {
		return l, nil
	}
	return nil, stacktrace.Propagate(ErrApplicationLogNotFound, "")
}

func (r *AppRunner) EvaluateExpressionOnApplication(ctx context.Context, applicationID, expression string) (bool, string, time.Duration, error) {
	var instance *appInstance
	var ok bool
	func() {
		// make sure to release lock ASAP since expression execution can take a significant amount of time
		r.instancesLock.RLock()
		defer r.instancesLock.RUnlock()
		instance, ok = r.instances[applicationID]
	}()
	if !ok {
		return false, "", 0, stacktrace.Propagate(ErrApplicationNotInstantiated, "")
	}
	successful, result, executionTime, err := instance.EvaluateExpression(ctx, expression)
	if err != nil {
		return false, "", 0, stacktrace.Propagate(err, "")
	}
	return successful, result, executionTime, nil
}

func (r *AppRunner) ResolvePage(applicationID, pageID string) (pages.PageInfo, types.ApplicationVersion, bool) {
	var instance *appInstance
	var ok bool
	func() {
		// make sure to release lock ASAP since expression execution can take a significant amount of time
		r.instancesLock.RLock()
		defer r.instancesLock.RUnlock()
		instance, ok = r.instances[applicationID]
	}()
	if !ok {
		return pages.PageInfo{}, types.ApplicationVersion{}, false
	}
	return instance.ResolvePage(pageID)
}

func (r *AppRunner) ApplicationMethod(ctx context.Context, applicationID, pageID, method string, args []string) (string, error) {
	var instance *appInstance
	var ok bool
	func() {
		// make sure to release lock ASAP since expression execution can take a significant amount of time
		r.instancesLock.RLock()
		defer r.instancesLock.RUnlock()
		instance, ok = r.instances[applicationID]
	}()
	if !ok {
		return "", stacktrace.Propagate(ErrApplicationNotInstantiated, "")
	}
	_, _, _, ok, err := r.incomingClientEventRateLimiter.Take(ctx, auth.RemoteAddressFromContext(ctx))
	if err != nil {
		return "", stacktrace.Propagate(err, "")
	}
	if !ok {
		return "", stacktrace.NewError("rate limit reached")
	}
	result, err := instance.ApplicationMethod(ctx, pageID, method, args)
	return result, stacktrace.Propagate(err, "")
}

func (r *AppRunner) ApplicationEvent(ctx context.Context, trusted bool, applicationID, pageID string, eventName string, eventArgs []string) error {
	var instance *appInstance
	var ok bool
	func() {
		r.instancesLock.RLock()
		defer r.instancesLock.RUnlock()
		instance, ok = r.instances[applicationID]
	}()
	if !ok {
		return stacktrace.Propagate(ErrApplicationNotInstantiated, "")
	}
	_, _, _, ok, err := r.incomingClientEventRateLimiter.Take(ctx, auth.RemoteAddressFromContext(ctx))
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	if !ok {
		return stacktrace.NewError("rate limit reached")
	}
	return stacktrace.Propagate(instance.ApplicationEvent(ctx, trusted, pageID, eventName, eventArgs), "")
}

func (r *AppRunner) ConsumeApplicationEvents(ctx context.Context, applicationID, pageID string) (<-chan rpc.ClientEventData, func(), error) {
	r.instancesLock.RLock()
	defer r.instancesLock.RUnlock()
	if instance, ok := r.instances[applicationID]; ok {
		ch, cancel := instance.ConsumeApplicationEvents(ctx, pageID)
		return ch, cancel, nil
	}
	return nil, nil, stacktrace.Propagate(ErrApplicationNotInstantiated, "")
}

func (r *AppRunner) pageAttachmentLoader(ctx context.Context, data string) (chat.MessageAttachmentView, error) {
	var storage *chatmodule.MessageAttachmentApplicationPageStorage
	err := sonic.Unmarshal([]byte(data), &storage)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	pageInfo, appVersion, ok := r.ResolvePage(storage.ApplicationID, storage.PageID)
	if !ok || !time.Time(appVersion).Equal(time.Time(storage.ApplicationVersion)) {
		// page no longer available. this is normal enough, return nil to omit the attachment but don't fail
		return nil, nil
	}

	return &chatmodule.MessageAttachmentApplicationPageView{
		PageInfo:           pageInfo,
		ApplicationID:      storage.ApplicationID,
		ApplicationVersion: storage.ApplicationVersion,
		PageID:             storage.PageID,
		Height:             storage.Height,
	}, nil
}

func (r *AppRunner) ServeFile(ctx context.Context, applicationID, fileName string, w http.ResponseWriter, req *http.Request) error {
	r.instancesLock.RLock()
	defer r.instancesLock.RUnlock()

	var instance *appInstance
	var ok bool
	func() {
		// release lock ASAP because TypeScript files are transpiled and that takes time
		r.instancesLock.RLock()
		defer r.instancesLock.RUnlock()
		instance, ok = r.instances[applicationID]
	}()
	if !ok {
		http.NotFound(w, req)
		return nil
	}

	return stacktrace.Propagate(instance.ServeFile(ctx, fileName, w, req), "")
}
