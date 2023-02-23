package enqueuemanager

import (
	"context"
	"errors"
	"log"
	"math/big"
	"sync"
	"time"

	"github.com/DisgoOrg/disgohook/api"
	"github.com/palantir/stacktrace"
	"github.com/patrickmn/go-cache"
	uuid "github.com/satori/go.uuid"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/server/auth"
	"github.com/tnyim/jungletv/server/components/mediaqueue"
	"github.com/tnyim/jungletv/server/components/nanswapclient"
	"github.com/tnyim/jungletv/server/components/payment"
	"github.com/tnyim/jungletv/server/components/pointsmanager"
	"github.com/tnyim/jungletv/server/components/pricer"
	"github.com/tnyim/jungletv/server/components/rewards"
	"github.com/tnyim/jungletv/server/media"
	"github.com/tnyim/jungletv/server/stores/moderation"
	"github.com/tnyim/jungletv/types"
	"github.com/tnyim/jungletv/utils/event"
	"github.com/tnyim/jungletv/utils/transaction"
	"google.golang.org/protobuf/types/known/timestamppb"
	"gopkg.in/alexcesaro/statsd.v2"
)

const TicketExpiration = 10 * time.Minute

// Manager manages requests for enqueuing that are pending payment
type Manager struct {
	workerContext                      context.Context
	statsClient                        *statsd.Client
	mediaQueue                         *mediaqueue.MediaQueue
	pricer                             *pricer.Pricer
	paymentAccountPool                 *payment.PaymentAccountPool
	rewardsHandler                     *rewards.Handler
	pointsManager                      *pointsmanager.Manager
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
	SetFailedDueToInsufficientPoints()
	Status() proto.EnqueueMediaTicketStatus
	StatusChanged() event.NoArgEvent
	ForceEnqueuing(proto.ForcedTicketEnqueueType)
	EnqueuingForced() (bool, proto.ForcedTicketEnqueueType)
}

// New returns a new Manager
func New(
	workerContext context.Context,
	log *log.Logger,
	statsClient *statsd.Client,
	mediaQueue *mediaqueue.MediaQueue,
	pricer *pricer.Pricer,
	paymentAccountPool *payment.PaymentAccountPool,
	rewardsHandler *rewards.Handler,
	pointsManager *pointsmanager.Manager,
	moderationStore moderation.Store,
	modLogWebhook api.WebhookClient) (*Manager, error) {
	return &Manager{
		workerContext:           workerContext,
		log:                     log,
		statsClient:             statsClient,
		mediaQueue:              mediaQueue,
		pricer:                  pricer,
		paymentAccountPool:      paymentAccountPool,
		rewardsHandler:          rewardsHandler,
		pointsManager:           pointsManager,
		requests:                make(map[string]EnqueueTicket),
		moderationStore:         moderationStore,
		modLogWebhook:           modLogWebhook,
		recentlyEvictedRequests: cache.New[string, EnqueueTicket](10*time.Minute, 1*time.Minute),
	}, nil
}

func (e *Manager) NewEntriesAlwaysUnskippableForFree() bool {
	return e.newEntriesAlwaysUnskippableForFree
}

func (e *Manager) SetNewQueueEntriesAlwaysUnskippableForFree(enabled bool) {
	e.newEntriesAlwaysUnskippableForFree = enabled
}

func (e *Manager) RegisterRequest(ctx context.Context, request media.EnqueueRequest, forceAnonymous bool) (EnqueueTicket, error) {
	pricing := e.pricer.ComputeEnqueuePricing(request.MediaInfo().Length(), request.Unskippable(), request.Concealed())

	amounts := []payment.Amount{
		pricing.EnqueuePrice,
		pricing.PlayNextPrice,
		pricing.PlayNowPrice,
	}

	paymentReceiver, err := e.paymentAccountPool.ReceiveMulticurrencyPayment(ctx, amounts, []nanswapclient.Ticker{nanswapclient.TickerNano}, TicketExpiration)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	if request.Concealed() && !forceAnonymous && (request.RequestedBy() == nil || request.RequestedBy().IsUnknown()) {
		return nil, stacktrace.NewError("anonymous users can not enqueue concealed entries")
	}

	t := &ticket{
		id:              uuid.NewV4().String(),
		createdAt:       time.Now(),
		requestedBy:     request.RequestedBy(),
		mediaInfo:       request.MediaInfo(),
		unskippable:     request.Unskippable(),
		concealed:       request.Concealed(),
		forceAnonymous:  forceAnonymous,
		pricing:         pricing,
		paymentReceiver: paymentReceiver,
		statusChanged:   event.NewNoArg(),
	}
	go t.worker(e.workerContext, e)

	e.requestsLock.Lock()
	defer e.requestsLock.Unlock()
	e.requests[t.ID()] = t
	numActive := len(e.requests)
	e.log.Printf("Registered ticket %s with payment account %s", t.id, t.PaymentAddress())
	go e.statsClient.Gauge("active_enqueue_tickets", numActive)
	return t, nil
}

func (e *Manager) GetTicket(id string) EnqueueTicket {
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

func (e *Manager) tryEnqueuingTicket(ctx context.Context, balance payment.Amount, senderAmount payment.Amount, senderCurrency nanswapclient.Ticker, ticket *ticket) error {
	if ticket.Status() == proto.EnqueueMediaTicketStatus_PAID {
		return nil
	}
	pricing := ticket.RequestPricing()
	forceEnqueuing, forcedEnqueuingType := ticket.EnqueuingForced()

	var mcpd *payment.MulticurrencyPaymentData

	for _, data := range ticket.paymentReceiver.MulticurrencyPaymentData() {
		if data.Currency == senderCurrency && len(data.ExpectedAmounts) >= 3 {
			mcpd = &data
			break
		}
	}

	var playFn func(media.QueueEntry)
	if balance.Cmp(pricing.PlayNowPrice.Int) >= 0 ||
		(mcpd != nil && mcpd.ExpectedAmounts[2].Cmp(big.NewInt(0)) > 0 && senderAmount.Cmp(mcpd.ExpectedAmounts[2].Int) >= 0) ||
		(forceEnqueuing && forcedEnqueuingType == proto.ForcedTicketEnqueueType_PLAY_NOW) {
		playFn = e.mediaQueue.PlayNow
	} else if balance.Cmp(pricing.PlayNextPrice.Int) >= 0 ||
		(mcpd != nil && mcpd.ExpectedAmounts[1].Cmp(big.NewInt(0)) > 0 && senderAmount.Cmp(mcpd.ExpectedAmounts[1].Int) >= 0) ||
		(forceEnqueuing && forcedEnqueuingType == proto.ForcedTicketEnqueueType_PLAY_NEXT) {
		playFn = e.mediaQueue.PlayAfterNext
	} else if balance.Cmp(pricing.EnqueuePrice.Int) >= 0 ||
		(mcpd != nil && mcpd.ExpectedAmounts[0].Cmp(big.NewInt(0)) > 0 && senderAmount.Cmp(mcpd.ExpectedAmounts[0].Int) >= 0) ||
		(forceEnqueuing && forcedEnqueuingType == proto.ForcedTicketEnqueueType_ENQUEUE) {
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
			if requestedBy.IsFromAlienChain() {
				// can't revert to alien chain
				return nil
			}
			// revert all transactions that came from the banned address
			err = ticket.paymentReceiver.Revert(requestedByStr)
			return stacktrace.Propagate(err, "")
		}
	}

	if ticket.Concealed() && !ticket.forceAnonymous {
		err := e.deductConcealedTicketPoints(ctx, ticket)
		if err != nil {
			if !errors.Is(err, types.ErrInsufficientPointsBalance) {
				return stacktrace.Propagate(err, "")
			}

			e.log.Printf("Ticket %s not being enqueued due to insufficient points balance to enqueue concealed entry", ticket.ID())
			// this ticket can not be enqueued because the user does not have sufficient points for a concealed queue entry
			ticket.SetFailedDueToInsufficientPoints()
			if requestedBy.IsFromAlienChain() {
				// can't revert to alien chain
				// this shouldn't happen since anonymous users can't request concealed entries. still, it's good practice to handle this
				return nil
			}
			// refund the paid amount
			err = ticket.paymentReceiver.Revert(requestedByStr)
			return stacktrace.Propagate(err, "")
		}
	}

	mi := ticket.MediaInfo()
	playFn(mi.ProduceMediaQueueEntry(requestedBy, balance,
		ticket.Unskippable() || e.newEntriesAlwaysUnskippableForFree,
		ticket.Concealed(), ticket.ID()))

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

func (e *Manager) deductConcealedTicketPoints(ctxCtx context.Context, ticket EnqueueTicket) error {
	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	defer ctx.Rollback()

	requestedBy := ticket.RequestedBy()
	cost, err := e.pointsCostOfConcealedEntry(ctx, requestedBy)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	_, err = e.pointsManager.CreateTransaction(ctx, requestedBy, types.PointsTxTypeConcealedEntryEnqueuing, -cost, pointsmanager.TxExtraField{
		Key:   "media",
		Value: ticket.ID(),
	})
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	return stacktrace.Propagate(ctx.Commit(), "")
}

func (e *Manager) pointsCostOfConcealedEntry(ctxCtx context.Context, user auth.User) (int, error) {
	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return 0, stacktrace.Propagate(err, "")
	}
	defer ctx.Commit() // read-only tx

	cost := 690
	subscribed, err := e.pointsManager.IsUserCurrentlySubscribed(ctx, user)
	if err != nil {
		return 0, stacktrace.Propagate(err, "")
	}
	if subscribed {
		cost = 404
	}
	return cost, nil
}

func (e *Manager) UserHasEnoughPointsToEnqueueConcealedEntry(ctxCtx context.Context, user auth.User) (bool, error) {
	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return false, stacktrace.Propagate(err, "")
	}
	defer ctx.Commit() // read-only tx

	balance, err := types.GetPointsBalanceForAddress(ctx, user.Address())
	if err != nil {
		return false, stacktrace.Propagate(err, "")
	}

	cost, err := e.pointsCostOfConcealedEntry(ctx, user)
	if err != nil {
		return false, stacktrace.Propagate(err, "")
	}

	return balance.Balance >= cost, nil
}

func (e *Manager) cleanupTicket(ticket EnqueueTicket) {
	e.requestsLock.Lock()
	defer e.requestsLock.Unlock()
	e.recentlyEvictedRequests.SetDefault(ticket.ID(), ticket)
	delete(e.requests, ticket.ID())

	numActive := len(e.requests)
	go e.statsClient.Gauge("active_enqueue_tickets", numActive)
}

type ticket struct {
	id                       string
	paid                     bool
	failedInsufficientPoints bool
	unskippable              bool
	concealed                bool
	forceAnonymous           bool
	requestedBy              auth.User
	createdAt                time.Time
	mediaInfo                media.Info
	paymentReceiver          payment.PaymentReceiver
	pricing                  pricer.EnqueuePricing
	statusChanged            event.NoArgEvent
	forceEnqueuing           *proto.ForcedTicketEnqueueType
}

func (t *ticket) Unskippable() bool {
	return t.unskippable
}

func (t *ticket) Concealed() bool {
	return t.concealed
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
	return t.paymentReceiver.Address()
}

func (t *ticket) SerializeForAPI() *proto.EnqueueMediaTicket {
	serialized := &proto.EnqueueMediaTicket{
		Id:             t.id,
		Status:         t.Status(),
		PaymentAddress: t.PaymentAddress(),
		EnqueuePrice:   t.pricing.EnqueuePrice.SerializeForAPI(),
		PlayNextPrice:  t.pricing.PlayNextPrice.SerializeForAPI(),
		PlayNowPrice:   t.pricing.PlayNowPrice.SerializeForAPI(),
		Expiration:     timestamppb.New(t.CreatedAt().Add(TicketExpiration)),
		Unskippable:    t.unskippable,
		Concealed:      t.concealed,
	}
	multicurrencyPaymentData := t.paymentReceiver.MulticurrencyPaymentData()
	for _, data := range multicurrencyPaymentData {
		protoData := &proto.ExtraCurrencyPaymentData{
			CurrencyTicker: string(data.Currency),
			SwapOrderId:    string(data.OrderID),
			PaymentAddress: string(data.PaymentAddress),
		}

		fields := []*string{&protoData.EnqueuePrice, &protoData.PlayNextPrice, &protoData.PlayNowPrice}
		for i := 0; i < len(fields) && i < len(data.ExpectedAmounts); i++ {
			if data.ExpectedAmounts[i].Cmp(big.NewInt(0)) > 0 {
				*fields[i] = data.ExpectedAmounts[i].SerializeForAPI()
			}
		}

		serialized.ExtraCurrencyPaymentData = append(serialized.ExtraCurrencyPaymentData, protoData)
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
	if t.failedInsufficientPoints {
		return stacktrace.NewError("ticket failed due to insufficient points")
	}
	t.paid = true
	t.statusChanged.Notify(true)
	return nil
}

func (t *ticket) SetFailedDueToInsufficientPoints() {
	if !t.failedInsufficientPoints {
		t.failedInsufficientPoints = true
		t.statusChanged.Notify(true)
	}
}

func (t *ticket) Status() proto.EnqueueMediaTicketStatus {
	switch {
	case t.failedInsufficientPoints:
		return proto.EnqueueMediaTicketStatus_FAILED_INSUFFICIENT_POINTS
	case t.paid:
		return proto.EnqueueMediaTicketStatus_PAID
	case time.Now().After(t.CreatedAt().Add(TicketExpiration)):
		return proto.EnqueueMediaTicketStatus_EXPIRED
	default:
		return proto.EnqueueMediaTicketStatus_ACTIVE
	}
}

func (t *ticket) StatusChanged() event.NoArgEvent {
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

func (t *ticket) worker(ctx context.Context, e *Manager) {
	defer e.cleanupTicket(t)

	expirationTimer := time.NewTimer(TicketExpiration)
	defer expirationTimer.Stop()

	actualExpirationTimer := time.NewTimer(TicketExpiration + 1*time.Minute)
	defer actualExpirationTimer.Stop()

	checkForcedEnqueuingTicker := time.NewTicker(5 * time.Second)
	defer checkForcedEnqueuingTicker.Stop()

	onPaymentReceived, onPaymentReceivedUnsub := t.paymentReceiver.PaymentReceived().Subscribe(event.BufferAll)
	defer onPaymentReceivedUnsub()

	onMulticurrencyPaymentDataAvailable, onMulticurrencyPaymentDataAvailableUnsub := t.paymentReceiver.MulticurrencyPaymentDataAvailable().Subscribe(event.BufferAll)
	defer onMulticurrencyPaymentDataAvailableUnsub()

	onStatusChanged, onStatusChangedUnsub := t.statusChanged.Subscribe(event.BufferFirst)
	defer onStatusChangedUnsub()

	lastSeenBalance := payment.NewAmount()
	lastSeenSenderAmount := payment.NewAmount()
	var lastSeenSenderCurrency nanswapclient.Ticker
	for {
		var err error
		select {
		case <-expirationTimer.C:
			t.statusChanged.Notify(false)
		case data := <-onMulticurrencyPaymentDataAvailable:
			t.statusChanged.Notify(false)
			for _, cData := range data {
				e.log.Printf("Ticket %s (p.a. %s) has Nanswap order ID %s for currency %s with payment address %s",
					t.ID(),
					t.PaymentAddress(),
					cData.OrderID,
					cData.Currency,
					cData.PaymentAddress)
			}
		case <-actualExpirationTimer.C:
			return
		case <-onStatusChanged:
			if t.paid || t.failedInsufficientPoints {
				return
			}
		case <-ctx.Done():
			return
		case paymentArgs := <-onPaymentReceived:
			if (t.requestedBy == nil || t.requestedBy.IsUnknown()) && !t.forceAnonymous {
				t.requestedBy = auth.NewAddressOnlyUser(paymentArgs.From)
			}
			lastSeenBalance = paymentArgs.Balance
			lastSeenSenderAmount = paymentArgs.SenderAmount
			lastSeenSenderCurrency = paymentArgs.SenderCurrency
			err = e.tryEnqueuingTicket(ctx, paymentArgs.Balance, paymentArgs.SenderAmount, paymentArgs.SenderCurrency, t)
		case <-checkForcedEnqueuingTicker.C:
			err = e.tryEnqueuingTicket(ctx, lastSeenBalance, lastSeenSenderAmount, lastSeenSenderCurrency, t)
		}
		if err != nil {
			e.log.Println(stacktrace.Propagate(err, "failed to enqueue ticket %s, now terminating ticket worker", t.id))
			return
		}
	}
}
