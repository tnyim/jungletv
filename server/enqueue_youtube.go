package server

import (
	"time"

	"github.com/palantir/stacktrace"
	"github.com/rickb777/date/period"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/server/auth"
	authinterceptor "github.com/tnyim/jungletv/server/interceptors/auth"
	"github.com/tnyim/jungletv/types"
	"github.com/tnyim/jungletv/utils/event"
	"github.com/tnyim/jungletv/utils/transaction"
	"google.golang.org/protobuf/types/known/durationpb"
)

type youTubeVideoEnqueueRequestCreationResult int

const (
	youTubeVideoEnqueueRequestCreationSucceeded youTubeVideoEnqueueRequestCreationResult = iota
	youTubeVideoEnqueueRequestCreationFailed
	youTubeVideoEnqueueRequestCreationVideoNotFound
	youTubeVideoEnqueueRequestCreationVideoAgeRestricted
	youTubeVideoEnqueueRequestCreationVideoIsUpcomingLiveBroadcast
	youTubeVideoEnqueueRequestCreationVideoIsUnpopularLiveBroadcast
	youTubeVideoEnqueueRequestCreationVideoIsNotEmbeddable
	youTubeVideoEnqueueRequestCreationVideoIsTooLong
	youTubeVideoEnqueueRequestCreationVideoIsAlreadyInQueue
	youTubeVideoEnqueueRequestCreationVideoPlayedTooRecently
	youTubeVideoEnqueueRequestCreationVideoIsDisallowed
	youTubeVideoEnqueueRequestVideoEnqueuingDisabled
	youTubeVideoEnqueueRequestVideoEnqueuingStaffOnly
)

func (s *grpcServer) NewYouTubeVideoEnqueueRequest(ctx *transaction.WrappingContext, videoID string, startOffset, endOffset *durationpb.Duration, unskippable bool) (EnqueueRequest, youTubeVideoEnqueueRequestCreationResult, error) {
	isAdmin := false
	user := authinterceptor.UserClaimsFromContext(ctx)
	if banned, err := s.moderationStore.LoadRemoteAddressBannedFromVideoEnqueuing(ctx, authinterceptor.RemoteAddressFromContext(ctx)); err == nil && banned {
		return nil, youTubeVideoEnqueueRequestVideoEnqueuingStaffOnly, nil
	}
	if user != nil {
		isAdmin = auth.UserPermissionLevelIsAtLeast(user, auth.AdminPermissionLevel)
		if banned, err := s.moderationStore.LoadPaymentAddressBannedFromVideoEnqueuing(ctx, user.Address()); err == nil && banned {
			return nil, youTubeVideoEnqueueRequestVideoEnqueuingStaffOnly, nil
		}
	}
	if s.allowVideoEnqueuing == proto.AllowedVideoEnqueuingType_DISABLED {
		return nil, youTubeVideoEnqueueRequestVideoEnqueuingDisabled, nil
	}
	if !isAdmin && s.allowVideoEnqueuing == proto.AllowedVideoEnqueuingType_STAFF_ONLY {
		return nil, youTubeVideoEnqueueRequestVideoEnqueuingStaffOnly, nil
	}

	ctx, err := transaction.Begin(ctx)
	if err != nil {
		return nil, youTubeVideoEnqueueRequestCreationFailed, stacktrace.Propagate(err, "")
	}
	defer ctx.Commit() // read-only tx

	response, err := s.youtube.Videos.List([]string{"snippet", "contentDetails", "status", "liveStreamingDetails"}).Id(videoID).MaxResults(1).Do()
	if err != nil {
		return nil, youTubeVideoEnqueueRequestCreationFailed, stacktrace.Propagate(err, "")
	}

	if len(response.Items) == 0 {
		return nil, youTubeVideoEnqueueRequestCreationVideoNotFound, nil
	}

	videoItem := response.Items[0]

	allowed, err := types.IsMediaAllowed(ctx, types.MediaTypeYouTubeVideo, videoItem.Id)
	if err != nil {
		return nil, youTubeVideoEnqueueRequestCreationFailed, stacktrace.Propagate(err, "")
	}
	if !allowed {
		return nil, youTubeVideoEnqueueRequestCreationVideoIsDisallowed, nil
	}

	if videoItem.ContentDetails.ContentRating.YtRating == "ytAgeRestricted" {
		return nil, youTubeVideoEnqueueRequestCreationVideoAgeRestricted, nil
	}

	if !videoItem.Status.Embeddable {
		return nil, youTubeVideoEnqueueRequestCreationVideoIsNotEmbeddable, nil
	}

	if videoItem.Snippet.LiveBroadcastContent == "upcoming" {
		return nil, youTubeVideoEnqueueRequestCreationVideoIsUpcomingLiveBroadcast, nil
	}

	var startOffsetDuration time.Duration
	if startOffset != nil {
		startOffsetDuration = startOffset.AsDuration()
	}
	var endOffsetDuration time.Duration
	if endOffset != nil {
		endOffsetDuration = endOffset.AsDuration()
		if endOffsetDuration <= startOffsetDuration {
			return nil, youTubeVideoEnqueueRequestCreationFailed, stacktrace.Propagate(err, "video start offset past video end offset")
		}
	}

	var playFor = 10 * time.Minute
	var totalVideoDuration time.Duration
	if videoItem.Snippet.LiveBroadcastContent == "live" {
		if videoItem.LiveStreamingDetails.ConcurrentViewers < 10 && s.allowVideoEnqueuing != proto.AllowedVideoEnqueuingType_STAFF_ONLY {
			return nil, youTubeVideoEnqueueRequestCreationVideoIsUnpopularLiveBroadcast, nil
		}
		if endOffset != nil {
			playFor = endOffsetDuration - startOffsetDuration
			startOffsetDuration = 0
			endOffsetDuration = playFor
		}
	} else {
		videoDurationPeriod, err := period.Parse(videoItem.ContentDetails.Duration)
		if err != nil {
			return nil, youTubeVideoEnqueueRequestCreationFailed, stacktrace.Propagate(err, "error parsing video duration")
		}
		totalVideoDuration = videoDurationPeriod.DurationApprox()

		if startOffsetDuration > totalVideoDuration {
			return nil, youTubeVideoEnqueueRequestCreationFailed, stacktrace.Propagate(err, "video start offset past end of video")
		}

		if endOffsetDuration == 0 || endOffsetDuration > totalVideoDuration {
			endOffsetDuration = totalVideoDuration
		}

		playFor = endOffsetDuration - startOffsetDuration
	}

	if s.allowVideoEnqueuing != proto.AllowedVideoEnqueuingType_STAFF_ONLY {
		if playFor > 35*time.Minute {
			return nil, youTubeVideoEnqueueRequestCreationVideoIsTooLong, nil
		}

		if videoItem.Snippet.LiveBroadcastContent == "live" {
			result, err := s.checkYouTubeBroadcastContentDuplication(ctx, videoItem.Id, playFor)
			if err != nil || result != youTubeVideoEnqueueRequestCreationSucceeded {
				return nil, result, stacktrace.Propagate(err, "")
			}
		} else {
			result, err := s.checkYouTubeVideoContentDuplication(ctx, videoItem.Id, startOffsetDuration, playFor, totalVideoDuration)
			if err != nil || result != youTubeVideoEnqueueRequestCreationSucceeded {
				return nil, result, stacktrace.Propagate(err, "")
			}
		}
	}

	request := &queueEntryYouTubeVideo{
		id:            videoItem.Id,
		title:         videoItem.Snippet.Title,
		channelTitle:  videoItem.Snippet.ChannelTitle,
		thumbnailURL:  videoItem.Snippet.Thumbnails.Default.Url,
		duration:      playFor,
		offset:        startOffsetDuration,
		donePlaying:   event.NewNoArg(),
		requestedBy:   &unknownUser{},
		unskippable:   unskippable,
		liveBroadcast: videoItem.Snippet.LiveBroadcastContent == "live",
	}

	userClaims := authinterceptor.UserClaimsFromContext(ctx)
	if userClaims != nil {
		request.requestedBy = userClaims
	}

	return request, youTubeVideoEnqueueRequestCreationSucceeded, nil
}

func (s *grpcServer) checkYouTubeVideoContentDuplication(ctx *transaction.WrappingContext, videoID string, offset, length, totalVideoLength time.Duration) (youTubeVideoEnqueueRequestCreationResult, error) {
	toleranceMargin := 1 * time.Minute
	if totalVideoLength/10 < toleranceMargin {
		toleranceMargin = totalVideoLength / 10
	}

	candidatePeriod := playPeriod{offset + toleranceMargin, offset + length - toleranceMargin}
	if candidatePeriod.start > candidatePeriod.end {
		candidatePeriod.start = candidatePeriod.end
	}
	// check range overlap with enqueued entries
	for _, entry := range s.mediaQueue.Entries() {
		mediaInfo := entry.MediaInfo()
		entryType, entryMediaID := mediaInfo.MediaID()
		if entryType == types.MediaTypeYouTubeVideo && entryMediaID == videoID {
			enqueuedPeriod := playPeriod{mediaInfo.Offset(), mediaInfo.Offset() + mediaInfo.Length()}
			if periodsOverlap(enqueuedPeriod, candidatePeriod) {
				return youTubeVideoEnqueueRequestCreationVideoIsAlreadyInQueue, nil
			}
		}
	}

	now := time.Now()

	// check range overlap with previously played entries
	lookback := 2*time.Hour + totalVideoLength
	lastPlays, err := types.LastPlaysOfMedia(ctx, now.Add(-lookback), types.MediaTypeYouTubeVideo, videoID)
	if err != nil {
		return youTubeVideoEnqueueRequestCreationFailed, stacktrace.Propagate(err, "")
	}
	for _, play := range lastPlays {
		endedAt := now
		if play.EndedAt.Valid {
			endedAt = play.EndedAt.Time
		}
		playedFor := endedAt.Sub(play.StartedAt)
		playedPeriod := playPeriod{time.Duration(play.MediaOffset), time.Duration(play.MediaOffset) + playedFor}

		if periodsOverlap(playedPeriod, candidatePeriod) {
			return youTubeVideoEnqueueRequestCreationVideoPlayedTooRecently, nil
		}
	}

	return youTubeVideoEnqueueRequestCreationSucceeded, nil
}

func (s *grpcServer) checkYouTubeBroadcastContentDuplication(ctx *transaction.WrappingContext, videoID string, length time.Duration) (youTubeVideoEnqueueRequestCreationResult, error) {
	// check total enqueued length
	totalLength := length
	for idx, entry := range s.mediaQueue.Entries() {
		if idx == 0 {
			// current entry will already be counted below
			continue
		}
		mediaInfo := entry.MediaInfo()
		entryType, entryMediaID := mediaInfo.MediaID()
		if entryType == types.MediaTypeYouTubeVideo && entryMediaID == videoID {
			totalLength += mediaInfo.Length()
		}
	}
	if totalLength > 2*time.Hour {
		return youTubeVideoEnqueueRequestCreationVideoIsAlreadyInQueue, nil
	}

	now := time.Now()

	// add total played length
	lastPlays, err := types.LastPlaysOfMedia(ctx, now.Add(-4*time.Hour), types.MediaTypeYouTubeVideo, videoID)
	if err != nil {
		return youTubeVideoEnqueueRequestCreationFailed, stacktrace.Propagate(err, "")
	}
	for _, play := range lastPlays {
		endedAt := now
		if play.EndedAt.Valid {
			endedAt = play.EndedAt.Time
		}
		playedFor := endedAt.Sub(play.StartedAt)
		totalLength += playedFor
	}

	if totalLength > 2*time.Hour {
		return youTubeVideoEnqueueRequestCreationVideoPlayedTooRecently, nil
	}

	return youTubeVideoEnqueueRequestCreationSucceeded, nil
}

type playPeriod struct {
	start time.Duration
	end   time.Duration
}

func periodsOverlap(first, second playPeriod) bool {
	return first.start <= second.end && first.end >= second.start
}
