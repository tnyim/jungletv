package queue

import (
	"math"
	"time"

	"github.com/dop251/goja"
	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/server/components/apprunner/gojautil"
	"github.com/tnyim/jungletv/server/components/skipmanager"
	"github.com/tnyim/jungletv/server/media"
)

func (m *queueModule) serializeQueueEntry(vm *goja.Runtime, entry media.QueueEntry) goja.Value {
	if entry == nil || entry == media.QueueEntry(nil) {
		return goja.Undefined()
	}
	result := vm.NewObject()

	serializePerformance(vm, result, entry)

	result.DefineAccessorProperty("concealed", vm.ToValue(func(call goja.FunctionCall) goja.Value {
		return vm.ToValue(entry.Concealed())
	}), goja.Undefined(), goja.FLAG_FALSE, goja.FLAG_TRUE)

	result.DefineAccessorProperty("movedBy", vm.ToValue(func(call goja.FunctionCall) goja.Value {
		return vm.ToValue(entry.MovedBy())
	}), goja.Undefined(), goja.FLAG_FALSE, goja.FLAG_TRUE)

	result.Set("remove", func() goja.Value {
		removed := m.removeEntryAndLog(entry.PerformanceID())
		return m.serializeQueueEntry(vm, removed)
	})

	result.Set("move", func(call goja.FunctionCall) goja.Value {
		if len(call.Arguments) < 1 {
			panic(m.runtime.NewTypeError("Missing argument"))
		}
		m.moveEntry(entry.PerformanceID(), call.Argument(0).String(), "First", "move", false)
		return goja.Undefined()
	})

	result.Set("moveWithCost", func(call goja.FunctionCall) goja.Value {
		if len(call.Arguments) < 1 {
			panic(m.runtime.NewTypeError("Missing argument"))
		}
		m.moveEntry(entry.PerformanceID(), call.Argument(0).String(), "First", "moveWithCost", true)
		return goja.Undefined()
	})

	return result
}

func serializePerformance(vm *goja.Runtime, onObject *goja.Object, performance media.Performance) goja.Value {
	if performance == nil || performance == media.Performance(nil) {
		return goja.Undefined()
	}
	result := onObject
	if result == nil {
		result = vm.NewObject()
	}

	result.DefineAccessorProperty("media", vm.ToValue(func(call goja.FunctionCall) goja.Value {
		return serializeMediaInfo(vm, performance.MediaInfo())
	}), goja.Undefined(), goja.FLAG_FALSE, goja.FLAG_TRUE)

	result.DefineAccessorProperty("played", vm.ToValue(func(call goja.FunctionCall) goja.Value {
		return vm.ToValue(performance.Played())
	}), goja.Undefined(), goja.FLAG_FALSE, goja.FLAG_TRUE)

	result.DefineAccessorProperty("playedFor", vm.ToValue(func(call goja.FunctionCall) goja.Value {
		return vm.ToValue(performance.PlayedFor().Milliseconds())
	}), goja.Undefined(), goja.FLAG_FALSE, goja.FLAG_TRUE)

	result.DefineAccessorProperty("startedAt", vm.ToValue(func(call goja.FunctionCall) goja.Value {
		startedAt := performance.StartedAt()
		if startedAt.IsZero() {
			return goja.Undefined()
		}
		return gojautil.SerializeTime(vm, startedAt)
	}), goja.Undefined(), goja.FLAG_FALSE, goja.FLAG_TRUE)

	result.DefineAccessorProperty("playing", vm.ToValue(func(call goja.FunctionCall) goja.Value {
		return vm.ToValue(performance.Playing())
	}), goja.Undefined(), goja.FLAG_FALSE, goja.FLAG_TRUE)

	result.DefineAccessorProperty("id", vm.ToValue(func(call goja.FunctionCall) goja.Value {
		return vm.ToValue(performance.PerformanceID())
	}), goja.Undefined(), goja.FLAG_FALSE, goja.FLAG_TRUE)

	result.DefineAccessorProperty("requestCost", vm.ToValue(func(call goja.FunctionCall) goja.Value {
		return vm.ToValue(performance.RequestCost().SerializeForAPI())
	}), goja.Undefined(), goja.FLAG_FALSE, goja.FLAG_TRUE)

	result.DefineAccessorProperty("requestedAt", vm.ToValue(func(call goja.FunctionCall) goja.Value {
		requestedAt := performance.RequestedAt()
		if requestedAt.IsZero() || requestedAt.Equal(time.Unix(0, 0)) {
			return goja.Undefined()
		}
		return gojautil.SerializeTime(vm, requestedAt)
	}), goja.Undefined(), goja.FLAG_FALSE, goja.FLAG_TRUE)

	result.DefineAccessorProperty("requestedBy", vm.ToValue(func(call goja.FunctionCall) goja.Value {
		return gojautil.SerializeUser(vm, performance.RequestedBy())
	}), goja.Undefined(), goja.FLAG_FALSE, goja.FLAG_TRUE)

	result.DefineAccessorProperty("unskippable", vm.ToValue(func(call goja.FunctionCall) goja.Value {
		return vm.ToValue(performance.Unskippable())
	}), goja.Undefined(), goja.FLAG_FALSE, goja.FLAG_TRUE)

	return result
}

func serializeMediaInfo(vm *goja.Runtime, info media.BasicInfo) goja.Value {
	result := vm.NewObject()

	result.DefineAccessorProperty("length", vm.ToValue(func(call goja.FunctionCall) goja.Value {
		if info.Length() == math.MaxInt64 {
			return goja.PositiveInf()
		}
		return vm.ToValue(info.Length().Milliseconds())
	}), goja.Undefined(), goja.FLAG_FALSE, goja.FLAG_TRUE)

	result.DefineAccessorProperty("offset", vm.ToValue(func(call goja.FunctionCall) goja.Value {
		return vm.ToValue(info.Offset().Milliseconds())
	}), goja.Undefined(), goja.FLAG_FALSE, goja.FLAG_TRUE)

	result.DefineAccessorProperty("title", vm.ToValue(func(call goja.FunctionCall) goja.Value {
		return vm.ToValue(info.Title())
	}), goja.Undefined(), goja.FLAG_FALSE, goja.FLAG_TRUE)

	result.DefineAccessorProperty("id", vm.ToValue(func(call goja.FunctionCall) goja.Value {
		_, id := info.MediaID()
		return vm.ToValue(id)
	}), goja.Undefined(), goja.FLAG_FALSE, goja.FLAG_TRUE)

	result.DefineAccessorProperty("type", vm.ToValue(func(call goja.FunctionCall) goja.Value {
		t, _ := info.MediaID()
		return vm.ToValue(string(t))
	}), goja.Undefined(), goja.FLAG_FALSE, goja.FLAG_TRUE)

	return result
}

func (m *queueModule) serializeSkipAccount(vm *goja.Runtime, status *skipmanager.SkipAccountStatus) goja.Value {
	result := vm.NewObject()

	result.DefineAccessorProperty("status", vm.ToValue(func(call goja.FunctionCall) goja.Value {
		switch status.SkipStatus {
		case proto.SkipStatus_SKIP_STATUS_ALLOWED:
			return vm.ToValue("possible")
		case proto.SkipStatus_SKIP_STATUS_UNSKIPPABLE:
			return vm.ToValue("impossible_unskippable")
		case proto.SkipStatus_SKIP_STATUS_END_OF_MEDIA_PERIOD:
			return vm.ToValue("impossible_end_of_media_period")
		case proto.SkipStatus_SKIP_STATUS_NO_MEDIA:
			return vm.ToValue("impossible_no_media")
		case proto.SkipStatus_SKIP_STATUS_UNAVAILABLE:
			return vm.ToValue("impossible_unavailable")
		case proto.SkipStatus_SKIP_STATUS_DISABLED:
			return vm.ToValue("impossible_disabled")
		case proto.SkipStatus_SKIP_STATUS_START_OF_MEDIA_PERIOD:
			return vm.ToValue("impossible_start_of_media_period")
		default:
			panic(vm.NewGoError(stacktrace.NewError("unknown skip account status")))
		}
	}), goja.Undefined(), goja.FLAG_FALSE, goja.FLAG_TRUE)

	result.DefineAccessorProperty("address", vm.ToValue(func(call goja.FunctionCall) goja.Value {
		return vm.ToValue(status.Address)
	}), goja.Undefined(), goja.FLAG_FALSE, goja.FLAG_TRUE)

	result.DefineAccessorProperty("balance", vm.ToValue(func(call goja.FunctionCall) goja.Value {
		return vm.ToValue(status.Balance.SerializeForAPI())
	}), goja.Undefined(), goja.FLAG_FALSE, goja.FLAG_TRUE)

	result.DefineAccessorProperty("threshold", vm.ToValue(func(call goja.FunctionCall) goja.Value {
		return vm.ToValue(status.Threshold.SerializeForAPI())
	}), goja.Undefined(), goja.FLAG_FALSE, goja.FLAG_TRUE)

	result.DefineAccessorProperty("thresholdLowerable", vm.ToValue(func(call goja.FunctionCall) goja.Value {
		return vm.ToValue(status.ThresholdLowerable)
	}), goja.Undefined(), goja.FLAG_FALSE, goja.FLAG_TRUE)

	return result
}

func (m *queueModule) serializeRainAccount(vm *goja.Runtime, status *skipmanager.RainAccountStatus) goja.Value {
	result := vm.NewObject()

	result.DefineAccessorProperty("address", vm.ToValue(func(call goja.FunctionCall) goja.Value {
		return vm.ToValue(status.Address)
	}), goja.Undefined(), goja.FLAG_FALSE, goja.FLAG_TRUE)

	result.DefineAccessorProperty("balance", vm.ToValue(func(call goja.FunctionCall) goja.Value {
		return vm.ToValue(status.Balance.SerializeForAPI())
	}), goja.Undefined(), goja.FLAG_FALSE, goja.FLAG_TRUE)

	return result
}
