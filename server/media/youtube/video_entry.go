package youtube

import (
	"context"
	"encoding/json"
	"math/big"
	"time"

	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/server/auth"
	"github.com/tnyim/jungletv/server/components/payment"
	"github.com/tnyim/jungletv/server/media"
	"github.com/tnyim/jungletv/types"
	"google.golang.org/protobuf/types/known/durationpb"
)

type queueEntryYouTubeVideo struct {
	media.CommonQueueEntry
	media.CommonInfo
	id            string
	channelTitle  string
	liveBroadcast bool
	thumbnailURL  string
}

func (e *queueEntryYouTubeVideo) ProduceMediaQueueEntry(requestedBy auth.User, requestCost payment.Amount, unskippable, concealed bool, queueID string) media.QueueEntry {
	e.FillMediaQueueEntryFields(requestedBy, requestCost, unskippable, concealed, queueID)
	return e
}

func (e *queueEntryYouTubeVideo) MediaID() (types.MediaType, string) {
	return types.MediaTypeYouTubeVideo, e.id
}

func (e *queueEntryYouTubeVideo) SerializeForAPIQueue(ctx context.Context) proto.IsQueueEntry_MediaInfo {
	info := &proto.QueueEntry_YoutubeVideoData{
		YoutubeVideoData: &proto.QueueYouTubeVideoData{
			Id:            e.id,
			Title:         e.Title(),
			ThumbnailUrl:  e.thumbnailURL,
			ChannelTitle:  e.channelTitle,
			LiveBroadcast: e.liveBroadcast,
		},
	}
	return info
}

type queueEntryYouTubeVideoJsonRepresentation struct {
	QueueID       string
	Type          string
	ID            string
	Title         string
	ChannelTitle  string
	ThumbnailURL  string
	Duration      time.Duration
	Offset        time.Duration
	LiveBroadcast bool
	RequestedBy   string
	RequestCost   *big.Int
	RequestedAt   time.Time
	Unskippable   bool
	Concealed     bool
	MovedBy       []string
}

func (e *queueEntryYouTubeVideo) MarshalJSON() ([]byte, error) {
	j, err := json.Marshal(queueEntryYouTubeVideoJsonRepresentation{
		QueueID:       e.QueueID(),
		Type:          string(types.MediaTypeYouTubeVideo),
		ID:            e.id,
		Title:         e.Title(),
		ChannelTitle:  e.channelTitle,
		ThumbnailURL:  e.thumbnailURL,
		Duration:      e.Length(),
		Offset:        e.Offset(),
		LiveBroadcast: e.liveBroadcast,
		RequestedBy:   e.RequestedBy().Address(),
		RequestCost:   e.RequestCost().Int,
		RequestedAt:   e.RequestedAt(),
		Unskippable:   e.Unskippable(),
		Concealed:     e.Concealed(),
		MovedBy:       e.MovedBy(),
	})
	if err != nil {
		return nil, stacktrace.Propagate(err, "error serializing queue entry %s", e.QueueID())
	}
	return j, nil
}

func (e *queueEntryYouTubeVideo) UnmarshalJSON(b []byte) error {
	var t queueEntryYouTubeVideoJsonRepresentation
	if err := json.Unmarshal(b, &t); err != nil {
		return stacktrace.Propagate(err, "error deserializing queue entry")
	}

	e.InitializeBase(e)
	e.SetQueueID(t.QueueID)
	e.id = t.ID
	e.SetTitle(t.Title)
	e.channelTitle = t.ChannelTitle
	e.thumbnailURL = t.ThumbnailURL
	e.SetLength(t.Duration)
	e.SetOffset(t.Offset)
	e.liveBroadcast = t.LiveBroadcast
	e.SetRequestedBy(auth.NewAddressOnlyUser(t.RequestedBy))
	e.SetRequestCost(payment.NewAmount(t.RequestCost))
	e.SetRequestedAt(t.RequestedAt)
	e.SetUnskippable(t.Unskippable)
	e.SetConcealed(t.Concealed)
	for _, m := range t.MovedBy {
		e.SetAsMovedBy(auth.NewAddressOnlyUser(m))
	}
	return nil
}

func (e *queueEntryYouTubeVideo) FillAPITicketMediaInfo(ticket *proto.EnqueueMediaTicket) {
	ticket.MediaLength = durationpb.New(e.Length())
	ticket.MediaInfo = &proto.EnqueueMediaTicket_YoutubeVideoData{
		YoutubeVideoData: &proto.QueueYouTubeVideoData{
			Id:            e.id,
			Title:         e.Title(),
			ChannelTitle:  e.channelTitle,
			ThumbnailUrl:  e.thumbnailURL,
			LiveBroadcast: e.liveBroadcast,
		},
	}
}

func (e *queueEntryYouTubeVideo) ProduceCheckpointForAPI(ctx context.Context) *proto.MediaConsumptionCheckpoint {
	cp := &proto.MediaConsumptionCheckpoint{
		LiveBroadcast: e.liveBroadcast,
		// Reward is optionally filled outside this function
		MediaInfo: &proto.MediaConsumptionCheckpoint_YoutubeVideoData{
			YoutubeVideoData: &proto.NowPlayingYouTubeVideoData{
				Id: e.id,
			},
		},
	}
	return cp
}
