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
	gojautil.AdaptEvent(m.eventAdapter, m.mediaQueue.EntryAdded(), "entryadded", func(vm *goja.Runtime, arg mediaqueue.EntryAddedEventArg) map[string]interface{} {
		return map[string]interface{}{
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
		}
	})
	gojautil.AdaptEvent(m.eventAdapter, m.mediaQueue.EntryMoved(), "entrymoved", func(vm *goja.Runtime, arg mediaqueue.EntryMovedEventArg) map[string]interface{} {
		return map[string]interface{}{
			"previousIndex": arg.PreviousIndex,
			"currentIndex":  arg.CurrentIndex,
			"user":          gojautil.SerializeUser(vm, arg.User),
			"entry":         m.serializeQueueEntry(vm, arg.Entry),
			"direction": func(up bool) string {
				if up {
					return "up"
				}
				return "down"
			}(arg.Up),
		}
	})
	gojautil.AdaptEvent(m.eventAdapter, m.mediaQueue.EntryRemoved(), "entryremoved", func(vm *goja.Runtime, arg mediaqueue.EntryRemovedEventArg) map[string]interface{} {
		return map[string]interface{}{
			"index":       arg.Index,
			"selfRemoval": arg.SelfRemoval,
			"entry":       m.serializeQueueEntry(vm, arg.Entry),
		}
	})
	gojautil.AdaptEvent(m.eventAdapter, m.mediaQueue.MediaChanged(), "mediachanged", func(vm *goja.Runtime, arg media.QueueEntry) map[string]interface{} {
		return map[string]interface{}{
			"playingEntry": m.serializeQueueEntry(vm, arg),
		}
	})
	gojautil.AdaptNoArgEvent(m.eventAdapter, m.mediaQueue.SkippingAllowedUpdated(), "skippingallowedchanged", nil)
}

func (m *queueModule) configureCrowdfundingEvents() {
	gojautil.AdaptEvent(m.crowdfundingEventAdapter, m.skipManager.StatusUpdated(), "statusupdated", func(vm *goja.Runtime, arg skipmanager.SkipStatusUpdatedEventArgs) map[string]interface{} {
		return map[string]interface{}{
			"skipping": m.serializeSkipAccount(m.runtime, arg.SkipAccountStatus),
			"tipping":  m.serializeRainAccount(m.runtime, arg.RainAccountStatus),
		}
	})

	gojautil.AdaptEvent(m.crowdfundingEventAdapter, m.skipManager.SkipThresholdReductionMilestoneReached(), "skipthresholdreductionmilestonereached", func(vm *goja.Runtime, arg float64) map[string]interface{} {
		return map[string]interface{}{
			"ratioOfOriginal": arg,
		}
	})

	gojautil.AdaptEvent(m.crowdfundingEventAdapter, m.skipManager.CrowdfundedSkip(), "skipped", func(vm *goja.Runtime, arg payment.Amount) map[string]interface{} {
		return map[string]interface{}{
			"balance": arg.SerializeForAPI(),
		}
	})

	gojautil.AdaptEvent(m.crowdfundingEventAdapter, m.skipManager.CrowdfundedTransactionReceived(), "transactionreceived", func(vm *goja.Runtime, arg *types.CrowdfundedTransaction) map[string]interface{} {
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
		return r
	})
}
