package spectators

import (
	"github.com/dop251/goja"
	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/server/components/apprunner/gojautil"
	"github.com/tnyim/jungletv/server/components/rewards"
)

func (m *spectatorsModule) serializeSpectator(spectator rewards.Spectator) goja.Value {
	result := m.runtime.NewObject()

	result.DefineAccessorProperty("user", m.runtime.ToValue(func(call goja.FunctionCall) goja.Value {
		return m.userSerializer.SerializeUser(m.runtime, spectator.User())
	}), goja.Undefined(), goja.FLAG_FALSE, goja.FLAG_TRUE)

	result.DefineAccessorProperty("connectedAt", m.runtime.ToValue(func(call goja.FunctionCall) goja.Value {
		return gojautil.SerializeTime(m.runtime, spectator.WatchingSince())
	}), goja.Undefined(), goja.FLAG_FALSE, goja.FLAG_TRUE)

	result.DefineAccessorProperty("disconnectedAt", m.runtime.ToValue(func(call goja.FunctionCall) goja.Value {
		stoppedWatching, stoppedWatchingAt := spectator.StoppedWatching()
		if !stoppedWatching {
			return goja.Undefined()
		}
		return gojautil.SerializeTime(m.runtime, stoppedWatchingAt)
	}), goja.Undefined(), goja.FLAG_FALSE, goja.FLAG_TRUE)

	result.DefineAccessorProperty("connectionCount", m.runtime.ToValue(func(call goja.FunctionCall) goja.Value {
		return m.runtime.ToValue(spectator.ConnectionCount())
	}), goja.Undefined(), goja.FLAG_FALSE, goja.FLAG_TRUE)

	result.DefineAccessorProperty("failedLegitimacyCheckAt", m.runtime.ToValue(func(call goja.FunctionCall) goja.Value {
		legitimate, failedAt := spectator.Legitimate()
		if legitimate {
			return goja.Undefined()
		}
		return gojautil.SerializeTime(m.runtime, failedAt)
	}), goja.Undefined(), goja.FLAG_FALSE, goja.FLAG_TRUE)

	result.DefineAccessorProperty("activityChallengedAt", m.runtime.ToValue(func(call goja.FunctionCall) goja.Value {
		challenge := spectator.CurrentActivityChallenge()
		if challenge == nil {
			return goja.Undefined()
		}
		return gojautil.SerializeTime(m.runtime, challenge.ChallengedAt)
	}), goja.Undefined(), goja.FLAG_FALSE, goja.FLAG_TRUE)

	result.DefineAccessorProperty("remoteAddress", m.runtime.ToValue(func(call goja.FunctionCall) goja.Value {
		goodRep, asn, checked := spectator.RemoteAddressInformation(m.appContext.ExecutionContext(), m.rewardsHandler)
		if !checked {
			return goja.Undefined()
		}
		info := map[string]interface{}{
			"reputable": goodRep,
		}
		if asn >= 0 {
			info["asNumber"] = asn
		} else {
			info["asNumber"] = goja.Undefined()
		}
		return m.runtime.ToValue(info)
	}), goja.Undefined(), goja.FLAG_FALSE, goja.FLAG_TRUE)

	result.Set("markAsActive", func() goja.Value {
		err := m.rewardsHandler.MarkAddressAsActiveIfNotChallenged(m.appContext.ExecutionContext(), spectator.User().Address())
		if err != nil {
			panic(m.runtime.NewGoError(stacktrace.Propagate(err, "")))
		}
		return goja.Undefined()
	})

	return result
}
