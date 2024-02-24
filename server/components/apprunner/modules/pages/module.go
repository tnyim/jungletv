package pages

import (
	"context"
	"net/http"
	"net/textproto"
	"regexp"
	"sync"

	"github.com/dop251/goja"
	"github.com/dop251/goja_nodejs/require"
	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/server/components/apprunner/modules"
	"github.com/tnyim/jungletv/types"
	"github.com/tnyim/jungletv/utils/event"
	"github.com/tnyim/jungletv/utils/transaction"
	"golang.org/x/exp/slices"
)

// ModuleName is the name by which this module can be require()d in a script
const ModuleName = "jungletv:pages"

// PagesModule manages page associations for an application
type PagesModule interface {
	modules.NativeModule
	ResolvePage(pageID string) (PageInfo, bool)
	OnPagePublished() event.Event[string]
	OnPageUnpublished() event.Event[string]
}

type pagesModule struct {
	runtime           *goja.Runtime
	exports           *goja.Object
	onPagePublished   event.Event[string]
	onPageUnpublished event.Event[string]
	appContext        modules.ApplicationContext
	pages             map[string]PageInfo
	mu                sync.RWMutex
	ctx               context.Context // just to pass the sqalx node around...
}

type PageInfo struct {
	Title  string
	File   string
	Header http.Header
}

// New returns a new pages module
func New(appContext modules.ApplicationContext) PagesModule {
	return &pagesModule{
		onPagePublished:   event.New[string](),
		onPageUnpublished: event.New[string](),
		appContext:        appContext,
		pages:             make(map[string]PageInfo),
	}
}

func (m *pagesModule) IsNodeBuiltin() bool {
	return false
}

func (m *pagesModule) ModuleLoader() require.ModuleLoader {
	return func(runtime *goja.Runtime, module *goja.Object) {
		m.runtime = runtime
		m.exports = module.Get("exports").(*goja.Object)
		m.exports.Set("publishFile", m.publishFile)
		m.exports.Set("unpublish", m.unpublish)
	}
}
func (m *pagesModule) ModuleName() string {
	return ModuleName
}
func (m *pagesModule) AutoRequire() (bool, string) {
	return false, ""
}
func (m *pagesModule) ExecutionResumed(ctx context.Context, _ *sync.WaitGroup, runtime *goja.Runtime) {
	m.ctx = ctx
	m.runtime = runtime
}

func (m *pagesModule) ResolvePage(pageID string) (PageInfo, bool) {
	m.mu.RLock()
	defer m.mu.RUnlock()

	page, ok := m.pages[pageID]
	return page, ok
}

func (m *pagesModule) OnPagePublished() event.Event[string] {
	return m.onPagePublished
}

func (m *pagesModule) OnPageUnpublished() event.Event[string] {
	return m.onPageUnpublished
}

var headerWhitelist = []string{
	"Content-Security-Policy",
	"Permissions-Policy",
	"Cross-Origin-Opener-Policy",
	"Cross-Origin-Embedder-Policy",
	"Cross-Origin-Resource-Policy",
}

func init() {
	for i := range headerWhitelist {
		headerWhitelist[i] = textproto.CanonicalMIMEHeaderKey(headerWhitelist[i])
	}
}

// empty page IDs are explicitly allowed
var allowedPageIDs = regexp.MustCompile("^[A-Za-z0-9_-]*$")

func (m *pagesModule) publishFile(call goja.FunctionCall) goja.Value {
	if len(call.Arguments) < 3 {
		panic(m.runtime.NewTypeError("Missing argument"))
	}

	ctx, err := transaction.Begin(m.ctx)
	if err != nil {
		panic(m.runtime.NewGoError(stacktrace.Propagate(err, "")))
	}
	defer ctx.Commit() // read-only tx

	pageID := call.Argument(0).String()
	if !allowedPageIDs.MatchString(pageID) {
		panic(m.runtime.NewTypeError("Invalid page ID specified"))
	}
	fileName := call.Argument(1).String()

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

	page := PageInfo{
		File:  call.Argument(1).String(),
		Title: call.Argument(2).String(),
	}

	// why would anyone want a title longer than the original length a tweet
	// (prevents extremely large configuration change payloads, among other things)
	if len(page.Title) > 140 {
		panic(m.runtime.NewTypeError("Third argument to publishFile must not be longer than 140 bytes when encoded using UTF-8"))
	}

	if len(call.Arguments) > 3 {
		page.Header = make(http.Header)
		headersMap := map[string]goja.Value{}
		err := m.runtime.ExportTo(call.Argument(3), &headersMap)
		if err != nil {
			panic(m.runtime.NewTypeError("Fourth argument is not an object"))
		}
		for key, value := range headersMap {
			key = textproto.CanonicalMIMEHeaderKey(key)
			if slices.Contains(headerWhitelist, key) {
				page.Header.Add(key, value.ToString().String())
			}
		}
	}

	m.mu.Lock()
	defer m.mu.Unlock()
	m.pages[pageID] = page

	m.onPagePublished.Notify(pageID, false)

	return goja.Undefined()
}

func (m *pagesModule) unpublish(call goja.FunctionCall) goja.Value {
	if len(call.Arguments) < 1 {
		panic(m.runtime.NewTypeError("Missing argument"))
	}

	m.mu.Lock()
	defer m.mu.Unlock()

	pageID := call.Argument(0).String()
	_, present := m.pages[pageID]
	delete(m.pages, pageID)

	if present {
		m.onPageUnpublished.Notify(pageID, false)
	}

	return goja.Undefined()
}
