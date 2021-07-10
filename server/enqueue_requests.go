package server

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"math/big"
	"sync"
	"time"

	"github.com/DisgoOrg/disgohook/api"
	"github.com/hectorchu/gonano/wallet"
	"github.com/palantir/stacktrace"
	uuid "github.com/satori/go.uuid"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/utils/event"
	"google.golang.org/protobuf/types/known/timestamppb"
	"gopkg.in/alexcesaro/statsd.v2"
)

const TicketExpiration = 2 * time.Minute

// EnqueueManager manages requests for enqueuing that are pending payment
type EnqueueManager struct {
	statsClient                    *statsd.Client
	mediaQueue                     *MediaQueue
	wallet                         *wallet.Wallet
	paymentAccountPool             *PaymentAccountPool
	paymentAccountPendingWaitGroup *sync.WaitGroup
	statsHandler                   *StatsHandler
	collectorAccountAddress        string
	log                            *log.Logger
	moderationStore                ModerationStore
	modLogWebhook                  api.WebhookClient

	requests     map[string]EnqueueTicket
	requestsLock sync.RWMutex
}

// EnqueueRequest is a request to create an EnqueueTicket
type EnqueueRequest interface {
	RequestedBy() User
	Unskippable() bool
	MediaInfo() MediaInfo
}

// EnqueueTicket is a request to enqueue media that is pending payment
type EnqueueTicket interface {
	EnqueueRequest
	ID() string
	CreatedAt() time.Time
	RequestedBy() User
	PaymentAccount() *wallet.Account
	SerializeForAPI() *proto.EnqueueMediaTicket
	RequestPricing() EnqueuePricing
	SetPaid() error
	Status() proto.EnqueueMediaTicketStatus
	StatusChanged() *event.Event
	ForceEnqueuing(proto.ForcedTicketEnqueueType)
	EnqueuingForced() (bool, proto.ForcedTicketEnqueueType)
}

// NewEnqueueManager returns a new EnqueueManager
func NewEnqueueManager(log *log.Logger,
	statsClient *statsd.Client,
	mediaQueue *MediaQueue,
	wallet *wallet.Wallet,
	paymentAccountPool *PaymentAccountPool,
	paymentAccountPendingWaitGroup *sync.WaitGroup,
	statsHandler *StatsHandler,
	collectorAccountAddress string,
	moderationStore ModerationStore,
	modLogWebhook api.WebhookClient) (*EnqueueManager, error) {
	return &EnqueueManager{
		log:                            log,
		statsClient:                    statsClient,
		mediaQueue:                     mediaQueue,
		wallet:                         wallet,
		paymentAccountPool:             paymentAccountPool,
		paymentAccountPendingWaitGroup: paymentAccountPendingWaitGroup,
		statsHandler:                   statsHandler,
		collectorAccountAddress:        collectorAccountAddress,
		requests:                       make(map[string]EnqueueTicket),
		moderationStore:                moderationStore,
		modLogWebhook:                  modLogWebhook,
	}, nil
}

func (e *EnqueueManager) RegisterRequest(ctx context.Context, request EnqueueRequest) (EnqueueTicket, error) {
	var err error
	var paymentAccount *wallet.Account
	for {
		paymentAccount, err = e.paymentAccountPool.RequestAccount()
		if err != nil {
			return nil, stacktrace.Propagate(err, "")
		}

		// avoid using an address which still has leftover balance
		// (e.g. because someone sent banano too late and their ticket had already expired)
		// also has the benefit of checking the liveliness of the RPC server before letting people proceed to payment
		balance, pending, err := paymentAccount.Balance()
		if err != nil {
			return nil, stacktrace.Propagate(err, "failed to check balance for account %v", paymentAccount.Address())
		}
		balance.Add(balance, pending)

		if balance.Cmp(big.NewInt(0)) == 0 {
			break
		}
		e.modLogWebhook.SendContent(fmt.Sprintf(
			"Address %v has unhandled balance! (gbl08ma will issue a refund)\n"+
				"Most likely, someone sent money to this address after their payment ticket had already expired.\n"+
				"This address has been removed from the payment account pool for the time being.",
			paymentAccount.Address()))
	}

	t := &ticket{
		id:            uuid.NewV4().String(),
		createdAt:     time.Now(),
		requestedBy:   request.RequestedBy(),
		mediaInfo:     request.MediaInfo(),
		unskippable:   request.Unskippable(),
		pricing:       ComputeEnqueuePricing(e.mediaQueue, e.statsHandler.CurrentlyWatching(ctx), request.MediaInfo().Length(), request.Unskippable()),
		account:       paymentAccount,
		statusChanged: event.New(),
	}
	go func() {
		<-time.NewTimer(TicketExpiration).C
		t.statusChanged.Notify()
	}()

	e.log.Printf("Registered ticket %s with payment account %s", t.id, t.account.Address())

	e.requestsLock.Lock()
	defer e.requestsLock.Unlock()
	e.requests[t.ID()] = t
	return t, nil
}

func (e *EnqueueManager) ProcessPayments(ctx context.Context) error {
	// create a copy of the map so we don't hold the lock for so long
	requestCopy := make(map[string]EnqueueTicket)
	func() {
		e.requestsLock.RLock()
		defer e.requestsLock.RUnlock()
		for k, v := range e.requests {
			requestCopy[k] = v
		}
	}()

	go e.statsClient.Gauge("active_enqueue_tickets", len(requestCopy))

	if len(requestCopy) == 0 {
		return nil
	}

	for reqID, request := range requestCopy {
		err := e.processPaymentForTicket(ctx, reqID, request)
		if err != nil {
			return stacktrace.Propagate(err, "")
		}
	}

	return nil
}

func (e *EnqueueManager) processPaymentForTicket(ctx context.Context, reqID string, request EnqueueTicket) error {
	if request.Status() == proto.EnqueueMediaTicketStatus_PAID {
		return nil
	}
	if time.Now().After(request.CreatedAt().Add(TicketExpiration).Add(1 * time.Minute)) {
		func() {
			e.requestsLock.Lock()
			defer e.requestsLock.Unlock()
			delete(e.requests, reqID)
		}()
		e.paymentAccountPool.ReturnAccount(request.PaymentAccount())
		e.log.Printf("Purged ticket %s with payment address %s", reqID, request.PaymentAccount().Address())
		return nil
	}
	t := e.statsClient.NewTiming()
	defer t.Send("check_enqueue_ticket")

	balance, pending, err := request.PaymentAccount().Balance()
	if err != nil {
		return stacktrace.Propagate(err, "failed to check balance for account %v", request.PaymentAccount().Address())
	}
	balance.Add(balance, pending)

	pricing := request.RequestPricing()
	forceEnqueuing, forcedEnqueuingType := request.EnqueuingForced()

	var playFn func(MediaQueueEntry)
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
	e.log.Printf("Ticket %s meets requirements for enqueuing", reqID)

	t2 := e.statsClient.NewTiming()
	defer t2.Send("enqueue_ticket")

	requestedBy := request.RequestedBy()
	if requestedBy.IsUnknown() && balance.Cmp(big.NewInt(0)) > 0 {
		// requested by unauthenticated user, set the user to be who paid

		// we must receive pendings otherwise the history might not contain the latest tx
		err := request.PaymentAccount().ReceivePendings()
		if err != nil {
			e.log.Printf("failed to receive pendings in account %v: %v", request.PaymentAccount().Address(), err)
			return nil
		}

		requestedBy, err = e.findUserWhoPaid(request.PaymentAccount())
		if err != nil {
			return stacktrace.Propagate(err, "")
		}
	}

	// user can still be nil here, in case we couldn't find it in the last 10 account blocks
	mi := request.MediaInfo()
	e.paymentAccountPendingWaitGroup.Add(1)
	playFn(mi.ProduceMediaQueueEntry(requestedBy, Amount{balance}, request.Unskippable(), request.ID()))

	err = request.SetPaid()
	if err != nil {
		return stacktrace.Propagate(err, "failed to set ticket %v as paid", request.ID())
	}

	requestedByStr := "unknown"
	if requestedBy != nil {
		requestedByStr = requestedBy.Address()

		if banned, err := e.moderationStore.LoadPaymentAddressBannedFromVideoEnqueuing(ctx, requestedByStr); err == nil && banned {
			return nil
		}
	}

	e.log.Printf("Enqueued ticket %s - video \"%s\" with length %s - requested by %s with cost %s",
		reqID,
		mi.Title(),
		mi.Length().String(),
		requestedByStr,
		balance.String())

	e.requestsLock.Lock()
	defer e.requestsLock.Unlock()
	delete(e.requests, reqID)

	go func(reqID string, request EnqueueTicket) {
		t := e.statsClient.NewTiming()
		defer t.Send("enqueue_ticket_final_operations")

		retry := 0
		for ; retry < 3; retry++ {
			err := request.PaymentAccount().ReceivePendings()
			if err != nil {
				e.log.Printf("failed to receive pendings in account %v: %v", request.PaymentAccount().Address(), err)
				time.Sleep(1 * time.Second)
				continue
			}
			if balance.Cmp(big.NewInt(0)) > 0 {
				_, err = request.PaymentAccount().Send(e.collectorAccountAddress, balance)
				if err != nil {
					e.log.Printf("failed to send balance in account %v to the collector account: %v", request.PaymentAccount().Address(), err)
					time.Sleep(1 * time.Second)
					continue
				}
			}
			break
		}
		e.paymentAccountPendingWaitGroup.Done()

		if retry < 3 {
			// only reuse the account if no funds got stuck there
			e.paymentAccountPool.ReturnAccount(request.PaymentAccount())
		}
	}(reqID, request)
	return nil
}

func (e *EnqueueManager) findUserWhoPaid(account *wallet.Account) (User, error) {
	var user User
	history, _, err := e.wallet.RPC.AccountHistory(account.Address(), 10, nil)
	if err != nil {
		if _, ok := err.(*json.UnmarshalTypeError); ok {
			// account has no history. When this happens the node returns history: "" (which is not an empty array) which causes this error
			return nil, nil
		}
		return nil, stacktrace.Propagate(err, "failed to retrieve history for account %v", account.Address())
	}
	for _, historyEntry := range history {
		if historyEntry.Type == "receive" {
			user = NewAddressOnlyUser(historyEntry.Account)
			break
		}
	}
	return user, nil
}

func (e *EnqueueManager) ProcessPaymentsWorker(ctx context.Context, interval time.Duration) error {
	t := time.NewTicker(interval)
	for {
		select {
		case <-t.C:
			err := e.ProcessPayments(ctx)
			if err != nil {
				return stacktrace.Propagate(err, "")
			}
		case <-ctx.Done():
			return nil
		}
	}
}

func (e *EnqueueManager) GetTicket(id string) EnqueueTicket {
	e.requestsLock.RLock()
	defer e.requestsLock.RUnlock()
	return e.requests[id]
}

type ticket struct {
	id             string
	paid           bool
	unskippable    bool
	requestedBy    User
	createdAt      time.Time
	mediaInfo      MediaInfo
	account        *wallet.Account
	pricing        EnqueuePricing
	statusChanged  *event.Event
	forceEnqueuing *proto.ForcedTicketEnqueueType
}

func (t *ticket) Unskippable() bool {
	return t.unskippable
}

func (t *ticket) MediaInfo() MediaInfo {
	return t.mediaInfo
}

func (t *ticket) ID() string {
	return t.id
}

func (t *ticket) CreatedAt() time.Time {
	return t.createdAt
}

func (t *ticket) RequestedBy() User {
	return t.requestedBy
}

func (t *ticket) PaymentAccount() *wallet.Account {
	return t.account
}

func (t *ticket) SerializeForAPI() *proto.EnqueueMediaTicket {
	serialized := &proto.EnqueueMediaTicket{
		Id:             t.id,
		Status:         t.Status(),
		PaymentAddress: t.account.Address(),
		EnqueuePrice:   t.pricing.EnqueuePrice.SerializeForAPI(),
		PlayNextPrice:  t.pricing.PlayNextPrice.SerializeForAPI(),
		PlayNowPrice:   t.pricing.PlayNowPrice.SerializeForAPI(),
		Expiration:     timestamppb.New(t.CreatedAt().Add(TicketExpiration)),
		Unskippable:    t.unskippable,
	}
	t.mediaInfo.FillAPITicketMediaInfo(serialized)
	return serialized
}

func (t *ticket) RequestPricing() EnqueuePricing {
	return t.pricing
}

func (t *ticket) SetPaid() error {
	if t.paid {
		return stacktrace.NewError("ticket already paid")
	}
	t.paid = true
	t.statusChanged.Notify()
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

func (t *ticket) StatusChanged() *event.Event {
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
