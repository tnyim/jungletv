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
	if file.Type != ServerScriptMIMEType {
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
	a.loop.Start()
	a.started = true
	a.startedOrStoppedAt = time.Now()
	a.appLogger.RuntimeLog("application instance started")

	mainSource, err := a.getMainFileSource()
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	a.runOnLoopAndLogError(a.setupEnvironment)

	a.runOnLoopAndLogError(func(vm *goja.Runtime) error {
		_, err = vm.RunString(mainSource)
		return stacktrace.Propagate(err, "")
	})

	return nil
}

func (a *appInstance) runOnLoopAndLogError(f func(vm *goja.Runtime) error) {
	errCh := make(chan error)
	a.loop.RunOnLoop(func(vm *goja.Runtime) {
		errCh <- f(vm)
	})
	err := <-errCh
	if err != nil {
		a.appLogger.RuntimeError(err)
	}
}

func (a *appInstance) setupEnvironment(vm *goja.Runtime) error {
	err := vm.GlobalObject().Set("process", process{
		Title:    a.applicationID,
		Platform: "jungletv",
		Version:  fmt.Sprint(RuntimeVersion),
	})
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	return nil
}

var appInstanceInterruptValue = struct{}{}

type process struct {
	Title    string `json:"title"`
	Platform string `json:"platform"`
	Version  string `json:"version"`
}

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
	if file.Type != ServerScriptMIMEType {
		return nil, stacktrace.Propagate(ErrApplicationFileTypeMismatch, "source file has wrong type")
	}

	return file.Content, nil
}
