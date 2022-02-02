package server

import (
	"context"
	"fmt"
	"log"
	"math/big"
	"net/http"
	"sync"
	"time"

	movingaverage "github.com/RobinUS2/golang-moving-average"
	"github.com/hectorchu/gonano/rpc"
	"github.com/hectorchu/gonano/wallet"
	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/server/auth"
	"github.com/tnyim/jungletv/server/components/ipreputation"
	authinterceptor "github.com/tnyim/jungletv/server/interceptors/auth"
	"github.com/tnyim/jungletv/server/stores/moderation"
	"github.com/tnyim/jungletv/types"
	"github.com/tnyim/jungletv/utils"
	"github.com/tnyim/jungletv/utils/event"
	"google.golang.org/protobuf/types/known/timestamppb"
	"gopkg.in/alexcesaro/statsd.v2"
)

type captchaResponseCheckFn func(context.Context, string) (bool, error)

// RewardsHandler handles reward distribution among spectators
type RewardsHandler struct {
	log                            *log.Logger
	statsClient                    *statsd.Client
	mediaQueue                     *MediaQueue
	ipReputationChecker            *ipreputation.Checker
	withdrawalHandler              *WithdrawalHandler
	wallet                         *wallet.Wallet
	collectorAccountQueue          chan func(*wallet.Account, *rpc.Client, *rpc.Client)
	skipManager                    *SkipManager
	paymentAccountPendingWaitGroup *sync.WaitGroup
	lastMedia                      MediaQueueEntry
	hCaptchaSecret                 string
	hCaptchaHTTPClient             http.Client
	moderationStore                moderation.Store
	eligibleMovingAverage          *movingaverage.MovingAverage
	segchaCheckFn                  captchaResponseCheckFn
	versionHash                    string

	rewardsDistributed *event.Event

	// spectatorsByRemoteAddress maps a remote address to a set of spectators
	spectatorsByRemoteAddress map[string][]*spectator
	// spectatorsByRewardAddress maps a reward address to a spectator
	spectatorsByRewardAddress map[string]*spectator
	// spectatorByActivityChallenge maps an activity challenge to a spectator
	spectatorByActivityChallenge map[string]*spectator
	spectatorsMutex              sync.RWMutex
}

type Spectator interface {
	OnRewarded() *event.Event
	OnWithdrew() *event.Event
	OnChatMentioned() *event.Event
	OnActivityChallenge() *event.Event
	CurrentActivityChallenge() *activityChallenge
	Legitimate() (bool, time.Time)
	RemoteAddressCanReceiveRewards(*ipreputation.Checker) bool
	CountOtherConnectedSpectatorsOnSameRemoteAddress(*RewardsHandler) int
	WatchingSince() time.Time
	StoppedWatching() (bool, time.Time)
	ConnectionCount() int
}

type spectator struct {
	isDummy                    bool // dummy spectators don't actually get rewarded but make the rest of the code happy
	legitimate                 bool
	legitimacyFailures         int
	stoppedBeingLegitimate     time.Time
	user                       auth.User
	remoteAddress              string
	remoteAddresses            map[string]struct{}
	startedWatching            time.Time
	stoppedWatching            time.Time
	activityCheckTimer         *time.Timer
	nextActivityCheckTime      time.Time
	onRewarded                 *event.Event
	onWithdrew                 *event.Event
	onDisconnected             *event.Event
	onReconnected              *event.Event
	onChatMentioned            *event.Event
	onActivityChallenge        *event.Event
	activityChallenge          *activityChallenge
	lastHardChallengeSolvedAt  time.Time
	connectionCount            int
	noToleranceOnNextChallenge bool
}

type activityChallenge struct {
	ChallengedAt time.Time
	ID           string
	Type         string
	Tolerance    time.Duration
}

func (a *activityChallenge) SerializeForAPI() *proto.ActivityChallenge {
	return &proto.ActivityChallenge{
		Id:           a.ID,
		Type:         a.Type,
		ChallengedAt: timestamppb.New(a.ChallengedAt),
	}
}

func (s *spectator) OnRewarded() *event.Event {
	return s.onRewarded
}

func (s *spectator) OnWithdrew() *event.Event {
	return s.onWithdrew
}

func (s *spectator) OnChatMentioned() *event.Event {
	return s.onChatMentioned
}

func (s *spectator) OnActivityChallenge() *event.Event {
	return s.onActivityChallenge
}

func (s *spectator) CurrentActivityChallenge() *activityChallenge {
	return s.activityChallenge
}

func (s *spectator) Legitimate() (bool, time.Time) {
	return s.legitimate, s.stoppedBeingLegitimate
}

func (s *spectator) RemoteAddressCanReceiveRewards(checker *ipreputation.Checker) bool {
	return checker.CanReceiveRewards(s.remoteAddress)
}

func (s *spectator) CountOtherConnectedSpectatorsOnSameRemoteAddress(r *RewardsHandler) int {
	c := r.CountConnectedSpectatorsOnRemoteAddress(s.remoteAddress)
	if c == 0 {
		return c
	}
	return c - 1
}

func (s *spectator) WatchingSince() time.Time {
	return s.startedWatching
}

func (s *spectator) StoppedWatching() (bool, time.Time) {
	return !s.stoppedWatching.IsZero(), s.stoppedWatching
}

func (s *spectator) ConnectionCount() int {
	return s.connectionCount
}

// NewRewardsHandler creates a new RewardsHandler
func NewRewardsHandler(log *log.Logger,
	statsClient *statsd.Client,
	mediaQueue *MediaQueue,
	ipReputationChecker *ipreputation.Checker,
	withdrawalHandler *WithdrawalHandler,
	hCaptchaSecret string,
	wallet *wallet.Wallet,
	collectorAccountQueue chan func(*wallet.Account, *rpc.Client, *rpc.Client),
	skipManager *SkipManager,
	paymentAccountPendingWaitGroup *sync.WaitGroup,
	moderationStore moderation.Store,
	segchaCheckFn captchaResponseCheckFn,
	versionHash string) (*RewardsHandler, error) {
	return &RewardsHandler{
		log:                            log,
		statsClient:                    statsClient,
		mediaQueue:                     mediaQueue,
		ipReputationChecker:            ipReputationChecker,
		withdrawalHandler:              withdrawalHandler,
		wallet:                         wallet,
		collectorAccountQueue:          collectorAccountQueue,
		skipManager:                    skipManager,
		paymentAccountPendingWaitGroup: paymentAccountPendingWaitGroup,
		hCaptchaSecret:                 hCaptchaSecret,
		hCaptchaHTTPClient: http.Client{
			Timeout: 10 * time.Second,
		},
		moderationStore:       moderationStore,
		eligibleMovingAverage: movingaverage.New(3),
		segchaCheckFn:         segchaCheckFn,

		rewardsDistributed: event.New(),

		spectatorsByRemoteAddress:    make(map[string][]*spectator),
		spectatorsByRewardAddress:    make(map[string]*spectator),
		spectatorByActivityChallenge: make(map[string]*spectator),

		versionHash: versionHash,
	}, nil
}

func (r *RewardsHandler) RegisterSpectator(ctx context.Context, user auth.User) (Spectator, error) {
	ipCountry := authinterceptor.IPCountryFromContext(ctx)
	if ipCountry == "T1" {
		return &spectator{
			isDummy:             true,
			onRewarded:          event.New(),
			onWithdrew:          event.New(),
			onChatMentioned:     event.New(),
			onActivityChallenge: event.New(),
		}, nil
	}

	now := time.Now()
	remoteAddress := authinterceptor.RemoteAddressFromContext(ctx)

	r.spectatorsMutex.Lock()
	defer r.spectatorsMutex.Unlock()

	s, found := r.spectatorsByRewardAddress[user.Address()]
	if found {
		// refresh user (e.g. to update permission level)
		s.user = user
		s.stoppedWatching = time.Time{}
		if s.remoteAddress != remoteAddress {
			// changing IPs makes one lose human verification status
			d := durationUntilNextActivityChallenge(user, true)
			s.nextActivityCheckTime = now.Add(d)
			s.activityCheckTimer = time.NewTimer(d)
			s.lastHardChallengeSolvedAt = time.Time{}
			s.noToleranceOnNextChallenge = true
			s.remoteAddresses[remoteAddress] = struct{}{}
		}
		s.onReconnected.Notify()
	} else {
		d := durationUntilNextActivityChallenge(user, true)
		s = &spectator{
			legitimate:            true, // everyone starts in good standings
			user:                  user,
			remoteAddress:         remoteAddress,
			startedWatching:       now,
			nextActivityCheckTime: now.Add(d),
			activityCheckTimer:    time.NewTimer(d),
			onRewarded:            event.New(),
			onWithdrew:            event.New(),
			onChatMentioned:       event.New(),
			onDisconnected:        event.New(),
			onReconnected:         event.New(),
			onActivityChallenge:   event.New(),
			remoteAddresses: map[string]struct{}{
				remoteAddress: {},
			},
		}
		r.spectatorsByRemoteAddress[s.remoteAddress] = append(r.spectatorsByRemoteAddress[s.remoteAddress], s)
		r.spectatorsByRewardAddress[s.user.Address()] = s
	}
	s.connectionCount++

	r.ipReputationChecker.EnqueueAddressForChecking(s.remoteAddress)

	reconnectingStr := ""
	if found {
		reconnectingStr = "-re"
		// we must fire this event again since the timer may have been consumed by spectatorActivityWatchdog on another/a previous connection
		if s.activityChallenge != nil {
			s.onActivityChallenge.Notify(s.activityChallenge)
		}
	}

	r.log.Printf("Re%sgistered spectator with reward address %s and remote address %s, %d connections", reconnectingStr, s.user.Address(), s.remoteAddress, s.connectionCount)
	if s.connectionCount == 1 {
		go spectatorActivityWatchdog(ctx, s, r)
	}
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

	s.connectionCount--
	if s.connectionCount <= 0 {
		s.stoppedWatching = time.Now()
		s.onDisconnected.Notify()
	}

	activityChallengeInfo := ""
	if s.activityChallenge != nil {
		activityChallengeInfo = fmt.Sprintf(" (had activity challenge since %v)", s.activityChallenge.ChallengedAt)
	}
	r.log.Printf("Unregistered spectator with reward address %s and remote address %s%s, %d connections remain", s.user.Address(), s.remoteAddress, activityChallengeInfo, s.connectionCount)

	return nil
}

func (r *RewardsHandler) purgeOldDisconnectedSpectators() {
	r.spectatorsMutex.Lock()
	defer r.spectatorsMutex.Unlock()

	removeSpectator := func(m map[string][]*spectator, s *spectator, key string) {
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

	spectators := []*spectator{}
	for _, slice := range r.spectatorsByRemoteAddress {
		spectators = append(spectators, slice...)
	}
	for _, s := range spectators {
		if !s.stoppedWatching.IsZero() && time.Since(s.stoppedWatching) > 15*time.Minute {
			removeSpectator(r.spectatorsByRemoteAddress, s, s.remoteAddress)
			delete(r.spectatorsByRewardAddress, s.user.Address())
			if s.activityChallenge != nil {
				delete(r.spectatorByActivityChallenge, s.activityChallenge.ID)
			}
			r.log.Printf("Purged spectator with reward address %s and remote address %s", s.user.Address(), s.remoteAddress)
		}
	}
}

func (r *RewardsHandler) Worker(ctx context.Context) error {
	onMediaChanged, mediaChangedU := r.mediaQueue.mediaChanged.Subscribe(event.ExactlyOnceGuarantee)
	defer mediaChangedU()

	onEntryRemoved, deepEntryRemovedU := r.mediaQueue.deepEntryRemoved.Subscribe(event.ExactlyOnceGuarantee)
	defer deepEntryRemovedU()

	onPendingWithdrawalCreated, pendingWithdrawalCreatedU := r.withdrawalHandler.pendingWithdrawalCreated.Subscribe(event.AtLeastOnceGuarantee)
	defer pendingWithdrawalCreatedU()

	// the rewards handler might be starting at a time when there are things already playing,
	// in that case we need to update lastMedia
	entries := r.mediaQueue.Entries()
	if len(entries) > 0 {
		r.lastMedia = entries[0]
	}
	purgeTicker := time.NewTicker(10 * time.Minute)
	defer purgeTicker.Stop()
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
		case v := <-onPendingWithdrawalCreated:
			r.onPendingWithdrawalCreated(ctx, v[0].([]*types.PendingWithdrawal))
		case <-purgeTicker.C:
			r.purgeOldDisconnectedSpectators()
		case <-ctx.Done():
			return nil
		}
	}
}

func (r *RewardsHandler) onPendingWithdrawalCreated(ctx context.Context, pending []*types.PendingWithdrawal) {
	r.spectatorsMutex.RLock()
	defer r.spectatorsMutex.RUnlock()
	for _, p := range pending {
		spectator, ok := r.spectatorsByRewardAddress[p.RewardsAddress]
		if ok {
			spectator.onWithdrew.Notify()
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
	lastMedia := r.lastMedia

	go func() {
		err := r.rewardUsers(ctx, lastMedia)
		if err != nil {
			r.log.Println("Error rewarding users:", err)
		}
	}()

	return nil
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

	spectator, ok := r.spectatorsByRewardAddress[rewardAddress]
	if ok {
		list := []string{}
		for a := range spectator.remoteAddresses {
			list = append(list, a)
		}
		return list
	}
	return []string{}
}

func (r *RewardsHandler) MarkAddressAsMentionedInChat(ctx context.Context, address string) {
	r.spectatorsMutex.Lock()
	defer r.spectatorsMutex.Unlock()

	spectator, ok := r.spectatorsByRewardAddress[address]
	if ok {
		spectator.onChatMentioned.Notify()
	}
}

func (r *RewardsHandler) GetSpectator(address string) (Spectator, bool) {
	r.spectatorsMutex.RLock()
	defer r.spectatorsMutex.RUnlock()

	spectator, ok := r.spectatorsByRewardAddress[address]
	return spectator, ok
}

func (r *RewardsHandler) CountConnectedSpectatorsOnRemoteAddress(remoteAddress string) int {
	r.spectatorsMutex.RLock()
	defer r.spectatorsMutex.RUnlock()

	count := 0
	uniquifiedNeedle := utils.GetUniquifiedIP(remoteAddress)
	for k, spectators := range r.spectatorsByRemoteAddress {
		uniquifiedIP := utils.GetUniquifiedIP(k)
		if uniquifiedNeedle == uniquifiedIP {
			for _, spectator := range spectators {
				if spectator.connectionCount > 0 {
					count++
				}
			}
		}
	}

	return count
}
