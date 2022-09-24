package document

import (
	"context"
	"encoding/json"
	"math/big"
	"sync"
	"time"

	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/server/auth"
	"github.com/tnyim/jungletv/server/components/payment"
	"github.com/tnyim/jungletv/server/media"
	"github.com/tnyim/jungletv/types"
	"github.com/tnyim/jungletv/utils/event"
	"github.com/tnyim/jungletv/utils/transaction"
	"google.golang.org/protobuf/types/known/durationpb"
	"google.golang.org/protobuf/types/known/timestamppb"
)

type queueEntryDocument struct {
	media.CommonQueueEntry
	media.CommonInfo

	backgroundContext context.Context

	lock             sync.RWMutex
	document         *types.Document
	sendFullContents bool
}

func (e *queueEntryDocument) ProduceMediaQueueEntry(requestedBy auth.User, requestCost payment.Amount, unskippable, concealed bool, queueID string) media.QueueEntry {
	e.FillMediaQueueEntryFields(requestedBy, requestCost, unskippable, concealed, queueID)
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
	Concealed   bool
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
		Concealed:   e.Concealed(),
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

	ctx, err := transaction.Begin(e.backgroundContext)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	defer ctx.Commit() // read-only tx

	documents, err := types.GetDocumentsWithIDs(ctx, []string{t.ID})
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	document, ok := documents[t.ID]
	if !ok {
		return stacktrace.NewError("document in queue not found in database")
	}

	e.InitializeBase(e)
	e.SetQueueID(t.QueueID)
	e.SetTitle(t.Title)
	e.document = document
	e.SetLength(t.Duration)
	e.SetOffset(0)
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
	e.lock.RLock()
	defer e.lock.RUnlock()
	documentData := &proto.MediaConsumptionCheckpoint_DocumentData{
		DocumentData: &proto.NowPlayingDocumentData{
			Id:        e.document.ID,
			UpdatedAt: timestamppb.New(e.document.UpdatedAt),
		},
	}
	if e.sendFullContents {
		documentData.DocumentData.Document = &proto.Document{
			Id:        e.document.ID,
			Format:    e.document.Format,
			Content:   e.document.Content,
			UpdatedAt: timestamppb.New(e.document.UpdatedAt),
		}
	}
	return &proto.MediaConsumptionCheckpoint{
		MediaInfo: documentData,
	}
}

// Play implements the QueueEntry interface
func (e *queueEntryDocument) Play() {
	e.CommonQueueEntry.Play()

	e.lock.RLock()
	defer e.lock.RUnlock()

	// ensure already connected clients receive the document via push, not by self-DDoSing ourselves
	// we'll set this to false 5s after liveUpdateWorker starts
	e.sendFullContents = true

	go e.liveUpdateWorker(e.backgroundContext, e.document.ID, e.document.UpdatedAt)
}

func (e *queueEntryDocument) liveUpdateWorker(ctx context.Context, documentID string, updatedAt time.Time) {
	ticker := time.NewTicker(5 * time.Second)
	defer ticker.Stop()

	donePlaying, unsubscribe := e.DonePlaying().Subscribe(event.AtLeastOnceGuarantee)
	defer unsubscribe()

	childContext, cancelChildContext := context.WithCancel(ctx)
	defer cancelChildContext()

	isFirstUpdate := true
	for {
		select {
		case <-ticker.C:
			if isFirstUpdate {
				e.sendFullContents = false
				isFirstUpdate = false
			}
			hasUpdate, updatedDocument, err := fetchUpdatedDocument(ctx, documentID, updatedAt)
			if err != nil {
				continue
			}
			if hasUpdate {
				updatedAt = updatedDocument.UpdatedAt
				e.updateDocument(childContext, updatedDocument)
			}
		case <-donePlaying:
			return
		case <-ctx.Done():
			return
		}
	}
}

func fetchUpdatedDocument(ctxCtx context.Context, documentID string, prevUpdatedAt time.Time) (bool, *types.Document, error) {
	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return false, nil, stacktrace.Propagate(err, "")
	}
	defer ctx.Commit() // read-only tx

	documents, err := types.GetDocumentsWithIDs(ctx, []string{documentID})
	if err != nil {
		return false, nil, stacktrace.Propagate(err, "")
	}
	updatedDocument, ok := documents[documentID]
	if !ok {
		return false, nil, stacktrace.NewError("document in queue not found in database")
	}

	return updatedDocument.UpdatedAt.After(prevUpdatedAt), updatedDocument, nil
}

func (e *queueEntryDocument) updateDocument(ctx context.Context, newDocument *types.Document) {
	e.lock.Lock()
	defer e.lock.Unlock()

	e.document = newDocument

	// temporarily send full document contents in media consumption checkpoints,
	// so that clients receive the document in a "push" strategy instead of having to
	// request it from the server and causing a self-DDoS
	e.sendFullContents = true

	timer := time.NewTimer(7 * time.Second)
	go func() {
		select {
		case <-timer.C:
			e.lock.Lock()
			defer e.lock.Unlock()
			e.sendFullContents = false
		case <-ctx.Done():
		}
	}()
}
