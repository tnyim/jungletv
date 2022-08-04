package media

import (
	"context"
	"encoding/json"
	"time"

	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/server/auth"
	"github.com/tnyim/jungletv/server/components/payment"
	"github.com/tnyim/jungletv/types"
	"github.com/tnyim/jungletv/utils/event"
)

// QueueEntry represents one entry in the media queue
type QueueEntry interface {
	json.Marshaler
	json.Unmarshaler
	RequestedBy() auth.User
	RequestCost() payment.Amount
	RequestedAt() time.Time
	Unskippable() bool
	MediaInfo() Info
	SerializeForAPI(ctx context.Context, userSerializer auth.APIUserSerializer, canMoveUp bool, canMoveDown bool) *proto.QueueEntry
	ProduceCheckpointForAPI(ctx context.Context, userSerializer auth.APIUserSerializer, needsTitle bool) *proto.MediaConsumptionCheckpoint
	Play()
	Stop()
	Played() bool
	Playing() bool
	PlayedFor() time.Duration
	DonePlaying() *event.NoArgEvent

	WasMovedBy(user auth.User) bool
	SetAsMovedBy(user auth.User)
	MovedBy() []string

	QueueID() string
}

// Info provides information about a media
type Info interface {
	Title() string
	MediaID() (types.MediaType, string)
	ThumbnailURL() string
	Offset() time.Duration
	Length() time.Duration
	ProduceMediaQueueEntry(requestedBy auth.User, requestCost payment.Amount, unskippable bool, queueID string) QueueEntry
	FillAPITicketMediaInfo(ticket *proto.EnqueueMediaTicket)
}
