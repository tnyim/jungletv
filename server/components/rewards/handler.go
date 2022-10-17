package rewards

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
	"github.com/tnyim/jungletv/server/components/mediaqueue"
	"github.com/tnyim/jungletv/server/components/payment"
	"github.com/tnyim/jungletv/server/components/pointsmanager"
	"github.com/tnyim/jungletv/server/components/pricer"
	"github.com/tnyim/jungletv/server/components/skipmanager"
	"github.com/tnyim/jungletv/server/components/staffactivitymanager"
	"github.com/tnyim/jungletv/server/components/withdrawalhandler"
	authinterceptor "github.com/tnyim/jungletv/server/interceptors/auth"
	"github.com/tnyim/jungletv/server/media"
	"github.com/tnyim/jungletv/server/stores/chat"
	"github.com/tnyim/jungletv/server/stores/moderation"
	"github.com/tnyim/jungletv/types"
	"github.com/tnyim/jungletv/utils"
	"github.com/tnyim/jungletv/utils/event"
	"google.golang.org/protobuf/types/known/timestamppb"
	"gopkg.in/alexcesaro/statsd.v2"
)

type captchaResponseCheckFn func(context.Context, string) (bool, error)

// Handler handles reward distribution among spectators
type Handler struct {
	log                   *log.Logger
	statsClient           *statsd.Client
	mediaQueue            *mediaqueue.MediaQueue
	ipReputationChecker   *ipreputation.Checker
	withdrawalHandler     *withdrawalhandler.Handler
	wallet                *wallet.Wallet
	collectorAccountQueue chan func(*wallet.Account, *rpc.Client, *rpc.Client)
	skipManager           *skipmanager.Manager
	chatManager           *chatmanager.Manager
	paymentAccountPool    *payment.PaymentAccountPool
	lastMedia             media.QueueEntry
	moderationStore       moderation.Store
	staffActivityManager  *staffactivitymanager.Manager
	eligibleMovingAverage *movingaverage.MovingAverage
	segchaCheckFn         captchaResponseCheckFn
	versionHash           *string
	pointsManager         *pointsmanager.Manager

	rewardsDistributed *event.Event[RewardsDistributedEventArgs]

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
	OnRewarded() *event.Event[SpectatorRewardedEventArgs]
	OnWithdrew() *event.NoArgEvent
	OnChatMentioned() *event.NoArgEvent
	OnActivityChallenge() *event.Event[*ActivityChallenge]
	CurrentActivityChallenge() *ActivityChallenge
	Legitimate() (bool, time.Time)
	CurrentRemoteAddress() string
	CountOtherConnectedSpectatorsOnSameRemoteAddress(*Handler) int
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
	onRewarded                 *event.Event[SpectatorRewardedEventArgs]
	onWithdrew                 *event.NoArgEvent
	onDisconnected             *event.NoArgEvent
	onReconnected              *event.NoArgEvent
	onChatMentioned            *event.NoArgEvent
	onActivityChallenge        *event.Event[*ActivityChallenge]
	activityChallenge          *ActivityChallenge
	lastHardChallengeSolvedAt  time.Time
	connectionCount            int
	noToleranceOnNextChallenge bool
}

type ActivityChallenge struct {
	ChallengedAt time.Time
	ID           string
	Type         string
	Tolerance    time.Duration
}

func (a *ActivityChallenge) SerializeForAPI() *proto.ActivityChallenge {
	return &proto.ActivityChallenge{
		Id:           a.ID,
		Type:         a.Type,
		ChallengedAt: timestamppb.New(a.ChallengedAt),
	}
}

func (s *spectator) OnRewarded() *event.Event[SpectatorRewardedEventArgs] {
	return s.onRewarded
}

func (s *spectator) OnWithdrew() *event.NoArgEvent {
	return s.onWithdrew
}

func (s *spectator) OnChatMentioned() *event.NoArgEvent {
	return s.onChatMentioned
}

func (s *spectator) OnActivityChallenge() *event.Event[*ActivityChallenge] {
	return s.onActivityChallenge
}

func (s *spectator) CurrentActivityChallenge() *ActivityChallenge {
	return s.activityChallenge
}

func (s *spectator) Legitimate() (bool, time.Time) {
	return s.legitimate, s.stoppedBeingLegitimate
}

func (s *spectator) CurrentRemoteAddress() string {
	return s.remoteAddress
}

func (s *spectator) CountOtherConnectedSpectatorsOnSameRemoteAddress(r *Handler) int {
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

// NewHandler creates a new RewardsHandler
func NewHandler(log *log.Logger,
	statsClient *statsd.Client,
	mediaQueue *mediaqueue.MediaQueue,
	ipReputationChecker *ipreputation.Checker,
	withdrawalHandler *withdrawalhandler.Handler,
	wallet *wallet.Wallet,
	collectorAccountQueue chan func(*wallet.Account, *rpc.Client, *rpc.Client),
	skipManager *skipmanager.Manager,
	chatManager *chatmanager.Manager,
	pointsManager *pointsmanager.Manager,
	paymentAccountPool *payment.PaymentAccountPool,
	moderationStore moderation.Store,
	staffActivityManager *staffactivitymanager.Manager,
	segchaCheckFn captchaResponseCheckFn,
	versionHash *string) (*Handler, error) {
	return &Handler{
		log:                   log,
		statsClient:           statsClient,
		mediaQueue:            mediaQueue,
		ipReputationChecker:   ipReputationChecker,
		withdrawalHandler:     withdrawalHandler,
		wallet:                wallet,
		collectorAccountQueue: collectorAccountQueue,
		skipManager:           skipManager,
		chatManager:           chatManager,
		paymentAccountPool:    paymentAccountPool,
		staffActivityManager:  staffActivityManager,
		moderationStore:       moderationStore,
		eligibleMovingAverage: movingaverage.New(3),
		segchaCheckFn:         segchaCheckFn,
		pointsManager:         pointsManager,

		rewardsDistributed: event.New[RewardsDistributedEventArgs](),

		spectatorsByRemoteAddress:    make(map[string][]*spectator),
		spectatorsByRewardAddress:    make(map[string]*spectator),
		spectatorByActivityChallenge: make(map[string]*spectator),

		versionHash: versionHash,

		chatParticipation:             cache.New[string, struct{}](2*time.Minute+45*time.Second, 10*time.Minute),
		chatLessFrequentParticipation: cache.New[string, struct{}](15*time.Minute, 10*time.Minute),
	}, nil
}

func (r *Handler) RegisterSpectator(ctx context.Context, user auth.User) (Spectator, error) {
	ipCountry := authinterceptor.IPCountryFromContext(ctx)
	if ipCountry == "T1" {
		return &spectator{
			isDummy:             true,
			onRewarded:          event.New[SpectatorRewardedEventArgs](),
			onWithdrew:          event.NewNoArg(),
			onChatMentioned:     event.NewNoArg(),
			onActivityChallenge: event.New[*ActivityChallenge](),
		}, nil
	}

	now := time.Now()
	remoteAddress := authinterceptor.RemoteAddressFromContext(ctx)

	r.ipReputationChecker.EnqueueAddressForChecking(remoteAddress)

	r.spectatorsMutex.Lock()
	defer r.spectatorsMutex.Unlock()

	s, found := r.spectatorsByRewardAddress[user.Address()]
	if found {
		// refresh user (e.g. to update permission level)
		s.user = user
		s.stoppedWatching = time.Time{}
		if s.remoteAddress != remoteAddress {
			// changing IPs makes one lose human verification status
			d, err := r.durationUntilNextActivityChallenge(ctx, user, true)
			if err != nil {
				return nil, stacktrace.Propagate(err, "")
			}
			s.nextActivityCheckTime = now.Add(d)
			s.activityCheckTimer = time.NewTimer(d)
			s.lastHardChallengeSolvedAt = time.Time{}
			s.noToleranceOnNextChallenge = true
			s.remoteAddresses[remoteAddress] = struct{}{}
		}
		s.onReconnected.Notify(true)
	} else {
		d, err := r.durationUntilNextActivityChallenge(ctx, user, true)
		if err != nil {
			return nil, stacktrace.Propagate(err, "")
		}
		s = &spectator{
			legitimate:            true, // everyone starts in good standings
			user:                  user,
			remoteAddress:         remoteAddress,
			startedWatching:       now,
			nextActivityCheckTime: now.Add(d),
			activityCheckTimer:    time.NewTimer(d),
			onRewarded:            event.New[SpectatorRewardedEventArgs](),
			onWithdrew:            event.NewNoArg(),
			onChatMentioned:       event.NewNoArg(),
			onDisconnected:        event.NewNoArg(),
			onReconnected:         event.NewNoArg(),
			onActivityChallenge:   event.New[*ActivityChallenge](),
			remoteAddresses: map[string]struct{}{
				remoteAddress: {},
			},
		}
		r.spectatorsByRemoteAddress[s.remoteAddress] = append(r.spectatorsByRemoteAddress[s.remoteAddress], s)
		r.spectatorsByRewardAddress[s.user.Address()] = s
	}
	s.connectionCount++

	reconnectingStr := ""
	if found {
		reconnectingStr = "-re"
		// we must fire this event again since the timer may have been consumed by spectatorActivityWatchdog on another/a previous connection
		if s.activityChallenge != nil {
			s.onActivityChallenge.Notify(s.activityChallenge, true)
		}
	}

	r.log.Printf("Re%sgistered spectator with reward address %s and remote address %s, %d connections", reconnectingStr, s.user.Address(), s.remoteAddress, s.connectionCount)
	if s.connectionCount == 1 {
		go spectatorActivityWatchdog(ctx, s, r)
	}
	return s, nil
}

func (r *Handler) UnregisterSpectator(ctx context.Context, sInterface Spectator) error {
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
		s.onDisconnected.Notify(false)
	}

	activityChallengeInfo := ""
	if s.activityChallenge != nil {
		activityChallengeInfo = fmt.Sprintf(" (had activity challenge since %v)", s.activityChallenge.ChallengedAt)
	}
	r.log.Printf("Unregistered spectator with reward address %s and remote address %s%s, %d connections remain", s.user.Address(), s.remoteAddress, activityChallengeInfo, s.connectionCount)

	return nil
}

func (r *Handler) purgeOldDisconnectedSpectators() {
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

func (r *Handler) Worker(ctx context.Context) error {
	onEntryAdded, entryAddedU := r.mediaQueue.EntryAdded().Subscribe(event.AtLeastOnceGuarantee)
	defer entryAddedU()

	onMediaChanged, mediaChangedU := r.mediaQueue.MediaChanged().Subscribe(event.ExactlyOnceGuarantee)
	defer mediaChangedU()

	onEntryRemoved, deepEntryRemovedU := r.mediaQueue.DeepEntryRemoved().Subscribe(event.ExactlyOnceGuarantee)
	defer deepEntryRemovedU()

	onPendingWithdrawalsCreated, pendingWithdrawalsCreatedU := r.withdrawalHandler.PendingWithdrawalsCreated().Subscribe(event.AtLeastOnceGuarantee)
	defer pendingWithdrawalsCreatedU()

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
			if v == nil || v == (media.QueueEntry)(nil) {
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
		case pendingWithdrawals := <-onPendingWithdrawalsCreated:
			r.onPendingWithdrawalCreated(ctx, pendingWithdrawals)
		case <-purgeTicker.C:
			r.purgeOldDisconnectedSpectators()
		case entryAddedArgs := <-onEntryAdded:
			err := r.handleQueueEntryAdded(ctx, entryAddedArgs.Entry)
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

func (r *Handler) onPendingWithdrawalCreated(ctx context.Context, pending []*types.PendingWithdrawal) {
	r.spectatorsMutex.RLock()
	defer r.spectatorsMutex.RUnlock()
	for _, p := range pending {
		spectator, ok := r.spectatorsByRewardAddress[p.RewardsAddress]
		if ok {
			spectator.onWithdrew.Notify(false)
		}
	}
}

func (r *Handler) onMediaChanged(ctx context.Context, newMedia media.QueueEntry) error {
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

func (r *Handler) onMediaRemoved(ctx context.Context, removed media.QueueEntry) error {
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

	_, err := r.pointsManager.CreateTransaction(ctx, removed.RequestedBy(), types.PointsTxTypeMediaEnqueuedRewardReversal,
		-pointsReward, pointsmanager.TxExtraField{
			Key:   "media",
			Value: removed.QueueID()})
	if err != nil {
		if errors.Is(err, types.ErrInsufficientPointsBalance) {
			// user already spent the reward, let's deduct it from the refunded amount as if this was a points purchase
			banoshi := new(big.Int).Div(pricer.BananoUnit, big.NewInt(100))
			amountToKeep := new(big.Int).Mul(banoshi, big.NewInt(int64(pointsReward)))
			amountToReimburse.Sub(amountToReimburse.Int, amountToKeep)
		} else {
			return stacktrace.Propagate(err, "")
		}
	}

	if amountToReimburse.Cmp(big.NewInt(0)) > 0 && !removed.RequestedBy().IsFromAlienChain() {
		go r.reimburseRequester(ctx, removed.RequestedBy().Address(), amountToReimburse)
	}
	return nil
}

func (r *Handler) RemoteAddressesForRewardAddress(ctx context.Context, rewardAddress string) []string {
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

func (r *Handler) markAddressAsMentionedInChat(ctx context.Context, address string) {
	r.spectatorsMutex.RLock()
	defer r.spectatorsMutex.RUnlock()

	spectator, ok := r.spectatorsByRewardAddress[address]
	if ok {
		spectator.onChatMentioned.Notify(false)
	}
}

func (r *Handler) handleQueueEntryAdded(ctx context.Context, m media.QueueEntry) error {
	requestedBy := m.RequestedBy()
	if requestedBy == nil || requestedBy == (auth.User)(nil) || requestedBy.IsUnknown() || requestedBy.IsFromAlienChain() {
		return nil
	}
	r.markAddressAsActiveIfNotChallenged(ctx, requestedBy.Address())
	_, err := r.pointsManager.CreateTransaction(ctx, requestedBy, types.PointsTxTypeMediaEnqueuedReward,
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

func (r *Handler) getPointsRewardForMedia(m media.QueueEntry) int {
	return int(m.MediaInfo().Length().Seconds())/10 + 1
}

func (r *Handler) handleNewChatMessage(ctx context.Context, m *chat.Message) error {
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

			_, err := r.pointsManager.CreateTransaction(ctx, m.Author, types.PointsTxTypeChatActivityReward, points)
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

func (r *Handler) GetSpectator(address string) (Spectator, bool) {
	r.spectatorsMutex.RLock()
	defer r.spectatorsMutex.RUnlock()

	spectator, ok := r.spectatorsByRewardAddress[address]
	return spectator, ok
}

func (r *Handler) CountConnectedSpectatorsOnRemoteAddress(remoteAddress string) int {
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

func (r *Handler) EstimateEligibleSpectators() (int, bool) {
	if r.eligibleMovingAverage.Count() > 0 {
		return int(r.eligibleMovingAverage.Avg()), true
	}
	return 0, false
}
