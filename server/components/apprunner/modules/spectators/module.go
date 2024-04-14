package spectators

import (
	"context"
	"sync"
	"time"

	"github.com/dop251/goja"
	"github.com/dop251/goja_nodejs/require"
	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/server/components/apprunner/gojautil"
	"github.com/tnyim/jungletv/server/components/apprunner/modules"
	"github.com/tnyim/jungletv/server/components/apprunner/modules/queue"
	"github.com/tnyim/jungletv/server/components/rewards"
	"github.com/tnyim/jungletv/server/components/stats"
)

// ModuleName is the name by which this module can be require()d in a script
const ModuleName = "jungletv:spectators"

type spectatorsModule struct {
	runtime        *goja.Runtime
	exports        *goja.Object
	rewardsHandler *rewards.Handler
	statsRegistry  *stats.Registry
	userSerializer gojautil.UserSerializer
	dateSerializer func(time.Time) interface{}
	eventAdapter   *gojautil.EventAdapter

	appContext modules.ApplicationContext

	executionContext context.Context
}

// New returns a new points module
func New(appContext modules.ApplicationContext, rewardsHandler *rewards.Handler, statsRegistry *stats.Registry, userSerializer gojautil.UserSerializer) modules.NativeModule {
	return &spectatorsModule{
		rewardsHandler: rewardsHandler,
		statsRegistry:  statsRegistry,
		userSerializer: userSerializer,
		appContext:     appContext,
		eventAdapter:   gojautil.NewEventAdapter(appContext.Schedule),
	}
}

func (m *spectatorsModule) IsNodeBuiltin() bool {
	return false
}

func (m *spectatorsModule) ModuleLoader() require.ModuleLoader {
	return func(runtime *goja.Runtime, module *goja.Object) {
		m.runtime = runtime
		m.dateSerializer = func(t time.Time) interface{} {
			return gojautil.SerializeTime(runtime, t)
		}
		m.exports = module.Get("exports").(*goja.Object)
		m.exports.Set("markAsActive", m.markAsActive)
		m.exports.Set("addEventListener", m.eventAdapter.AddEventListener)
		m.exports.Set("removeEventListener", m.eventAdapter.RemoveEventListener)

		gojautil.AdaptEvent(m.eventAdapter, m.rewardsHandler.RewardsDistributed(), "rewardsdistributed", func(vm *goja.Runtime, arg rewards.RewardsDistributedEventArgs) *goja.Object {
			t := map[string]interface{}{
				"eligibleSpectators": arg.EligibleSpectators,
				"rewardBudget":       arg.RewardBudget.SerializeForAPI(),
				"requesterReward":    arg.RequesterReward.SerializeForAPI(),
				"mediaPerformance":   queue.SerializePerformance(vm, nil, arg.Media, m.userSerializer),
			}
			return vm.ToValue(t).ToObject(vm)
		})

		m.exports.DefineAccessorProperty("connectedCount", m.runtime.ToValue(func(call goja.FunctionCall) goja.Value {
			return m.runtime.ToValue(m.statsRegistry.CurrentlyWatching())
		}), goja.Undefined(), goja.FLAG_FALSE, goja.FLAG_TRUE)

		m.exports.DefineAccessorProperty("eligibleEstimate", m.runtime.ToValue(func(call goja.FunctionCall) goja.Value {
			active, ok := m.rewardsHandler.EstimateEligibleSpectators()
			if !ok {
				return m.runtime.ToValue(m.statsRegistry.CurrentlyWatching() / 2)
			}
			return m.runtime.ToValue(active)
		}), goja.Undefined(), goja.FLAG_FALSE, goja.FLAG_TRUE)
	}
}
func (m *spectatorsModule) ModuleName() string {
	return ModuleName
}
func (m *spectatorsModule) AutoRequire() (bool, string) {
	return false, ""
}

func (m *spectatorsModule) ExecutionResumed(ctx context.Context, wg *sync.WaitGroup, runtime *goja.Runtime) {
	m.executionContext = ctx
	m.runtime = runtime
	m.eventAdapter.StartOrResume(ctx, wg, m.runtime)
}

func (m *spectatorsModule) markAsActive(call goja.FunctionCall) goja.Value {
	if len(call.Arguments) < 1 {
		panic(m.runtime.NewTypeError("Missing argument"))
	}
	userValue := call.Argument(0)
	userAddress := userValue.String()

	gojautil.ValidateBananoAddress(m.runtime, userAddress, "Invalid user address")

	err := m.rewardsHandler.MarkAddressAsActiveIfNotChallenged(m.executionContext, userAddress)
	if err != nil {
		panic(m.runtime.NewGoError(stacktrace.Propagate(err, "")))
	}
	return goja.Undefined()
}
