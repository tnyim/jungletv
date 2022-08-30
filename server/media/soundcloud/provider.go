package soundcloud

import (
	"encoding/json"
	"net/http"
	"net/url"
	"strconv"
	"time"

	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/proto"
	authinterceptor "github.com/tnyim/jungletv/server/interceptors/auth"
	"github.com/tnyim/jungletv/server/media"
	"github.com/tnyim/jungletv/types"
	"github.com/tnyim/jungletv/utils/transaction"
)

// TrackProvider provides SoundCloud track media
type TrackProvider struct {
	mediaQueue media.MediaQueueStub

	apiHost    string
	clientID   string
	appVersion string

	httpClient http.Client
}

// NewProvider returns a new SoundCloud track provider
func NewProvider(apiHost, clientID, appVersion string) media.Provider {
	return &TrackProvider{

		apiHost:    apiHost,
		clientID:   clientID,
		appVersion: appVersion,

		httpClient: http.Client{
			Timeout: time.Second * 5,
		},
	}
}

func (c *TrackProvider) SetMediaQueue(mediaQueue media.MediaQueueStub) {
	c.mediaQueue = mediaQueue
}

func (c *TrackProvider) CanHandleRequestType(mediaParameters proto.IsEnqueueMediaRequest_MediaInfo) bool {
	_, ok := mediaParameters.(*proto.EnqueueMediaRequest_SoundcloudTrackData)
	return ok
}

type initialInfo struct {
	id         string
	response   *APIResponse
	parameters *proto.EnqueueMediaRequest_SoundcloudTrackData
}

func (i *initialInfo) MediaID() (types.MediaType, string) {
	return types.MediaTypeSoundCloudTrack, i.id
}

func (i *initialInfo) Title() string {
	return i.response.Title
}

func (i *initialInfo) Collections() []media.CollectionKey {
	return []media.CollectionKey{
		{
			ID:    strconv.FormatInt(i.response.User.ID, 10),
			Title: i.response.User.Username,
			Type:  types.MediaCollectionTypeSoundCloudUser,
		},
	}
}

func (c *TrackProvider) BeginEnqueueRequest(ctx *transaction.WrappingContext, mediaParameters proto.IsEnqueueMediaRequest_MediaInfo) (media.InitialInfo, media.EnqueueRequestCreationResult, error) {
	ctx, err := transaction.Begin(ctx)
	if err != nil {
		return nil, media.EnqueueRequestCreationFailed, stacktrace.Propagate(err, "")
	}
	defer ctx.Commit() // read-only tx

	soundCloudParameters, ok := mediaParameters.(*proto.EnqueueMediaRequest_SoundcloudTrackData)
	if !ok {
		return nil, media.EnqueueRequestCreationFailed, stacktrace.NewError("invalid parameter type for SoundCloud track provider")
	}

	response, err := c.TrackInfo(soundCloudParameters.SoundcloudTrackData.GetPermalink())
	if err != nil {
		return nil, media.EnqueueRequestCreationFailed, stacktrace.Propagate(err, "")
	}

	if response.Kind != "track" {
		return nil, media.EnqueueRequestCreationFailedMediumIsNotATrack, nil
	}

	if response.EmbeddableBy != "all" ||
		!response.Public ||
		response.Sharing != "public" ||
		!response.Streamable ||
		response.Policy == "SNIP" ||
		response.MonetizationModel == "SUB_HIGH_TIER" {
		return nil, media.EnqueueRequestCreationFailedMediumIsNotEmbeddable, nil
	}

	idString := strconv.FormatInt(response.ID, 10)

	return &initialInfo{
		id:         idString,
		response:   response,
		parameters: soundCloudParameters,
	}, media.EnqueueRequestCreationSucceeded, nil
}

func (c *TrackProvider) ContinueEnqueueRequest(ctx *transaction.WrappingContext, genericInfo media.InitialInfo, unskippable bool,
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
	if preInfo.parameters.SoundcloudTrackData.StartOffset != nil {
		startOffsetDuration = preInfo.parameters.SoundcloudTrackData.StartOffset.AsDuration()
	}
	var endOffsetDuration time.Duration
	if preInfo.parameters.SoundcloudTrackData.EndOffset != nil {
		endOffsetDuration = preInfo.parameters.SoundcloudTrackData.EndOffset.AsDuration()
		if endOffsetDuration <= startOffsetDuration {
			return nil, media.EnqueueRequestCreationFailed, stacktrace.Propagate(err, "track start offset past track end offset")
		}
	}

	trackDuration := parseSoundCloudDuration(preInfo.response.Duration)
	if trackDuration == 0 {
		// work around incorrect metadata on some tracks
		// e.g. https://soundcloud.com/rojasonthebeat/look-at-me-ft-xxxtentacion
		trackDuration = parseSoundCloudDuration(preInfo.response.FullDuration)
	}
	if trackDuration == 0 {
		return nil, media.EnqueueRequestCreationFailedMediumIsNotEmbeddable, nil
	}

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
		result, err := c.checkSoundCloudTrackContentDuplication(ctx, preInfo.id, startOffsetDuration, playFor, trackDuration)
		if err != nil || result != media.EnqueueRequestCreationSucceeded {
			return nil, result, stacktrace.Propagate(err, "")
		}
	}

	request := &queueEntrySoundCloudTrack{
		id:           preInfo.id,
		uploader:     preInfo.response.User.Username,
		artist:       preInfo.response.PublisherMetadata.Artist,
		permalink:    preInfo.response.PermalinkURL,
		thumbnailURL: preInfo.response.ArtworkURL,
	}
	request.InitializeBase(request)
	request.SetTitle(preInfo.response.Title)
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

type APIResponse struct {
	ArtworkURL        string               `json:"artwork_url"`
	Duration          int64                `json:"duration"`
	FullDuration      int64                `json:"full_duration"`
	EmbeddableBy      string               `json:"embeddable_by"`
	Kind              string               `json:"kind"`
	ID                int64                `json:"id"`
	MonetizationModel string               `json:"monetization_model"`
	PermalinkURL      string               `json:"permalink_url"`
	Policy            string               `json:"policy"`
	Public            bool                 `json:"public"`
	PublisherMetadata APIPublisherMetadata `json:"publisher_metadata"`
	Sharing           string               `json:"sharing"`
	Streamable        bool                 `json:"streamable"`
	Title             string               `json:"title"`
	User              APIUser              `json:"user"`
}

type APIPublisherMetadata struct {
	Artist        string `json:"artist"`
	ContainsMusic bool   `json:"contains_music"`
}

type APIUser struct {
	Username string `json:"username"`
	ID       int64  `json:"id"`
}

func (c *TrackProvider) TrackInfo(trackURL string) (*APIResponse, error) {
	var err error
	trackURL, err = c.resolvePermalink(trackURL)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
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

	var responseData APIResponse
	err = json.NewDecoder(response.Body).Decode(&responseData)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	return &responseData, nil
}

func (c *TrackProvider) resolvePermalink(trackURLString string) (string, error) {
	url, err := url.Parse(trackURLString)
	if err != nil {
		// let it go just in case the soundcloud API can actually resolve this despite us not being able to parse it
		return trackURLString, nil
	}
	if url.Host != "soundcloud.app.goo.gl" {
		// let the SoundCloud API deal with it
		return trackURLString, nil
	}

	resp, err := c.httpClient.Head(trackURLString)
	if err != nil {
		return "", stacktrace.Propagate(err, "")
	}
	// The Request in the Response is the last URL the client tried to access.
	return resp.Request.URL.String(), nil
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
