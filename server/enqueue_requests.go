package server

import (
	"context"
	"log"
	"sync"
	"time"

	"github.com/DisgoOrg/disgohook/api"
	"github.com/palantir/stacktrace"
	"github.com/patrickmn/go-cache"
	uuid "github.com/satori/go.uuid"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/server/auth"
	"github.com/tnyim/jungletv/server/components/mediaqueue"
	"github.com/tnyim/jungletv/server/components/payment"
	"github.com/tnyim/jungletv/server/components/pricer"
	"github.com/tnyim/jungletv/server/components/rewards"
	"github.com/tnyim/jungletv/server/media"
	"github.com/tnyim/jungletv/server/stores/moderation"
	"github.com/tnyim/jungletv/utils/event"
	"google.golang.org/protobuf/types/known/timestamppb"
	"gopkg.in/alexcesaro/statsd.v2"
)

const TicketExpiration = 10 * time.Minute

// EnqueueManager manages requests for enqueuing that are pending payment
type EnqueueManager struct {
	workerContext                      context.Context
	statsClient                        *statsd.Client
	mediaQueue                         *mediaqueue.MediaQueue
	pricer                             *pricer.Pricer
	paymentAccountPool                 *payment.PaymentAccountPool
	rewardsHandler                     *rewards.Handler
	log                                *log.Logger
	moderationStore                    moderation.Store
	modLogWebhook                      api.WebhookClient
	newEntriesAlwaysUnskippableForFree bool

	requests                map[string]EnqueueTicket
	requestsLock            sync.RWMutex
	recentlyEvictedRequests *cache.Cache[string, EnqueueTicket]
}

// EnqueueTicket is a request to enqueue media that is pending payment
type EnqueueTicket interface {
	media.EnqueueRequest
	ID() string
	CreatedAt() time.Time
	RequestedBy() auth.User
	PaymentAddress() string
	SerializeForAPI() *proto.EnqueueMediaTicket
	RequestPricing() pricer.EnqueuePricing
	SetPaid() error
	Status() proto.EnqueueMediaTicketStatus
	StatusChanged() *event.NoArgEvent
	ForceEnqueuing(proto.ForcedTicketEnqueueType)
	EnqueuingForced() (bool, proto.ForcedTicketEnqueueType)
}

// NewEnqueueManager returns a new EnqueueManager
func NewEnqueueManager(
	workerContext context.Context,
	log *log.Logger,
	statsClient *statsd.Client,
	mediaQueue *mediaqueue.MediaQueue,
	pricer *pricer.Pricer,
	paymentAccountPool *payment.PaymentAccountPool,
	rewardsHandler *rewards.Handler,
	moderationStore moderation.Store,
	modLogWebhook api.WebhookClient) (*EnqueueManager, error) {
	return &EnqueueManager{
		workerContext:           workerContext,
		log:                     log,
		statsClient:             statsClient,
		mediaQueue:              mediaQueue,
		pricer:                  pricer,
		paymentAccountPool:      paymentAccountPool,
		rewardsHandler:          rewardsHandler,
		requests:                make(map[string]EnqueueTicket),
		moderationStore:         moderationStore,
		modLogWebhook:           modLogWebhook,
		recentlyEvictedRequests: cache.New[string, EnqueueTicket](10*time.Minute, 1*time.Minute),
	}, nil
}

func (e *EnqueueManager) NewEntriesAlwaysUnskippableForFree() bool {
	return e.newEntriesAlwaysUnskippableForFree
}

func (e *EnqueueManager) SetNewQueueEntriesAlwaysUnskippableForFree(enabled bool) {
	e.newEntriesAlwaysUnskippableForFree = enabled
}

func (e *EnqueueManager) RegisterRequest(ctx context.Context, request media.EnqueueRequest) (EnqueueTicket, error) {
	paymentAddress, paymentReceivedEvent, err := e.paymentAccountPool.ReceivePayment()
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	t := &ticket{
		id:             uuid.NewV4().String(),
		createdAt:      time.Now(),
		requestedBy:    request.RequestedBy(),
		mediaInfo:      request.MediaInfo(),
		unskippable:    request.Unskippable(),
		pricing:        e.pricer.ComputeEnqueuePricing(request.MediaInfo().Length(), request.Unskippable()),
		paymentAddress: paymentAddress,
		statusChanged:  event.NewNoArg(),
	}
	go t.worker(e.workerContext, e, paymentReceivedEvent)

	e.requestsLock.Lock()
	defer e.requestsLock.Unlock()
	e.requests[t.ID()] = t
	numActive := len(e.requests)
	e.log.Printf("Registered ticket %s with payment account %s", t.id, t.paymentAddress)
	go e.statsClient.Gauge("active_enqueue_tickets", numActive)
	return t, nil
}

func (e *EnqueueManager) GetTicket(id string) EnqueueTicket {
	e.requestsLock.RLock()
	defer e.requestsLock.RUnlock()
	if r, ok := e.requests[id]; ok {
		return r
	}
	ev, ok := e.recentlyEvictedRequests.Get(id)
	if ok {
		return ev
	}
	return nil
}

func (e *EnqueueManager) tryEnqueuingTicket(ctx context.Context, balance payment.Amount, ticket EnqueueTicket) error {
	if ticket.Status() == proto.EnqueueMediaTicketStatus_PAID {
		return nil
	}
	pricing := ticket.RequestPricing()
	forceEnqueuing, forcedEnqueuingType := ticket.EnqueuingForced()

	var playFn func(media.QueueEntry)
	if balance.Cmp(pricing.PlayNowPrice.Int) >= 0 || (forceEnqueuing && forcedEnqueuingType == proto.ForcedTicketEnqueueType_PLAY_NOW) {
		playFn = e.mediaQueue.PlayNow
	} else if balance.Cmp(pricing.PlayNextPrice.Int) >= 0 || (forceEnqueuing && forcedEnqueuingType == proto.ForcedTicketEnqueueType_PLAY_NEXT) {
		playFn = e.mediaQueue.PlayAfterNext
	} else if balance.Cmp(pricing.EnqueuePrice.Int) >= 0 || (forceEnqueuing && forcedEnqueuingType == proto.ForcedTicketEnqueueType_ENQUEUE) {
		playFn = e.mediaQueue.Enqueue
	} else {
		// yet to receive enough money
		return nil
	}
	e.log.Printf("Ticket %s (p.a. %s) meets requirements for enqueuing", ticket.ID(), ticket.PaymentAddress())

	t2 := e.statsClient.NewTiming()
	defer t2.Send("enqueue_ticket")

	requestedBy := ticket.RequestedBy()
	requestedByStr := "unknown"
	if requestedBy != nil && requestedBy != (auth.User)(nil) {
		requestedByStr = requestedBy.Address()

		if banned, err := e.moderationStore.LoadPaymentAddressBannedFromVideoEnqueuing(ctx, requestedByStr); err == nil && banned {
			e.log.Printf("Ticket %s not being enqueued due to banned requester", ticket.ID())
			// TODO auto-revert all transactions that came from the banned address
			return nil
		}
	}

	mi := ticket.MediaInfo()
	playFn(mi.ProduceMediaQueueEntry(requestedBy, balance, ticket.Unskippable() || e.newEntriesAlwaysUnskippableForFree, ticket.ID()))

	err := ticket.SetPaid()
	if err != nil {
		return stacktrace.Propagate(err, "failed to set ticket %v as paid", ticket.ID())
	}

	_, mediaID := mi.MediaID()
	e.log.Printf("Enqueued ticket %s (p.a. %s) - video \"%s\" (%s) with length %s - requested by %s with cost %s",
		ticket.ID(),
		ticket.PaymentAddress(),
		mi.Title(),
		mediaID,
		mi.Length().String(),
		requestedByStr,
		balance.String())

	return nil
}

func (e *EnqueueManager) cleanupTicket(ticket EnqueueTicket) {
	e.requestsLock.Lock()
	defer e.requestsLock.Unlock()
	e.recentlyEvictedRequests.SetDefault(ticket.ID(), ticket)
	delete(e.requests, ticket.ID())

	numActive := len(e.requests)
	go e.statsClient.Gauge("active_enqueue_tickets", numActive)
}

type ticket struct {
	id             string
	paid           bool
	unskippable    bool
	requestedBy    auth.User
	createdAt      time.Time
	mediaInfo      media.Info
	paymentAddress string
	pricing        pricer.EnqueuePricing
	statusChanged  *event.NoArgEvent
	forceEnqueuing *proto.ForcedTicketEnqueueType
}

func (t *ticket) Unskippable() bool {
	return t.unskippable
}

func (t *ticket) MediaInfo() media.Info {
	return t.mediaInfo
}

func (t *ticket) ID() string {
	return t.id
}

func (t *ticket) CreatedAt() time.Time {
	return t.createdAt
}

func (t *ticket) RequestedBy() auth.User {
	return t.requestedBy
}

func (t *ticket) PaymentAddress() string {
	return t.paymentAddress
}

func (t *ticket) SerializeForAPI() *proto.EnqueueMediaTicket {
	serialized := &proto.EnqueueMediaTicket{
		Id:             t.id,
		Status:         t.Status(),
		PaymentAddress: t.paymentAddress,
		EnqueuePrice:   t.pricing.EnqueuePrice.SerializeForAPI(),
		PlayNextPrice:  t.pricing.PlayNextPrice.SerializeForAPI(),
		PlayNowPrice:   t.pricing.PlayNowPrice.SerializeForAPI(),
		Expiration:     timestamppb.New(t.CreatedAt().Add(TicketExpiration)),
		Unskippable:    t.unskippable,
	}
	t.mediaInfo.FillAPITicketMediaInfo(serialized)
	return serialized
}

func (t *ticket) RequestPricing() pricer.EnqueuePricing {
	return t.pricing
}

func (t *ticket) SetPaid() error {
	if t.paid {
		return stacktrace.NewError("ticket already paid")
	}
	t.paid = true
	t.statusChanged.Notify(true)
	return nil
}

func (t *ticket) Status() proto.EnqueueMediaTicketStatus {
	switch {
	case t.paid:
		return proto.EnqueueMediaTicketStatus_PAID
	case time.Now().After(t.CreatedAt().Add(TicketExpiration)):
		return proto.EnqueueMediaTicketStatus_EXPIRED
	default:
		return proto.EnqueueMediaTicketStatus_ACTIVE
	}
}

func (t *ticket) StatusChanged() *event.NoArgEvent {
	return t.statusChanged
}

func (t *ticket) ForceEnqueuing(et proto.ForcedTicketEnqueueType) {
	t.forceEnqueuing = &et
}

func (t *ticket) EnqueuingForced() (bool, proto.ForcedTicketEnqueueType) {
	if t.forceEnqueuing != nil {
		return true, *t.forceEnqueuing
	}
	return false, 0
}

func (t *ticket) worker(ctx context.Context, e *EnqueueManager, paymentReceivedEvent *event.Event[payment.PaymentReceivedEventArgs]) {
	defer e.cleanupTicket(t)

	expirationTimer := time.NewTimer(TicketExpiration)
	defer expirationTimer.Stop()

	actualExpirationTimer := time.NewTimer(TicketExpiration + 1*time.Minute)
	defer actualExpirationTimer.Stop()

	checkForcedEnqueuingTicker := time.NewTicker(5 * time.Second)
	defer checkForcedEnqueuingTicker.Stop()

	onPaymentReceived, onPaymentReceivedUnsub := paymentReceivedEvent.Subscribe(event.ExactlyOnceGuarantee)
	defer onPaymentReceivedUnsub()

	onStatusChanged, onStatusChangedUnsub := t.statusChanged.Subscribe(event.AtLeastOnceGuarantee)
	defer onStatusChangedUnsub()

	lastSeenBalance := payment.NewAmount()
	for {
		var err error
		select {
		case <-expirationTimer.C:
			t.statusChanged.Notify(false)
		case <-actualExpirationTimer.C:
			return
		case <-onStatusChanged:
			if t.paid {
				return
			}
		case <-ctx.Done():
			return
		case paymentArgs := <-onPaymentReceived:
			if t.requestedBy == nil || t.requestedBy.IsUnknown() {
				t.requestedBy = auth.NewAddressOnlyUser(paymentArgs.From)
			}
			lastSeenBalance = paymentArgs.Balance
			err = e.tryEnqueuingTicket(ctx, paymentArgs.Balance, t)
		case <-checkForcedEnqueuingTicker.C:
			err = e.tryEnqueuingTicket(ctx, lastSeenBalance, t)
		}
		if err != nil {
			e.log.Println(stacktrace.Propagate(err, "failed to enqueue ticket %s, now terminating ticket worker", t.id))
			return
		}
	}
}
