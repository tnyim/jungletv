package configuration

import (
	"context"
	"fmt"
	"regexp"
	"slices"
	"strings"
	"sync"
	"time"

	"github.com/dop251/goja"
	"github.com/dop251/goja_nodejs/require"
	"github.com/palantir/stacktrace"
	uuid "github.com/satori/go.uuid"
	"github.com/tnyim/jungletv/server/auth"
	"github.com/tnyim/jungletv/server/components/apprunner/gojautil"
	"github.com/tnyim/jungletv/server/components/apprunner/modules"
	"github.com/tnyim/jungletv/server/components/apprunner/modules/pages"
	"github.com/tnyim/jungletv/server/components/configurationmanager"
	"github.com/tnyim/jungletv/server/components/notificationmanager"
	"github.com/tnyim/jungletv/server/components/notificationmanager/notifications"
	"github.com/tnyim/jungletv/types"
	"github.com/tnyim/jungletv/utils/event"
	"github.com/tnyim/jungletv/utils/transaction"
)

// ModuleName is the name by which this module can be require()d in a script
const ModuleName = "jungletv:configuration"

type configurationModule struct {
	runtime       *goja.Runtime
	exports       *goja.Object
	appContext    modules.ApplicationContext
	configManager *configurationmanager.Manager
	notifManager  *notificationmanager.Manager
	pagesModule   pages.PagesModule

	configurationAssociationLock       sync.Mutex
	currentSidebarTab                  configurationmanager.SidebarTabData
	currentNavigationDestination       configurationmanager.NavigationDestination
	currentNavigationDestinationPageID string

	executionContext context.Context
}

// New returns a new configuration module
func New(appContext modules.ApplicationContext, configManager *configurationmanager.Manager, notifManager *notificationmanager.Manager, pagesModule pages.PagesModule) modules.NativeModule {
	return &configurationModule{
		appContext:    appContext,
		configManager: configManager,
		notifManager:  notifManager,
		pagesModule:   pagesModule,
	}
}

func (m *configurationModule) IsNodeBuiltin() bool {
	return false
}

func (m *configurationModule) ModuleLoader() require.ModuleLoader {
	return func(runtime *goja.Runtime, module *goja.Object) {
		m.runtime = runtime
		m.exports = module.Get("exports").(*goja.Object)
		m.exports.Set("setAppName", m.setAppName)
		m.exports.Set("setAppLogo", m.setAppLogo)
		m.exports.Set("setAppFavicon", m.setAppFavicon)
		m.exports.Set("setSidebarTab", m.setSidebarTab)
		m.exports.Set("setUserVIPStatus", m.setUserVIPStatus)
		m.exports.Set("setNavigationDestination", m.setNavigationDestination)
		m.exports.Set("highlightNavigationDestination", m.highlightNavigationDestination)
		m.exports.Set("highlightNavigationDestinationForUser", m.highlightNavigationDestinationForUser)
	}
}
func (m *configurationModule) ModuleName() string {
	return ModuleName
}
func (m *configurationModule) AutoRequire() (bool, string) {
	return false, ""
}

func (m *configurationModule) ExecutionResumed(ctx context.Context, wg *sync.WaitGroup, runtime *goja.Runtime) {
	m.executionContext = ctx
	m.runtime = runtime

	unsub := m.pagesModule.OnPagePublished().SubscribeUsingCallback(event.BufferAll, m.updatePageConfigurablesOnPagePublish)
	unsub2 := m.pagesModule.OnPageUnpublished().SubscribeUsingCallback(event.BufferAll, m.resetPageConfigurablesOnPageUnpublish)

	wg.Add(1)
	go func() {
		<-ctx.Done()
		unsub()
		unsub2()
		wg.Done()
	}()
}

func (m *configurationModule) updatePageConfigurablesOnPagePublish(pageID string) {
	m.configurationAssociationLock.Lock()
	defer m.configurationAssociationLock.Unlock()
	// update navbar buttons and tab titles when pages are republished with a different title
	if pageID == m.currentSidebarTab.PageID && m.currentSidebarTab != (configurationmanager.SidebarTabData{}) {
		info, ok := m.pagesModule.ResolvePage(pageID)
		if ok {
			m.currentSidebarTab.Title = info.Title
			_, _ = configurationmanager.SetConfigurable(m.configManager, configurationmanager.SidebarTabs, m.currentSidebarTab.ApplicationID, m.currentSidebarTab)
		}
	}
	if pageID == m.currentNavigationDestinationPageID && m.currentNavigationDestination != (configurationmanager.NavigationDestination{}) {
		info, ok := m.pagesModule.ResolvePage(pageID)
		if ok {
			m.currentNavigationDestination.Label = info.Title
			_, _ = configurationmanager.SetConfigurable(m.configManager, configurationmanager.NavigationDestinations, m.appContext.ApplicationID(), m.currentNavigationDestination)
		}
	}
}

func (m *configurationModule) resetPageConfigurablesOnPageUnpublish(pageID string) {
	m.configurationAssociationLock.Lock()
	defer m.configurationAssociationLock.Unlock()

	if pageID == m.currentSidebarTab.PageID && m.currentSidebarTab != (configurationmanager.SidebarTabData{}) {
		_ = m.configManager.UndoApplicationChange(configurationmanager.SidebarTabs, m.appContext.ApplicationID())
	}
	if pageID == m.currentNavigationDestinationPageID && m.currentNavigationDestination != (configurationmanager.NavigationDestination{}) {
		_ = m.configManager.UndoApplicationChange(configurationmanager.NavigationDestinations, m.appContext.ApplicationID())
		m.notifManager.ClearPersistedNotificationsWithKeyPrefix(notifications.NavigationDestinationHighlightedPrefix(m.currentNavigationDestination.DestinationID))
	}
}

func (m *configurationModule) setAppName(call goja.FunctionCall) goja.Value {
	if len(call.Arguments) < 1 {
		panic(m.runtime.NewTypeError("Missing argument"))
	}
	nameValue := call.Argument(0)
	configurable := configurationmanager.ApplicationName
	applicationID := m.appContext.ApplicationID()

	var err error
	var success bool
	if goja.IsUndefined(nameValue) || goja.IsNull(nameValue) || nameValue.String() == "" {
		err = m.configManager.UndoApplicationChange(configurable, applicationID)
		success = true
	} else {
		// why would anyone want a title longer than the original length a tweet
		// (prevents extremely large configuration change payloads, among other things)
		if len(nameValue.String()) > 140 {
			panic(m.runtime.NewTypeError("First argument to setAppName must not be longer than 140 bytes when encoded using UTF-8"))
		}

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
		m.appContext.ApplicationID(),
		m.appContext.ApplicationVersion(),
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

	applicationID := m.appContext.ApplicationID()
	fileName := call.Argument(0).String()
	configurable := configurationmanager.LogoURL

	if goja.IsUndefined(call.Argument(0)) || goja.IsNull(call.Argument(0)) || fileName == "" {
		err := m.configManager.UndoApplicationChange(configurable, applicationID)
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

	v := time.Time(m.appContext.ApplicationVersion()).Unix()
	url := fmt.Sprintf("/assets/app/%s/%d/%s", applicationID, v, fileName)

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

	applicationID := m.appContext.ApplicationID()
	fileName := call.Argument(0).String()
	configurable := configurationmanager.FaviconURL

	if goja.IsUndefined(call.Argument(0)) || goja.IsNull(call.Argument(0)) || fileName == "" {
		err := m.configManager.UndoApplicationChange(configurable, applicationID)
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

	v := time.Time(m.appContext.ApplicationVersion()).Unix()
	url := fmt.Sprintf("/assets/app/%s/%d/%s", applicationID, v, fileName)

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

	applicationID := m.appContext.ApplicationID()
	pageID := call.Argument(0).String()
	configurable := configurationmanager.SidebarTabs

	if goja.IsUndefined(call.Argument(0)) || goja.IsNull(call.Argument(0)) {
		err := m.configManager.UndoApplicationChange(configurable, applicationID)
		if err != nil {
			panic(m.runtime.NewGoError(stacktrace.Propagate(err, "")))
		}

		m.configurationAssociationLock.Lock()
		defer m.configurationAssociationLock.Unlock()
		m.currentSidebarTab = configurationmanager.SidebarTabData{}
		return m.runtime.ToValue(true)
	}

	beforeTabID := ""
	if !goja.IsUndefined(call.Argument(1)) && !goja.IsNull(call.Argument(1)) && call.Argument(1).String() != "" {
		beforeTabID = call.Argument(1).String()
		tabIDs := []string{"queue", "skipandtip", "chat", "announcements"}
		if !slices.Contains(tabIDs, beforeTabID) {
			panic(m.runtime.NewTypeError(
				"Second argument to setSidebarTab must be undefined or one of '%s' or '%s'",
				strings.Join(tabIDs[0:len(tabIDs)-1], "', '"),
				tabIDs[len(tabIDs)-1]))
		}
	}

	info, ok := m.pagesModule.ResolvePage(pageID)
	if !ok {
		panic(m.runtime.NewTypeError("First argument to setSidebarTab must be the ID of a published page"))
	}

	data := configurationmanager.SidebarTabData{
		TabID:         uuid.NewV4().String(),
		ApplicationID: applicationID,
		PageID:        pageID,
		Title:         info.Title,
		BeforeTabID:   beforeTabID,
	}
	success, err := configurationmanager.SetConfigurable(m.configManager, configurable, applicationID, data)
	if err != nil {
		panic(m.runtime.NewGoError(stacktrace.Propagate(err, "")))
	}
	if success {
		m.configurationAssociationLock.Lock()
		defer m.configurationAssociationLock.Unlock()
		m.currentSidebarTab = data
	}

	return m.runtime.ToValue(success)
}

func (m *configurationModule) setUserVIPStatus(call goja.FunctionCall) goja.Value {
	if len(call.Arguments) < 1 {
		panic(m.runtime.NewTypeError("Missing argument"))
	}

	applicationID := m.appContext.ApplicationID()
	userAddress := call.Argument(0).String()
	gojautil.ValidateBananoAddress(m.runtime, userAddress, "Invalid user address")

	if len(call.Arguments) < 2 || goja.IsUndefined(call.Argument(1)) || goja.IsNull(call.Argument(1)) || call.Argument(1).String() == "" {
		success, err := configurationmanager.UnsetConfigurable[configurationmanager.VIPUser](m.configManager, configurationmanager.VIPUsers, applicationID, configurationmanager.VIPUser{
			Address: userAddress,
		})
		if err != nil {
			panic(m.runtime.NewGoError(stacktrace.Propagate(err, "")))
		}

		if success {
			m.appContext.Logger().RuntimeAuditLog(fmt.Sprintf("ceased making user %s a VIP", userAddress[:14]))
		}

		return m.runtime.ToValue(success)
	}

	var appearance configurationmanager.VIPUserAppearance
	switch call.Argument(1).String() {
	case "normal":
		appearance = configurationmanager.VIPUserAppearanceNormal
	case "vip":
		appearance = configurationmanager.VIPUserAppearanceVIP
	case "moderator":
		appearance = configurationmanager.VIPUserAppearanceModerator
	case "vipmoderator":
		appearance = configurationmanager.VIPUserAppearanceVIPModerator
	default:
		panic(m.runtime.NewTypeError("Second argument to setUserVIPStatus must be undefined or one of 'normal', 'vip', 'moderator' or 'vipmoderator'"))
	}

	success, err := configurationmanager.SetConfigurable[configurationmanager.VIPUser](m.configManager, configurationmanager.VIPUsers, applicationID, configurationmanager.VIPUser{
		Address:    userAddress,
		Appearance: appearance,
	})
	if err != nil {
		panic(m.runtime.NewGoError(stacktrace.Propagate(err, "")))
	}
	if success {
		m.appContext.Logger().RuntimeAuditLog(fmt.Sprintf("made user %s a VIP with appearance `%s`", userAddress[:14], call.Argument(1).String()))
	}
	return m.runtime.ToValue(success)
}

// the free version only has solid (fas), brand (fab) and some regular (far) icons
// complete list of icons at https://fontawesome.com/v5/search?m=free + https://fontawesome.com/v5/search?f=brands
// allow both e.g. "fas fa-vial" and "fa-vial fas"
var fontAwesomeIconRegex = regexp.MustCompile("^((fas|far|fab) +(fa-[a-zA-Z0-9-]+)|(fa-[a-zA-Z0-9-]+) +(fas|far|fab))$")

func (m *configurationModule) setNavigationDestination(call goja.FunctionCall) goja.Value {
	if len(call.Arguments) < 1 {
		panic(m.runtime.NewTypeError("Missing argument"))
	}

	applicationID := m.appContext.ApplicationID()
	pageID := call.Argument(0).String()
	configurable := configurationmanager.NavigationDestinations

	if goja.IsUndefined(call.Argument(0)) || goja.IsNull(call.Argument(0)) {
		err := m.configManager.UndoApplicationChange(configurable, applicationID)
		if err != nil {
			panic(m.runtime.NewGoError(stacktrace.Propagate(err, "")))
		}

		m.configurationAssociationLock.Lock()
		defer m.configurationAssociationLock.Unlock()
		m.currentNavigationDestination = configurationmanager.NavigationDestination{}
		m.currentNavigationDestinationPageID = ""
		return m.runtime.ToValue(true)
	}

	if len(call.Arguments) < 2 {
		panic(m.runtime.NewTypeError("Missing argument"))
	}

	icon := call.Argument(1).String()
	if !fontAwesomeIconRegex.MatchString(icon) {
		panic(m.runtime.NewTypeError("Second argument to setNavigationDestination must be a FontAwesome icon specifier"))
	}

	color := ""
	if !goja.IsUndefined(call.Argument(2)) && !goja.IsNull(call.Argument(2)) && call.Argument(2).String() != "" {
		color = call.Argument(2).String()
		colors := []string{"gray", "red", "yellow", "green", "blue", "indigo", "purple", "pink"}
		if !slices.Contains(colors, color) {
			panic(m.runtime.NewTypeError(
				"Third argument to setNavigationDestination must be undefined or one of '%s' or '%s'",
				strings.Join(colors[0:len(colors)-1], "', '"),
				colors[len(colors)-1]))
		}
	}

	beforeDestinationID := ""
	if !goja.IsUndefined(call.Argument(3)) && !goja.IsNull(call.Argument(3)) && call.Argument(3).String() != "" {
		beforeDestinationID = call.Argument(3).String()
		destinationIDs := []string{"enqueue", "rewards", "leaderboards", "about", "faq", "guidelines", "playhistory"}
		if !slices.Contains(destinationIDs, beforeDestinationID) && !strings.HasPrefix(beforeDestinationID, "application-") {
			panic(m.runtime.NewTypeError(
				"Fourth argument to setNavigationDestination must be undefined or one of '%s' or '%s'",
				strings.Join(destinationIDs[0:len(destinationIDs)-1], "', '"),
				destinationIDs[len(destinationIDs)-1]))
		}
	}

	info, ok := m.pagesModule.ResolvePage(pageID)
	if !ok {
		panic(m.runtime.NewTypeError("First argument to setNavigationDestination must be the ID of a published page"))
	}

	data := configurationmanager.NavigationDestination{
		DestinationID:       "application-" + applicationID,
		Label:               info.Title,
		Icon:                icon,
		Href:                fmt.Sprintf("/apps/%s/%s", applicationID, pageID),
		Color:               color,
		BeforeDestinationID: beforeDestinationID,
	}

	if m.currentNavigationDestination != (configurationmanager.NavigationDestination{}) {
		m.notifManager.ClearPersistedNotificationsWithKeyPrefix(notifications.NavigationDestinationHighlightedPrefix(m.currentNavigationDestination.DestinationID))
	}

	success, err := configurationmanager.SetConfigurable(m.configManager, configurable, applicationID, data)
	if err != nil {
		panic(m.runtime.NewGoError(stacktrace.Propagate(err, "")))
	}
	if success {
		m.configurationAssociationLock.Lock()
		defer m.configurationAssociationLock.Unlock()
		m.currentNavigationDestination = data
		m.currentNavigationDestinationPageID = pageID
	}

	return m.runtime.ToValue(success)
}

func (m *configurationModule) highlightNavigationDestination(call goja.FunctionCall) goja.Value {
	if m.currentNavigationDestination == (configurationmanager.NavigationDestination{}) {
		panic(m.runtime.NewTypeError("No navigation destination set"))
	}

	n := notifications.NewNavigationDestinationHighlightedForEveryoneNotification(
		m.appContext.ApplicationID(),
		time.Now().Add(48*time.Hour),
		m.currentNavigationDestination.DestinationID,
	)
	return m.runtime.ToValue(m.notifManager.Notify(n))
}

func (m *configurationModule) highlightNavigationDestinationForUser(call goja.FunctionCall) goja.Value {
	if len(call.Arguments) < 1 {
		panic(m.runtime.NewTypeError("Missing argument"))
	}

	if m.currentNavigationDestination == (configurationmanager.NavigationDestination{}) {
		panic(m.runtime.NewTypeError("No navigation destination set"))
	}

	userAddress := call.Argument(0).String()
	gojautil.ValidateBananoAddress(m.runtime, userAddress, "Invalid user address")

	n := notifications.NewNavigationDestinationHighlightedForUserNotification(
		m.appContext.ApplicationID(),
		auth.NewAddressOnlyUser(userAddress),
		time.Now().Add(48*time.Hour),
		m.currentNavigationDestination.DestinationID,
	)
	return m.runtime.ToValue(m.notifManager.Notify(n))
}
