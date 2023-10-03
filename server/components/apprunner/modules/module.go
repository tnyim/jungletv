package modules

import (
	"context"
	"time"

	"github.com/dop251/goja"
	"github.com/dop251/goja_nodejs/require"
	"github.com/tnyim/jungletv/server/auth"
	"github.com/tnyim/jungletv/types"
)

// NativeModule is a module that can be imported into a single application instance
type NativeModule interface {
	ModuleLoader() require.ModuleLoader
	ModuleName() string
	IsNodeBuiltin() bool
	AutoRequire() (bool, string)
	ExecutionResumed(context.Context)
	ExecutionPaused()
}

// ApplicationLogger logs application actions
type ApplicationLogger interface {
	RuntimeAuditLog(s string)
}

// LifecycleManager can manage the application's execution lifecycle
type LifecycleManager interface {
	AbortProcess()
	ExitProcess(exitCode int)
}

// ApplicationContext is the context of an application as passed to a module instance
type ApplicationContext interface {
	ApplicationID() string
	ApplicationVersion() types.ApplicationVersion
	ApplicationStartTime() time.Time
	RuntimeVersion() int
	ApplicationUser() auth.User

	Logger() ApplicationLogger
	LifecycleManager() LifecycleManager

	Schedule(func(*goja.Runtime) error)
	ScheduleNoError(func(*goja.Runtime))
}
