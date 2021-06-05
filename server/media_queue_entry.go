package server

import (
	"encoding/json"
	"math/big"
	"time"

	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/utils/event"
	"google.golang.org/protobuf/types/known/durationpb"
)

// MediaQueueEntry represents one entry in the media queue
type MediaQueueEntry interface {
	json.Marshaler
	json.Unmarshaler
	RequestedBy() User
	RequestCost() Amount
	MediaInfo() MediaInfo
	SerializeForAPI() *proto.QueueEntry
	ProduceCheckpointForAPI() *proto.NowPlayingCheckpoint
	Play()
	Stop()
	Played() bool
	Playing() bool
	PlayingFor() time.Duration
	DonePlaying() *event.Event

	QueueID() string
}

type MediaInfo interface {
	Title() string
	ThumbnailURL() string
	Length() time.Duration
	ProduceMediaQueueEntry(requestedBy User, requestCost Amount, queueID string) MediaQueueEntry
	FillAPITicketMediaInfo(ticket *proto.EnqueueMediaTicket)
}

type queueEntryYouTubeVideo struct {
	queueID      string
	id           string
	title        string
	channelTitle string
	thumbnailURL string
	duration     time.Duration

	requestedBy    User
	requestCost    Amount
	startedPlaying time.Time
	played         bool
	donePlaying    *event.Event
}

func (e *queueEntryYouTubeVideo) ProduceMediaQueueEntry(requestedBy User, requestCost Amount, queueID string) MediaQueueEntry {
	e.requestedBy = requestedBy
	e.requestCost = requestCost
	e.queueID = queueID
	return e
}

func (e *queueEntryYouTubeVideo) QueueID() string {
	return e.queueID
}

func (e *queueEntryYouTubeVideo) Title() string {
	return e.title
}

func (e *queueEntryYouTubeVideo) ThumbnailURL() string {
	return e.thumbnailURL
}

func (e *queueEntryYouTubeVideo) Length() time.Duration {
	return e.duration
}

func (e *queueEntryYouTubeVideo) MediaInfo() MediaInfo {
	return e
}

func (e *queueEntryYouTubeVideo) RequestedBy() User {
	return e.requestedBy
}

func (e *queueEntryYouTubeVideo) RequestCost() Amount {
	return e.requestCost
}

func (e *queueEntryYouTubeVideo) SerializeForAPI() *proto.QueueEntry {
	entry := &proto.QueueEntry{
		Id:     e.queueID,
		Length: durationpb.New(e.duration),
		MediaInfo: &proto.QueueEntry_YoutubeVideoData{
			YoutubeVideoData: &proto.QueueYouTubeVideoData{
				Id:           e.id,
				Title:        e.title,
				ThumbnailUrl: e.thumbnailURL,
				ChannelTitle: e.channelTitle,
			},
		},
	}
	if !e.requestedBy.IsUnknown() {
		entry.RequestedBy = e.requestedBy.SerializeForAPI()
	}
	return entry
}

type queueEntryYouTubeVideoJsonRepresentation struct {
	QueueID      string
	Type         string
	ID           string
	Title        string
	ChannelTitle string
	ThumbnailURL string
	Duration     time.Duration
	RequestedBy  string
	RequestCost  *big.Int
}

func (e *queueEntryYouTubeVideo) MarshalJSON() ([]byte, error) {
	j, err := json.Marshal(queueEntryYouTubeVideoJsonRepresentation{
		QueueID:      e.queueID,
		Type:         "youtube-video",
		ID:           e.id,
		Title:        e.title,
		ChannelTitle: e.channelTitle,
		ThumbnailURL: e.thumbnailURL,
		Duration:     e.duration,
		RequestedBy:  e.requestedBy.Address(),
		RequestCost:  e.requestCost.Int,
	})
	if err != nil {
		return nil, stacktrace.Propagate(err, "error serializing queue entry %s", e.id)
	}
	return j, nil
}

func (e *queueEntryYouTubeVideo) UnmarshalJSON(b []byte) error {
	var t queueEntryYouTubeVideoJsonRepresentation
	if err := json.Unmarshal(b, &t); err != nil {
		return stacktrace.Propagate(err, "error deserializing queue entry")
	}

	e.queueID = t.QueueID
	e.id = t.ID
	e.title = t.Title
	e.channelTitle = t.ChannelTitle
	e.thumbnailURL = t.ThumbnailURL
	e.duration = t.Duration
	e.requestedBy = NewAddressOnlyUser(t.RequestedBy)
	e.requestCost = Amount{t.RequestCost}
	e.donePlaying = event.New()
	return nil
}

func (e *queueEntryYouTubeVideo) FillAPITicketMediaInfo(ticket *proto.EnqueueMediaTicket) {
	ticket.MediaInfo = &proto.EnqueueMediaTicket_YoutubeVideoData{
		YoutubeVideoData: &proto.QueueYouTubeVideoData{
			Id:           e.id,
			Title:        e.title,
			ChannelTitle: e.channelTitle,
			ThumbnailUrl: e.thumbnailURL,
		},
	}
}

func (e *queueEntryYouTubeVideo) ProduceCheckpointForAPI() *proto.NowPlayingCheckpoint {
	cp := &proto.NowPlayingCheckpoint{
		MediaPresent:    true,
		CurrentPosition: durationpb.New(e.PlayingFor()),
		RequestCost:     e.requestCost.SerializeForAPI(),
		// Reward is optionally filled outside this function
		MediaInfo: &proto.NowPlayingCheckpoint_YoutubeVideoData{
			YoutubeVideoData: &proto.NowPlayingYouTubeVideoData{
				Id: e.id,
			},
		},
	}
	if !e.requestedBy.IsUnknown() {
		cp.RequestedBy = e.requestedBy.SerializeForAPI()
	}
	return cp
}

func (e *queueEntryYouTubeVideo) Play() {
	e.startedPlaying = time.Now()
	c := time.NewTimer(e.duration).C
	go func() {
		<-c
		if e.Playing() {
			e.played = true
			e.donePlaying.Notify()
		}
	}()
}

func (e *queueEntryYouTubeVideo) Played() bool {
	return e.played
}

func (e *queueEntryYouTubeVideo) Stop() {
	if !e.Playing() {
		return
	}
	e.played = true
	e.donePlaying.Notify()
}

func (e *queueEntryYouTubeVideo) Playing() bool {
	return !e.startedPlaying.IsZero() && !e.played
}

func (e *queueEntryYouTubeVideo) PlayingFor() time.Duration {
	if !e.Playing() {
		return 0
	}
	return time.Now().Sub(e.startedPlaying)
}

func (e *queueEntryYouTubeVideo) DonePlaying() *event.Event {
	return e.donePlaying
}
