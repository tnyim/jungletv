package queue

import (
	"github.com/dop251/goja"
	"github.com/tnyim/jungletv/server/components/apprunner/gojautil"
	"github.com/tnyim/jungletv/server/components/mediaqueue"
	"github.com/tnyim/jungletv/server/components/payment"
	"github.com/tnyim/jungletv/server/components/skipmanager"
	"github.com/tnyim/jungletv/server/media"
	"github.com/tnyim/jungletv/types"
)

func (m *queueModule) configureEvents() {
	gojautil.AdaptNoArgEvent(m.eventAdapter, m.mediaQueue.QueueUpdated(), "queueupdated", nil)
	gojautil.AdaptEvent(m.eventAdapter, m.mediaQueue.EntryAdded(), "entryadded", func(vm *goja.Runtime, arg mediaqueue.EntryAddedEventArg) *goja.Object {
		return vm.ToValue(map[string]interface{}{
			"entry": m.serializeQueueEntry(vm, arg.Entry),
			"index": arg.Index,
			"placement": func(placement mediaqueue.EntryAddedPlacement) string {
				switch placement {
				case mediaqueue.EntryAddedPlacementEnqueue:
					return "later"
				case mediaqueue.EntryAddedPlacementPlayNext:
					return "aftercurrent"
				case mediaqueue.EntryAddedPlacementPlayNow:
					return "now"
				default:
					return ""
				}
			}(arg.AddType),
		}).ToObject(vm)
	})
	gojautil.AdaptEvent(m.eventAdapter, m.mediaQueue.EntryMoved(), "entrymoved", func(vm *goja.Runtime, arg mediaqueue.EntryMovedEventArg) *goja.Object {
		r := vm.NewObject()
		r.Set("previousIndex", arg.PreviousIndex)
		r.Set("currentIndex", arg.CurrentIndex)
		r.DefineAccessorProperty("user", m.userSerializer.BuildUserGetter(m.runtime, arg.User), nil, goja.FLAG_FALSE, goja.FLAG_TRUE)
		r.Set("entry", m.serializeQueueEntry(vm, arg.Entry))
		if arg.Up {
			r.Set("direction", "up")
		} else {
			r.Set("direction", "down")
		}
		r.Set("direction", func(up bool) string {
			if up {
				return "up"
			}
			return "down"
		}(arg.Up))
		return r
	})
	gojautil.AdaptEvent(m.eventAdapter, m.mediaQueue.EntryRemoved(), "entryremoved", func(vm *goja.Runtime, arg mediaqueue.EntryRemovedEventArg) *goja.Object {
		return vm.ToValue(map[string]interface{}{
			"index":       arg.Index,
			"selfRemoval": arg.SelfRemoval,
			"entry":       m.serializeQueueEntry(vm, arg.Entry),
		}).ToObject(vm)
	})
	gojautil.AdaptEvent(m.eventAdapter, m.mediaQueue.MediaChanged(), "mediachanged", func(vm *goja.Runtime, arg media.QueueEntry) *goja.Object {
		return vm.ToValue(map[string]interface{}{
			"playingEntry": m.serializeQueueEntry(vm, arg),
		}).ToObject(vm)
	})
	gojautil.AdaptNoArgEvent(m.eventAdapter, m.mediaQueue.SkippingAllowedUpdated(), "skippingallowedchanged", nil)
}

func (m *queueModule) configureCrowdfundingEvents() {
	gojautil.AdaptEvent(m.crowdfundingEventAdapter, m.skipManager.StatusUpdated(), "statusupdated", func(vm *goja.Runtime, arg skipmanager.SkipStatusUpdatedEventArgs) *goja.Object {
		return vm.ToValue(map[string]interface{}{
			"skipping": m.serializeSkipAccount(m.runtime, arg.SkipAccountStatus),
			"tipping":  m.serializeRainAccount(m.runtime, arg.RainAccountStatus),
		}).ToObject(vm)
	})

	gojautil.AdaptEvent(m.crowdfundingEventAdapter, m.skipManager.SkipThresholdReductionMilestoneReached(), "skipthresholdreductionmilestonereached", func(vm *goja.Runtime, arg float64) *goja.Object {
		return vm.ToValue(map[string]interface{}{
			"ratioOfOriginal": arg,
		}).ToObject(vm)
	})

	gojautil.AdaptEvent(m.crowdfundingEventAdapter, m.skipManager.CrowdfundedSkip(), "skipped", func(vm *goja.Runtime, arg payment.Amount) *goja.Object {
		return vm.ToValue(map[string]interface{}{
			"balance": arg.SerializeForAPI(),
		}).ToObject(vm)
	})

	gojautil.AdaptEvent(m.crowdfundingEventAdapter, m.skipManager.CrowdfundedTransactionReceived(), "transactionreceived", func(vm *goja.Runtime, arg *types.CrowdfundedTransaction) *goja.Object {
		r := map[string]interface{}{
			"txHash":      arg.TxHash,
			"fromAddress": arg.FromAddress,
			"amount":      payment.NewAmountFromDecimal(arg.Amount).SerializeForAPI(),
			"receivedAt":  gojautil.SerializeTime(vm, arg.ReceivedAt),
			"txType": map[types.CrowdfundedTransactionType]string{
				types.CrowdfundedTransactionTypeRain: "tip",
				types.CrowdfundedTransactionTypeSkip: "skip",
			}[arg.TransactionType],
		}
		if arg.ForMedia != nil {
			r["forMedia"] = *arg.ForMedia
		}
		return vm.ToValue(r).ToObject(vm)
	})
}
