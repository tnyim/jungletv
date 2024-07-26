package spectators

import (
	"context"
	"sync"
	"time"

	"github.com/dop251/goja"
	"github.com/dop251/goja_nodejs/require"
	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/server/auth"
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
}

// New returns a new points module
func New(appContext modules.ApplicationContext, rewardsHandler *rewards.Handler, statsRegistry *stats.Registry, userSerializer gojautil.UserSerializer) modules.NativeModule {
	return &spectatorsModule{
		rewardsHandler: rewardsHandler,
		statsRegistry:  statsRegistry,
		userSerializer: userSerializer,
		appContext:     appContext,
		eventAdapter:   gojautil.NewEventAdapter(appContext),
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
		m.exports.Set("getSpectator", m.getSpectator)
		m.exports.Set("markAsActive", m.markAsActive)
		m.exports.Set("addEventListener", m.eventAdapter.AddEventListener)
		m.exports.Set("removeEventListener", m.eventAdapter.RemoveEventListener)

		gojautil.AdaptEvent(m.eventAdapter, m.rewardsHandler.RewardsDistributed(), "rewardsdistributed", func(vm *goja.Runtime, arg rewards.RewardsDistributedEventArgs) *goja.Object {
			t := map[string]interface{}{
				"rewardBudget":    arg.RewardBudget.SerializeForAPI(),
				"requesterReward": arg.RequesterReward.SerializeForAPI(),
			}
			obj := vm.ToValue(t).ToObject(vm)

			obj.DefineAccessorProperty("rewardedUsers", m.runtime.ToValue(func(call goja.FunctionCall) goja.Value {
				userValues := make([]goja.Value, len(arg.EligibleSpectators))
				for i, address := range arg.EligibleSpectators {
					userValues[i] = m.userSerializer.SerializeUser(m.runtime, auth.NewAddressOnlyUser(address))
				}
				return m.runtime.ToValue(userValues)
			}), goja.Undefined(), goja.FLAG_FALSE, goja.FLAG_TRUE)

			obj.DefineAccessorProperty("mediaPerformance", m.runtime.ToValue(func(call goja.FunctionCall) goja.Value {
				return queue.SerializePerformance(vm, nil, arg.Media, m.userSerializer)
			}), goja.Undefined(), goja.FLAG_FALSE, goja.FLAG_TRUE)

			return obj
		})

		gojautil.AdaptEvent(m.eventAdapter, m.rewardsHandler.SpectatorConnected(), "spectatorconnected", func(vm *goja.Runtime, arg rewards.Spectator) *goja.Object {
			t := map[string]interface{}{
				"spectator": m.serializeSpectator(arg),
			}
			return vm.ToValue(t).ToObject(vm)
		})

		gojautil.AdaptEvent(m.eventAdapter, m.rewardsHandler.SpectatorDisconnected(), "spectatordisconnected", func(vm *goja.Runtime, arg rewards.Spectator) *goja.Object {
			t := map[string]interface{}{
				"spectator": m.serializeSpectator(arg),
			}
			return vm.ToValue(t).ToObject(vm)
		})

		gojautil.AdaptEvent(m.eventAdapter, m.rewardsHandler.SpectatorActivityChallenged(), "spectatoractivitychallenged", func(vm *goja.Runtime, arg rewards.SpectatorActivityChallengedEventArgs) *goja.Object {
			t := map[string]interface{}{
				"spectator":                    m.serializeSpectator(arg.Spectator),
				"hadPreviousUnsolvedChallenge": arg.HadPreviousUnsolvedChallenge,
			}
			if arg.HardChallenge {
				t["challengeDifficulty"] = "hard"
			} else {
				t["challengeDifficulty"] = "easy"
			}
			return vm.ToValue(t).ToObject(vm)
		})

		gojautil.AdaptEvent(m.eventAdapter, m.rewardsHandler.SpectatorSolvedActivityChallenge(), "spectatorsolvedactivitychallenge", func(vm *goja.Runtime, arg rewards.SpectatorSolvedActivityChallengeEventArgs) *goja.Object {
			t := map[string]interface{}{
				"spectator":       m.serializeSpectator(arg.Spectator),
				"challengedFor":   arg.ChallengedFor.Milliseconds(),
				"correctSolution": arg.CorrectSolution,
			}
			if arg.HardChallenge {
				t["challengeDifficulty"] = "hard"
			} else {
				t["challengeDifficulty"] = "easy"
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

		m.exports.DefineAccessorProperty("connected", m.runtime.ToValue(func(call goja.FunctionCall) goja.Value {
			spectators := m.rewardsHandler.ConnectedSpectators()
			result := make([]goja.Value, len(spectators))
			for i := range spectators {
				result[i] = m.serializeSpectator(spectators[i])
			}
			return m.runtime.ToValue(result)
		}), goja.Undefined(), goja.FLAG_FALSE, goja.FLAG_TRUE)
	}
}
func (m *spectatorsModule) ModuleName() string {
	return ModuleName
}
func (m *spectatorsModule) AutoRequire() (bool, string) {
	return false, ""
}

func (m *spectatorsModule) ExecutionResumed(ctx context.Context, wg *sync.WaitGroup) {
	m.eventAdapter.StartOrResume(ctx, wg, m.runtime)
}

func (m *spectatorsModule) getSpectator(call goja.FunctionCall) goja.Value {
	if len(call.Arguments) < 1 {
		panic(m.runtime.NewTypeError("Missing argument"))
	}
	userValue := call.Argument(0)
	userAddress := userValue.String()

	gojautil.ValidateBananoAddress(m.runtime, userAddress, "Invalid user address")

	spectator, ok := m.rewardsHandler.GetSpectator(userAddress)
	if !ok {
		return goja.Null()
	}

	return m.serializeSpectator(spectator)
}

func (m *spectatorsModule) markAsActive(call goja.FunctionCall) goja.Value {
	if len(call.Arguments) < 1 {
		panic(m.runtime.NewTypeError("Missing argument"))
	}
	userValue := call.Argument(0)
	userAddress := userValue.String()

	gojautil.ValidateBananoAddress(m.runtime, userAddress, "Invalid user address")

	err := m.rewardsHandler.MarkAddressAsActiveIfNotChallenged(m.appContext.ExecutionContext(), userAddress)
	if err != nil {
		panic(m.runtime.NewGoError(stacktrace.Propagate(err, "")))
	}
	return goja.Undefined()
}
