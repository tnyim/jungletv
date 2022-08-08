package document

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

type queueEntryDocument struct {
	media.CommonQueueEntry
	media.CommonInfo
	document   *types.Document
	documentID string // used temporarily during the JSON unmarshalling process
}

func (e *queueEntryDocument) ProduceMediaQueueEntry(requestedBy auth.User, requestCost payment.Amount, unskippable bool, queueID string) media.QueueEntry {
	e.SetRequestedBy(requestedBy)
	e.SetRequestCost(requestCost)
	e.SetUnskippable(unskippable)
	e.SetQueueID(queueID)
	e.SetRequestedAt(time.Now())
	return e
}

func (e *queueEntryDocument) MediaID() (types.MediaType, string) {
	return types.MediaTypeDocument, e.document.ID
}

func (e *queueEntryDocument) SerializeForAPIQueue(ctx context.Context) proto.IsQueueEntry_MediaInfo {
	info := &proto.QueueEntry_DocumentData{
		DocumentData: &proto.QueueDocumentData{
			Id:    e.document.ID,
			Title: e.Title(),
		},
	}
	return info
}

type queueEntryDocumentJsonRepresentation struct {
	QueueID     string
	Type        string
	ID          string
	Title       string
	Duration    time.Duration
	RequestedBy string
	RequestCost *big.Int
	RequestedAt time.Time
	Unskippable bool
	MovedBy     []string
}

func (e *queueEntryDocument) MarshalJSON() ([]byte, error) {
	j, err := json.Marshal(queueEntryDocumentJsonRepresentation{
		QueueID:     e.QueueID(),
		Type:        string(types.MediaTypeDocument),
		ID:          e.document.ID,
		Title:       e.Title(),
		Duration:    e.Length(),
		RequestedBy: e.RequestedBy().Address(),
		RequestCost: e.RequestCost().Int,
		RequestedAt: e.RequestedAt(),
		Unskippable: e.Unskippable(),
		MovedBy:     e.MovedBy(),
	})
	if err != nil {
		return nil, stacktrace.Propagate(err, "error serializing queue entry %s", e.QueueID())
	}
	return j, nil
}

func (e *queueEntryDocument) UnmarshalJSON(b []byte) error {
	var t queueEntryDocumentJsonRepresentation
	if err := json.Unmarshal(b, &t); err != nil {
		return stacktrace.Propagate(err, "error deserializing queue entry")
	}

	e.InitializeBase(e)
	e.SetQueueID(t.QueueID)
	e.SetTitle(t.Title)
	e.documentID = t.ID
	e.SetLength(t.Duration)
	e.SetOffset(0)
	e.SetRequestedBy(auth.NewAddressOnlyUser(t.RequestedBy))
	e.SetRequestCost(payment.NewAmount(t.RequestCost))
	e.SetRequestedAt(t.RequestedAt)
	e.SetUnskippable(t.Unskippable)
	for _, m := range t.MovedBy {
		e.SetAsMovedBy(auth.NewAddressOnlyUser(m))
	}
	return nil
}

func (e *queueEntryDocument) FillAPITicketMediaInfo(ticket *proto.EnqueueMediaTicket) {
	ticket.MediaLength = durationpb.New(e.Length())
	ticket.MediaInfo = &proto.EnqueueMediaTicket_DocumentData{
		DocumentData: &proto.QueueDocumentData{
			Id:    e.document.ID,
			Title: e.Title(),
		},
	}
}

func (e *queueEntryDocument) ProduceCheckpointForAPI(ctx context.Context) *proto.MediaConsumptionCheckpoint {
	cp := &proto.MediaConsumptionCheckpoint{
		MediaInfo: &proto.MediaConsumptionCheckpoint_DocumentData{
			DocumentData: &proto.NowPlayingDocumentData{
				Id:        e.document.ID,
				UpdatedAt: timestamppb.New(e.document.UpdatedAt),
			},
		},
	}
	return cp
}
