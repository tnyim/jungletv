package queue

import (
	"context"
	"fmt"
	"time"

	"github.com/dop251/goja"
	"github.com/palantir/stacktrace"
	uuid "github.com/satori/go.uuid"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/server/components/apprunner/gojautil"
	"github.com/tnyim/jungletv/server/components/enqueuemanager"
	"github.com/tnyim/jungletv/server/components/payment"
	"github.com/tnyim/jungletv/server/interceptors/auth"
	"github.com/tnyim/jungletv/server/media"
	"github.com/tnyim/jungletv/types"
	"github.com/tnyim/jungletv/utils/transaction"
	"google.golang.org/protobuf/types/known/durationpb"
)

func (m *queueModule) enqueueMedia(call goja.FunctionCall) goja.Value {
	if len(call.Arguments) < 3 {
		panic(m.runtime.NewTypeError("Missing argument"))
	}

	// first argument: media type
	mediaType := types.MediaType(call.Argument(0).String())

	provider, ok := m.mediaProviders[mediaType]
	if !ok {
		panic(m.runtime.NewTypeError("First argument to enqueueMedia must be a known media type"))
	}

	// second argument: media info
	mediaInfo := parseMediaInfoArgument(m.runtime, mediaType, call.Argument(1), "enqueueMedia")

	// third argument: queue placement
	var playFn func(media.QueueEntry)
	switch call.Argument(2).String() {
	case "later":
		playFn = m.mediaQueue.Enqueue
	case "aftercurrent":
		playFn = m.mediaQueue.PlayAfterCurrent
	case "now":
		playFn = m.mediaQueue.PlayNow
	default:
		panic(m.runtime.NewTypeError("Third argument to enqueueMedia must be one of 'later', 'aftercurrent', 'now'"))
	}

	requestCost := payment.NewAmount()
	unskippable, concealed := false, false
	withPointsCost := true
	allowUnpopular, skipLengthChecks, skipDuplicationChecks := false, false, false
	performAllowlistChecks := true

	// fourth optional argument: options object
	if len(call.Arguments) > 3 {
		optionsMap := map[string]goja.Value{}
		err := m.runtime.ExportTo(call.Argument(3), &optionsMap)
		if err != nil {
			panic(m.runtime.NewTypeError("Fourth argument to enqueueMedia is not an object"))
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
		if v, ok := optionsMap["debitPoints"]; ok {
			withPointsCost = v.ToBoolean()
		}
		if v, ok := optionsMap["checkPopularity"]; ok {
			allowUnpopular = !v.ToBoolean()
		}
		if v, ok := optionsMap["checkLength"]; ok {
			skipLengthChecks = !v.ToBoolean()
		}
		if v, ok := optionsMap["checkDuplicateContent"]; ok {
			skipDuplicationChecks = !v.ToBoolean()
		}
		if v, ok := optionsMap["checkMediaBlocklist"]; ok {
			performAllowlistChecks = !v.ToBoolean()
		}
	}

	return gojautil.DoAsyncWithTransformer(m.appContext, m.runtime, func(actx gojautil.AsyncContext) (media.QueueEntry, gojautil.PromiseResultTransformer[media.QueueEntry]) {
		ctxCtx, ctxCancel := context.WithTimeout(actx, 15*time.Second)
		// some media providers rely on having the user in the context
		ctxCtx = auth.WithUser(ctxCtx, m.appContext.ApplicationUser())

		defer ctxCancel()
		ctx, err := transaction.Begin(ctxCtx)
		if err != nil {
			panic(actx.NewGoError(stacktrace.Propagate(err, "")))
		}
		defer ctx.Rollback()

		preInfo, result, err := provider.BeginEnqueueRequest(ctx, mediaInfo)
		if err != nil {
			panic(actx.NewGoError(stacktrace.Propagate(err, "")))
		}
		if result != media.EnqueueRequestCreationSucceeded {
			panic(actx.NewTypeError(stringForMediaEnqueueRequestCreationFailed(result)))
		}

		if performAllowlistChecks {
			mediaType, mediaID := preInfo.MediaID()
			allowed, err := types.IsMediaAllowed(ctx, mediaType, mediaID)
			if err != nil {
				panic(actx.NewGoError(stacktrace.Propagate(err, "")))
			}
			if !allowed {
				panic(actx.NewTypeError(stringForMediaEnqueueRequestCreationFailed(media.EnqueueRequestCreationFailedMediumIsDisallowed)))
			}

			for _, collection := range preInfo.Collections() {
				allowed, err := types.IsMediaCollectionAllowed(ctx, collection.Type, collection.ID)
				if err != nil {
					panic(actx.NewGoError(stacktrace.Propagate(err, "")))
				}
				if !allowed {
					panic(actx.NewTypeError(stringForMediaEnqueueRequestCreationFailed(media.EnqueueRequestCreationFailedMediumIsDisallowed)))
				}
			}
		}

		request, result, err := provider.ContinueEnqueueRequest(ctx, preInfo, unskippable, concealed, false,
			allowUnpopular, skipLengthChecks, skipDuplicationChecks)
		if err != nil {
			panic(actx.NewGoError(stacktrace.Propagate(err, "")))
		}
		if result != media.EnqueueRequestCreationSucceeded {
			panic(actx.NewTypeError(stringForMediaEnqueueRequestCreationFailed(result)))
		}

		playedMediaID := uuid.NewV4().String()
		if withPointsCost && request.Concealed() {
			err := enqueuemanager.DeductConcealedTicketPoints(ctx, m.pointsManager, m.appContext.ApplicationUser(), playedMediaID)
			if err != nil {
				panic(actx.NewGoError(stacktrace.Propagate(err, "")))
			}
		}

		err = m.paymentsModule.DebitFromApplicationWallet(requestCost)
		if err != nil {
			panic(actx.NewGoError(stacktrace.Propagate(err, "")))
		}

		err = ctx.Commit()
		if err != nil {
			panic(actx.NewGoError(stacktrace.Propagate(err, "")))
		}

		mi := request.ActionableMediaInfo()
		queueEntry := mi.ProduceMediaQueueEntry(m.appContext.ApplicationUser(), requestCost, request.Unskippable(), request.Concealed(), playedMediaID)

		playFn(queueEntry)

		return queueEntry, func(vm *goja.Runtime, entry media.QueueEntry) interface{} {
			return m.serializeQueueEntry(vm, entry)
		}
	})
}

func parseMediaInfoArgument(vm *goja.Runtime, mediaType types.MediaType, arg goja.Value, fnName string) proto.IsEnqueueMediaRequest_MediaInfo {
	infoMap := map[string]goja.Value{}
	err := vm.ExportTo(arg, &infoMap)
	if err != nil {
		panic(vm.NewTypeError("Second argument is not an object"))
	}

	switch mediaType {
	case types.MediaTypeYouTubeVideo:
		return parseYouTubeMediaInfoArgument(vm, infoMap)
	case types.MediaTypeSoundCloudTrack:
		return parseSoundCloudTrackInfoArgument(vm, infoMap)
	case types.MediaTypeDocument:
		return parseDocumentInfoArgument(vm, infoMap)
	default:
		panic(vm.NewTypeError("First argument to %s must be a known media type", fnName))
	}
}

func parseYouTubeMediaInfoArgument(vm *goja.Runtime, infoMap map[string]goja.Value) proto.IsEnqueueMediaRequest_MediaInfo {
	id, ok := infoMap["id"]
	if !ok {
		panic(vm.NewTypeError("Second argument is missing 'id' property"))
	}
	request := &proto.EnqueueMediaRequest_YoutubeVideoData{
		YoutubeVideoData: &proto.EnqueueYouTubeVideoData{
			Id: id.String(),
		},
	}

	startOffsetValue, ok := infoMap["startOffset"]
	if ok {
		var startOffset int64
		err := vm.ExportTo(startOffsetValue, &startOffset)
		if err != nil || startOffset < 0 {
			panic(vm.NewTypeError("If specified, startOffset must be a non-negative integer"))
		}
		request.YoutubeVideoData.StartOffset = durationpb.New(time.Duration(startOffset * int64(time.Millisecond)))
	}

	endOffsetValue, ok := infoMap["endOffset"]
	if ok {
		var endOffset int64
		err := vm.ExportTo(endOffsetValue, &endOffset)
		if err != nil || endOffset < 0 {
			panic(vm.NewTypeError("If specified, endOffset must be a non-negative integer"))
		}
		request.YoutubeVideoData.EndOffset = durationpb.New(time.Duration(endOffset * int64(time.Millisecond)))
	}

	return request
}

func parseSoundCloudTrackInfoArgument(vm *goja.Runtime, infoMap map[string]goja.Value) proto.IsEnqueueMediaRequest_MediaInfo {
	permalink, ok := infoMap["permalink"]
	if !ok {
		panic(vm.NewTypeError("Second argument is missing 'permalink' property"))
	}
	request := &proto.EnqueueMediaRequest_SoundcloudTrackData{
		SoundcloudTrackData: &proto.EnqueueSoundCloudTrackData{
			Permalink: permalink.String(),
		},
	}

	startOffsetValue, ok := infoMap["startOffset"]
	if ok {
		var startOffset int64
		err := vm.ExportTo(startOffsetValue, &startOffset)
		if err != nil || startOffset < 0 {
			panic(vm.NewTypeError("If specified, startOffset must be a non-negative integer"))
		}
		request.SoundcloudTrackData.StartOffset = durationpb.New(time.Duration(startOffset * int64(time.Millisecond)))
	}

	endOffsetValue, ok := infoMap["endOffset"]
	if ok {
		var endOffset int64
		err := vm.ExportTo(endOffsetValue, &endOffset)
		if err != nil || endOffset < 0 {
			panic(vm.NewTypeError("If specified, endOffset must be a non-negative integer"))
		}
		request.SoundcloudTrackData.EndOffset = durationpb.New(time.Duration(endOffset * int64(time.Millisecond)))
	}

	return request
}

func parseDocumentInfoArgument(vm *goja.Runtime, infoMap map[string]goja.Value) proto.IsEnqueueMediaRequest_MediaInfo {
	id, ok := infoMap["id"]
	if !ok {
		panic(vm.NewTypeError("Second argument is missing 'id' property"))
	}

	title, ok := infoMap["title"]
	if !ok {
		panic(vm.NewTypeError("Second argument is missing 'title' property"))
	}

	request := &proto.EnqueueMediaRequest_DocumentData{
		DocumentData: &proto.EnqueueDocumentData{
			DocumentId: id.String(),
			Title:      title.String(),
		},
	}

	lengthValue, ok := infoMap["length"]
	if ok {
		var length int64
		err := vm.ExportTo(lengthValue, &length)
		if err != nil || length < 0 {
			panic(vm.NewTypeError("If specified, length must be a non-negative integer"))
		}
		request.DocumentData.Duration = durationpb.New(time.Duration(length * int64(time.Millisecond)))
	}

	return request
}

func stringForMediaEnqueueRequestCreationFailed(result media.EnqueueRequestCreationResult) string {
	return fmt.Sprintf(formatStringForMediaEnqueueRequestCreationFailed(result), "enqueuing")
}

func stringForMediaInfoRequestCreationFailed(result media.EnqueueRequestCreationResult) string {
	return fmt.Sprintf(formatStringForMediaEnqueueRequestCreationFailed(result), "information fetching")
}

func formatStringForMediaEnqueueRequestCreationFailed(result media.EnqueueRequestCreationResult) string {
	switch result {
	default:
		fallthrough
	case media.EnqueueRequestCreationFailed:
		return "Media %s failed"
	case media.EnqueueRequestCreationFailedMediumNotFound:
		return "Media %s failed because the content was not found"
	case media.EnqueueRequestCreationFailedMediumAgeRestricted:
		return "Media %s failed because the content is age restricted"
	case media.EnqueueRequestCreationFailedMediumIsUpcomingLiveBroadcast:
		return "Media %s failed because the content is an upcoming live broadcast"
	case media.EnqueueRequestCreationFailedMediumIsUnpopularLiveBroadcast:
		return "Media %s failed because the content is a live broadcast that has insufficient viewers"
	case media.EnqueueRequestCreationFailedMediumIsNotEmbeddable:
		return "Media %s failed because the content can't be played outside of its original website"
	case media.EnqueueRequestCreationFailedMediumIsTooLong:
		return "Media %s failed because the content is too long"
	case media.EnqueueRequestCreationFailedMediumIsAlreadyInQueue:
		return "Media %s failed because the content is already in the queue"
	case media.EnqueueRequestCreationFailedMediumPlayedTooRecently:
		return "Media %s failed because the content was last played too recently"
	case media.EnqueueRequestCreationFailedMediumIsDisallowed:
		return "Media %s failed because the content is disallowed"
	case media.EnqueueRequestCreationFailedMediumIsNotATrack:
		return "Media %s failed because the content is not a track"
	}
}

func (m *queueModule) getMediaInformation(call goja.FunctionCall) goja.Value {
	if len(call.Arguments) < 2 {
		panic(m.runtime.NewTypeError("Missing argument"))
	}

	// first argument: media type
	mediaType := types.MediaType(call.Argument(0).String())

	provider, ok := m.mediaProviders[mediaType]
	if !ok {
		panic(m.runtime.NewTypeError("First argument to getMediaInformation must be a known media type"))
	}

	// second argument: media info
	mediaInfo := parseMediaInfoArgument(m.runtime, mediaType, call.Argument(1), "getMediaInformation")

	allowUnpopular, skipLengthChecks, skipDuplicationChecks := false, false, false
	performAllowlistChecks := true

	// third optional argument: options object
	if len(call.Arguments) > 2 {
		optionsMap := map[string]goja.Value{}
		err := m.runtime.ExportTo(call.Argument(2), &optionsMap)
		if err != nil {
			panic(m.runtime.NewTypeError("Third argument to getMediaInformation is not an object"))
		}

		if v, ok := optionsMap["checkPopularity"]; ok {
			allowUnpopular = !v.ToBoolean()
		}
		if v, ok := optionsMap["checkLength"]; ok {
			skipLengthChecks = !v.ToBoolean()
		}
		if v, ok := optionsMap["checkDuplicateContent"]; ok {
			skipDuplicationChecks = !v.ToBoolean()
		}
		if v, ok := optionsMap["checkMediaBlocklist"]; ok {
			performAllowlistChecks = !v.ToBoolean()
		}
	}

	return gojautil.DoAsyncWithTransformer(m.appContext, m.runtime, func(actx gojautil.AsyncContext) (media.BasicInfo, gojautil.PromiseResultTransformer[media.BasicInfo]) {
		ctxCtx, ctxCancel := context.WithTimeout(actx, 15*time.Second)
		// some media providers rely on having the user in the context
		ctxCtx = auth.WithUser(ctxCtx, m.appContext.ApplicationUser())

		defer ctxCancel()
		ctx, err := transaction.Begin(ctxCtx)
		if err != nil {
			panic(actx.NewGoError(stacktrace.Propagate(err, "")))
		}
		defer ctx.Rollback()

		preInfo, result, err := provider.BeginEnqueueRequest(ctx, mediaInfo)
		if err != nil {
			panic(actx.NewGoError(stacktrace.Propagate(err, "")))
		}
		if result != media.EnqueueRequestCreationSucceeded {
			panic(actx.NewTypeError(stringForMediaInfoRequestCreationFailed(result)))
		}

		if performAllowlistChecks {
			mediaType, mediaID := preInfo.MediaID()
			allowed, err := types.IsMediaAllowed(ctx, mediaType, mediaID)
			if err != nil {
				panic(actx.NewGoError(stacktrace.Propagate(err, "")))
			}
			if !allowed {
				panic(actx.NewTypeError(stringForMediaInfoRequestCreationFailed(media.EnqueueRequestCreationFailedMediumIsDisallowed)))
			}

			for _, collection := range preInfo.Collections() {
				allowed, err := types.IsMediaCollectionAllowed(ctx, collection.Type, collection.ID)
				if err != nil {
					panic(actx.NewGoError(stacktrace.Propagate(err, "")))
				}
				if !allowed {
					panic(actx.NewTypeError(stringForMediaInfoRequestCreationFailed(media.EnqueueRequestCreationFailedMediumIsDisallowed)))
				}
			}
		}

		request, result, err := provider.ContinueEnqueueRequest(ctx, preInfo, false, false, false,
			allowUnpopular, skipLengthChecks, skipDuplicationChecks)
		if err != nil {
			panic(actx.NewGoError(stacktrace.Propagate(err, "")))
		}
		if result != media.EnqueueRequestCreationSucceeded {
			panic(actx.NewTypeError(stringForMediaInfoRequestCreationFailed(result)))
		}

		return request.ActionableMediaInfo(), func(vm *goja.Runtime, info media.BasicInfo) interface{} {
			return serializeMediaInfo(vm, info)
		}
	})
}
