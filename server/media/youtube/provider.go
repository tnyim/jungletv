package youtube

import (
	"time"

	"github.com/palantir/stacktrace"
	"github.com/rickb777/date/period"
	"github.com/tnyim/jungletv/proto"
	authinterceptor "github.com/tnyim/jungletv/server/interceptors/auth"
	"github.com/tnyim/jungletv/server/media"
	"github.com/tnyim/jungletv/types"
	"github.com/tnyim/jungletv/utils/transaction"
	"google.golang.org/api/youtube/v3"
)

// VideoProvider provides YouTube videos
type VideoProvider struct {
	mediaQueue media.MediaQueueStub
	youtube    *youtube.Service
}

// NewProvider returns a new YouTube video provider
func NewProvider(youtube *youtube.Service) media.Provider {
	return &VideoProvider{
		youtube: youtube,
	}
}

func (c *VideoProvider) SetMediaQueue(mediaQueue media.MediaQueueStub) {
	c.mediaQueue = mediaQueue
}

func (c *VideoProvider) CanHandleRequestType(mediaParameters proto.IsEnqueueMediaRequest_MediaInfo) bool {
	_, ok := mediaParameters.(*proto.EnqueueMediaRequest_YoutubeVideoData)
	return ok
}

type initialInfo struct {
	videoItem  *youtube.Video
	parameters *proto.EnqueueMediaRequest_YoutubeVideoData
}

func (i *initialInfo) MediaID() (types.MediaType, string) {
	return types.MediaTypeYouTubeVideo, i.videoItem.Id
}

func (i *initialInfo) Title() string {
	return i.videoItem.Snippet.Title
}

func (i *initialInfo) Collections() []media.CollectionKey {
	return []media.CollectionKey{
		{
			ID:    i.videoItem.Snippet.ChannelId,
			Title: i.videoItem.Snippet.ChannelTitle,
			Type:  types.MediaCollectionTypeYouTubeChannel,
		},
	}
}

func (c *VideoProvider) BeginEnqueueRequest(ctx *transaction.WrappingContext, mediaParameters proto.IsEnqueueMediaRequest_MediaInfo) (media.InitialInfo, media.EnqueueRequestCreationResult, error) {
	ctx, err := transaction.Begin(ctx)
	if err != nil {
		return nil, media.EnqueueRequestCreationFailed, stacktrace.Propagate(err, "")
	}
	defer ctx.Commit() // read-only tx

	youTubeParameters, ok := mediaParameters.(*proto.EnqueueMediaRequest_YoutubeVideoData)
	if !ok {
		return nil, media.EnqueueRequestCreationFailed, stacktrace.NewError("invalid parameter type for YouTube video provider")
	}

	response, err := c.youtube.Videos.
		List([]string{"snippet", "contentDetails", "status", "liveStreamingDetails"}).
		Id(youTubeParameters.YoutubeVideoData.GetId()).
		MaxResults(1).Do()
	if err != nil {
		return nil, media.EnqueueRequestCreationFailed, stacktrace.Propagate(err, "")
	}

	if len(response.Items) == 0 {
		return nil, media.EnqueueRequestCreationFailedMediumNotFound, nil
	}

	videoItem := response.Items[0]

	if videoItem.ContentDetails.ContentRating.YtRating == "ytAgeRestricted" {
		return nil, media.EnqueueRequestCreationFailedMediumAgeRestricted, nil
	}

	if !videoItem.Status.Embeddable {
		return nil, media.EnqueueRequestCreationFailedMediumIsNotEmbeddable, nil
	}

	if videoItem.Snippet.LiveBroadcastContent == "upcoming" {
		return nil, media.EnqueueRequestCreationFailedMediumIsUpcomingLiveBroadcast, nil
	}

	return &initialInfo{
		videoItem:  videoItem,
		parameters: youTubeParameters,
	}, media.EnqueueRequestCreationSucceeded, nil
}

func (c *VideoProvider) ContinueEnqueueRequest(ctx *transaction.WrappingContext, genericInfo media.InitialInfo, unskippable bool,
	allowUnpopular bool, skipLengthChecks bool, skipDuplicationChecks bool) (media.EnqueueRequest, media.EnqueueRequestCreationResult, error) {

	ctx, err := transaction.Begin(ctx)
	if err != nil {
		return nil, media.EnqueueRequestCreationFailed, stacktrace.Propagate(err, "")
	}
	defer ctx.Commit() // read-only tx

	preInfo, ok := genericInfo.(*initialInfo)
	if !ok {
		return nil, media.EnqueueRequestCreationFailed, stacktrace.NewError("unexpected type")
	}

	var startOffsetDuration time.Duration
	if preInfo.parameters.YoutubeVideoData.StartOffset != nil {
		startOffsetDuration = preInfo.parameters.YoutubeVideoData.StartOffset.AsDuration()
	}
	var endOffsetDuration time.Duration
	if preInfo.parameters.YoutubeVideoData.EndOffset != nil {
		endOffsetDuration = preInfo.parameters.YoutubeVideoData.EndOffset.AsDuration()
		if endOffsetDuration <= startOffsetDuration {
			return nil, media.EnqueueRequestCreationFailed, stacktrace.Propagate(err, "video start offset past video end offset")
		}
	}

	var playFor = 10 * time.Minute
	var totalVideoDuration time.Duration
	if preInfo.videoItem.Snippet.LiveBroadcastContent == "live" {
		if preInfo.videoItem.LiveStreamingDetails.ConcurrentViewers < 10 && !allowUnpopular {
			return nil, media.EnqueueRequestCreationFailedMediumIsUnpopularLiveBroadcast, nil
		}
		if preInfo.parameters.YoutubeVideoData.EndOffset != nil {
			playFor = endOffsetDuration - startOffsetDuration
			startOffsetDuration = 0
			endOffsetDuration = playFor
		}
	} else {
		videoDurationPeriod, err := period.Parse(preInfo.videoItem.ContentDetails.Duration)
		if err != nil {
			return nil, media.EnqueueRequestCreationFailed, stacktrace.Propagate(err, "error parsing video duration")
		}
		totalVideoDuration = videoDurationPeriod.DurationApprox()

		if startOffsetDuration > totalVideoDuration {
			return nil, media.EnqueueRequestCreationFailed, stacktrace.Propagate(err, "video start offset past end of video")
		}

		if endOffsetDuration == 0 || endOffsetDuration > totalVideoDuration {
			endOffsetDuration = totalVideoDuration
		}

		playFor = endOffsetDuration - startOffsetDuration
	}

	if playFor > 35*time.Minute && !skipLengthChecks {
		return nil, media.EnqueueRequestCreationFailedMediumIsTooLong, nil
	}

	if !skipDuplicationChecks {
		if preInfo.videoItem.Snippet.LiveBroadcastContent == "live" {
			result, err := c.checkYouTubeBroadcastContentDuplication(ctx, preInfo.videoItem.Id, playFor)
			if err != nil || result != media.EnqueueRequestCreationSucceeded {
				return nil, result, stacktrace.Propagate(err, "")
			}
		} else {
			result, err := c.checkYouTubeVideoContentDuplication(ctx, preInfo.videoItem.Id, startOffsetDuration, playFor, totalVideoDuration)
			if err != nil || result != media.EnqueueRequestCreationSucceeded {
				return nil, result, stacktrace.Propagate(err, "")
			}
		}
	}

	request := &queueEntryYouTubeVideo{
		id:            preInfo.videoItem.Id,
		channelTitle:  preInfo.videoItem.Snippet.ChannelTitle,
		liveBroadcast: preInfo.videoItem.Snippet.LiveBroadcastContent == "live",
		thumbnailURL:  preInfo.videoItem.Snippet.Thumbnails.Default.Url,
	}
	request.InitializeBase(request)
	request.SetTitle(preInfo.videoItem.Snippet.Title)
	request.SetLength(playFor)
	request.SetOffset(startOffsetDuration)
	request.SetUnskippable(unskippable)

	userClaims := authinterceptor.UserClaimsFromContext(ctx)
	if userClaims != nil {
		request.SetRequestedBy(userClaims)
	}

	return request, media.EnqueueRequestCreationSucceeded, nil
}

func (s *VideoProvider) checkYouTubeVideoContentDuplication(ctx *transaction.WrappingContext, videoID string, offset, length, totalVideoLength time.Duration) (media.EnqueueRequestCreationResult, error) {
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
				return media.EnqueueRequestCreationFailedMediumIsAlreadyInQueue, nil
			}
		}
	}

	now := time.Now()

	// check range overlap with previously played entries
	lookback := 2*time.Hour + totalVideoLength
	lastPlays, err := types.LastPlaysOfMedia(ctx, now.Add(-lookback), types.MediaTypeYouTubeVideo, videoID)
	if err != nil {
		return media.EnqueueRequestCreationFailed, stacktrace.Propagate(err, "")
	}
	for _, play := range lastPlays {
		endedAt := now
		if play.EndedAt.Valid {
			endedAt = play.EndedAt.Time
		}
		playedFor := endedAt.Sub(play.StartedAt)
		playedPeriod := playPeriod{time.Duration(play.MediaOffset), time.Duration(play.MediaOffset) + playedFor}

		if periodsOverlap(playedPeriod, candidatePeriod) {
			return media.EnqueueRequestCreationFailedMediumPlayedTooRecently, nil
		}
	}

	return media.EnqueueRequestCreationSucceeded, nil
}

func (s *VideoProvider) checkYouTubeBroadcastContentDuplication(ctx *transaction.WrappingContext, videoID string, length time.Duration) (media.EnqueueRequestCreationResult, error) {
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
		return media.EnqueueRequestCreationFailedMediumIsAlreadyInQueue, nil
	}

	now := time.Now()

	// add total played length
	lastPlays, err := types.LastPlaysOfMedia(ctx, now.Add(-4*time.Hour), types.MediaTypeYouTubeVideo, videoID)
	if err != nil {
		return media.EnqueueRequestCreationFailed, stacktrace.Propagate(err, "")
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
		return media.EnqueueRequestCreationFailedMediumPlayedTooRecently, nil
	}

	return media.EnqueueRequestCreationSucceeded, nil
}

type playPeriod struct {
	start time.Duration
	end   time.Duration
}

func periodsOverlap(first, second playPeriod) bool {
	return first.start <= second.end && first.end >= second.start
}
