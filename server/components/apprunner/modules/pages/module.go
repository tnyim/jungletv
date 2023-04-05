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
	OnPageUnpublished() event.Event[string]
}

// ProcessInformationProvider can get information about the process
type ProcessInformationProvider interface {
	ApplicationID() string
	ApplicationVersion() types.ApplicationVersion
}

type pagesModule struct {
	runtime           *goja.Runtime
	exports           *goja.Object
	onPageUnpublished event.Event[string]
	infoProvider      ProcessInformationProvider
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
func New(infoProvider ProcessInformationProvider) PagesModule {
	return &pagesModule{
		onPageUnpublished: event.New[string](),
		infoProvider:      infoProvider,
		pages:             make(map[string]PageInfo),
	}
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
func (m *pagesModule) ExecutionResumed(ctx context.Context) {
	m.ctx = ctx
}
func (m *pagesModule) ExecutionPaused() {
	m.ctx = nil
}

func (m *pagesModule) ResolvePage(pageID string) (PageInfo, bool) {
	m.mu.RLock()
	defer m.mu.RUnlock()

	page, ok := m.pages[pageID]
	return page, ok
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

	page := PageInfo{
		File:  call.Argument(1).String(),
		Title: call.Argument(2).String(),
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
