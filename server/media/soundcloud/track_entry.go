package soundcloud

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
	"google.golang.org/protobuf/types/known/timestamppb"
)

type queueEntrySoundCloudTrack struct {
	media.CommonQueueEntry
	media.CommonInfo
	id           string
	uploader     string
	artist       string
	permalink    string
	thumbnailURL string
}

func (e *queueEntrySoundCloudTrack) ProduceMediaQueueEntry(requestedBy auth.User, requestCost payment.Amount, unskippable bool, queueID string) media.QueueEntry {
	e.SetRequestedBy(requestedBy)
	e.SetRequestCost(requestCost)
	e.SetUnskippable(unskippable)
	e.SetQueueID(queueID)
	e.SetRequestedAt(time.Now())
	return e
}

func (e *queueEntrySoundCloudTrack) MediaID() (types.MediaType, string) {
	return types.MediaTypeSoundCloudTrack, e.id
}

func (e *queueEntrySoundCloudTrack) SerializeForAPI(ctx context.Context, userSerializer auth.APIUserSerializer, canMoveUp bool, canMoveDown bool) *proto.QueueEntry {
	entry := &proto.QueueEntry{
		Id:          e.QueueID(),
		Length:      durationpb.New(e.Length()),
		Offset:      durationpb.New(e.Offset()),
		Unskippable: e.Unskippable(),
		RequestCost: e.RequestCost().SerializeForAPI(),
		RequestedAt: timestamppb.New(e.RequestedAt()),
		CanMoveUp:   canMoveUp,
		CanMoveDown: canMoveDown,
		MediaInfo: &proto.QueueEntry_SoundcloudTrackData{
			SoundcloudTrackData: &proto.QueueSoundCloudTrackData{
				Id:           e.id,
				Title:        e.Title(),
				ThumbnailUrl: e.thumbnailURL,
				Uploader:     e.uploader,
				Artist:       e.artist,
				Permalink:    e.permalink,
			},
		},
	}
	if !e.RequestedBy().IsUnknown() {
		entry.RequestedBy = userSerializer(ctx, e.RequestedBy())
	}
	return entry
}

type queueEntrySoundCloudTrackJsonRepresentation struct {
	QueueID      string
	Type         string
	ID           string
	Title        string
	Uploader     string
	Artist       string
	Permalink    string
	ThumbnailURL string
	Duration     time.Duration
	Offset       time.Duration
	RequestedBy  string
	RequestCost  *big.Int
	RequestedAt  time.Time
	Unskippable  bool
	MovedBy      []string
}

func (e *queueEntrySoundCloudTrack) MarshalJSON() ([]byte, error) {
	j, err := json.Marshal(queueEntrySoundCloudTrackJsonRepresentation{
		QueueID:      e.QueueID(),
		Type:         string(types.MediaTypeSoundCloudTrack),
		ID:           e.id,
		Title:        e.Title(),
		Uploader:     e.uploader,
		Artist:       e.artist,
		Permalink:    e.permalink,
		ThumbnailURL: e.thumbnailURL,
		Duration:     e.Length(),
		Offset:       e.Offset(),
		RequestedBy:  e.RequestedBy().Address(),
		RequestCost:  e.RequestCost().Int,
		RequestedAt:  e.RequestedAt(),
		Unskippable:  e.Unskippable(),
		MovedBy:      e.MovedBy(),
	})
	if err != nil {
		return nil, stacktrace.Propagate(err, "error serializing queue entry %s", e.id)
	}
	return j, nil
}

func (e *queueEntrySoundCloudTrack) UnmarshalJSON(b []byte) error {
	var t queueEntrySoundCloudTrackJsonRepresentation
	if err := json.Unmarshal(b, &t); err != nil {
		return stacktrace.Propagate(err, "error deserializing queue entry")
	}

	e.InitializeBase(e)
	e.SetQueueID(t.QueueID)
	e.id = t.ID
	e.SetTitle(t.Title)
	e.uploader = t.Uploader
	e.artist = t.Artist
	e.permalink = t.Permalink
	e.thumbnailURL = t.ThumbnailURL
	e.SetLength(t.Duration)
	e.SetOffset(t.Offset)
	e.SetRequestedBy(auth.NewAddressOnlyUser(t.RequestedBy))
	e.SetRequestCost(payment.NewAmount(t.RequestCost))
	e.SetRequestedAt(t.RequestedAt)
	e.SetUnskippable(t.Unskippable)
	for _, m := range t.MovedBy {
		e.SetAsMovedBy(auth.NewAddressOnlyUser(m))
	}
	return nil
}

func (e *queueEntrySoundCloudTrack) FillAPITicketMediaInfo(ticket *proto.EnqueueMediaTicket) {
	ticket.MediaLength = durationpb.New(e.Length())
	ticket.MediaInfo = &proto.EnqueueMediaTicket_SoundcloudTrackData{
		SoundcloudTrackData: &proto.QueueSoundCloudTrackData{
			Id:           e.id,
			Title:        e.Title(),
			Uploader:     e.uploader,
			Artist:       e.artist,
			Permalink:    e.permalink,
			ThumbnailUrl: e.thumbnailURL,
		},
	}
}

func (e *queueEntrySoundCloudTrack) ProduceCheckpointForAPI(ctx context.Context, userSerializer auth.APIUserSerializer, needsTitle bool) *proto.MediaConsumptionCheckpoint {
	cp := &proto.MediaConsumptionCheckpoint{
		MediaPresent:    true,
		CurrentPosition: durationpb.New(e.Offset() + e.PlayedFor()),
		RequestCost:     e.RequestCost().SerializeForAPI(),
		// Reward is optionally filled outside this function
		MediaInfo: &proto.MediaConsumptionCheckpoint_SoundcloudTrackData{
			SoundcloudTrackData: &proto.NowPlayingSoundCloudTrackData{
				Id: e.id,
			},
		},
	}
	if needsTitle {
		title := e.Title()
		cp.MediaTitle = &title
	}
	if !e.RequestedBy().IsUnknown() {
		cp.RequestedBy = userSerializer(ctx, e.RequestedBy())
	}
	return cp
}
