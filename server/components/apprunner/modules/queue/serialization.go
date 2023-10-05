package queue

import (
	"math"

	"github.com/dop251/goja"
	"github.com/tnyim/jungletv/server/components/apprunner/gojautil"
	"github.com/tnyim/jungletv/server/media"
)

func (m *queueModule) serializeQueueEntry(vm *goja.Runtime, entry media.QueueEntry) goja.Value {
	result := vm.NewObject()

	result.DefineAccessorProperty("concealed", vm.ToValue(func(call goja.FunctionCall) goja.Value {
		return vm.ToValue(entry.Concealed())
	}), goja.Undefined(), goja.FLAG_FALSE, goja.FLAG_TRUE)

	result.DefineAccessorProperty("media", vm.ToValue(func(call goja.FunctionCall) goja.Value {
		return serializeMediaInfo(vm, entry.MediaInfo())
	}), goja.Undefined(), goja.FLAG_FALSE, goja.FLAG_TRUE)

	result.DefineAccessorProperty("movedBy", vm.ToValue(func(call goja.FunctionCall) goja.Value {
		return vm.ToValue(entry.MovedBy())
	}), goja.Undefined(), goja.FLAG_FALSE, goja.FLAG_TRUE)

	result.DefineAccessorProperty("played", vm.ToValue(func(call goja.FunctionCall) goja.Value {
		return vm.ToValue(entry.Played())
	}), goja.Undefined(), goja.FLAG_FALSE, goja.FLAG_TRUE)

	result.DefineAccessorProperty("playedFor", vm.ToValue(func(call goja.FunctionCall) goja.Value {
		return vm.ToValue(entry.PlayedFor().Milliseconds())
	}), goja.Undefined(), goja.FLAG_FALSE, goja.FLAG_TRUE)

	result.DefineAccessorProperty("playing", vm.ToValue(func(call goja.FunctionCall) goja.Value {
		return vm.ToValue(entry.Playing())
	}), goja.Undefined(), goja.FLAG_FALSE, goja.FLAG_TRUE)

	result.DefineAccessorProperty("id", vm.ToValue(func(call goja.FunctionCall) goja.Value {
		return vm.ToValue(entry.QueueID())
	}), goja.Undefined(), goja.FLAG_FALSE, goja.FLAG_TRUE)

	result.DefineAccessorProperty("requestCost", vm.ToValue(func(call goja.FunctionCall) goja.Value {
		return vm.ToValue(entry.RequestCost().SerializeForAPI())
	}), goja.Undefined(), goja.FLAG_FALSE, goja.FLAG_TRUE)

	result.DefineAccessorProperty("requestedAt", vm.ToValue(func(call goja.FunctionCall) goja.Value {
		return gojautil.SerializeTime(vm, entry.RequestedAt())
	}), goja.Undefined(), goja.FLAG_FALSE, goja.FLAG_TRUE)

	result.DefineAccessorProperty("requestedBy", vm.ToValue(func(call goja.FunctionCall) goja.Value {
		return gojautil.SerializeUser(vm, entry.RequestedBy())
	}), goja.Undefined(), goja.FLAG_FALSE, goja.FLAG_TRUE)

	result.DefineAccessorProperty("unskippable", vm.ToValue(func(call goja.FunctionCall) goja.Value {
		return vm.ToValue(entry.Unskippable())
	}), goja.Undefined(), goja.FLAG_FALSE, goja.FLAG_TRUE)

	result.Set("remove", func() goja.Value {
		removed := m.removeEntryAndLog(entry.QueueID())
		return m.serializeQueueEntry(vm, removed)
	})

	return result
}

func serializeMediaInfo(vm *goja.Runtime, info media.Info) goja.Value {
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
