package modules

import (
	"context"

	"github.com/dop251/goja"
	"github.com/dop251/goja_nodejs/require"
)

// Collection is a set of NativeModules that belongs to a single application instance
type Collection struct {
	latestExecutionCtx context.Context
	modules            []NativeModule
	loaded             map[NativeModule]struct{}
	vm                 *goja.Runtime
}

func NewCollection() *Collection {
	return &Collection{
		loaded: make(map[NativeModule]struct{}),
	}
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

func (c *Collection) ExecutionResumed(ctx context.Context) {
	c.latestExecutionCtx = ctx
	for _, m := range c.modules {
		if _, ok := c.loaded[m]; ok {
			m.ExecutionResumed(ctx)
		}
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
	for _, m := range c.modules {
		name, loader := m.ModuleName(), m.ModuleLoader()
		loaderProxy := func(vm *goja.Runtime, o *goja.Object) {
			loader(vm, o)
			if _, ok := c.loaded[m]; !ok {
				c.loaded[m] = struct{}{}
				m.ExecutionResumed(c.latestExecutionCtx)
			}
		}
		registry.RegisterNativeModule(name, loaderProxy)
		if m.IsNodeBuiltin() {
			registry.RegisterNativeModule("node:"+name, loader)
		}
	}
}
