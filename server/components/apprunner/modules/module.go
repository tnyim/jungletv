package modules

import (
	"context"

	"github.com/dop251/goja"
	"github.com/dop251/goja_nodejs/require"
)

// NativeModule is a module that can be imported into a single application instance
type NativeModule interface {
	ModuleLoader() require.ModuleLoader
	ModuleName() string
	AutoRequire() (bool, string)
	ExecutionResumed(context.Context)
	ExecutionPaused()
}

// ScheduleFunction is a function that may be called to add tasks to an application's event loop
type ScheduleFunction func(func(vm *goja.Runtime) error)
