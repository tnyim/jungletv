package queue

import (
	"fmt"

	"github.com/dop251/goja"
	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/server/components/apprunner/gojautil"
)

func (m *queueModule) setPropertyExports() {
	m.exports.DefineAccessorProperty("enqueuingPermission", m.runtime.ToValue(func(call goja.FunctionCall) goja.Value {
		permission := m.queueMisc.MediaEnqueuingPermission()
		switch permission {
		case proto.AllowedMediaEnqueuingType_ENABLED:
			return m.runtime.ToValue("enabled")
		case proto.AllowedMediaEnqueuingType_STAFF_ONLY:
			return m.runtime.ToValue("enabled_staff_only")
		case proto.AllowedMediaEnqueuingType_PASSWORD_REQUIRED:
			return m.runtime.ToValue("enabled_password_required")
		case proto.AllowedMediaEnqueuingType_DISABLED:
			return m.runtime.ToValue("disabled")
		}
		panic(m.runtime.NewGoError(stacktrace.NewError("unknown enqueuing permission type %v", permission)))
	}), goja.Undefined(), goja.FLAG_FALSE, goja.FLAG_FALSE)

	m.exports.DefineAccessorProperty("entries", m.runtime.ToValue(func(call goja.FunctionCall) goja.Value {
		entries := m.mediaQueue.Entries()
		result := make([]goja.Value, len(entries))
		for i := range entries {
			result[i] = m.serializeQueueEntry(m.runtime, entries[i])
		}
		return m.runtime.ToValue(result)
	}), goja.Undefined(), goja.FLAG_FALSE, goja.FLAG_FALSE)

	m.exports.DefineAccessorProperty("playing", m.runtime.ToValue(func(call goja.FunctionCall) goja.Value {
		entry, playing := m.mediaQueue.CurrentlyPlaying()
		if !playing {
			return goja.Undefined()
		}
		return m.serializeQueueEntry(m.runtime, entry)
	}), goja.Undefined(), goja.FLAG_FALSE, goja.FLAG_FALSE)

	m.exports.DefineAccessorProperty("length", m.runtime.ToValue(func(call goja.FunctionCall) goja.Value {
		return m.runtime.ToValue(m.mediaQueue.Length())
	}), goja.Undefined(), goja.FLAG_FALSE, goja.FLAG_FALSE)

	m.exports.DefineAccessorProperty("lengthUpToCursor", m.runtime.ToValue(func(call goja.FunctionCall) goja.Value {
		return m.runtime.ToValue(m.mediaQueue.LengthUpToCursor())
	}), goja.Undefined(), goja.FLAG_FALSE, goja.FLAG_FALSE)

	m.exports.DefineAccessorProperty("removalOfOwnEntriesAllowed", m.runtime.ToValue(func(call goja.FunctionCall) goja.Value {
		return m.runtime.ToValue(m.mediaQueue.RemovalOfOwnEntriesAllowed())
	}), m.runtime.ToValue(func(call goja.FunctionCall) goja.Value {
		if len(call.Arguments) < 1 {
			panic(m.runtime.NewTypeError("Missing argument"))
		}

		var allowed bool
		err := m.runtime.ExportTo(call.Argument(0), &allowed)
		if err != nil {
			panic(m.runtime.NewTypeError("First argument must be a boolean"))
		}

		m.mediaQueue.SetRemovalOfOwnEntriesAllowed(allowed)

		action := "disabled"
		if allowed {
			action = "enabled"
		}
		m.appContext.Logger().RuntimeAuditLog(fmt.Sprintf("%s removal of own queue entries", action))
		return goja.Undefined()
	}), goja.FLAG_FALSE, goja.FLAG_FALSE)

	m.exports.DefineAccessorProperty("newQueueEntriesAllUnskippable", m.runtime.ToValue(func(call goja.FunctionCall) goja.Value {
		return m.runtime.ToValue(m.queueMisc.NewQueueEntriesAllUnskippable())
	}), m.runtime.ToValue(func(call goja.FunctionCall) goja.Value {
		if len(call.Arguments) < 1 {
			panic(m.runtime.NewTypeError("Missing argument"))
		}

		var enabled bool
		err := m.runtime.ExportTo(call.Argument(0), &enabled)
		if err != nil {
			panic(m.runtime.NewTypeError("First argument must be a boolean"))
		}

		m.queueMisc.SetNewQueueEntriesAllUnskippable(enabled)

		action := "disabled"
		if enabled {
			action = "enabled"
		}
		m.appContext.Logger().RuntimeAuditLog(fmt.Sprintf("%s forced unskippability of new queue entries", action))
		return goja.Undefined()
	}), goja.FLAG_FALSE, goja.FLAG_FALSE)

	m.exports.DefineAccessorProperty("skippingAllowed", m.runtime.ToValue(func(call goja.FunctionCall) goja.Value {
		return m.runtime.ToValue(m.mediaQueue.SkippingEnabled())
	}), m.runtime.ToValue(func(call goja.FunctionCall) goja.Value {
		if len(call.Arguments) < 1 {
			panic(m.runtime.NewTypeError("Missing argument"))
		}

		var allowed bool
		err := m.runtime.ExportTo(call.Argument(0), &allowed)
		if err != nil {
			panic(m.runtime.NewTypeError("First argument must be a boolean"))
		}

		m.mediaQueue.SetSkippingEnabled(allowed)

		action := "disabled"
		if allowed {
			action = "enabled"
		}
		m.appContext.Logger().RuntimeAuditLog(fmt.Sprintf("%s skipping in general", action))
		return goja.Undefined()
	}), goja.FLAG_FALSE, goja.FLAG_FALSE)

	m.exports.DefineAccessorProperty("reorderingAllowed", m.runtime.ToValue(func(call goja.FunctionCall) goja.Value {
		return m.runtime.ToValue(m.mediaQueue.EntryReorderingAllowed())
	}), m.runtime.ToValue(func(call goja.FunctionCall) goja.Value {
		if len(call.Arguments) < 1 {
			panic(m.runtime.NewTypeError("Missing argument"))
		}

		var allowed bool
		err := m.runtime.ExportTo(call.Argument(0), &allowed)
		if err != nil {
			panic(m.runtime.NewTypeError("First argument must be a boolean"))
		}

		m.mediaQueue.SetEntryReorderingAllowed(allowed)

		action := "disabled"
		if allowed {
			action = "enabled"
		}
		m.appContext.Logger().RuntimeAuditLog(fmt.Sprintf("%s reordering of queue entries", action))
		return goja.Undefined()
	}), goja.FLAG_FALSE, goja.FLAG_FALSE)

	m.exports.DefineAccessorProperty("insertCursor", m.runtime.ToValue(func(call goja.FunctionCall) goja.Value {
		insertCursor, hasCursor := m.mediaQueue.InsertCursor()
		if !hasCursor {
			return goja.Undefined()
		}
		return m.runtime.ToValue(insertCursor)
	}), m.runtime.ToValue(func(call goja.FunctionCall) goja.Value {
		if len(call.Arguments) < 1 {
			panic(m.runtime.NewTypeError("Missing argument"))
		}
		cursor, hasCursor := m.mediaQueue.InsertCursor()

		arg := call.Argument(0)
		if goja.IsUndefined(arg) || goja.IsNull(arg) {
			if !hasCursor {
				return goja.Undefined()
			}
			m.mediaQueue.ClearInsertCursor()
			m.appContext.Logger().RuntimeAuditLog("cleared queue insert cursor")
			return goja.Undefined()
		}

		entryID := arg.String()
		if cursor == entryID {
			return goja.Undefined()
		}
		err := m.mediaQueue.SetInsertCursor(entryID)
		if err != nil {
			panic(m.runtime.NewGoError(stacktrace.Propagate(err, "")))
		}

		m.appContext.Logger().RuntimeAuditLog(fmt.Sprintf("set queue insert cursor to %s", entryID))
		return goja.Undefined()
	}), goja.FLAG_FALSE, goja.FLAG_FALSE)

	m.exports.DefineAccessorProperty("playingSince", m.runtime.ToValue(func(call goja.FunctionCall) goja.Value {
		return gojautil.SerializeTime(m.runtime, m.mediaQueue.PlayingSince())
	}), goja.Undefined(), goja.FLAG_FALSE, goja.FLAG_FALSE)
}
