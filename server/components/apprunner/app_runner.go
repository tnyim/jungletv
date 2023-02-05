package apprunner

import (
	"context"
	"errors"
	"log"
	"sort"
	"sync"
	"time"

	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/types"
	"github.com/tnyim/jungletv/utils/transaction"
)

// RuntimeVersion is the version of the application runtime
const RuntimeVersion = 1

// MainFileName is the name of the application file containing the application entry point
const MainFileName = "main.js"

// ServerScriptMIMEType is the content type of the application scripts executed by the server
const ServerScriptMIMEType = "text/javascript"

// ErrApplicationNotFound is returned when the specified application was not found
var ErrApplicationNotFound = errors.New("application not found")

// ErrApplicationNotEnabled is returned when the specified application is not allowed to launch
var ErrApplicationNotEnabled = errors.New("application not enabled")

// AppRunner launches applications and manages their lifecycle
type AppRunner struct {
	workerContext context.Context
	log           *log.Logger
	instances     map[string]*appInstance
	instancesLock sync.RWMutex
}

// New returns a new initialized AppRunner
func New(
	workerContext context.Context,
	log *log.Logger) *AppRunner {
	return &AppRunner{
		workerContext: workerContext,
		log:           log,
	}
}

// LaunchApplication launches the most recent version of the specified application
func (r *AppRunner) LaunchApplicationAtVersion(ctxCtx context.Context, applicationID string, applicationVersion types.ApplicationVersion) error {
	err := r.launchApplication(ctxCtx, applicationID, applicationVersion)
	return stacktrace.Propagate(err, "")
}

// LaunchApplication launches the most recent version of the specified application
func (r *AppRunner) LaunchApplication(ctxCtx context.Context, applicationID string) error {
	err := r.launchApplication(ctxCtx, applicationID, types.ApplicationVersion{})
	return stacktrace.Propagate(err, "")
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
	application, ok := applications[MainFileName]
	if !ok {
		return stacktrace.Propagate(ErrApplicationNotFound, "")
	}

	if !application.AllowLaunching {
		return stacktrace.Propagate(ErrApplicationNotEnabled, "")
	}

	if time.Time(specificVersion).IsZero() {
		specificVersion = application.UpdatedAt
	}
	instance, err := newAppInstance(ctx, r, application.ID, specificVersion)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	r.instancesLock.Lock()
	defer r.instancesLock.Unlock()

	if _, ok := r.instances[applicationID]; ok {
		return stacktrace.NewError("an instance of this application is already running")
	}
	r.instances[applicationID] = instance

	err = instance.Start()

	return stacktrace.Propagate(err, "")
}

// StopApplication stops the specified application
func (r *AppRunner) StopApplication(ctx context.Context, applicationID string) error {
	r.instancesLock.Lock()
	defer r.instancesLock.Unlock()

	instance, ok := r.instances[applicationID]
	if !ok {
		return stacktrace.NewError("application not running")
	}

	err := instance.Stop(false, false)
	if err != nil && !errors.Is(err, ErrApplicationInstanceAlreadyStopped) {
		return stacktrace.Propagate(err, "")
	}

	delete(r.instances, applicationID)
	return nil
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

	a := make([]RunningApplication, len(r.instances))
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
