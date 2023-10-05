package queue

import (
	"context"
	"fmt"
	"time"

	"github.com/dop251/goja"
	"github.com/dop251/goja_nodejs/require"
	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/server/components/apprunner/gojautil"
	"github.com/tnyim/jungletv/server/components/apprunner/modules"
	"github.com/tnyim/jungletv/server/components/apprunner/modules/pages"
	"github.com/tnyim/jungletv/server/components/mediaqueue"
	"github.com/tnyim/jungletv/server/media"
)

// ModuleName is the name by which this module can be require()d in a script
const ModuleName = "jungletv:queue"

type queueModule struct {
	runtime        *goja.Runtime
	exports        *goja.Object
	appContext     modules.ApplicationContext
	pagesModule    pages.PagesModule
	mediaQueue     *mediaqueue.MediaQueue
	queueMisc      modules.OtherMediaQueueMethods
	dateSerializer func(time.Time) interface{}
	eventAdapter   *gojautil.EventAdapter

	executionContext context.Context
}

// New returns a new queue module
func New(appContext modules.ApplicationContext, mediaQueue *mediaqueue.MediaQueue, queueMisc modules.OtherMediaQueueMethods, pagesModule pages.PagesModule) modules.NativeModule {
	return &queueModule{
		appContext:  appContext,
		pagesModule: pagesModule,
		mediaQueue:  mediaQueue,
		queueMisc:   queueMisc,
	}
}

func (m *queueModule) IsNodeBuiltin() bool {
	return false
}

func (m *queueModule) ModuleLoader() require.ModuleLoader {
	return func(runtime *goja.Runtime, module *goja.Object) {
		m.runtime = runtime
		m.eventAdapter = gojautil.NewEventAdapter(runtime, m.appContext.Schedule)
		m.dateSerializer = func(t time.Time) interface{} {
			return gojautil.SerializeTime(runtime, t)
		}
		m.exports = module.Get("exports").(*goja.Object)
		m.exports.Set("addEventListener", m.eventAdapter.AddEventListener)
		m.exports.Set("removeEventListener", m.eventAdapter.RemoveEventListener)
		m.exports.Set("setEnqueuingRestriction", m.setEnqueuingRestriction)
		m.exports.Set("removeEntry", m.removeEntry)
		m.exports.Set("enqueuePage", m.enqueuePage)

		m.setPropertyExports()
		m.configureEvents()
		m.eventAdapter.StartOrResume()
	}
}
func (m *queueModule) ModuleName() string {
	return ModuleName
}
func (m *queueModule) AutoRequire() (bool, string) {
	return false, ""
}

func (m *queueModule) ExecutionResumed(ctx context.Context) {
	m.executionContext = ctx
	if m.eventAdapter != nil {
		m.eventAdapter.StartOrResume()
	}
}

func (m *queueModule) ExecutionPaused() {
	if m.eventAdapter != nil {
		m.eventAdapter.Pause()
	}
}

func (m *queueModule) setEnqueuingRestriction(call goja.FunctionCall) goja.Value {
	if len(call.Arguments) < 1 {
		panic(m.runtime.NewTypeError("Missing argument"))
	}

	restrictionString := call.Argument(0).String()

	if restrictionString == "enabled_password_required" && len(call.Arguments) < 2 {
		panic(m.runtime.NewTypeError("Missing argument"))
	}

	var restriction proto.AllowedMediaEnqueuingType
	password := ""
	switch call.Argument(0).String() {
	case "enabled":
		restriction = proto.AllowedMediaEnqueuingType_ENABLED
	case "enabled_staff_only":
		restriction = proto.AllowedMediaEnqueuingType_STAFF_ONLY
	case "enabled_password_required":
		restriction = proto.AllowedMediaEnqueuingType_PASSWORD_REQUIRED
	case "disabled":
		restriction = proto.AllowedMediaEnqueuingType_DISABLED
	default:
		panic(m.runtime.NewTypeError("First argument to setEnqueuingRestriction must be one of 'enabled', 'enabled_staff_only', 'enabled_password_required', 'disabled'"))
	}

	m.queueMisc.SetMediaEnqueuingRestriction(restriction, password)

	m.appContext.Logger().RuntimeAuditLog(fmt.Sprintf("changed media enqueuing to %s", restriction.String()))

	return goja.Undefined()
}

func (m *queueModule) removeEntry(call goja.FunctionCall) goja.Value {
	if len(call.Arguments) < 1 {
		panic(m.runtime.NewTypeError("Missing argument"))
	}

	entry := m.removeEntryAndLog(call.Argument(0).String())

	return m.serializeQueueEntry(m.runtime, entry)
}

func (m *queueModule) removeEntryAndLog(entryID string) media.QueueEntry {
	entry, err := m.mediaQueue.RemoveEntry(entryID)
	if err != nil {
		panic(m.runtime.NewGoError(stacktrace.Propagate(err, "")))
	}

	// do not warn about removal of queue entries enqueued by JungleTV itself or by this application
	if entry.RequestedBy() != nil && !entry.RequestedBy().IsUnknown() && entry.RequestedBy().Address() == m.appContext.ApplicationUser().Address() {
		m.appContext.Logger().RuntimeAuditLog(fmt.Sprintf("removed queue entry requested by %s with title \"%s\"",
			entry.RequestedBy(), entry.MediaInfo().Title()))
	}

	return entry
}
