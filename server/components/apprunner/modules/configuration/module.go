package configuration

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/dop251/goja"
	"github.com/dop251/goja_nodejs/require"
	"github.com/palantir/stacktrace"
	uuid "github.com/satori/go.uuid"
	"github.com/tnyim/jungletv/server/components/apprunner/modules"
	"github.com/tnyim/jungletv/server/components/apprunner/modules/pages"
	"github.com/tnyim/jungletv/server/components/configurationmanager"
	"github.com/tnyim/jungletv/types"
	"github.com/tnyim/jungletv/utils/event"
	"github.com/tnyim/jungletv/utils/transaction"
)

// ModuleName is the name by which this module can be require()d in a script
const ModuleName = "jungletv:configuration"

type configurationModule struct {
	runtime              *goja.Runtime
	exports              *goja.Object
	infoProvider         ProcessInformationProvider
	configManager        *configurationmanager.Manager
	pagesModule          pages.PagesModule
	pageUnpublishedUnsub func()
	currentSidebarPageID string

	executionContext context.Context
}

// ProcessInformationProvider can get information about the process
type ProcessInformationProvider interface {
	ApplicationID() string
	ApplicationVersion() types.ApplicationVersion
}

// New returns a new configuration module
func New(infoProvider ProcessInformationProvider, configManager *configurationmanager.Manager, pagesModule pages.PagesModule) modules.NativeModule {
	return &configurationModule{
		infoProvider:  infoProvider,
		configManager: configManager,
		pagesModule:   pagesModule,
	}
}

func (m *configurationModule) ModuleLoader() require.ModuleLoader {
	return func(runtime *goja.Runtime, module *goja.Object) {
		m.runtime = runtime
		m.exports = module.Get("exports").(*goja.Object)
		m.exports.Set("setAppName", m.setAppName)
		m.exports.Set("setAppLogo", m.setAppLogo)
		m.exports.Set("setAppFavicon", m.setAppFavicon)
		m.exports.Set("setSidebarTab", m.setSidebarTab)

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

	m.pageUnpublishedUnsub = m.pagesModule.OnPageUnpublished().SubscribeUsingCallback(event.BufferAll, m.resetPageConfigurablesOnPageUnpublish)
}

func (m *configurationModule) ExecutionPaused() {
	m.executionContext = nil
	m.pageUnpublishedUnsub()
}

func (m *configurationModule) resetPageConfigurablesOnPageUnpublish(unpublishedPageID string) {
	if unpublishedPageID == m.currentSidebarPageID {
		_ = m.configManager.ResetConfigurable(configurationmanager.SidebarTabs, m.infoProvider.ApplicationID())
	}
}

func (m *configurationModule) setAppName(call goja.FunctionCall) goja.Value {
	if len(call.Arguments) < 1 {
		panic(m.runtime.NewTypeError("Missing argument"))
	}
	nameValue := call.Argument(0)
	configurable := configurationmanager.ApplicationName
	applicationID := m.infoProvider.ApplicationID()

	var err error
	var success bool
	if goja.IsUndefined(nameValue) || goja.IsNull(nameValue) || nameValue.String() == "" {
		err = m.configManager.ResetConfigurable(configurable, applicationID)
		success = true
	} else {
		success, err = configurationmanager.SetConfigurable(m.configManager, configurable, applicationID, nameValue.String())
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

	applicationID := m.infoProvider.ApplicationID()
	fileName := call.Argument(0).String()
	configurable := configurationmanager.LogoURL

	if goja.IsUndefined(call.Argument(0)) || goja.IsNull(call.Argument(0)) || fileName == "" {
		err := m.configManager.ResetConfigurable(configurable, applicationID)
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

	v := time.Time(m.infoProvider.ApplicationVersion()).Unix()
	url := fmt.Sprintf("/assets/app/%s/%s?v=%d", applicationID, fileName, v)

	success, err := configurationmanager.SetConfigurable(m.configManager, configurable, applicationID, url)
	if err != nil {
		panic(m.runtime.NewGoError(stacktrace.Propagate(err, "")))
	}

	return m.runtime.ToValue(success)
}

func (m *configurationModule) setAppFavicon(call goja.FunctionCall) goja.Value {
	if len(call.Arguments) < 1 {
		panic(m.runtime.NewTypeError("Missing argument"))
	}

	applicationID := m.infoProvider.ApplicationID()
	fileName := call.Argument(0).String()
	configurable := configurationmanager.FaviconURL

	if goja.IsUndefined(call.Argument(0)) || goja.IsNull(call.Argument(0)) || fileName == "" {
		err := m.configManager.ResetConfigurable(configurable, applicationID)
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

	v := time.Time(m.infoProvider.ApplicationVersion()).Unix()
	url := fmt.Sprintf("/assets/app/%s/%s?v=%d", applicationID, fileName, v)

	success, err := configurationmanager.SetConfigurable(m.configManager, configurable, applicationID, url)
	if err != nil {
		panic(m.runtime.NewGoError(stacktrace.Propagate(err, "")))
	}

	return m.runtime.ToValue(success)
}

func (m *configurationModule) setSidebarTab(call goja.FunctionCall) goja.Value {
	if len(call.Arguments) < 1 {
		panic(m.runtime.NewTypeError("Missing argument"))
	}

	applicationID := m.infoProvider.ApplicationID()
	pageID := call.Argument(0).String()
	configurable := configurationmanager.SidebarTabs

	if goja.IsUndefined(call.Argument(0)) || goja.IsNull(call.Argument(0)) || pageID == "" {
		err := m.configManager.ResetConfigurable(configurable, applicationID)
		if err != nil {
			panic(m.runtime.NewGoError(stacktrace.Propagate(err, "")))
		}
		m.currentSidebarPageID = ""
		return m.runtime.ToValue(true)
	}

	beforeTabID := ""
	if !goja.IsUndefined(call.Argument(1)) && !goja.IsNull(call.Argument(1)) && call.Argument(1).String() != "" {
		beforeTabID = call.Argument(1).String()
	}

	info, ok := m.pagesModule.ResolvePage(pageID)
	if !ok {
		panic(m.runtime.NewTypeError("Page not published"))
	}

	success, err := configurationmanager.SetConfigurable(m.configManager, configurable, applicationID, configurationmanager.SidebarTabData{
		TabID:         uuid.NewV4().String(),
		ApplicationID: applicationID,
		PageID:        pageID,
		Title:         info.Title,
		BeforeTabID:   beforeTabID,
	})
	if err != nil {
		panic(m.runtime.NewGoError(stacktrace.Propagate(err, "")))
	}
	if success {
		m.currentSidebarPageID = pageID
	}

	return m.runtime.ToValue(success)
}
