package apprunner

import (
	"context"
	"errors"
	"fmt"
	"sync"
	"time"

	"github.com/dop251/goja"
	"github.com/dop251/goja_nodejs/console"
	"github.com/dop251/goja_nodejs/eventloop"
	"github.com/dop251/goja_nodejs/require"
	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/types"
	"github.com/tnyim/jungletv/utils/transaction"
	"golang.org/x/exp/slices"
)

type appInstance struct {
	applicationID      string
	applicationVersion types.ApplicationVersion
	mu                 sync.RWMutex
	started            bool
	startedOrStoppedAt time.Time
	runner             *AppRunner
	loop               *eventloop.EventLoop
	appLogger          *appLogger
	ctx                context.Context
}

var ErrApplicationInstanceAlreadyStarted = errors.New("application instance already started")
var ErrApplicationInstanceAlreadyStopped = errors.New("application instance already stopped")
var ErrApplicationFileNotFound = errors.New("application file not found")
var ErrApplicationFileTypeMismatch = errors.New("unexpected type for application file")

// ErrApplicationInstanceNotRunning is returned when the specified application is not running
var ErrApplicationInstanceNotRunning = errors.New("application instance not running")

func newAppInstance(ctx context.Context, r *AppRunner, applicationID string, applicationVersion types.ApplicationVersion) (*appInstance, error) {
	instance := &appInstance{
		applicationID:      applicationID,
		applicationVersion: applicationVersion,
		runner:             r,
		appLogger:          NewAppLogger(),
		ctx:                ctx,
	}

	registry := require.NewRegistry(require.WithLoader(instance.sourceLoader))
	registry.RegisterNativeModule(console.ModuleName, console.RequireWithPrinter(instance.appLogger))

	instance.loop = eventloop.NewEventLoop(eventloop.WithRegistry(registry))

	instance.appLogger.RuntimeLog("application instance created")

	return instance, nil
}

func (a *appInstance) getMainFileSource() (string, error) {
	ctx, err := transaction.Begin(a.ctx)
	if err != nil {
		return "", stacktrace.Propagate(err, "")
	}
	defer ctx.Commit() // read-only tx

	files, err := types.GetApplicationFilesWithNamesForApplicationAtVersion(ctx, a.applicationID, a.applicationVersion, []string{MainFileName})
	if err != nil {
		return "", stacktrace.Propagate(err, "")
	}
	file, ok := files[MainFileName]
	if !ok {
		return "", stacktrace.Propagate(ErrApplicationFileNotFound, "main application file not found")
	}
	if !slices.Contains(validServerScriptMIMETypes, file.Type) {
		return "", stacktrace.Propagate(ErrApplicationFileTypeMismatch, "main application file has wrong type")
	}
	return string(file.Content), nil
}

// Start starts the application instance, returning an error if it is already started
func (a *appInstance) Start() error {
	a.mu.Lock()
	defer a.mu.Unlock()
	if a.started {
		return stacktrace.Propagate(ErrApplicationInstanceAlreadyStarted, "")
	}

	mainSource, err := a.getMainFileSource()
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	a.loop.Start()
	a.started = true
	a.startedOrStoppedAt = time.Now()

	a.runOnLoopAsync(a.setupEnvironment)

	a.appLogger.RuntimeLog("application instance started")

	a.runOnLoopAsync(func(vm *goja.Runtime) error {
		_, err = vm.RunString(mainSource)
		return stacktrace.Propagate(err, "")
	})

	return nil
}

func (a *appInstance) runOnLoopAsync(f func(vm *goja.Runtime) error) {
	a.loop.RunOnLoop(func(vm *goja.Runtime) {
		err := f(vm)
		if err != nil {
			a.appLogger.RuntimeError(err)
		}
	})
}

func (a *appInstance) setupEnvironment(vm *goja.Runtime) error {
	err := vm.GlobalObject().Set("process", map[string]string{
		"title":    a.applicationID,
		"platform": "jungletv",
		"version":  fmt.Sprint(RuntimeVersion),
	})
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	return nil
}

var appInstanceInterruptValue = struct{}{}

// Stop stops the application instance, returning an error if it is already stopped
func (a *appInstance) Stop(force, blocking bool) error {
	a.mu.Lock()
	defer a.mu.Unlock()
	if !a.started {
		return stacktrace.Propagate(ErrApplicationInstanceAlreadyStopped, "")
	}

	interrupt := func() {
		a.loop.RunOnLoop(func(vm *goja.Runtime) {
			vm.Interrupt(appInstanceInterruptValue)
		})
	}
	if blocking {
		if force {
			interrupt()
		}
		a.loop.Stop()
	} else {
		if force {
			go interrupt()
		}
		a.loop.StopNoWait()
	}
	a.started = false
	a.startedOrStoppedAt = time.Now()
	a.appLogger.RuntimeLog("application instance stopped")
	return nil
}

func (a *appInstance) Running() (bool, types.ApplicationVersion, time.Time) {
	a.mu.RLock()
	defer a.mu.RUnlock()
	return a.started, a.applicationVersion, a.startedOrStoppedAt
}

func (a *appInstance) sourceLoader(filename string) ([]byte, error) {
	ctx, err := transaction.Begin(a.ctx)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	defer ctx.Commit() // read-only tx

	files, err := types.GetApplicationFilesWithNamesForApplicationAtVersion(ctx, a.applicationID, a.applicationVersion, []string{filename})
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	file, ok := files[MainFileName]
	if !ok {
		return nil, errors.Join(require.ModuleFileDoesNotExistError, stacktrace.Propagate(ErrApplicationFileNotFound, "main application file not found"))
	}
	if !slices.Contains(validServerScriptMIMETypes, file.Type) {
		return nil, stacktrace.Propagate(ErrApplicationFileTypeMismatch, "source file has wrong type")
	}

	return file.Content, nil
}

func (a *appInstance) EvaluateExpression(expression string) (bool, string, time.Duration, error) {
	a.mu.RLock()
	defer a.mu.RUnlock()

	if !a.started {
		return false, "", 0, stacktrace.Propagate(ErrApplicationInstanceNotRunning, "")
	}

	resultChan := make(chan goja.Value)
	errChan := make(chan error)
	var executionTime time.Duration
	a.loop.RunOnLoop(func(vm *goja.Runtime) {
		start := time.Now()
		result, err := vm.RunString(expression)
		executionTime = time.Since(start)
		resultChan <- result
		errChan <- err
	})

	result, err := <-resultChan, <-errChan
	if err != nil {
		return false, err.Error(), executionTime, nil
	}
	return true, result.String(), executionTime, nil
}
