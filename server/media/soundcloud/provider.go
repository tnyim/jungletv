package soundcloud

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"time"

	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/proto"
	authinterceptor "github.com/tnyim/jungletv/server/interceptors/auth"
	"github.com/tnyim/jungletv/server/media"
	"github.com/tnyim/jungletv/types"
	"github.com/tnyim/jungletv/utils/transaction"
)

type mediaQueue interface {
	Entries() []media.QueueEntry
}

// TrackProvider provides SoundCloud track media
type TrackProvider struct {
	mediaQueue mediaQueue

	apiHost    string
	clientID   string
	appVersion string

	httpClient http.Client
}

// NewProvider returns a new SoundCloud track provider
func NewProvider(mediaQueue mediaQueue, apiHost, clientID, appVersion string) media.Provider {
	return &TrackProvider{
		mediaQueue: mediaQueue,

		apiHost:    apiHost,
		clientID:   clientID,
		appVersion: appVersion,

		httpClient: http.Client{
			Timeout: time.Second * 5,
		},
	}
}

func (c *TrackProvider) CanHandleRequestType(mediaParameters proto.IsEnqueueMediaRequest_MediaInfo) bool {
	_, ok := mediaParameters.(*proto.EnqueueMediaRequest_SoundcloudTrackData)
	return ok
}

func (c *TrackProvider) NewEnqueueRequest(ctx *transaction.WrappingContext, mediaParameters proto.IsEnqueueMediaRequest_MediaInfo, unskippable bool,
	allowUnpopular bool, skipLengthChecks bool, skipDuplicationChecks bool) (media.EnqueueRequest, media.EnqueueRequestCreationResult, error) {
	ctx, err := transaction.Begin(ctx)
	if err != nil {
		return nil, media.EnqueueRequestCreationFailed, stacktrace.Propagate(err, "")
	}
	defer ctx.Commit() // read-only tx

	soundCloudParameters, ok := mediaParameters.(*proto.EnqueueMediaRequest_SoundcloudTrackData)
	if !ok {
		return nil, media.EnqueueRequestCreationFailed, stacktrace.NewError("invalid parameter type for SoundCloud track provider")
	}

	response, err := c.getTrackInfo(soundCloudParameters.SoundcloudTrackData.GetPermalink())
	if err != nil {
		return nil, media.EnqueueRequestCreationFailed, stacktrace.Propagate(err, "")
	}

	if response.Kind != "track" {
		return nil, media.EnqueueRequestCreationFailedMediumIsNotATrack, nil
	}

	if response.EmbeddableBy != "all" || !response.Public || response.Sharing != "public" || !response.Streamable {
		return nil, media.EnqueueRequestCreationFailedMediumIsNotEmbeddable, nil
	}

	idString := fmt.Sprintf("%d", response.ID)

	allowed, err := types.IsMediaAllowed(ctx, types.MediaTypeSoundCloudTrack, idString)
	if err != nil {
		return nil, media.EnqueueRequestCreationFailed, stacktrace.Propagate(err, "")
	}
	if !allowed {
		return nil, media.EnqueueRequestCreationFailedMediumIsDisallowed, nil
	}

	var startOffsetDuration time.Duration
	if soundCloudParameters.SoundcloudTrackData.StartOffset != nil {
		startOffsetDuration = soundCloudParameters.SoundcloudTrackData.StartOffset.AsDuration()
	}
	var endOffsetDuration time.Duration
	if soundCloudParameters.SoundcloudTrackData.EndOffset != nil {
		endOffsetDuration = soundCloudParameters.SoundcloudTrackData.EndOffset.AsDuration()
		if endOffsetDuration <= startOffsetDuration {
			return nil, media.EnqueueRequestCreationFailed, stacktrace.Propagate(err, "track start offset past track end offset")
		}
	}

	trackDuration := parseSoundCloudDuration(response.Duration)

	if endOffsetDuration == 0 || endOffsetDuration > trackDuration {
		endOffsetDuration = trackDuration
	}

	playFor := endOffsetDuration - startOffsetDuration

	if playFor > 35*time.Minute && !skipLengthChecks {
		return nil, media.EnqueueRequestCreationFailedMediumIsTooLong, nil
	}

	if startOffsetDuration > trackDuration {
		return nil, media.EnqueueRequestCreationFailed, stacktrace.Propagate(err, "track start offset past end of track")
	}

	if !skipDuplicationChecks {
		result, err := c.checkSoundCloudTrackContentDuplication(ctx, idString, startOffsetDuration, playFor, trackDuration)
		if err != nil || result != media.EnqueueRequestCreationSucceeded {
			return nil, result, stacktrace.Propagate(err, "")
		}
	}

	request := &queueEntrySoundCloudTrack{
		id:           idString,
		uploader:     response.User.Username,
		artist:       response.PublisherMetadata.Artist,
		permalink:    response.PermalinkURL,
		thumbnailURL: response.ArtworkURL,
	}
	request.InitializeBase(request)
	request.SetTitle(response.Title)
	request.SetLength(playFor)
	request.SetOffset(startOffsetDuration)
	request.SetUnskippable(unskippable)

	userClaims := authinterceptor.UserClaimsFromContext(ctx)
	if userClaims != nil {
		request.SetRequestedBy(userClaims)
	}

	return request, media.EnqueueRequestCreationSucceeded, nil
}

func (s *TrackProvider) checkSoundCloudTrackContentDuplication(ctx *transaction.WrappingContext, trackID string, offset, length, totalTrackLength time.Duration) (media.EnqueueRequestCreationResult, error) {
	toleranceMargin := 1 * time.Minute
	if totalTrackLength/10 < toleranceMargin {
		toleranceMargin = totalTrackLength / 10
	}

	candidatePeriod := playPeriod{offset + toleranceMargin, offset + length - toleranceMargin}
	if candidatePeriod.start > candidatePeriod.end {
		candidatePeriod.start = candidatePeriod.end
	}
	// check range overlap with enqueued entries
	for _, entry := range s.mediaQueue.Entries() {
		mediaInfo := entry.MediaInfo()
		entryType, entryMediaID := mediaInfo.MediaID()
		if entryType == types.MediaTypeSoundCloudTrack && entryMediaID == trackID {
			enqueuedPeriod := playPeriod{mediaInfo.Offset(), mediaInfo.Offset() + mediaInfo.Length()}
			if periodsOverlap(enqueuedPeriod, candidatePeriod) {
				return media.EnqueueRequestCreationFailedMediumIsAlreadyInQueue, nil
			}
		}
	}

	now := time.Now()

	// check range overlap with previously played entries
	lookback := 2*time.Hour + totalTrackLength
	lastPlays, err := types.LastPlaysOfMedia(ctx, now.Add(-lookback), types.MediaTypeSoundCloudTrack, trackID)
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

type apiResponse struct {
	ArtworkURL        string               `json:"artwork_url"`
	Duration          int64                `json:"duration"`
	EmbeddableBy      string               `json:"embeddable_by"`
	Kind              string               `json:"kind"`
	ID                int64                `json:"id"`
	PermalinkURL      string               `json:"permalink_url"`
	Public            bool                 `json:"public"`
	PublisherMetadata apiPublisherMetadata `json:"publisher_metadata"`
	Sharing           string               `json:"sharing"`
	Streamable        bool                 `json:"streamable"`
	Title             string               `json:"title"`
	User              apiUser              `json:"user"`
}

type apiPublisherMetadata struct {
	Artist        string `json:"artist"`
	ContainsMusic bool   `json:"contains_music"`
}

type apiUser struct {
	Username string `json:"username"`
}

func (c *TrackProvider) getTrackInfo(trackURL string) (*apiResponse, error) {
	query := url.Values{}
	query.Set("url", trackURL)
	query.Set("format", "json")
	query.Set("client_id", c.clientID)
	query.Set("app_version", c.appVersion)

	url := url.URL{
		Scheme:   "https",
		Host:     c.apiHost,
		Path:     "resolve",
		RawQuery: query.Encode(),
	}
	response, err := c.httpClient.Get(url.String())
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	defer response.Body.Close()

	var responseData apiResponse
	err = json.NewDecoder(response.Body).Decode(&responseData)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	return &responseData, nil
}

func parseSoundCloudDuration(duration int64) time.Duration {
	return time.Duration(duration) * time.Millisecond
}

type playPeriod struct {
	start time.Duration
	end   time.Duration
}

func periodsOverlap(first, second playPeriod) bool {
	return first.start <= second.end && first.end >= second.start
}
