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
	"github.com/tnyim/jungletv/utils/transaction"
)

// QueueEntry represents one entry in the media queue
type QueueEntry interface {
	json.Marshaler
	Performance

	ActionableMediaInfo() ActionableInfo
	Concealed() bool
	ProduceCheckpointForAPI(ctx context.Context) *proto.MediaConsumptionCheckpoint
	ProducePlayedMedia() (*types.PlayedMedia, error)
	Play()
	Stop()
	DonePlaying() event.NoArgEvent

	WasMovedBy(user auth.User) bool
	SetAsMovedBy(user auth.User)
	MovedBy() []string
}

// ActionableInfo provides information about a media and is able to turn it into a QueueEntry, when given extra information
type ActionableInfo interface {
	BasicInfo
	ProduceMediaQueueEntry(requestedBy auth.User, requestCost payment.Amount, unskippable bool, concealed bool, queueID string) QueueEntry
	FillAPITicketMediaInfo(ticket *proto.EnqueueMediaTicket)
	SerializeForAPIQueue(ctx context.Context) proto.IsQueueEntry_MediaInfo
}

// BasicInfo provides information about a media
type BasicInfo interface {
	Title() string
	MediaID() (types.MediaType, string)
	Offset() time.Duration
	Length() time.Duration
}

// Performance represents one performance of a media
type Performance interface {
	RequestedBy() auth.User
	RequestCost() payment.Amount
	RequestedAt() time.Time
	Unskippable() bool

	Played() bool
	Playing() bool
	StartedAt() time.Time
	PlayedFor() time.Duration

	MediaInfo() BasicInfo
	PerformanceID() string
}

type CollectionKey struct {
	Type  types.MediaCollectionType
	ID    string
	Title string
}

// InitialInfo provides the initial information for blocklist checking during the enqueuing process
type InitialInfo interface {
	MediaID() (types.MediaType, string)
	Title() string
	Collections() []CollectionKey
}

// Provider provides media enqueuing and serialization facilities
type Provider interface {
	SetMediaQueue(mediaQueue MediaQueueStub)
	CanHandleRequestType(mediaParameters proto.IsEnqueueMediaRequest_MediaInfo) bool
	BeginEnqueueRequest(ctx *transaction.WrappingContext, mediaParameters proto.IsEnqueueMediaRequest_MediaInfo) (InitialInfo, EnqueueRequestCreationResult, error)
	ContinueEnqueueRequest(ctx *transaction.WrappingContext, info InitialInfo, unskippable, concealed, anonymous,
		allowUnpopular, skipLengthChecks, skipDuplicationChecks bool) (EnqueueRequest, EnqueueRequestCreationResult, error)

	UnmarshalQueueEntryJSON(ctx context.Context, b []byte) (QueueEntry, bool, error)

	BasicMediaInfoFromPlayedMedia(playedMedia *types.PlayedMedia) (BasicInfo, error)
	SerializePlayedMediaMediaInfo(playedMedia *types.PlayedMedia) (proto.IsPlayedMedia_MediaInfo, error)
	SerializeUserProfileResponseFeaturedMedia(playedMedia *types.PlayedMedia) (proto.IsUserProfileResponse_FeaturedMedia, error)
}

// MediaQueueStub contains a subset of the methods implemented by the media queue which are useful to media providers
type MediaQueueStub interface {
	Entries() []QueueEntry
}
