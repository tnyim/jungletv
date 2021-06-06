package server

import (
	"context"
	"log"
	"math/big"
	"math/rand"
	"sync"
	"time"

	"github.com/hectorchu/gonano/wallet"
	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/utils/event"
)

// RewardsHandler handles reward distribution among spectators
type RewardsHandler struct {
	log                            *log.Logger
	mediaQueue                     *MediaQueue
	wallet                         *wallet.Wallet
	collectorAccountQueue          chan func(*wallet.Account)
	paymentAccountPendingWaitGroup *sync.WaitGroup
	lastMedia                      MediaQueueEntry

	// spectatorsByRemoteAddress maps a remote address to a set of spectators
	spectatorsByRemoteAddress map[string][]*spectator
	// spectatorsByRewardAddress maps a reward address to a set of spectators
	spectatorsByRewardAddress map[string][]*spectator
	spectatorsMutex           sync.RWMutex
}

type Spectator interface {
	OnRewarded() *event.Event
}

type spectator struct {
	user            User
	remoteAddress   string
	startedWatching time.Time
	onRewarded      *event.Event
}

func (s *spectator) OnRewarded() *event.Event {
	return s.onRewarded
}

// NewRewardsHandler creates a new RewardsHandler
func NewRewardsHandler(log *log.Logger, mediaQueue *MediaQueue, wallet *wallet.Wallet, collectorAccountQueue chan func(*wallet.Account), paymentAccountPendingWaitGroup *sync.WaitGroup) (*RewardsHandler, error) {
	return &RewardsHandler{
		log:                            log,
		mediaQueue:                     mediaQueue,
		wallet:                         wallet,
		collectorAccountQueue:          collectorAccountQueue,
		paymentAccountPendingWaitGroup: paymentAccountPendingWaitGroup,

		spectatorsByRemoteAddress: make(map[string][]*spectator),
		spectatorsByRewardAddress: make(map[string][]*spectator),
	}, nil
}

func (r *RewardsHandler) RegisterSpectator(ctx context.Context, user User) (Spectator, error) {
	spectator := &spectator{
		user:            user,
		remoteAddress:   RemoteAddressFromContext(ctx),
		startedWatching: time.Now(),
		onRewarded:      event.New(),
	}

	r.spectatorsMutex.Lock()
	defer r.spectatorsMutex.Unlock()

	r.spectatorsByRemoteAddress[spectator.remoteAddress] = append(r.spectatorsByRemoteAddress[spectator.remoteAddress], spectator)
	r.spectatorsByRewardAddress[spectator.user.Address()] = append(r.spectatorsByRewardAddress[spectator.user.Address()], spectator)

	r.log.Printf("Registered spectator with reward address %s and remote address %s", spectator.user.Address(), spectator.remoteAddress)

	return spectator, nil
}

func (r *RewardsHandler) UnregisterSpectator(ctx context.Context, sInterface Spectator) error {
	r.spectatorsMutex.Lock()
	defer r.spectatorsMutex.Unlock()

	// we know the type of Spectator, we just make it opaque to the consumers of RewardHandler to help prevent mistakes
	s := sInterface.(*spectator)

	removeSpectator := func(m map[string][]*spectator) {
		slice := m[s.remoteAddress]
		newSlice := []*spectator{}
		for i := range slice {
			if slice[i] != s {
				newSlice = append(newSlice, slice[i])
			}
		}
		if len(newSlice) > 0 {
			m[s.remoteAddress] = newSlice
		} else {
			delete(m, s.remoteAddress)
		}
	}

	removeSpectator(r.spectatorsByRemoteAddress)
	removeSpectator(r.spectatorsByRewardAddress)

	r.log.Printf("Unregistered spectator with reward address %s and remote address %s", s.user.Address(), s.remoteAddress)

	return nil
}

func (r *RewardsHandler) Worker(ctx context.Context) error {
	onMediaChanged := r.mediaQueue.mediaChanged.Subscribe(event.AtLeastOnceGuarantee)
	onEntryRemoved := r.mediaQueue.deepEntryRemoved.Subscribe(event.AtLeastOnceGuarantee)
	// the rewards handler might be starting at a time when there are things already playing,
	// in that case we need to update lastMedia
	entries := r.mediaQueue.Entries()
	if len(entries) > 0 {
		r.lastMedia = entries[0]
	}
	for {
		select {
		case v := <-onMediaChanged:
			var err error
			if v[0] == nil {
				err = r.onMediaChanged(ctx, nil)
			} else {
				err = r.onMediaChanged(ctx, v[0].(MediaQueueEntry))
			}
			if err != nil {
				return stacktrace.Propagate(err, "")
			}
		case v := <-onEntryRemoved:
			err := r.onMediaRemoved(ctx, v[0].(MediaQueueEntry))
			if err != nil {
				return stacktrace.Propagate(err, "")
			}
		case <-ctx.Done():
			return nil
		}
	}
}

func (r *RewardsHandler) onMediaChanged(ctx context.Context, newMedia MediaQueueEntry) error {
	if newMedia == r.lastMedia {
		return nil
	}
	defer func() { r.lastMedia = newMedia }()
	if r.lastMedia == nil {
		return nil
	}

	return stacktrace.Propagate(r.rewardUsers(ctx, r.lastMedia), "")
}

func (r *RewardsHandler) onMediaRemoved(ctx context.Context, removed MediaQueueEntry) error {
	r.log.Printf("Media with ID %s removed from queue", removed.QueueID())
	if removed.RequestCost().Cmp(big.NewInt(0)) == 0 {
		r.log.Println("Request cost was 0, nothing to reimburse")
		return nil
	}
	if removed.RequestedBy().IsUnknown() {
		return nil
	}
	// reimburse who added to queue
	go r.reimburseRequester(ctx, removed.RequestedBy().Address(), removed.RequestCost())
	return nil
}

func (r *RewardsHandler) rewardUsers(ctx context.Context, media MediaQueueEntry) error {
	r.spectatorsMutex.RLock()
	defer r.spectatorsMutex.RUnlock()

	r.log.Printf("Rewarding users for \"%s\"", media.MediaInfo().Title())

	if media.RequestCost().Cmp(big.NewInt(0)) == 0 {
		r.log.Println("Request cost was 0, nothing to reward")
		return nil
	}

	eligible := getEligibleSpectators(r.spectatorsByRemoteAddress, media.RequestedBy().Address())
	if len(eligible) == 0 {
		if media.RequestedBy().IsUnknown() {
			return nil
		}
		// reimburse who added to queue
		go r.reimburseRequester(ctx, media.RequestedBy().Address(), media.RequestCost())
		return nil
	}

	amountForEach := ComputeReward(media.RequestCost(), len(eligible))
	if amountForEach.Int.Cmp(big.NewInt(0)) <= 0 {
		r.log.Printf("Not rewarding because the amount for each user would be zero")
		return nil
	}

	go r.rewardEligible(ctx, eligible, media.RequestCost(), amountForEach)
	return nil
}

func getEligibleSpectators(spectatorsByRemoteAddress map[string][]*spectator, exceptAddress string) map[string]*spectator {
	// maps addresses to spectators
	toBeRewarded := make(map[string]*spectator)

	for k := range spectatorsByRemoteAddress {
		spectators := spectatorsByRemoteAddress[k]
		if len(spectators) == 0 {
			continue
		}
		// pick a random spectator to reward within this remote address
		rand.Shuffle(len(spectators), func(i, j int) {
			spectators[i], spectators[j] = spectators[j], spectators[i]
		})
		for j := range spectators {
			// do not reward an address that would have received a reward via another remote address already
			if _, present := toBeRewarded[spectators[j].user.Address()]; !present {
				toBeRewarded[spectators[j].user.Address()] = spectators[j]
				break
			}
		}
	}
	delete(toBeRewarded, exceptAddress)
	return toBeRewarded
}

func (r *RewardsHandler) receiveCollectorPending(minExpectedBalance Amount) {
	done := make(chan struct{})
	r.collectorAccountQueue <- func(collectorAccount *wallet.Account) {
		defer func() { done <- struct{}{} }()
		balance, pending, err := collectorAccount.Balance()
		if err != nil {
			r.log.Printf("Error checking balance of collector account: %v", err)
			return
		}
		balance.Add(balance, pending)

		if balance.Cmp(minExpectedBalance.Int) < 0 {
			// this should happen very rarely (mostly when a very short video just played)
			// we are probably yet to send money from the payment accounts to the collector account
			// wait for those goroutines to finish
			r.log.Println("Waiting for payment accounts to send their balance to the collector account")
			r.paymentAccountPendingWaitGroup.Wait()
			r.log.Println("Payment accounts done sending their balance to the collector account")
		}

		err = collectorAccount.ReceivePendings()
		if err != nil {
			r.log.Printf("Error receiving pendings on collector account: %v", err)
		}
	}
	<-done
}

func (r *RewardsHandler) rewardEligible(ctx context.Context, eligible map[string]*spectator, requestCost Amount, amountForEach Amount) {
	r.receiveCollectorPending(requestCost)

	for k := range eligible {
		spectator := eligible[k]
		sendFn := func(collectorAccount *wallet.Account) {
			blockHash, err := collectorAccount.Send(spectator.user.Address(), amountForEach.Int)
			if err != nil {
				r.log.Printf("Error rewarding %s with %v: %v", spectator.user.Address(), amountForEach, err)
			} else {
				r.log.Printf("Rewarded %s with %v, block hash %s", spectator.user.Address(), amountForEach, blockHash.String())
				spectator.onRewarded.Notify(amountForEach)
			}
		}
		select {
		case r.collectorAccountQueue <- sendFn:
			continue
		case <-ctx.Done():
			return
		}
	}
}

func (r *RewardsHandler) reimburseRequester(ctx context.Context, address string, amount Amount) {
	r.receiveCollectorPending(amount)

	if ctx.Err() != nil {
		return
	}

	r.collectorAccountQueue <- func(collectorAccount *wallet.Account) {
		blockHash, err := collectorAccount.Send(address, amount.Int)
		if err != nil {
			r.log.Printf("Error reimbursing %s with %v: %v", address, amount.Int, err)
		} else {
			r.log.Printf("Reimbursed %s with %v, block hash %s", address, amount.Int, blockHash.String())
		}
	}
}

func init() {
	rand.Seed(time.Now().UnixNano())
}
