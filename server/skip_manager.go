package server

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
	"github.com/shopspring/decimal"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/server/components/payment"
	"github.com/tnyim/jungletv/server/media"
	"github.com/tnyim/jungletv/types"
	"github.com/tnyim/jungletv/utils/event"
	"github.com/tnyim/jungletv/utils/transaction"
)

var NoSkipPeriodBeforeMediaEnd = 30 * time.Second

// SkipManager manages skipping and tipping
type SkipManager struct {
	log                     *log.Logger
	rpc                     rpc.Client
	skipAccount             *wallet.Account
	rainAccount             *wallet.Account
	collectorAccountAddress string
	mediaQueue              *MediaQueue
	pricer                  *Pricer

	accountMovementLock        sync.Mutex
	cachedSkipBalance          payment.Amount
	cachedRainBalance          payment.Amount
	currentSkipThreshold       payment.Amount
	rainedByRequester          payment.Amount
	currentMediaID             *string
	currentMediaRequester      *string
	skippingEnabled            bool
	startupNoSkipPeriodOver    bool
	mediaStartNoSkipPeriodOver bool

	statusUpdated                  *event.Event[skipStatusUpdatedEventArgs]
	crowdfundedSkip                *event.Event[payment.Amount]
	crowdfundedTransactionReceived *event.Event[*types.CrowdfundedTransaction]
}

type skipStatusUpdatedEventArgs struct {
	skipAccountStatus *SkipAccountStatus
	rainAccountStatus *RainAccountStatus
}

// NewSkipManager returns an initialized skip manager
func NewSkipManager(log *log.Logger,
	rpc rpc.Client,
	skipAccount *wallet.Account,
	rainAccount *wallet.Account,
	collectorAccountAddress string,
	mediaQueue *MediaQueue,
	pricer *Pricer,
) *SkipManager {
	return &SkipManager{
		log:                            log,
		rpc:                            rpc,
		skipAccount:                    skipAccount,
		rainAccount:                    rainAccount,
		collectorAccountAddress:        collectorAccountAddress,
		mediaQueue:                     mediaQueue,
		pricer:                         pricer,
		statusUpdated:                  event.New[skipStatusUpdatedEventArgs](),
		crowdfundedSkip:                event.New[payment.Amount](),
		cachedSkipBalance:              payment.NewAmount(),
		cachedRainBalance:              payment.NewAmount(),
		currentSkipThreshold:           payment.NewAmount(),
		rainedByRequester:              payment.NewAmount(),
		skippingEnabled:                true,
		crowdfundedTransactionReceived: event.New[*types.CrowdfundedTransaction](),
	}
}

func (s *SkipManager) Worker(ctx context.Context) error {
	onMediaChanged, mediaChangedU := s.mediaQueue.mediaChanged.Subscribe(event.AtLeastOnceGuarantee)
	defer mediaChangedU()

	onSkippingAllowedUpdated, skippingAllowedUpdatedU := s.mediaQueue.skippingAllowedUpdated.Subscribe(event.AtLeastOnceGuarantee)
	defer skippingAllowedUpdatedU()

	s.UpdateSkipThreshold()

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
			s.UpdateSkipThreshold()
		case <-onSkippingAllowedUpdated:
			s.UpdateSkipThreshold()
		case <-mediaStartTimer.C:
			s.mediaStartNoSkipPeriodOver = true
			s.UpdateSkipThreshold()
		case <-mediaEndTimer.C:
			s.UpdateSkipThreshold()
		case <-startupNoSkipTimer.C:
			if !s.startupNoSkipPeriodOver {
				s.startupNoSkipPeriodOver = true
				s.UpdateSkipThreshold()
			}
		case <-ctx.Done():
			return nil
		}
	}
}

func (s *SkipManager) BalancesWorker(ctx context.Context, interval time.Duration) error {
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

func (s *SkipManager) retroactivelyUpdateForMedia(ctxCtx context.Context, mediaID string) error {
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

func (s *SkipManager) computeMediaEndTimer() *time.Timer {
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

func (s *SkipManager) checkBalances(ctx context.Context) error {
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
		s.statusUpdated.Notify(skipStatusUpdatedEventArgs{skipStatus, s.RainAccountStatus()}, false)
	}

	if skipStatus.SkipStatus != proto.SkipStatus_SKIP_STATUS_ALLOWED && skipStatus.SkipStatus != proto.SkipStatus_SKIP_STATUS_END_OF_MEDIA_PERIOD {
		return nil
	}
	if s.cachedSkipBalance.Cmp(s.currentSkipThreshold.Int) >= 0 {
		s.crowdfundedSkip.Notify(s.cachedSkipBalance, true)
		s.mediaQueue.SkipCurrentEntry()
	}

	return nil
}

func (s *SkipManager) computeSkipStatus() proto.SkipStatus {
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
func (s *SkipManager) EmptySkipAndRainAccounts(ctx context.Context, forMedia string, mediaRequestedBy *string) (skipTotal, rainTotal, rainedByRequester payment.Amount, err error) {
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
	s.statusUpdated.Notify(skipStatusUpdatedEventArgs{s.SkipAccountStatus(), s.RainAccountStatus()}, false)

	return skipTotal, rainTotal, totalRainedByRequester, nil
}

func (s *SkipManager) sendFullBalanceToCollector(ctx context.Context, account *wallet.Account, txType types.CrowdfundedTransactionType, forMedia, mediaRequestedBy *string) (payment.Amount, payment.Amount, error) {
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

func (s *SkipManager) receiveAndRegisterPendings(ctxCtx context.Context, account *wallet.Account, txType types.CrowdfundedTransactionType, forMedia *string, mediaRequestedBy *string) (payment.Amount, error) {
	recvPendings, err := account.ReceiveAndReturnPendings(dustThreshold)
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
	SkipStatus proto.SkipStatus
	Address    string
	Balance    payment.Amount
	Threshold  payment.Amount
}

func (s *SkipManager) SkipAccountStatus() *SkipAccountStatus {
	return &SkipAccountStatus{
		SkipStatus: s.computeSkipStatus(),
		Address:    s.skipAccount.Address(),
		Balance:    s.cachedSkipBalance,
		Threshold:  s.currentSkipThreshold,
	}
}

// RainAccountStatus returns the status of the tip account
type RainAccountStatus struct {
	Address string
	Balance payment.Amount
}

func (s *SkipManager) RainAccountStatus() *RainAccountStatus {
	return &RainAccountStatus{
		Address: s.rainAccount.Address(),
		Balance: s.cachedRainBalance,
	}
}

func (s *SkipManager) StatusUpdated() *event.Event[skipStatusUpdatedEventArgs] {
	return s.statusUpdated
}

func (s *SkipManager) UpdateSkipThreshold() {
	status := s.computeSkipStatus()
	if status != proto.SkipStatus_SKIP_STATUS_ALLOWED && status != proto.SkipStatus_SKIP_STATUS_END_OF_MEDIA_PERIOD {
		s.currentSkipThreshold = payment.NewAmount(big.NewInt(1).Exp(big.NewInt(2), big.NewInt(128), big.NewInt(0)))
	} else {
		s.currentSkipThreshold = s.pricer.ComputeCrowdfundedSkipPricing()
	}
	s.statusUpdated.Notify(skipStatusUpdatedEventArgs{s.SkipAccountStatus(), s.RainAccountStatus()}, false)
}

func (s *SkipManager) CrowdfundedSkippingEnabled() bool {
	return s.skippingEnabled
}

func (s *SkipManager) SetCrowdfundedSkippingEnabled(enabled bool) {
	s.skippingEnabled = enabled
	s.UpdateSkipThreshold()
}
