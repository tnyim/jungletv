package pages

import (
	"context"
	"sync"

	"github.com/dop251/goja"
	"github.com/dop251/goja_nodejs/require"
	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/server/components/apprunner/modules"
	"github.com/tnyim/jungletv/types"
	"github.com/tnyim/jungletv/utils/transaction"
)

// ModuleName is the name by which this module can be require()d in a script
const ModuleName = "jungletv:pages"

// PagesModule manages page associations for an application
type PagesModule interface {
	modules.NativeModule
	ResolvePage(pageID string) (Page, bool)
}

// ProcessInformationProvider can get information about the process
type ProcessInformationProvider interface {
	ApplicationID() string
	ApplicationVersion() types.ApplicationVersion
}

type pagesModule struct {
	runtime      *goja.Runtime
	exports      *goja.Object
	infoProvider ProcessInformationProvider
	pages        map[string]Page
	mu           sync.RWMutex
	ctx          context.Context // just to pass the sqalx node around...
}

type Page struct {
	Title string
	File  string
}

// New returns a new pages module
func New(infoProvider ProcessInformationProvider) PagesModule {
	return &pagesModule{
		infoProvider: infoProvider,
		pages:        make(map[string]Page),
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

func (m *pagesModule) ResolvePage(pageID string) (Page, bool) {
	m.mu.RLock()
	defer m.mu.RUnlock()

	page, ok := m.pages[pageID]
	return page, ok
}

func (m *pagesModule) publishFile(call goja.FunctionCall) goja.Value {
	if len(call.Arguments) < 3 {
		panic(m.runtime.NewTypeError("Missing argument"))
	}

	ctx, err := transaction.Begin(m.ctx)
	if err != nil {
		panic(m.runtime.NewGoError(stacktrace.Propagate(err, "")))
	}
	defer ctx.Commit() // read-only tx

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

	m.mu.Lock()
	defer m.mu.Unlock()

	m.pages[call.Argument(0).String()] = Page{
		File:  call.Argument(1).String(),
		Title: call.Argument(2).String(),
	}
	return goja.Undefined()
}

func (m *pagesModule) unpublish(call goja.FunctionCall) goja.Value {
	if len(call.Arguments) < 1 {
		panic(m.runtime.NewTypeError("Missing argument"))
	}

	m.mu.Lock()
	defer m.mu.Unlock()

	delete(m.pages, call.Argument(0).String())

	return goja.Undefined()
}
