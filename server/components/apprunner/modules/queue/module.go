package queue

import (
	"context"
	"fmt"
	"sync"
	"time"

	"github.com/dop251/goja"
	"github.com/dop251/goja_nodejs/require"
	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/server/auth"
	"github.com/tnyim/jungletv/server/components/apprunner/gojautil"
	"github.com/tnyim/jungletv/server/components/apprunner/modules"
	"github.com/tnyim/jungletv/server/components/apprunner/modules/pages"
	"github.com/tnyim/jungletv/server/components/apprunner/modules/wallet"
	"github.com/tnyim/jungletv/server/components/mediaqueue"
	"github.com/tnyim/jungletv/server/components/pricer"
	"github.com/tnyim/jungletv/server/components/skipmanager"
	"github.com/tnyim/jungletv/server/media"
	"github.com/tnyim/jungletv/types"
)

// ModuleName is the name by which this module can be require()d in a script
const ModuleName = "jungletv:queue"

type queueModule struct {
	runtime                  *goja.Runtime
	exports                  *goja.Object
	appContext               modules.ApplicationContext
	pagesModule              pages.PagesModule
	paymentsModule           wallet.WalletModule
	mediaQueue               *mediaqueue.MediaQueue
	mediaProviders           map[types.MediaType]media.Provider
	pricer                   *pricer.Pricer
	skipManager              *skipmanager.Manager
	queueMisc                modules.OtherMediaQueueMethods
	dateSerializer           func(time.Time) interface{}
	eventAdapter             *gojautil.EventAdapter
	crowdfundingEventAdapter *gojautil.EventAdapter

	executionContext context.Context
}

// New returns a new queue module
func New(appContext modules.ApplicationContext, mediaQueue *mediaqueue.MediaQueue, mediaProviders map[types.MediaType]media.Provider, pricer *pricer.Pricer, skipManager *skipmanager.Manager, queueMisc modules.OtherMediaQueueMethods, pagesModule pages.PagesModule, paymentsModule wallet.WalletModule) modules.NativeModule {
	return &queueModule{
		appContext:               appContext,
		pagesModule:              pagesModule,
		paymentsModule:           paymentsModule,
		mediaQueue:               mediaQueue,
		mediaProviders:           mediaProviders,
		pricer:                   pricer,
		skipManager:              skipManager,
		queueMisc:                queueMisc,
		eventAdapter:             gojautil.NewEventAdapter(appContext.Schedule),
		crowdfundingEventAdapter: gojautil.NewEventAdapter(appContext.Schedule),
	}
}

func (m *queueModule) IsNodeBuiltin() bool {
	return false
}

func (m *queueModule) ModuleLoader() require.ModuleLoader {
	return func(runtime *goja.Runtime, module *goja.Object) {
		m.runtime = runtime
		m.dateSerializer = func(t time.Time) interface{} {
			return gojautil.SerializeTime(runtime, t)
		}
		m.exports = module.Get("exports").(*goja.Object)
		m.exports.Set("addEventListener", m.eventAdapter.AddEventListener)
		m.exports.Set("removeEventListener", m.eventAdapter.RemoveEventListener)
		m.exports.Set("setEnqueuingPermission", m.setEnqueuingPermission)
		m.exports.Set("removeEntry", m.removeEntry)
		m.exports.Set("moveEntry", m.moveEntryJS)
		m.exports.Set("moveEntryWithCost", m.moveEntryWithCostJS)
		m.exports.Set("enqueuePage", m.enqueuePage)
		m.exports.Set("getPlayHistory", m.getPlayHistory)
		m.exports.Set("getEnqueueHistory", m.getEnqueueHistory)

		m.setPropertyExports()

		pricing := runtime.NewObject()
		m.exports.Set("pricing", pricing)
		pricing.Set("computeEnqueuePricing", m.computeEnqueuePricing)
		m.setPricingPropertyExports(pricing)

		crowdfunding := runtime.NewObject()
		m.exports.Set("crowdfunding", crowdfunding)
		crowdfunding.Set("addEventListener", m.crowdfundingEventAdapter.AddEventListener)
		crowdfunding.Set("removeEventListener", m.crowdfundingEventAdapter.RemoveEventListener)
		m.setCrowdfundingPropertyExports(crowdfunding)

		m.configureEvents()
		m.configureCrowdfundingEvents()
	}
}
func (m *queueModule) ModuleName() string {
	return ModuleName
}
func (m *queueModule) AutoRequire() (bool, string) {
	return false, ""
}

func (m *queueModule) ExecutionResumed(ctx context.Context, wg *sync.WaitGroup) {
	m.executionContext = ctx
	m.eventAdapter.StartOrResume(ctx, wg, m.runtime)
	m.crowdfundingEventAdapter.StartOrResume(ctx, wg, m.runtime)
}

func (m *queueModule) setEnqueuingPermission(call goja.FunctionCall) goja.Value {
	if len(call.Arguments) < 1 {
		panic(m.runtime.NewTypeError("Missing argument"))
	}

	permissionString := call.Argument(0).String()

	if permissionString == "enabled_password_required" && len(call.Arguments) < 2 {
		panic(m.runtime.NewTypeError("Missing argument"))
	}

	var permission proto.AllowedMediaEnqueuingType
	password := ""
	switch call.Argument(0).String() {
	case "enabled":
		permission = proto.AllowedMediaEnqueuingType_ENABLED
	case "enabled_staff_only":
		permission = proto.AllowedMediaEnqueuingType_STAFF_ONLY
	case "enabled_password_required":
		permission = proto.AllowedMediaEnqueuingType_PASSWORD_REQUIRED
	case "disabled":
		permission = proto.AllowedMediaEnqueuingType_DISABLED
	default:
		panic(m.runtime.NewTypeError("First argument to setEnqueuingPermission must be one of 'enabled', 'enabled_staff_only', 'enabled_password_required', 'disabled'"))
	}

	m.queueMisc.SetMediaEnqueuingPermission(permission, password)

	m.appContext.Logger().RuntimeAuditLog(fmt.Sprintf("changed media enqueuing to %s", permission.String()))

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

func (m *queueModule) moveEntryWithCostJS(call goja.FunctionCall) goja.Value {
	if len(call.Arguments) < 2 {
		panic(m.runtime.NewTypeError("Missing argument"))
	}

	m.moveEntry(call.Argument(0).String(), call.Argument(1).String(), "Second", "moveEntryWithCost", true)
	return goja.Undefined()
}

func (m *queueModule) moveEntryJS(call goja.FunctionCall) goja.Value { // move without cost
	if len(call.Arguments) < 2 {
		panic(m.runtime.NewTypeError("Missing argument"))
	}

	m.moveEntry(call.Argument(0).String(), call.Argument(1).String(), "Second", "moveEntry", false)
	return goja.Undefined()
}

func (m *queueModule) moveEntry(entryID, direction, argPos, callerName string, withCost bool) {
	up := m.parseMovementDirectionArgument(direction, argPos, callerName)

	if withCost {
		err := m.queueMisc.MoveQueueEntryWithCost(m.executionContext, entryID, up, m.appContext.ApplicationUser())
		if err != nil {
			panic(m.runtime.NewGoError(stacktrace.Propagate(err, "")))
		}
	} else {
		// use unknown user because we want the inability to move an entry more than once to be considered part of the "cost" that we're avoiding here
		err := m.mediaQueue.MoveEntry(entryID, auth.UnknownUser, up)
		if err != nil {
			panic(m.runtime.NewGoError(stacktrace.Propagate(err, "")))
		}
	}
}

func (m *queueModule) parseMovementDirectionArgument(direction, argPos, callerName string) bool {
	switch direction {
	case "up":
		return true
	case "down":
		return false
	default:
		panic(m.runtime.NewTypeError("%s argument to %s must be one of 'up', 'down'.", argPos, callerName))
	}
}

func (m *queueModule) computeEnqueuePricing(call goja.FunctionCall) goja.Value {
	if len(call.Arguments) < 3 {
		panic(m.runtime.NewTypeError("Missing argument"))
	}

	var lengthms int64
	err := m.runtime.ExportTo(call.Argument(0), &lengthms)
	if err != nil {
		panic(m.runtime.NewTypeError("First argument must be an integer"))
	}

	if lengthms < 1000 {
		panic(m.runtime.NewTypeError("Duration must be longer than one second"))
	}

	length := time.Duration(lengthms) * time.Millisecond

	var unskippable bool
	err = m.runtime.ExportTo(call.Argument(1), &unskippable)
	if err != nil {
		panic(m.runtime.NewTypeError("Second argument must be a boolean"))
	}

	var concealed bool
	err = m.runtime.ExportTo(call.Argument(2), &concealed)
	if err != nil {
		panic(m.runtime.NewTypeError("Third argument must be a boolean"))
	}

	pricing := m.pricer.ComputeEnqueuePricing(length, unskippable, concealed)

	return m.runtime.ToValue(map[string]interface{}{
		"later":        pricing.EnqueuePrice.SerializeForAPI(),
		"aftercurrent": pricing.PlayAfterCurrentPrice.SerializeForAPI(),
		"now":          pricing.PlayAfterCurrentPrice.SerializeForAPI(),
	})
}
