package process

import (
	"context"
	"fmt"
	"time"

	"github.com/dop251/goja"
	"github.com/dop251/goja_nodejs/require"
	"github.com/tnyim/jungletv/server/components/apprunner/modules"
)

// ModuleName is the name by which this module can be require()d in a script
const ModuleName = "process"

type processModule struct {
	runtime    *goja.Runtime
	exports    *goja.Object
	appContext modules.ApplicationContext
}

// New returns a new process module
func New(appContext modules.ApplicationContext) modules.NativeModule {
	return &processModule{
		appContext: appContext,
	}
}

func (m *processModule) IsNodeBuiltin() bool {
	return true
}

func (m *processModule) ModuleLoader() require.ModuleLoader {
	return func(runtime *goja.Runtime, module *goja.Object) {
		m.runtime = runtime
		m.exports = module.Get("exports").(*goja.Object)

		m.exports.DefineAccessorProperty("title", m.runtime.ToValue(func() string {
			return m.appContext.ApplicationID()
		}), nil, goja.FLAG_FALSE, goja.FLAG_TRUE)

		m.exports.DefineAccessorProperty("platform", m.runtime.ToValue(func() string {
			return "jungletv"
		}), nil, goja.FLAG_FALSE, goja.FLAG_TRUE)

		m.exports.DefineAccessorProperty("version", m.runtime.ToValue(func() string {
			return fmt.Sprint(m.appContext.RuntimeVersion())
		}), nil, goja.FLAG_FALSE, goja.FLAG_TRUE)

		m.exports.DefineAccessorProperty("versions", m.runtime.ToValue(func() map[string]string {
			return map[string]string{
				"jungletv":    fmt.Sprint(m.appContext.RuntimeVersion()),
				"application": fmt.Sprint(time.Time(m.appContext.ApplicationVersion()).UnixMilli()),
			}
		}), nil, goja.FLAG_FALSE, goja.FLAG_TRUE)

		m.exports.Set("abort", m.abort)
		m.exports.Set("exit", m.exit)
		m.exports.Set("exitCode", int(0))
		m.exports.Set("uptime", m.uptime)
	}
}
func (m *processModule) ModuleName() string {
	return ModuleName
}
func (m *processModule) AutoRequire() (bool, string) {
	return true, "process"
}
func (m *processModule) ExecutionResumed(_ context.Context) {}

func (m *processModule) abort(call goja.FunctionCall) goja.Value {
	m.runtime.Interrupt("process aborted")
	m.appContext.LifecycleManager().AbortProcess()
	return goja.Undefined()
}

func (m *processModule) exit(call goja.FunctionCall) goja.Value {
	m.runtime.Interrupt("process exited")
	exitCode := int(0)
	if len(call.Arguments) > 0 {
		exitCode = int(call.Argument(0).ToInteger())
		m.exports.Set("exitCode", exitCode)
	} else if exitCodeValue := m.exports.Get("exitCode"); exitCodeValue != nil && !goja.IsUndefined(exitCodeValue) {
		var c int
		err := m.runtime.ExportTo(exitCodeValue, &c)
		if err == nil {
			exitCode = c
		}
	}
	m.appContext.LifecycleManager().ExitProcess(exitCode)
	return goja.Undefined()
}

func (m *processModule) uptime(call goja.FunctionCall) goja.Value {
	return m.runtime.ToValue(time.Since(m.appContext.ApplicationStartTime()).Seconds())
}
