package modules

import (
	"context"

	"github.com/dop251/goja"
	"github.com/dop251/goja_nodejs/require"
)

// Collection is a set of NativeModules that belongs to a single application instance
type Collection struct {
	modules []NativeModule
}

func (c *Collection) RegisterNativeModule(m NativeModule) {
	c.modules = append(c.modules, m)
}

func (c *Collection) EnableModules(runtime *goja.Runtime) {
	for _, c := range c.modules {
		if autoEnable, name := c.AutoRequire(); autoEnable {
			runtime.Set(name, require.Require(runtime, c.ModuleName()))
		}
	}
}

func (c *Collection) ExecutionResumed(ctx context.Context) {
	for _, c := range c.modules {
		c.ExecutionResumed(ctx)
	}
}

func (c *Collection) ExecutionPaused() {
	for _, c := range c.modules {
		c.ExecutionPaused()
	}
}

func (c *Collection) BuildRegistry(sourceLoader require.SourceLoader) *require.Registry {
	registry := require.NewRegistry(require.WithLoader(sourceLoader))
	c.registerModules(registry)
	return registry
}

func (c *Collection) registerModules(registry *require.Registry) {
	for _, c := range c.modules {
		registry.RegisterNativeModule(c.ModuleName(), c.ModuleLoader())
	}
}
