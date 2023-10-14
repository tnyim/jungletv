package skipmanager

import (
	"context"
	"log"
	"math"
	"math/big"
	"sync"
	"time"

	"github.com/hectorchu/gonano/rpc"
	"github.com/hectorchu/gonano/wallet"
	"github.com/palantir/stacktrace"
	"github.com/patrickmn/go-cache"
	"github.com/shopspring/decimal"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/server/components/mediaqueue"
	"github.com/tnyim/jungletv/server/components/payment"
	"github.com/tnyim/jungletv/server/components/pricer"
	"github.com/tnyim/jungletv/server/media"
	"github.com/tnyim/jungletv/types"
	"github.com/tnyim/jungletv/utils/event"
	"github.com/tnyim/jungletv/utils/transaction"
)

var NoSkipPeriodBeforeMediaEnd = 30 * time.Second

// Manager manages skipping and tipping
type Manager struct {
	log                     *log.Logger
	rpc                     rpc.Client
	skipAccount             *wallet.Account
	rainAccount             *wallet.Account
	collectorAccountAddress string
	mediaQueue              *mediaqueue.MediaQueue
	pricer                  *pricer.Pricer

	accountMovementLock sync.Mutex
	cachedSkipBalance   payment.Amount
	cachedRainBalance   payment.Amount

	skipThresholdMutex     sync.RWMutex
	originalSkipThreshold  payment.Amount
	currentSkipThreshold   payment.Amount
	minSkipThreshold       payment.Amount
	skipThresholdChangedBy payment.Amount
	skipThresholdLowerable bool

	rainedByRequester          payment.Amount
	currentMediaID             *string
	currentMediaRequester      *string
	skippingEnabled            bool
	startupNoSkipPeriodOver    bool
	mediaStartNoSkipPeriodOver bool

	statusUpdated                          event.Event[SkipStatusUpdatedEventArgs]
	skipThresholdReductionMilestoneReached event.Event[float64]
	crowdfundedSkip                        event.Event[payment.Amount]
	crowdfundedTransactionReceived         event.Event[*types.CrowdfundedTransaction]

	recentCrowdfundedSkips *cache.Cache[string, struct{}]
}

// New returns an initialized skip manager
func New(log *log.Logger,
	rpc rpc.Client,
	skipAccount *wallet.Account,
	rainAccount *wallet.Account,
	collectorAccountAddress string,
	mediaQueue *mediaqueue.MediaQueue,
	pricer *pricer.Pricer,
) *Manager {
	return &Manager{
		log:                                    log,
		rpc:                                    rpc,
		skipAccount:                            skipAccount,
		rainAccount:                            rainAccount,
		collectorAccountAddress:                collectorAccountAddress,
		mediaQueue:                             mediaQueue,
		pricer:                                 pricer,
		statusUpdated:                          event.New[SkipStatusUpdatedEventArgs](),
		skipThresholdReductionMilestoneReached: event.New[float64](),
		crowdfundedSkip:                        event.New[payment.Amount](),
		cachedSkipBalance:                      payment.NewAmount(),
		cachedRainBalance:                      payment.NewAmount(),
		originalSkipThreshold:                  payment.NewAmount(),
		currentSkipThreshold:                   payment.NewAmount(),
		minSkipThreshold:                       payment.NewAmount(),
		skipThresholdChangedBy:                 payment.NewAmount(),
		rainedByRequester:                      payment.NewAmount(),
		skippingEnabled:                        true,
		crowdfundedTransactionReceived:         event.New[*types.CrowdfundedTransaction](),
		recentCrowdfundedSkips:                 cache.New[string, struct{}](30*time.Minute, 15*time.Minute),
	}
}

func (s *Manager) Worker(ctx context.Context) error {
	onMediaChanged, mediaChangedU := s.mediaQueue.MediaChanged().Subscribe(event.BufferFirst)
	defer mediaChangedU()

	onSkippingAllowedUpdated, skippingAllowedUpdatedU := s.mediaQueue.SkippingAllowedUpdated().Subscribe(event.BufferFirst)
	defer skippingAllowedUpdatedU()

	s.UpdateSkipThreshold(false)

	startupNoSkipTimer := time.NewTimer(30 * time.Second)
	defer startupNoSkipTimer.Stop()
	mediaStartTimer := time.NewTimer(time.Duration(math.MaxInt64))
	defer mediaStartTimer.Stop()

	for {
		mediaEndTimer := s.computeMediaEndTimer()
		select {
		case entry := <-onMediaChanged:
			s.mediaStartNoSkipPeriodOver = false
			if entry == nil || entry == (media.QueueEntry)(nil) {
				s.currentMediaID = nil
				s.currentMediaRequester = nil
				mediaStartTimer.Reset(time.Duration(math.MaxInt64))
			} else {
				mediaStartTimer.Reset(10 * time.Second)
				id := entry.QueueID()
				s.currentMediaID = &id
				if entry.RequestedBy() != nil && !entry.RequestedBy().IsUnknown() {
					req := entry.RequestedBy().Address()
					s.currentMediaRequester = &req
				} else {
					s.currentMediaRequester = nil
				}
				err := s.retroactivelyUpdateForMedia(ctx, id)
				if err != nil {
					return stacktrace.Propagate(err, "")
				}
			}
			s.UpdateSkipThreshold(true)
		case <-onSkippingAllowedUpdated:
			s.UpdateSkipThreshold(false)
		case <-mediaStartTimer.C:
			s.mediaStartNoSkipPeriodOver = true
			s.UpdateSkipThreshold(false)
		case <-mediaEndTimer.C:
			s.UpdateSkipThreshold(false)
		case <-startupNoSkipTimer.C:
			if !s.startupNoSkipPeriodOver {
				s.startupNoSkipPeriodOver = true
				s.UpdateSkipThreshold(false)
			}
		case <-ctx.Done():
			return nil
		}
	}
}

func (s *Manager) BalancesWorker(ctx context.Context, interval time.Duration) error {
	// since this operation takes time, runs on a separate goroutine from the main worker select{}
	// this should help the onMediaChanged handler run in time
	t := time.NewTicker(interval)
	defer t.Stop()
	for {
		select {
		case <-t.C:
			err := s.checkBalances(ctx)
			if err != nil {
				return stacktrace.Propagate(err, "")
			}
		case <-ctx.Done():
			return nil
		}
	}
}

func (s *Manager) retroactivelyUpdateForMedia(ctxCtx context.Context, mediaID string) error {
	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	defer ctx.Rollback()

	err = types.SetMediaOfCrowdfundedTransactionsWithoutMedia(ctx, mediaID)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	return stacktrace.Propagate(ctx.Commit(), "")
}

func (s *Manager) computeMediaEndTimer() *time.Timer {
	currentEntry, isCurrentlyPlaying := s.mediaQueue.CurrentlyPlaying()
	if !isCurrentlyPlaying {
		// return a timer that will never end
		// the next status change is caused by a new media starting
		return time.NewTimer(math.MaxInt64)
	}
	durationUntilNoSkipPeriodBegins := currentEntry.MediaInfo().Length() - NoSkipPeriodBeforeMediaEnd - currentEntry.PlayedFor()
	if durationUntilNoSkipPeriodBegins < 0 {
		// return a timer that will never end
		// the next status change is caused by the media changing
		return time.NewTimer(math.MaxInt64)
	}
	return time.NewTimer(durationUntilNoSkipPeriodBegins)
}

func (s *Manager) checkBalances(ctx context.Context) error {
	s.accountMovementLock.Lock()
	defer s.accountMovementLock.Unlock()
	_, err := s.receiveAndRegisterPendings(ctx, s.skipAccount, types.CrowdfundedTransactionTypeSkip, s.currentMediaID, s.currentMediaRequester)
	if err != nil {
		return stacktrace.Propagate(err, "failed to receive pendings in skip account")
	}

	oldSkipBalance := s.cachedSkipBalance
	skipBalance, _, err := s.skipAccount.Balance()
	if err != nil {
		return stacktrace.Propagate(err, "failed to get balance of skip account")
	}
	if skipBalance.Cmp(big.NewInt(0)) > 0 {
		accountInfo, err := s.rpc.AccountInfo(s.skipAccount.Address())
		if err != nil {
			return stacktrace.Propagate(err, "failed to get account info of skip account")
		}
		if accountInfo.Balance.Int.Cmp(skipBalance) < 0 {
			// if the unconfirmed balance is lower, prefer that
			// ensures we don't count yet-unconfirmed balance after account emptying towards the next video
			skipBalance = &accountInfo.Balance.Int
		}
	}
	s.cachedSkipBalance = payment.NewAmount(skipBalance)

	rainedByRequester, err := s.receiveAndRegisterPendings(ctx, s.rainAccount, types.CrowdfundedTransactionTypeRain, s.currentMediaID, s.currentMediaRequester)
	if err != nil {
		return stacktrace.Propagate(err, "failed to receive pendings in rain account")
	}
	s.rainedByRequester.Add(s.rainedByRequester.Int, rainedByRequester.Int)

	oldRainBalance := s.cachedRainBalance
	rainBalance, _, err := s.rainAccount.Balance()
	if err != nil {
		return stacktrace.Propagate(err, "failed to get balance of rain account")
	}
	s.cachedRainBalance = payment.NewAmount(rainBalance)

	skipStatus := s.SkipAccountStatus()
	if oldSkipBalance.Cmp(s.cachedSkipBalance.Int) != 0 || oldRainBalance.Cmp(s.cachedRainBalance.Int) != 0 {
		s.statusUpdated.Notify(SkipStatusUpdatedEventArgs{skipStatus, s.RainAccountStatus()}, false)
	}

	if skipStatus.SkipStatus != proto.SkipStatus_SKIP_STATUS_ALLOWED && skipStatus.SkipStatus != proto.SkipStatus_SKIP_STATUS_END_OF_MEDIA_PERIOD {
		return nil
	}
	s.skipThresholdMutex.RLock()
	defer s.skipThresholdMutex.RUnlock()
	if s.cachedSkipBalance.Cmp(s.currentSkipThreshold.Int) >= 0 {
		s.crowdfundedSkip.Notify(s.cachedSkipBalance, true)
		// currentMediaID should never be nil at this point, but it doesn't hurt to check
		if s.currentMediaID != nil {
			s.recentCrowdfundedSkips.SetDefault(*s.currentMediaID, struct{}{})
		}
		s.mediaQueue.SkipCurrentEntry()
	}

	return nil
}

func (s *Manager) computeSkipStatus() proto.SkipStatus {
	currentEntry, isCurrentlyPlaying := s.mediaQueue.CurrentlyPlaying()
	if !isCurrentlyPlaying {
		return proto.SkipStatus_SKIP_STATUS_NO_MEDIA
	}
	if !s.skippingEnabled || !s.mediaQueue.SkippingEnabled() {
		return proto.SkipStatus_SKIP_STATUS_DISABLED
	}
	if !s.startupNoSkipPeriodOver {
		return proto.SkipStatus_SKIP_STATUS_UNAVAILABLE
	}
	if currentEntry.Unskippable() {
		return proto.SkipStatus_SKIP_STATUS_UNSKIPPABLE
	}
	playedFor := currentEntry.PlayedFor()
	if !s.mediaStartNoSkipPeriodOver {
		return proto.SkipStatus_SKIP_STATUS_START_OF_MEDIA_PERIOD
	}
	if playedFor > currentEntry.MediaInfo().Length()-NoSkipPeriodBeforeMediaEnd {
		return proto.SkipStatus_SKIP_STATUS_END_OF_MEDIA_PERIOD
	}
	return proto.SkipStatus_SKIP_STATUS_ALLOWED
}

// EmptySkipAndRainAccounts empties the skipping and tipping accounts and returns the total balance that was contained in both
func (s *Manager) EmptySkipAndRainAccounts(ctx context.Context, forMedia string, mediaRequestedBy *string) (skipTotal, rainTotal, rainedByRequester payment.Amount, err error) {
	s.accountMovementLock.Lock()
	defer s.accountMovementLock.Unlock()

	skipTotal, _, err = s.sendFullBalanceToCollector(ctx, s.skipAccount, types.CrowdfundedTransactionTypeSkip, &forMedia, mediaRequestedBy)
	if err != nil {
		return payment.NewAmount(), payment.NewAmount(), payment.NewAmount(), stacktrace.Propagate(err, "failed to empty skip account")
	}

	rainTotal, rainedByRequester, err = s.sendFullBalanceToCollector(ctx, s.rainAccount, types.CrowdfundedTransactionTypeRain, &forMedia, mediaRequestedBy)
	if err != nil {
		return payment.NewAmount(), payment.NewAmount(), payment.NewAmount(), stacktrace.Propagate(err, "failed to empty rain account")
	}
	totalRainedByRequester := payment.NewAmount(rainedByRequester.Int, s.rainedByRequester.Int)
	s.rainedByRequester = payment.NewAmount()

	s.cachedSkipBalance = payment.NewAmount()
	s.cachedRainBalance = payment.NewAmount()
	s.statusUpdated.Notify(SkipStatusUpdatedEventArgs{s.SkipAccountStatus(), s.RainAccountStatus()}, false)

	return skipTotal, rainTotal, totalRainedByRequester, nil
}

func (s *Manager) sendFullBalanceToCollector(ctx context.Context, account *wallet.Account, txType types.CrowdfundedTransactionType, forMedia, mediaRequestedBy *string) (payment.Amount, payment.Amount, error) {
	sentByRequester, err := s.receiveAndRegisterPendings(ctx, account, txType, forMedia, mediaRequestedBy)
	if err != nil {
		return payment.NewAmount(), payment.NewAmount(), stacktrace.Propagate(err, "failed to receive pendings in account")
	}

	// we use AccountInfo instead of balance because we want the balance including unconfirmed blocks
	info, err := s.rpc.AccountInfo(account.Address())
	if err != nil {
		return payment.NewAmount(), payment.NewAmount(), stacktrace.Propagate(err, "failed to get balance of account")
	}
	balance := &info.Balance.Int

	totalBalance := payment.NewAmount()
	totalBalance.Add(totalBalance.Int, balance)

	if balance.Cmp(big.NewInt(0)) > 0 {
		_, err = account.Send(s.collectorAccountAddress, balance)
		if err != nil {
			return payment.NewAmount(), payment.NewAmount(), stacktrace.Propagate(err, "failed to empty account")
		}
	}
	return totalBalance, sentByRequester, nil
}

func (s *Manager) receiveAndRegisterPendings(ctxCtx context.Context, account *wallet.Account, txType types.CrowdfundedTransactionType, forMedia *string, mediaRequestedBy *string) (payment.Amount, error) {
	recvPendings, err := account.ReceiveAndReturnPendings(pricer.DustThreshold)
	if err != nil {
		return payment.NewAmount(), stacktrace.Propagate(err, "")
	}

	if len(recvPendings) == 0 {
		return payment.NewAmount(), nil
	}

	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return payment.NewAmount(), stacktrace.Propagate(err, "")
	}
	defer ctx.Rollback()

	transactions := []*types.CrowdfundedTransaction{}
	now := time.Now()
	fromMediaRequester := big.NewInt(0)
	for hash, pending := range recvPendings {
		tx := &types.CrowdfundedTransaction{
			TxHash:          hash,
			FromAddress:     pending.Source,
			Amount:          decimal.NewFromBigInt(&pending.Amount.Int, 0),
			ReceivedAt:      now,
			TransactionType: txType,
			ForMedia:        forMedia,
		}
		transactions = append(transactions, tx)
		s.crowdfundedTransactionReceived.Notify(tx, true)
		if mediaRequestedBy != nil && *mediaRequestedBy == pending.Source {
			fromMediaRequester.Add(fromMediaRequester, &pending.Amount.Int)
		}
	}

	err = types.InsertCrowdfundedTransactions(ctx, transactions)
	if err != nil {
		return payment.NewAmount(), stacktrace.Propagate(err, "")
	}

	return payment.NewAmount(fromMediaRequester), stacktrace.Propagate(ctx.Commit(), "")
}

// SkipAccountStatus returns the status of the skip account
type SkipAccountStatus struct {
	SkipStatus         proto.SkipStatus
	Address            string
	Balance            payment.Amount
	Threshold          payment.Amount
	ThresholdLowerable bool
}

func (s *Manager) SkipAccountStatus() *SkipAccountStatus {
	s.skipThresholdMutex.RLock()
	defer s.skipThresholdMutex.RUnlock()
	return &SkipAccountStatus{
		SkipStatus:         s.computeSkipStatus(),
		Address:            s.skipAccount.Address(),
		Balance:            s.cachedSkipBalance,
		Threshold:          s.currentSkipThreshold,
		ThresholdLowerable: s.skipThresholdLowerable,
	}
}

// RainAccountStatus returns the status of the tip account
type RainAccountStatus struct {
	Address string
	Balance payment.Amount
}

func (s *Manager) RainAccountStatus() *RainAccountStatus {
	return &RainAccountStatus{
		Address: s.rainAccount.Address(),
		Balance: s.cachedRainBalance,
	}
}

func (s *Manager) UpdateSkipThreshold(resetChange bool) {
	defer func() {
		// start by deferring this since SkipAccountStatus must be called outside of the lock
		s.statusUpdated.Notify(SkipStatusUpdatedEventArgs{s.SkipAccountStatus(), s.RainAccountStatus()}, false)
	}()

	s.skipThresholdMutex.Lock()
	defer s.skipThresholdMutex.Unlock()

	if resetChange {
		s.skipThresholdChangedBy = payment.NewAmount()
	}

	status := s.computeSkipStatus()

	if status != proto.SkipStatus_SKIP_STATUS_ALLOWED && status != proto.SkipStatus_SKIP_STATUS_END_OF_MEDIA_PERIOD {
		s.currentSkipThreshold = payment.NewAmount(big.NewInt(1).Exp(big.NewInt(2), big.NewInt(128), big.NewInt(0)))
		return
	}

	s.originalSkipThreshold = s.pricer.ComputeCrowdfundedSkipPricing(len(s.recentCrowdfundedSkips.Items()))

	minPrice := big.NewInt(0).Div(s.originalSkipThreshold.Int, big.NewInt(10))
	minPrice.Div(minPrice, pricer.PriceRoundingFactor)
	minPrice.Mul(minPrice, pricer.PriceRoundingFactor)

	finalPrice := big.NewInt(0).Add(s.originalSkipThreshold.Int, s.skipThresholdChangedBy.Int)
	finalPrice.Div(finalPrice, pricer.PriceRoundingFactor)
	finalPrice.Mul(finalPrice, pricer.PriceRoundingFactor)
	if finalPrice.Cmp(minPrice) < 0 {
		// this can happen if the community skip multiplier is altered after threshold reductions had already happened
		finalPrice.Set(minPrice)
	}

	s.currentSkipThreshold = payment.NewAmount(finalPrice)
	s.minSkipThreshold = payment.NewAmount(minPrice)
	s.skipThresholdLowerable = finalPrice.Cmp(minPrice) > 0
}

func (s *Manager) CrowdfundedSkippingEnabled() bool {
	return s.skippingEnabled
}

func (s *Manager) SetCrowdfundedSkippingEnabled(enabled bool) {
	s.skippingEnabled = enabled
	s.UpdateSkipThreshold(false)
}

func (s *Manager) ChangeSkipThreshold(desiredChange payment.Amount) payment.Amount {
	change := payment.NewAmount(desiredChange.Int) // create copy
	change.Div(change.Int, pricer.PriceRoundingFactor)
	change.Mul(change.Int, pricer.PriceRoundingFactor)

	changed := false
	defer func() {
		// start by deferring this since SkipAccountStatus must be called outside of the lock
		if changed {
			s.statusUpdated.Notify(SkipStatusUpdatedEventArgs{s.SkipAccountStatus(), s.RainAccountStatus()}, false)
		}
	}()

	s.skipThresholdMutex.Lock()
	defer s.skipThresholdMutex.Unlock()

	status := s.computeSkipStatus()

	if status != proto.SkipStatus_SKIP_STATUS_ALLOWED && status != proto.SkipStatus_SKIP_STATUS_END_OF_MEDIA_PERIOD {
		return payment.NewAmount()
	}

	prevThreshold := big.NewInt(0).Set(s.currentSkipThreshold.Int)
	priceAfterChange := big.NewInt(0).Add(prevThreshold, change.Int)
	diff := priceAfterChange.Cmp(s.minSkipThreshold.Int)
	if diff < 0 {
		change = payment.NewAmount(big.NewInt(0).Neg(big.NewInt(0).Sub(s.currentSkipThreshold.Int, s.minSkipThreshold.Int)))
	}
	s.skipThresholdLowerable = diff > 0

	if change.Cmp(big.NewInt(0)) == 0 {
		return payment.NewAmount()
	}

	s.skipThresholdChangedBy.Add(s.skipThresholdChangedBy.Int, change.Int)
	s.currentSkipThreshold.Add(prevThreshold, change.Int)
	changed = true

	// check if we need to send any notifications
	oneQuarterOfOriginal := big.NewInt(0).Div(s.originalSkipThreshold.Int, big.NewInt(4))
	halfOfOriginal := big.NewInt(0).Div(s.originalSkipThreshold.Int, big.NewInt(2))
	threeQuartersOfOriginal := big.NewInt(0).Mul(oneQuarterOfOriginal, big.NewInt(3))

	if prevThreshold.Cmp(oneQuarterOfOriginal) > 0 && s.currentSkipThreshold.Cmp(oneQuarterOfOriginal) <= 0 {
		// threshold is now reduced to 25% of the original
		s.skipThresholdReductionMilestoneReached.Notify(0.25, false)
	} else if prevThreshold.Cmp(halfOfOriginal) > 0 && s.currentSkipThreshold.Cmp(halfOfOriginal) <= 0 {
		// threshold is now reduced to 50% of the original
		s.skipThresholdReductionMilestoneReached.Notify(0.5, false)
	} else if prevThreshold.Cmp(threeQuartersOfOriginal) > 0 && s.currentSkipThreshold.Cmp(threeQuartersOfOriginal) <= 0 {
		// threshold is now reduced to 75% of the original
		s.skipThresholdReductionMilestoneReached.Notify(0.75, false)
	}
	return change
}
