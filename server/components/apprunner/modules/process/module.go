package process

import (
	"github.com/dop251/goja"
	"github.com/dop251/goja_nodejs/require"
	"github.com/tnyim/jungletv/types"
)

// ModuleName is the name by which this module can be require()d in a script
const ModuleName = "node:process"

// ProcessInformationProvider can get information about the process
type ProcessInformationProvider interface {
	ApplicationID() string
	ApplicationVersion() types.ApplicationVersion
	RuntimeVersion() int
}

// ProcessLifecycleManager can manage the process' lifecycle
type ProcessLifecycleManager interface {
	AbortProcess()
	ExitProcess(exitCode int)
}

// BuildRequire builds a ModuleLoader for this module as associated with a specific process
func BuildRequire(infoProvider ProcessInformationProvider, lifecycleManager ProcessLifecycleManager) require.ModuleLoader {
	return func(runtime *goja.Runtime, module *goja.Object) {
		m := &processModule{
			runtime:          runtime,
			infoProvider:     infoProvider,
			lifecycleManager: lifecycleManager,
		}
		m.exports = module.Get("exports").(*goja.Object)
		m.exports.Set("title", infoProvider.ApplicationID())
		m.exports.Set("platform", "jungletv")
		m.exports.Set("version", infoProvider.RuntimeVersion())
		m.exports.Set("abort", m.abort)
		m.exports.Set("exit", m.exit)
		m.exports.Set("exitCode", int(0))
	}
}

// Enable adds the process object to the specified runtime
func Enable(runtime *goja.Runtime) {
	runtime.Set("process", require.Require(runtime, ModuleName))
}

type processModule struct {
	runtime          *goja.Runtime
	exports          *goja.Object
	infoProvider     ProcessInformationProvider
	lifecycleManager ProcessLifecycleManager
}

func (m *processModule) abort(call goja.FunctionCall) goja.Value {
	m.runtime.Interrupt("process aborted")
	m.lifecycleManager.AbortProcess()
	return nil
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
	m.lifecycleManager.ExitProcess(exitCode)
	return nil
}
