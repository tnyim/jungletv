package process

import (
	"context"

	"github.com/dop251/goja"
	"github.com/dop251/goja_nodejs/require"
	"github.com/tnyim/jungletv/server/components/apprunner/modules"
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

type processModule struct {
	runtime          *goja.Runtime
	exports          *goja.Object
	infoProvider     ProcessInformationProvider
	lifecycleManager ProcessLifecycleManager
}

// New returns a new process module
func New(infoProvider ProcessInformationProvider, lifecycleManager ProcessLifecycleManager) modules.NativeModule {
	return &processModule{
		infoProvider:     infoProvider,
		lifecycleManager: lifecycleManager,
	}
}

func (m *processModule) ModuleLoader() require.ModuleLoader {
	return func(runtime *goja.Runtime, module *goja.Object) {
		m.runtime = runtime
		m.exports = module.Get("exports").(*goja.Object)
		m.exports.Set("title", m.infoProvider.ApplicationID())
		m.exports.Set("platform", "jungletv")
		m.exports.Set("version", m.infoProvider.RuntimeVersion())
		m.exports.Set("abort", m.abort)
		m.exports.Set("exit", m.exit)
		m.exports.Set("exitCode", int(0))
	}
}
func (m *processModule) ModuleName() string {
	return ModuleName
}
func (m *processModule) AutoRequire() (bool, string) {
	return true, "process"
}
func (m *processModule) ExecutionResumed(ctx context.Context) {}
func (m *processModule) ExecutionPaused()                     {}

func (m *processModule) abort(call goja.FunctionCall) goja.Value {
	m.runtime.Interrupt("process aborted")
	m.lifecycleManager.AbortProcess()
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
	m.lifecycleManager.ExitProcess(exitCode)
	return goja.Undefined()
}