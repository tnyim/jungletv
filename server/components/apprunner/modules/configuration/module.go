package configuration

import (
	"context"
	"fmt"
	"strings"

	"github.com/dop251/goja"
	"github.com/dop251/goja_nodejs/require"
	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/server/components/apprunner/modules"
	"github.com/tnyim/jungletv/server/components/configurationmanager"
	"github.com/tnyim/jungletv/types"
	"github.com/tnyim/jungletv/utils/transaction"
)

// ModuleName is the name by which this module can be require()d in a script
const ModuleName = "jungletv:configuration"

type configurationModule struct {
	runtime       *goja.Runtime
	exports       *goja.Object
	infoProvider  ProcessInformationProvider
	configManager *configurationmanager.Manager

	executionContext context.Context
}

// ProcessInformationProvider can get information about the process
type ProcessInformationProvider interface {
	ApplicationID() string
	ApplicationVersion() types.ApplicationVersion
}

// New returns a new configuration module
func New(infoProvider ProcessInformationProvider, configManager *configurationmanager.Manager) modules.NativeModule {
	return &configurationModule{
		infoProvider:  infoProvider,
		configManager: configManager,
	}
}

func (m *configurationModule) ModuleLoader() require.ModuleLoader {
	return func(runtime *goja.Runtime, module *goja.Object) {
		m.runtime = runtime
		m.exports = module.Get("exports").(*goja.Object)
		m.exports.Set("setAppName", m.setAppName)
		m.exports.Set("setAppLogo", m.setAppLogo)
		m.exports.Set("setAppFavicon", m.setAppFavicon)

	}
}
func (m *configurationModule) ModuleName() string {
	return ModuleName
}
func (m *configurationModule) AutoRequire() (bool, string) {
	return false, ""
}

func (m *configurationModule) ExecutionResumed(ctx context.Context) {
	m.executionContext = ctx
}

func (m *configurationModule) ExecutionPaused() {
	m.executionContext = nil
}

func (m *configurationModule) setAppName(call goja.FunctionCall) goja.Value {
	if len(call.Arguments) < 1 {
		panic(m.runtime.NewTypeError("Missing argument"))
	}
	nameValue := call.Argument(0)

	var err error
	var success bool
	if goja.IsUndefined(nameValue) || goja.IsNull(nameValue) || nameValue.String() == "" {
		err = m.configManager.ResetConfigurable(configurationmanager.ApplicationName, m.infoProvider.ApplicationID())
		success = true
	} else {
		success, err = configurationmanager.SetConfigurable(m.configManager, configurationmanager.ApplicationName, m.infoProvider.ApplicationID(), nameValue.String())
	}

	if err != nil {
		panic(m.runtime.NewGoError(stacktrace.Propagate(err, "")))
	}

	return m.runtime.ToValue(success)
}

func (m *configurationModule) assertFileAvailablePublicly(ctxCtx context.Context, fileName string, cb func(*types.ApplicationFile)) {
	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		panic(m.runtime.NewGoError(stacktrace.Propagate(err, "")))
	}
	defer ctx.Commit() // read-only tx

	files, err := types.GetApplicationFilesWithNamesForApplicationAtVersion(
		ctx,
		m.infoProvider.ApplicationID(),
		m.infoProvider.ApplicationVersion(),
		[]string{fileName})
	if err != nil {
		panic(m.runtime.NewGoError(stacktrace.Propagate(err, "")))
	}

	file, ok := files[fileName]
	if !ok {
		panic(m.runtime.NewTypeError("File '%s' not found", fileName))
	}
	if !file.Public {
		panic(m.runtime.NewTypeError("File '%s' is not public", fileName))
	}
	if cb != nil {
		cb(file)
	}
}

func (m *configurationModule) setAppLogo(call goja.FunctionCall) goja.Value {
	if len(call.Arguments) < 1 {
		panic(m.runtime.NewTypeError("Missing argument"))
	}

	fileName := call.Argument(0).String()

	if goja.IsUndefined(call.Argument(0)) || goja.IsNull(call.Argument(0)) || fileName == "" {
		err := m.configManager.ResetConfigurable(configurationmanager.LogoURL, m.infoProvider.ApplicationID())
		if err != nil {
			panic(m.runtime.NewGoError(stacktrace.Propagate(err, "")))
		}
		return m.runtime.ToValue(true)
	}

	m.assertFileAvailablePublicly(m.executionContext, fileName, func(af *types.ApplicationFile) {
		if !strings.HasPrefix(af.Type, "image/") {
			panic(m.runtime.NewTypeError("File is not an image"))
		}
	})

	url := fmt.Sprintf("/assets/app/%s/%s", m.infoProvider.ApplicationID(), fileName)

	success, err := configurationmanager.SetConfigurable(m.configManager, configurationmanager.LogoURL, m.infoProvider.ApplicationID(), url)
	if err != nil {
		panic(m.runtime.NewGoError(stacktrace.Propagate(err, "")))
	}

	return m.runtime.ToValue(success)
}

func (m *configurationModule) setAppFavicon(call goja.FunctionCall) goja.Value {
	if len(call.Arguments) < 1 {
		panic(m.runtime.NewTypeError("Missing argument"))
	}

	fileName := call.Argument(0).String()

	if goja.IsUndefined(call.Argument(0)) || goja.IsNull(call.Argument(0)) || fileName == "" {
		err := m.configManager.ResetConfigurable(configurationmanager.FaviconURL, m.infoProvider.ApplicationID())
		if err != nil {
			panic(m.runtime.NewGoError(stacktrace.Propagate(err, "")))
		}
		return m.runtime.ToValue(true)
	}

	m.assertFileAvailablePublicly(m.executionContext, fileName, func(af *types.ApplicationFile) {
		if !strings.HasPrefix(af.Type, "image/") {
			panic(m.runtime.NewTypeError("File is not an image"))
		}
	})

	url := fmt.Sprintf("/assets/app/%s/%s", m.infoProvider.ApplicationID(), fileName)

	success, err := configurationmanager.SetConfigurable(m.configManager, configurationmanager.LogoURL, m.infoProvider.ApplicationID(), url)
	if err != nil {
		panic(m.runtime.NewGoError(stacktrace.Propagate(err, "")))
	}

	return m.runtime.ToValue(success)
}
