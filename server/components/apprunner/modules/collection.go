package modules

import (
	"context"
	"sync"

	"github.com/dop251/goja"
	"github.com/dop251/goja_nodejs/require"
)

// Collection is a set of NativeModules that belongs to a single application instance
type Collection struct {
	modules []NativeModule
	vm      *goja.Runtime
}

// SourceLoader is a function responsible for loading sources
type SourceLoader func(*goja.Runtime, string) ([]byte, error)

func (c *Collection) RegisterNativeModule(m NativeModule) {
	c.modules = append(c.modules, m)
}

func (c *Collection) EnableModules(runtime *goja.Runtime) {
	c.vm = runtime
	for _, c := range c.modules {
		if autoEnable, name := c.AutoRequire(); autoEnable {
			runtime.Set(name, require.Require(runtime, c.ModuleName()))
		}
	}
}

func (c *Collection) ExecutionResumed(ctx context.Context, wg *sync.WaitGroup, runtime *goja.Runtime) {
	for _, c := range c.modules {
		c.ExecutionResumed(ctx, wg, runtime)
	}
}

func (c *Collection) BuildRegistry(sourceLoader SourceLoader) *require.Registry {
	registry := require.NewRegistry(require.WithLoader(func(path string) ([]byte, error) {
		return sourceLoader(c.vm, path)
	}))
	c.registerModules(registry)
	return registry
}

func (c *Collection) registerModules(registry *require.Registry) {
	for _, c := range c.modules {
		name, loader := c.ModuleName(), c.ModuleLoader()
		registry.RegisterNativeModule(name, loader)
		if c.IsNodeBuiltin() {
			registry.RegisterNativeModule("node:"+name, loader)
		}
	}
}
