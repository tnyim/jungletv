package server

import (
	"context"
	"fmt"
	"log"
	"math/big"
	"net/http"
	"sync"
	"time"

	"github.com/hectorchu/gonano/rpc"
	"github.com/hectorchu/gonano/wallet"
	"github.com/palantir/stacktrace"
	"github.com/patrickmn/go-cache"
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
	hCaptchaSecret                 string
	hCaptchaHTTPClient             http.Client
	moderationStore                ModerationStore

	rewardsDistributed *event.Event

	recentlyDisconnectedSpectators *cache.Cache

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
	isDummy               bool // dummy spectators don't actually get rewarded but make the rest of the code happy
	legitimate            bool
	user                  User
	remoteAddress         string
	startedWatching       time.Time
	activityCheckTimer    *time.Timer
	nextActivityCheckTime time.Time
	onRewarded            *event.Event
	onDisconnected        *event.Event
	onActivityChallenge   *event.Event
	activityChallenge     *activityChallenge
	hardChallengesSolved  int
}

type recentlyDisconnectedSpectator struct {
	legitimate            bool
	user                  User
	remoteAddress         string
	startedWatching       time.Time
	nextActivityCheckTime time.Time
	activityChallengeAt   time.Time
	hardChallengesSolved  int
}

type activityChallenge struct {
	ChallengedAt time.Time
	ID           string
	Type         string
	Tolerance    time.Duration
}

func (s *spectator) OnRewarded() *event.Event {
	return s.onRewarded
}

func (s *spectator) OnActivityChallenge() *event.Event {
	return s.onActivityChallenge
}

// NewRewardsHandler creates a new RewardsHandler
func NewRewardsHandler(log *log.Logger,
	statsClient *statsd.Client,
	mediaQueue *MediaQueue,
	ipReputationChecker *IPAddressReputationChecker,
	hCaptchaSecret string,
	wallet *wallet.Wallet,
	collectorAccountQueue chan func(*wallet.Account, rpc.Client, rpc.Client),
	workGenerator *WorkGenerator,
	paymentAccountPendingWaitGroup *sync.WaitGroup,
	moderationStore ModerationStore) (*RewardsHandler, error) {
	return &RewardsHandler{
		log:                            log,
		statsClient:                    statsClient,
		mediaQueue:                     mediaQueue,
		ipReputationChecker:            ipReputationChecker,
		wallet:                         wallet,
		collectorAccountQueue:          collectorAccountQueue,
		workGenerator:                  workGenerator,
		paymentAccountPendingWaitGroup: paymentAccountPendingWaitGroup,
		hCaptchaSecret:                 hCaptchaSecret,
		hCaptchaHTTPClient: http.Client{
			Timeout: 10 * time.Second,
		},
		moderationStore: moderationStore,

		rewardsDistributed: event.New(),

		recentlyDisconnectedSpectators: cache.New(30*time.Second, 1*time.Minute),

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

	now := time.Now()
	remoteAddress := RemoteAddressFromContext(ctx)

	var s *spectator
	oldSpectatorIface, found := r.recentlyDisconnectedSpectators.Get(user.Address())
	if found {
		oldSpectator := oldSpectatorIface.(recentlyDisconnectedSpectator)
		if oldSpectator.remoteAddress == remoteAddress {
			s = &spectator{
				legitimate:            oldSpectator.legitimate,
				user:                  oldSpectator.user,
				remoteAddress:         oldSpectator.remoteAddress,
				startedWatching:       oldSpectator.startedWatching,
				nextActivityCheckTime: oldSpectator.nextActivityCheckTime,
				activityCheckTimer:    time.NewTimer(time.Until(oldSpectator.nextActivityCheckTime)),
				hardChallengesSolved:  oldSpectator.hardChallengesSolved,
			}
		}
	}

	if s == nil {
		d := durationUntilNextActivityChallenge(true)
		s = &spectator{
			legitimate:            true, // everyone starts in good standings
			user:                  user,
			remoteAddress:         remoteAddress,
			startedWatching:       now,
			nextActivityCheckTime: now.Add(d),
			activityCheckTimer:    time.NewTimer(d),
		}
	}
	s.onRewarded = event.New()
	s.onDisconnected = event.New()
	s.onActivityChallenge = event.New()

	r.spectatorsMutex.Lock()
	defer r.spectatorsMutex.Unlock()

	r.spectatorsByRemoteAddress[s.remoteAddress] = append(r.spectatorsByRemoteAddress[s.remoteAddress], s)
	r.spectatorsByRewardAddress[s.user.Address()] = append(r.spectatorsByRewardAddress[s.user.Address()], s)

	r.ipReputationChecker.EnqueueAddressForChecking(s.remoteAddress)

	r.log.Printf("Registered spectator with reward address %s and remote address %s", s.user.Address(), s.remoteAddress)
	go spectatorActivityWatchdog(s, r)
	return s, nil
}

func (r *RewardsHandler) UnregisterSpectator(ctx context.Context, sInterface Spectator) error {
	r.spectatorsMutex.Lock()
	defer r.spectatorsMutex.Unlock()

	// we know the type of Spectator, we just make it opaque to the consumers of RewardHandler to help prevent mistakes
	s := sInterface.(*spectator)
	if s.isDummy {
		return nil
	}

	removeSpectator := func(m map[string][]*spectator, key string) {
		slice := m[key]
		newSlice := []*spectator{}
		for i := range slice {
			if slice[i] != s {
				newSlice = append(newSlice, slice[i])
			}
		}
		if len(newSlice) > 0 {
			m[key] = newSlice
		} else {
			delete(m, key)
		}
	}

	s.onDisconnected.Notify()
	removeSpectator(r.spectatorsByRemoteAddress, s.remoteAddress)
	removeSpectator(r.spectatorsByRewardAddress, s.user.Address())
	if s.activityChallenge != nil {
		delete(r.spectatorByActivityChallenge, s.activityChallenge.ID)
	}

	activityChallengeInfo := ""
	if s.activityChallenge != nil {
		activityChallengeInfo = fmt.Sprintf(" (had activity challenge since %v)", s.activityChallenge.ChallengedAt)
	}
	r.log.Printf("Unregistered spectator with reward address %s and remote address %s%s", s.user.Address(), s.remoteAddress, activityChallengeInfo)

	challengeAt := time.Time{}
	if s.activityChallenge != nil {
		challengeAt = s.activityChallenge.ChallengedAt
	}
	r.recentlyDisconnectedSpectators.SetDefault(s.user.Address(), recentlyDisconnectedSpectator{
		legitimate:            s.legitimate,
		user:                  s.user,
		remoteAddress:         s.remoteAddress,
		startedWatching:       s.startedWatching,
		nextActivityCheckTime: s.nextActivityCheckTime,
		activityChallengeAt:   challengeAt,
		hardChallengesSolved:  s.hardChallengesSolved,
	})

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

func (r *RewardsHandler) RemoteAddressesForRewardAddress(ctx context.Context, rewardAddress string) []string {
	r.spectatorsMutex.RLock()
	defer r.spectatorsMutex.RUnlock()

	result := []string{}

	spectators := r.spectatorsByRewardAddress[rewardAddress]
	for _, s := range spectators {
		result = append(result, s.remoteAddress)
	}
	return result
}
