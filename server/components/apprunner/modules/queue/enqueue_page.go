package queue

import (
	"context"
	"math"
	"strings"
	"time"

	"github.com/dop251/goja"
	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/server/components/apprunner/gojautil"
	"github.com/tnyim/jungletv/server/components/payment"
	"github.com/tnyim/jungletv/server/media"
	"github.com/tnyim/jungletv/server/media/applicationpage"
	"github.com/tnyim/jungletv/types"
	"github.com/tnyim/jungletv/utils/event"
	"github.com/tnyim/jungletv/utils/transaction"
)

func (m *queueModule) enqueuePage(call goja.FunctionCall) goja.Value {
	if len(call.Arguments) < 3 {
		panic(m.runtime.NewTypeError("Missing argument"))
	}

	applicationID := m.appContext.ApplicationID()
	applicationVersion := m.appContext.ApplicationVersion()

	// first argument: page ID
	pageID := call.Argument(0).String()
	info, ok := m.pagesModule.ResolvePage(pageID)
	if !ok {
		panic(m.runtime.NewTypeError("First argument to enqueuePage must be the ID of a published page"))
	}
	title := info.Title
	thumbnailFileName := ""
	length := time.Duration(math.MaxInt64)
	requestCost := payment.NewAmount()
	unskippable, concealed := false, false

	// second argument: queue placement
	var playFn func(media.QueueEntry)
	switch call.Argument(1).String() {
	case "later":
		playFn = m.mediaQueue.Enqueue
	case "aftercurrent":
		playFn = m.mediaQueue.PlayAfterCurrent
	case "now":
		playFn = m.mediaQueue.PlayNow
	default:
		panic(m.runtime.NewTypeError("Second argument to enqueuePage must be one of 'later', 'aftercurrent', 'now'"))
	}

	// third argument: length, in milliseconds
	if !goja.IsUndefined(call.Argument(2)) && !goja.IsInfinity(call.Argument(2)) {
		var lengthms int64
		err := m.runtime.ExportTo(call.Argument(2), &lengthms)
		if err != nil {
			panic(m.runtime.NewTypeError("Third argument to enqueuePage must be an integer or undefined"))
		}

		if lengthms < 1000 {
			panic(m.runtime.NewTypeError("Application pages may only be enqueued with a specified length longer than one second"))
		}

		if lengthms > 1000*60*60 {
			panic(m.runtime.NewTypeError("Application pages may only be enqueued with a specified length shorter than one hour"))
		}

		length = time.Duration(lengthms) * time.Millisecond
	}

	// fourth optional argument: options object
	if len(call.Arguments) > 3 {
		optionsMap := map[string]goja.Value{}
		err := m.runtime.ExportTo(call.Argument(3), &optionsMap)
		if err != nil {
			panic(m.runtime.NewTypeError("Fourth argument to enqueuePage is not an object"))
		}

		if v, ok := optionsMap["title"]; ok {
			title = v.String()
		}
		if v, ok := optionsMap["thumbnail"]; ok {
			thumbnailFileName = v.String()
		}
		if v, ok := optionsMap["baseReward"]; ok {
			requestCost, err = payment.NewAmountFromAPIString(v.String())
			if err != nil {
				panic(m.runtime.NewTypeError("If specified, baseReward must be a valid amount string"))
			}
		}
		if v, ok := optionsMap["unskippable"]; ok {
			unskippable = v.ToBoolean()
		}
		if v, ok := optionsMap["concealed"]; ok {
			concealed = v.ToBoolean()
		}
	}

	return gojautil.DoAsyncWithTransformer(m.runtime, m.appContext.ScheduleNoError, func(actx gojautil.AsyncContext) (media.QueueEntry, gojautil.PromiseResultTransformer[media.QueueEntry]) {
		if thumbnailFileName != "" {
			m.validateThumbnailFileName(actx, thumbnailFileName)
		}

		err := m.paymentsModule.DebitFromApplicationWallet(requestCost)
		if err != nil {
			panic(actx.NewGoError(stacktrace.Propagate(err, "")))
		}

		entry := applicationpage.NewApplicationPageQueueEntry(applicationID, applicationVersion, pageID, title, thumbnailFileName, length, m.appContext.ApplicationUser(), requestCost, unskippable, concealed)

		ready := make(chan bool)
		go m.monitorForPageQueueEntry(m.executionContext, entry.PerformanceID(), pageID, ready)
		pageStillPublished := <-ready
		if !pageStillPublished {
			panic(actx.NewTypeError("First argument to enqueuePage must be the ID of a published page"))
		}

		// we only enqueue now that the monitor is running. this ensures there isn't a toctou issue between the time we
		// added the entry to the queue and the time we subscribed to EntryRemoved, which could leave the monitor goroutine
		// running unnecessarily until application termination
		playFn(entry)

		return entry, func(vm *goja.Runtime, entry media.QueueEntry) interface{} {
			return m.serializeQueueEntry(vm, entry)
		}
	})
}

func (m *queueModule) validateThumbnailFileName(actx gojautil.AsyncContext, fileName string) {
	ctx, err := transaction.Begin(m.executionContext)
	if err != nil {
		panic(actx.NewGoError(stacktrace.Propagate(err, "")))
	}
	defer ctx.Commit() // read-only tx

	files, err := types.GetApplicationFilesWithNamesForApplicationAtVersion(
		ctx,
		m.appContext.ApplicationID(),
		m.appContext.ApplicationVersion(),
		[]string{fileName})
	if err != nil {
		panic(actx.NewGoError(stacktrace.Propagate(err, "")))
	}

	file, ok := files[fileName]
	if !ok {
		panic(actx.NewTypeError("File '%s' not found", fileName))
	}
	if !file.Public {
		panic(actx.NewTypeError("File '%s' is not public", fileName))
	}

	if !strings.HasPrefix(file.Type, "image/") {
		panic(actx.NewTypeError("File '%s' is not an image", fileName))
	}
}

func (m *queueModule) monitorForPageQueueEntry(ctx context.Context, entryID, pageID string, ready chan<- bool) {
	onQueueEntryRemoved, queueEntryRemovedU := m.mediaQueue.EntryRemoved().Subscribe(event.BufferAll)
	defer queueEntryRemovedU()

	onPageUnpublished, pageUnpublishedU := m.pagesModule.OnPageUnpublished().Subscribe(event.BufferAll)
	defer pageUnpublishedU()

	// repeating this check here ensures there isn't a toctou issue between the time we performed the original check
	// and the time at which we subscribe to OnPageUnpublished, in this separate goroutine
	_, ok := m.pagesModule.ResolvePage(pageID)
	ready <- ok
	if !ok {
		return
	}

	for {
		select {
		case args := <-onQueueEntryRemoved:
			if args.Entry.PerformanceID() == entryID {
				// this monitor outlived its usefulness
				return
			}
		case unpublishedPageID := <-onPageUnpublished:
			if pageID == unpublishedPageID {
				_, _ = m.mediaQueue.RemoveEntry(entryID) // we don't care if this fails
				return
			}
		case <-ctx.Done():
			// handles the case where all application pages are unpublished due to application termination
			_, _ = m.mediaQueue.RemoveEntry(entryID) // we don't care if this fails
			return
		}
	}
}
