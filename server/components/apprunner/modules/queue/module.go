package queue

import (
	"context"
	"time"

	"github.com/dop251/goja"
	"github.com/dop251/goja_nodejs/require"
	"github.com/tnyim/jungletv/server/auth"
	"github.com/tnyim/jungletv/server/components/apprunner/gojautil"
	"github.com/tnyim/jungletv/server/components/apprunner/modules"
	"github.com/tnyim/jungletv/server/components/apprunner/modules/pages"
	"github.com/tnyim/jungletv/server/components/mediaqueue"
	"github.com/tnyim/jungletv/server/media"
	"github.com/tnyim/jungletv/types"
)

// ModuleName is the name by which this module can be require()d in a script
const ModuleName = "jungletv:queue"

type queueModule struct {
	runtime        *goja.Runtime
	exports        *goja.Object
	infoProvider   ProcessInformationProvider
	pagesModule    pages.PagesModule
	mediaQueue     *mediaqueue.MediaQueue
	schedule       gojautil.ScheduleFunction
	runOnLoop      gojautil.ScheduleFunctionNoError
	dateSerializer func(time.Time) interface{}
	eventAdapter   *gojautil.EventAdapter
	logger         modules.ApplicationLogger
	appUser        auth.User

	executionContext context.Context
}

// ProcessInformationProvider can get information about the process
type ProcessInformationProvider interface {
	ApplicationID() string
	ApplicationVersion() types.ApplicationVersion
}

// New returns a new queue module
func New(logger modules.ApplicationLogger, infoProvider ProcessInformationProvider, mediaQueue *mediaqueue.MediaQueue, pagesModule pages.PagesModule, appUser auth.User, schedule gojautil.ScheduleFunction, runOnLoop gojautil.ScheduleFunctionNoError) modules.NativeModule {
	return &queueModule{
		infoProvider: infoProvider,
		pagesModule:  pagesModule,
		logger:       logger,
		mediaQueue:   mediaQueue,
		schedule:     schedule,
		runOnLoop:    runOnLoop,
		appUser:      appUser,
	}
}

func (m *queueModule) IsNodeBuiltin() bool {
	return false
}

func (m *queueModule) ModuleLoader() require.ModuleLoader {
	return func(runtime *goja.Runtime, module *goja.Object) {
		m.runtime = runtime
		m.eventAdapter = gojautil.NewEventAdapter(runtime, m.schedule)
		m.dateSerializer = func(t time.Time) interface{} {
			return gojautil.SerializeTime(runtime, t)
		}
		m.exports = module.Get("exports").(*goja.Object)
		m.exports.Set("addEventListener", m.eventAdapter.AddEventListener)
		m.exports.Set("removeEventListener", m.eventAdapter.RemoveEventListener)
		/*m.exports.Set("createSystemMessage", m.createSystemMessage)
		m.exports.Set("createMessage", m.createMessage)
		m.exports.Set("createMessageWithPageAttachment", m.createMessageWithPageAttachment)
		m.exports.Set("getMessages", m.getMessages)*/

		m.exports.DefineAccessorProperty("entries", m.runtime.ToValue(func(call goja.FunctionCall) goja.Value {
			entries := m.mediaQueue.Entries()
			result := make([]goja.Value, len(entries))
			for i := range entries {
				result[i] = m.serializeQueueEntry(entries[i])
			}
			return m.runtime.ToValue(result)
		}), goja.Undefined(), goja.FLAG_FALSE, goja.FLAG_FALSE)

		m.exports.DefineAccessorProperty("playing", m.runtime.ToValue(func(call goja.FunctionCall) goja.Value {
			entry, playing := m.mediaQueue.CurrentlyPlaying()
			if !playing {
				return goja.Undefined()
			}
			return m.serializeQueueEntry(entry)
		}), goja.Undefined(), goja.FLAG_FALSE, goja.FLAG_FALSE)

		m.exports.DefineAccessorProperty("length", m.runtime.ToValue(func(call goja.FunctionCall) goja.Value {
			return m.runtime.ToValue(m.mediaQueue.Length())
		}), goja.Undefined(), goja.FLAG_FALSE, goja.FLAG_FALSE)

		m.exports.DefineAccessorProperty("lengthUpToCursor", m.runtime.ToValue(func(call goja.FunctionCall) goja.Value {
			return m.runtime.ToValue(m.mediaQueue.LengthUpToCursor())
		}), goja.Undefined(), goja.FLAG_FALSE, goja.FLAG_FALSE)

		m.exports.DefineAccessorProperty("removalOfOwnEntriesAllowed", m.runtime.ToValue(func(call goja.FunctionCall) goja.Value {
			return m.runtime.ToValue(m.mediaQueue.RemovalOfOwnEntriesAllowed())
		}), goja.Undefined(), goja.FLAG_FALSE, goja.FLAG_FALSE) // TODO should be read-write

		m.exports.DefineAccessorProperty("skippingAllowed", m.runtime.ToValue(func(call goja.FunctionCall) goja.Value {
			return m.runtime.ToValue(m.mediaQueue.SkippingEnabled())
		}), goja.Undefined(), goja.FLAG_FALSE, goja.FLAG_FALSE) // TODO should be read-write

		m.exports.DefineAccessorProperty("reorderingAllowed", m.runtime.ToValue(func(call goja.FunctionCall) goja.Value {
			return m.runtime.ToValue(m.mediaQueue.EntryReorderingAllowed())
		}), goja.Undefined(), goja.FLAG_FALSE, goja.FLAG_FALSE) // TODO should be read-write

		m.exports.DefineAccessorProperty("playingSince", m.runtime.ToValue(func(call goja.FunctionCall) goja.Value {
			return gojautil.SerializeTime(m.runtime, m.mediaQueue.PlayingSince())
		}), goja.Undefined(), goja.FLAG_FALSE, goja.FLAG_FALSE)

		// TODO cursor management

		gojautil.AdaptNoArgEvent(m.eventAdapter, m.mediaQueue.QueueUpdated(), "queueupdated", nil)
		gojautil.AdaptEvent(m.eventAdapter, m.mediaQueue.EntryAdded(), "entryadded", func(vm *goja.Runtime, arg mediaqueue.EntryAddedEventArg) map[string]interface{} {
			return map[string]interface{}{
				"entry": m.serializeQueueEntry(arg.Entry),
				"placement": func(placement mediaqueue.EntryAddedPlacement) string {
					switch placement {
					case mediaqueue.EntryAddedPlacementEnqueue:
						return "enqueue"
					case mediaqueue.EntryAddedPlacementPlayNext:
						return "playnext"
					case mediaqueue.EntryAddedPlacementPlayNow:
						return "playnow"
					default:
						return ""
					}
				}(arg.AddType),
			}
		})
		gojautil.AdaptEvent(m.eventAdapter, m.mediaQueue.EntryMoved(), "entrymoved", func(vm *goja.Runtime, arg mediaqueue.EntryMovedEventArg) map[string]interface{} {
			return map[string]interface{}{
				"user":  gojautil.SerializeUser(vm, arg.User),
				"entry": m.serializeQueueEntry(arg.Entry),
				"direction": func(up bool) string {
					if up {
						return "up"
					}
					return "down"
				}(arg.Up),
			}
		})
		gojautil.AdaptEvent(m.eventAdapter, m.mediaQueue.NonPlayingEntryRemoved(), "nonplayingentryremoved", func(vm *goja.Runtime, arg media.QueueEntry) map[string]interface{} {
			return map[string]interface{}{
				"entry": m.serializeQueueEntry(arg),
			}
		})
		gojautil.AdaptEvent(m.eventAdapter, m.mediaQueue.MediaChanged(), "mediachanged", func(vm *goja.Runtime, arg media.QueueEntry) map[string]interface{} {
			return map[string]interface{}{
				"playingEntry": m.serializeQueueEntry(arg),
			}
		})
		gojautil.AdaptEvent(m.eventAdapter, m.mediaQueue.OwnEntryRemoved(), "ownentryremoved", func(vm *goja.Runtime, arg media.QueueEntry) map[string]interface{} {
			return map[string]interface{}{
				"entry": m.serializeQueueEntry(arg),
			}
		})
		gojautil.AdaptNoArgEvent(m.eventAdapter, m.mediaQueue.SkippingAllowedUpdated(), "skippingallowedchanged", nil)
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
	m.executionContext = nil
}

func (m *queueModule) serializeQueueEntry(entry media.QueueEntry) goja.Value {
	result := m.runtime.NewObject()

	result.DefineAccessorProperty("concealed", m.runtime.ToValue(func(call goja.FunctionCall) goja.Value {
		return m.runtime.ToValue(entry.Concealed())
	}), goja.Undefined(), goja.FLAG_FALSE, goja.FLAG_TRUE)

	result.DefineAccessorProperty("media", m.runtime.ToValue(func(call goja.FunctionCall) goja.Value {
		return m.serializeMediaInfo(entry.MediaInfo())
	}), goja.Undefined(), goja.FLAG_FALSE, goja.FLAG_TRUE)

	result.DefineAccessorProperty("movedBy", m.runtime.ToValue(func(call goja.FunctionCall) goja.Value {
		return m.runtime.ToValue(entry.MovedBy())
	}), goja.Undefined(), goja.FLAG_FALSE, goja.FLAG_TRUE)

	result.DefineAccessorProperty("played", m.runtime.ToValue(func(call goja.FunctionCall) goja.Value {
		return m.runtime.ToValue(entry.Played())
	}), goja.Undefined(), goja.FLAG_FALSE, goja.FLAG_TRUE)

	result.DefineAccessorProperty("playedFor", m.runtime.ToValue(func(call goja.FunctionCall) goja.Value {
		return m.runtime.ToValue(entry.PlayedFor()) // TODO check if duration is serialized properly
	}), goja.Undefined(), goja.FLAG_FALSE, goja.FLAG_TRUE)

	result.DefineAccessorProperty("playing", m.runtime.ToValue(func(call goja.FunctionCall) goja.Value {
		return m.runtime.ToValue(entry.Playing())
	}), goja.Undefined(), goja.FLAG_FALSE, goja.FLAG_TRUE)

	result.DefineAccessorProperty("id", m.runtime.ToValue(func(call goja.FunctionCall) goja.Value {
		return m.runtime.ToValue(entry.QueueID())
	}), goja.Undefined(), goja.FLAG_FALSE, goja.FLAG_TRUE)

	result.DefineAccessorProperty("requestCost", m.runtime.ToValue(func(call goja.FunctionCall) goja.Value {
		return m.runtime.ToValue(entry.RequestCost().SerializeForAPI())
	}), goja.Undefined(), goja.FLAG_FALSE, goja.FLAG_TRUE)

	result.DefineAccessorProperty("requestedAt", m.runtime.ToValue(func(call goja.FunctionCall) goja.Value {
		return gojautil.SerializeTime(m.runtime, entry.RequestedAt())
	}), goja.Undefined(), goja.FLAG_FALSE, goja.FLAG_TRUE)

	result.DefineAccessorProperty("requestedBy", m.runtime.ToValue(func(call goja.FunctionCall) goja.Value {
		return gojautil.SerializeUser(m.runtime, entry.RequestedBy())
	}), goja.Undefined(), goja.FLAG_FALSE, goja.FLAG_TRUE)

	result.DefineAccessorProperty("unskippable", m.runtime.ToValue(func(call goja.FunctionCall) goja.Value {
		return m.runtime.ToValue(entry.Unskippable())
	}), goja.Undefined(), goja.FLAG_FALSE, goja.FLAG_TRUE)

	return result
}

func (m *queueModule) serializeMediaInfo(info media.Info) goja.Value {
	result := m.runtime.NewObject()

	result.DefineAccessorProperty("length", m.runtime.ToValue(func(call goja.FunctionCall) goja.Value {
		return m.runtime.ToValue(info.Length()) // TODO check if duration is serialized properly
	}), goja.Undefined(), goja.FLAG_FALSE, goja.FLAG_TRUE)

	result.DefineAccessorProperty("offset", m.runtime.ToValue(func(call goja.FunctionCall) goja.Value {
		return m.runtime.ToValue(info.Offset()) // TODO check if duration is serialized properly
	}), goja.Undefined(), goja.FLAG_FALSE, goja.FLAG_TRUE)

	result.DefineAccessorProperty("title", m.runtime.ToValue(func(call goja.FunctionCall) goja.Value {
		return m.runtime.ToValue(info.Title())
	}), goja.Undefined(), goja.FLAG_FALSE, goja.FLAG_TRUE)

	result.DefineAccessorProperty("id", m.runtime.ToValue(func(call goja.FunctionCall) goja.Value {
		_, id := info.MediaID()
		return m.runtime.ToValue(id)
	}), goja.Undefined(), goja.FLAG_FALSE, goja.FLAG_TRUE)

	result.DefineAccessorProperty("type", m.runtime.ToValue(func(call goja.FunctionCall) goja.Value {
		t, _ := info.MediaID()
		return m.runtime.ToValue(string(t))
	}), goja.Undefined(), goja.FLAG_FALSE, goja.FLAG_TRUE)

	return result
}
