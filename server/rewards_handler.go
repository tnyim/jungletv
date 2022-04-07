package server

import (
	"context"
	"errors"
	"fmt"
	"log"
	"math/big"
	"sync"
	"time"

	movingaverage "github.com/RobinUS2/golang-moving-average"
	"github.com/hectorchu/gonano/rpc"
	"github.com/hectorchu/gonano/wallet"
	"github.com/palantir/stacktrace"
	"github.com/patrickmn/go-cache"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/server/auth"
	"github.com/tnyim/jungletv/server/components/chatmanager"
	"github.com/tnyim/jungletv/server/components/ipreputation"
	"github.com/tnyim/jungletv/server/components/pointsmanager"
	authinterceptor "github.com/tnyim/jungletv/server/interceptors/auth"
	"github.com/tnyim/jungletv/server/stores/chat"
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
	chatManager                    *chatmanager.Manager
	paymentAccountPendingWaitGroup *sync.WaitGroup
	lastMedia                      MediaQueueEntry
	moderationStore                moderation.Store
	staffActivityManager           *StaffActivityManager
	eligibleMovingAverage          *movingaverage.MovingAverage
	segchaCheckFn                  captchaResponseCheckFn
	versionHash                    string
	pointsManager                  *pointsmanager.Manager

	rewardsDistributed *event.Event[rewardsDistributedEventArgs]

	// spectatorsByRemoteAddress maps a remote address to a set of spectators
	spectatorsByRemoteAddress map[string][]*spectator
	// spectatorsByRewardAddress maps a reward address to a spectator
	spectatorsByRewardAddress map[string]*spectator
	// spectatorByActivityChallenge maps an activity challenge to a spectator
	spectatorByActivityChallenge map[string]*spectator
	spectatorsMutex              sync.RWMutex

	chatParticipation             *cache.Cache[string, struct{}]
	chatLessFrequentParticipation *cache.Cache[string, struct{}]
}

type Spectator interface {
	OnRewarded() *event.Event[spectatorRewardedEventArgs]
	OnWithdrew() *event.NoArgEvent
	OnChatMentioned() *event.NoArgEvent
	OnActivityChallenge() *event.Event[*activityChallenge]
	CurrentActivityChallenge() *activityChallenge
	Legitimate() (bool, time.Time)
	RemoteAddressCanReceiveRewards(*ipreputation.Checker) bool
	CountOtherConnectedSpectatorsOnSameRemoteAddress(*RewardsHandler) int
	WatchingSince() time.Time
	StoppedWatching() (bool, time.Time)
	ConnectionCount() int
}

type rewardsDistributedEventArgs struct {
	rewardBudget       Amount
	eligibleSpectators int
	requesterReward    Amount
	media              MediaQueueEntry
}

type spectatorRewardedEventArgs struct {
	reward        Amount
	rewardBalance Amount
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
	onRewarded                 *event.Event[spectatorRewardedEventArgs]
	onWithdrew                 *event.NoArgEvent
	onDisconnected             *event.NoArgEvent
	onReconnected              *event.NoArgEvent
	onChatMentioned            *event.NoArgEvent
	onActivityChallenge        *event.Event[*activityChallenge]
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

func (s *spectator) OnRewarded() *event.Event[spectatorRewardedEventArgs] {
	return s.onRewarded
}

func (s *spectator) OnWithdrew() *event.NoArgEvent {
	return s.onWithdrew
}

func (s *spectator) OnChatMentioned() *event.NoArgEvent {
	return s.onChatMentioned
}

func (s *spectator) OnActivityChallenge() *event.Event[*activityChallenge] {
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
	wallet *wallet.Wallet,
	collectorAccountQueue chan func(*wallet.Account, *rpc.Client, *rpc.Client),
	skipManager *SkipManager,
	chatManager *chatmanager.Manager,
	pointsManager *pointsmanager.Manager,
	paymentAccountPendingWaitGroup *sync.WaitGroup,
	moderationStore moderation.Store,
	staffActivityManager *StaffActivityManager,
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
		chatManager:                    chatManager,
		paymentAccountPendingWaitGroup: paymentAccountPendingWaitGroup,
		staffActivityManager:           staffActivityManager,
		moderationStore:                moderationStore,
		eligibleMovingAverage:          movingaverage.New(3),
		segchaCheckFn:                  segchaCheckFn,
		pointsManager:                  pointsManager,

		rewardsDistributed: event.New[rewardsDistributedEventArgs](),

		spectatorsByRemoteAddress:    make(map[string][]*spectator),
		spectatorsByRewardAddress:    make(map[string]*spectator),
		spectatorByActivityChallenge: make(map[string]*spectator),

		versionHash: versionHash,

		chatParticipation:             cache.New[string, struct{}](2*time.Minute+45*time.Second, 10*time.Minute),
		chatLessFrequentParticipation: cache.New[string, struct{}](15*time.Minute, 10*time.Minute),
	}, nil
}

func (r *RewardsHandler) RegisterSpectator(ctx context.Context, user auth.User) (Spectator, error) {
	ipCountry := authinterceptor.IPCountryFromContext(ctx)
	if ipCountry == "T1" {
		return &spectator{
			isDummy:             true,
			onRewarded:          event.New[spectatorRewardedEventArgs](),
			onWithdrew:          event.NewNoArg(),
			onChatMentioned:     event.NewNoArg(),
			onActivityChallenge: event.New[*activityChallenge](),
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
			d := r.durationUntilNextActivityChallenge(user, true)
			s.nextActivityCheckTime = now.Add(d)
			s.activityCheckTimer = time.NewTimer(d)
			s.lastHardChallengeSolvedAt = time.Time{}
			s.noToleranceOnNextChallenge = true
			s.remoteAddresses[remoteAddress] = struct{}{}
		}
		s.onReconnected.Notify()
	} else {
		d := r.durationUntilNextActivityChallenge(user, true)
		s = &spectator{
			legitimate:            true, // everyone starts in good standings
			user:                  user,
			remoteAddress:         remoteAddress,
			startedWatching:       now,
			nextActivityCheckTime: now.Add(d),
			activityCheckTimer:    time.NewTimer(d),
			onRewarded:            event.New[spectatorRewardedEventArgs](),
			onWithdrew:            event.NewNoArg(),
			onChatMentioned:       event.NewNoArg(),
			onDisconnected:        event.NewNoArg(),
			onReconnected:         event.NewNoArg(),
			onActivityChallenge:   event.New[*activityChallenge](),
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
	onEntryAdded, entryAddedU := r.mediaQueue.entryAdded.Subscribe(event.AtLeastOnceGuarantee)
	defer entryAddedU()

	onMediaChanged, mediaChangedU := r.mediaQueue.mediaChanged.Subscribe(event.ExactlyOnceGuarantee)
	defer mediaChangedU()

	onEntryRemoved, deepEntryRemovedU := r.mediaQueue.deepEntryRemoved.Subscribe(event.ExactlyOnceGuarantee)
	defer deepEntryRemovedU()

	onPendingWithdrawalCreated, pendingWithdrawalCreatedU := r.withdrawalHandler.pendingWithdrawalCreated.Subscribe(event.AtLeastOnceGuarantee)
	defer pendingWithdrawalCreatedU()

	onChatMessageCreated, onChatMessageCreatedU := r.chatManager.OnMessageCreated().Subscribe(event.AtLeastOnceGuarantee)
	defer onChatMessageCreatedU()

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
			if v == nil || v == (MediaQueueEntry)(nil) {
				err = r.onMediaChanged(ctx, nil)
			} else {
				err = r.onMediaChanged(ctx, v)
			}
			if err != nil {
				return stacktrace.Propagate(err, "")
			}
		case v := <-onEntryRemoved:
			err := r.onMediaRemoved(ctx, v)
			if err != nil {
				return stacktrace.Propagate(err, "")
			}
		case pendingWithdrawals := <-onPendingWithdrawalCreated:
			r.onPendingWithdrawalCreated(ctx, pendingWithdrawals)
		case <-purgeTicker.C:
			r.purgeOldDisconnectedSpectators()
		case entryAddedArgs := <-onEntryAdded:
			err := r.handleQueueEntryAdded(ctx, entryAddedArgs.entry)
			if err != nil {
				return stacktrace.Propagate(err, "")
			}
		case msgCreatedArgs := <-onChatMessageCreated:
			err := r.handleNewChatMessage(ctx, msgCreatedArgs.Message)
			if err != nil {
				return stacktrace.Propagate(err, "")
			}
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
	amountToReimburse := removed.RequestCost()
	if amountToReimburse.Cmp(big.NewInt(0)) == 0 {
		r.log.Println("Request cost was 0, nothing to reimburse")
		return nil
	}
	if removed.RequestedBy().IsUnknown() {
		return nil
	}
	// reimburse who added to queue

	pointsReward := r.getPointsRewardForMedia(removed)

	err := r.pointsManager.CreateTransaction(ctx, removed.RequestedBy(), types.PointsTxTypeMediaEnqueuedRewardReversal,
		-pointsReward, pointsmanager.TxExtraField{
			Key:   "media",
			Value: removed.QueueID()})
	if err != nil {
		if errors.Is(err, types.ErrInsufficientPointsBalance) {
			// user already spent the reward, let's deduct it from the refunded amount as if this was a points purchase
			banoshi := new(big.Int).Div(BananoUnit, big.NewInt(100))
			amountToKeep := new(big.Int).Mul(banoshi, big.NewInt(int64(pointsReward)))
			amountToReimburse.Sub(amountToReimburse.Int, amountToKeep)
		} else {
			return stacktrace.Propagate(err, "")
		}
	}

	if amountToReimburse.Cmp(big.NewInt(0)) > 0 {
		go r.reimburseRequester(ctx, removed.RequestedBy().Address(), amountToReimburse)
	}
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

func (r *RewardsHandler) markAddressAsMentionedInChat(ctx context.Context, address string) {
	r.spectatorsMutex.RLock()
	defer r.spectatorsMutex.RUnlock()

	spectator, ok := r.spectatorsByRewardAddress[address]
	if ok {
		spectator.onChatMentioned.Notify()
	}
}

func (r *RewardsHandler) handleQueueEntryAdded(ctx context.Context, m MediaQueueEntry) error {
	requestedBy := m.RequestedBy()
	if requestedBy == nil || requestedBy == (auth.User)(nil) || requestedBy.IsUnknown() {
		return nil
	}
	r.markAddressAsActiveIfNotChallenged(ctx, requestedBy.Address())
	err := r.pointsManager.CreateTransaction(ctx, requestedBy, types.PointsTxTypeMediaEnqueuedReward,
		r.getPointsRewardForMedia(m),
		pointsmanager.TxExtraField{
			Key:   "media",
			Value: m.QueueID(),
		})
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	return nil
}

func (r *RewardsHandler) getPointsRewardForMedia(m MediaQueueEntry) int {
	return int(m.MediaInfo().Length().Seconds())/10 + 1
}

func (r *RewardsHandler) handleNewChatMessage(ctx context.Context, m *chat.Message) error {
	if m.Author == nil || m.Author == (auth.User)(nil) || m.Author.IsUnknown() || m.Shadowbanned {
		return nil
	}

	if len(m.Content) >= 10 || m.Reference != nil || len(m.AttachmentsView) > 0 {
		r.markAddressAsActiveIfNotChallenged(ctx, m.Author.Address())

		_, present := r.chatParticipation.Get(m.Author.Address())
		_, presentInLessFrequent := r.chatLessFrequentParticipation.Get(m.Author.Address())
		if !present {
			r.chatParticipation.SetDefault(m.Author.Address(), struct{}{})
			r.chatLessFrequentParticipation.SetDefault(m.Author.Address(), struct{}{})

			points := 3
			if !presentInLessFrequent {
				points = 6
			}

			err := r.pointsManager.CreateTransaction(ctx, m.Author, types.PointsTxTypeChatActivityReward, points)
			if err != nil {
				return stacktrace.Propagate(err, "")
			}
		}
	}

	if m.Reference != nil && m.Reference.Author != nil && !m.Reference.Author.IsUnknown() {
		r.markAddressAsMentionedInChat(ctx, m.Reference.Author.Address())
	}
	return nil
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
