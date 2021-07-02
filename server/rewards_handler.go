package server

import (
	"context"
	"log"
	"math/big"
	"sync"
	"time"

	"github.com/hectorchu/gonano/rpc"
	"github.com/hectorchu/gonano/wallet"
	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/utils/event"
	"gopkg.in/alexcesaro/statsd.v2"
)

// RewardsHandler handles reward distribution among spectators
type RewardsHandler struct {
	log                            *log.Logger
	statsClient                    *statsd.Client
	mediaQueue                     *MediaQueue
	ipReputationChecker            *IPAddressReputationChecker
	wallet                         *wallet.Wallet
	collectorAccountQueue          chan func(*wallet.Account, rpc.Client, rpc.Client)
	workGenerator                  *WorkGenerator
	paymentAccountPendingWaitGroup *sync.WaitGroup
	lastMedia                      MediaQueueEntry

	rewardsDistributed *event.Event

	// spectatorsByRemoteAddress maps a remote address to a set of spectators
	spectatorsByRemoteAddress map[string][]*spectator
	// spectatorsByRewardAddress maps a reward address to a set of spectators
	spectatorsByRewardAddress map[string][]*spectator
	// spectatorByActivityChallenge maps an activity challenge to a spectator
	spectatorByActivityChallenge map[string]*spectator
	spectatorsMutex              sync.RWMutex
}

type Spectator interface {
	OnRewarded() *event.Event
	OnActivityChallenge() *event.Event
}

type spectator struct {
	isDummy             bool // dummy spectators don't actually get rewarded but make the rest of the code happy
	user                User
	remoteAddress       string
	startedWatching     time.Time
	lastActive          time.Time
	activityCheckTimer  *time.Timer
	onRewarded          *event.Event
	onDisconnected      *event.Event
	onActivityChallenge *event.Event
	activityChallengeAt time.Time
	activityChallenge   string
}

func (s *spectator) OnRewarded() *event.Event {
	return s.onRewarded
}

func (s *spectator) OnActivityChallenge() *event.Event {
	return s.onActivityChallenge
}

// NewRewardsHandler creates a new RewardsHandler
func NewRewardsHandler(log *log.Logger, statsClient *statsd.Client, mediaQueue *MediaQueue, ipReputationChecker *IPAddressReputationChecker, wallet *wallet.Wallet, collectorAccountQueue chan func(*wallet.Account, rpc.Client, rpc.Client), workGenerator *WorkGenerator, paymentAccountPendingWaitGroup *sync.WaitGroup) (*RewardsHandler, error) {
	return &RewardsHandler{
		log:                            log,
		statsClient:                    statsClient,
		mediaQueue:                     mediaQueue,
		ipReputationChecker:            ipReputationChecker,
		wallet:                         wallet,
		collectorAccountQueue:          collectorAccountQueue,
		workGenerator:                  workGenerator,
		paymentAccountPendingWaitGroup: paymentAccountPendingWaitGroup,

		rewardsDistributed: event.New(),

		spectatorsByRemoteAddress:    make(map[string][]*spectator),
		spectatorsByRewardAddress:    make(map[string][]*spectator),
		spectatorByActivityChallenge: make(map[string]*spectator),
	}, nil
}

func (r *RewardsHandler) RegisterSpectator(ctx context.Context, user User) (Spectator, error) {
	ipCountry := IPCountryFromContext(ctx)
	if ipCountry == "T1" {
		return &spectator{
			isDummy:             true,
			onRewarded:          event.New(),
			onActivityChallenge: event.New(),
		}, nil
	}

	spectator := &spectator{
		user:                user,
		remoteAddress:       RemoteAddressFromContext(ctx),
		startedWatching:     time.Now(),
		onRewarded:          event.New(),
		onDisconnected:      event.New(),
		onActivityChallenge: event.New(),
	}
	spectator.lastActive = time.Now() // TODO unless this is an automatic reconnect, in which case it shouldn't count
	spectator.activityCheckTimer = time.NewTimer(durationUntilNextActivityChallenge())

	r.spectatorsMutex.Lock()
	defer r.spectatorsMutex.Unlock()

	r.spectatorsByRemoteAddress[spectator.remoteAddress] = append(r.spectatorsByRemoteAddress[spectator.remoteAddress], spectator)
	r.spectatorsByRewardAddress[spectator.user.Address()] = append(r.spectatorsByRewardAddress[spectator.user.Address()], spectator)

	r.ipReputationChecker.EnqueueAddressForChecking(spectator.remoteAddress)

	r.log.Printf("Registered spectator with reward address %s and remote address %s", spectator.user.Address(), spectator.remoteAddress)
	go spectatorActivityWatchdog(spectator, r)
	return spectator, nil
}

func (r *RewardsHandler) UnregisterSpectator(ctx context.Context, sInterface Spectator) error {
	r.spectatorsMutex.Lock()
	defer r.spectatorsMutex.Unlock()

	// we know the type of Spectator, we just make it opaque to the consumers of RewardHandler to help prevent mistakes
	s := sInterface.(*spectator)
	if s.isDummy {
		return nil
	}

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

	s.onDisconnected.Notify()
	removeSpectator(r.spectatorsByRemoteAddress)
	removeSpectator(r.spectatorsByRewardAddress)
	if s.activityChallenge != "" {
		delete(r.spectatorByActivityChallenge, s.activityChallenge)
	}

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
