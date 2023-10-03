package queue

import (
	"github.com/dop251/goja"
	"github.com/tnyim/jungletv/server/components/apprunner/gojautil"
	"github.com/tnyim/jungletv/server/components/mediaqueue"
	"github.com/tnyim/jungletv/server/media"
)

func (m *queueModule) configureEvents() {
	gojautil.AdaptNoArgEvent(m.eventAdapter, m.mediaQueue.QueueUpdated(), "queueupdated", nil)
	gojautil.AdaptEvent(m.eventAdapter, m.mediaQueue.EntryAdded(), "entryadded", func(vm *goja.Runtime, arg mediaqueue.EntryAddedEventArg) map[string]interface{} {
		return map[string]interface{}{
			"entry": serializeQueueEntry(vm, arg.Entry),
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
			"entry": serializeQueueEntry(vm, arg.Entry),
			"direction": func(up bool) string {
				if up {
					return "up"
				}
				return "down"
			}(arg.Up),
		}
	})
	gojautil.AdaptEvent(m.eventAdapter, m.mediaQueue.EntryRemoved(), "entryremoved", func(vm *goja.Runtime, arg media.QueueEntry) map[string]interface{} {
		return map[string]interface{}{
			"entry": serializeQueueEntry(vm, arg),
		}
	})
	gojautil.AdaptEvent(m.eventAdapter, m.mediaQueue.NonPlayingEntryRemoved(), "nonplayingentryremoved", func(vm *goja.Runtime, arg media.QueueEntry) map[string]interface{} {
		return map[string]interface{}{
			"entry": serializeQueueEntry(vm, arg),
		}
	})
	gojautil.AdaptEvent(m.eventAdapter, m.mediaQueue.MediaChanged(), "mediachanged", func(vm *goja.Runtime, arg media.QueueEntry) map[string]interface{} {
		return map[string]interface{}{
			"playingEntry": serializeQueueEntry(vm, arg),
		}
	})
	gojautil.AdaptEvent(m.eventAdapter, m.mediaQueue.OwnEntryRemoved(), "ownentryremoved", func(vm *goja.Runtime, arg media.QueueEntry) map[string]interface{} {
		return map[string]interface{}{
			"entry": serializeQueueEntry(vm, arg),
		}
	})
	gojautil.AdaptNoArgEvent(m.eventAdapter, m.mediaQueue.SkippingAllowedUpdated(), "skippingallowedchanged", nil)
}
