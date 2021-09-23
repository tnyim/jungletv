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
	"github.com/tnyim/jungletv/types"
	"github.com/tnyim/jungletv/utils/event"
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
	cachedSkipBalance          Amount
	cachedRainBalance          Amount
	currentSkipThreshold       Amount
	currentMediaID             *string
	skippingEnabled            bool
	startupNoSkipPeriodOver    bool
	mediaStartNoSkipPeriodOver bool

	statusUpdated                  *event.Event
	crowdfundedSkip                *event.Event
	crowdfundedTransactionReceived *event.Event
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
		statusUpdated:                  event.New(),
		crowdfundedSkip:                event.New(),
		cachedSkipBalance:              Amount{big.NewInt(0)},
		cachedRainBalance:              Amount{big.NewInt(0)},
		currentSkipThreshold:           Amount{big.NewInt(0)},
		skippingEnabled:                true,
		crowdfundedTransactionReceived: event.New(),
	}
}

func (s *SkipManager) Worker(ctx context.Context, interval time.Duration) error {
	t := time.NewTicker(interval)

	onMediaChanged := s.mediaQueue.mediaChanged.Subscribe(event.AtLeastOnceGuarantee)
	defer s.mediaQueue.mediaChanged.Unsubscribe(onMediaChanged)

	s.UpdateSkipThreshold()

	startupNoSkipTimer := time.NewTimer(30 * time.Second)
	mediaStartTimer := time.NewTimer(time.Duration(math.MaxInt64))

	for {
		mediaEndTimer := s.computeMediaEndTimer()
		select {
		case <-t.C:
			err := s.checkBalances(ctx)
			if err != nil {
				return stacktrace.Propagate(err, "")
			}
		case v := <-onMediaChanged:
			s.mediaStartNoSkipPeriodOver = false
			if v[0] == nil {
				s.currentMediaID = nil
				mediaStartTimer.Reset(time.Duration(math.MaxInt64))
			} else {
				mediaStartTimer.Reset(10 * time.Second)
				id := v[0].(MediaQueueEntry).QueueID()
				s.currentMediaID = &id
				err := s.retroactivelyUpdateForMedia(ctx, id)
				if err != nil {
					return stacktrace.Propagate(err, "")
				}
			}
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

func (s *SkipManager) retroactivelyUpdateForMedia(ctxCtx context.Context, mediaID string) error {
	ctx, err := BeginTransaction(ctxCtx)
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
		return time.NewTimer(9999 * time.Hour)
	}
	return time.NewTimer(currentEntry.MediaInfo().Length() - NoSkipPeriodBeforeMediaEnd - currentEntry.PlayedFor())
}

func (s *SkipManager) checkBalances(ctx context.Context) error {
	s.accountMovementLock.Lock()
	defer s.accountMovementLock.Unlock()
	err := s.receiveAndRegisterPendings(ctx, s.skipAccount, types.CrowdfundedTransactionTypeSkip, s.currentMediaID)
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
	s.cachedSkipBalance = Amount{skipBalance}

	err = s.receiveAndRegisterPendings(ctx, s.rainAccount, types.CrowdfundedTransactionTypeRain, s.currentMediaID)
	if err != nil {
		return stacktrace.Propagate(err, "failed to receive pendings in rain account")
	}

	oldRainBalance := s.cachedRainBalance
	rainBalance, _, err := s.rainAccount.Balance()
	if err != nil {
		return stacktrace.Propagate(err, "failed to get balance of rain account")
	}
	s.cachedRainBalance = Amount{rainBalance}

	skipStatus := s.SkipAccountStatus()
	if oldSkipBalance.Cmp(s.cachedSkipBalance.Int) != 0 || oldRainBalance.Cmp(s.cachedRainBalance.Int) != 0 {
		s.statusUpdated.Notify(skipStatus, s.RainAccountStatus())
	}

	if skipStatus.SkipStatus != proto.SkipStatus_SKIP_STATUS_ALLOWED && skipStatus.SkipStatus != proto.SkipStatus_SKIP_STATUS_END_OF_MEDIA_PERIOD {
		return nil
	}
	if s.cachedSkipBalance.Cmp(s.currentSkipThreshold.Int) >= 0 {
		s.crowdfundedSkip.Notify(s.cachedSkipBalance)
		s.mediaQueue.SkipCurrentEntry()
	}

	return nil
}

func (s *SkipManager) computeSkipStatus() proto.SkipStatus {
	currentEntry, isCurrentlyPlaying := s.mediaQueue.CurrentlyPlaying()
	if !isCurrentlyPlaying {
		return proto.SkipStatus_SKIP_STATUS_NO_MEDIA
	}
	if !s.skippingEnabled {
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
func (s *SkipManager) EmptySkipAndRainAccounts(ctx context.Context, forMedia string) (skipTotal, rainTotal Amount, err error) {
	s.accountMovementLock.Lock()
	defer s.accountMovementLock.Unlock()

	skipTotal, err = s.sendFullBalanceToCollector(ctx, s.skipAccount, types.CrowdfundedTransactionTypeSkip, &forMedia)
	if err != nil {
		return Amount{}, Amount{}, stacktrace.Propagate(err, "failed to empty skip account")
	}

	rainTotal, err = s.sendFullBalanceToCollector(ctx, s.rainAccount, types.CrowdfundedTransactionTypeRain, &forMedia)
	if err != nil {
		return Amount{}, Amount{}, stacktrace.Propagate(err, "failed to empty rain account")
	}

	s.cachedSkipBalance = Amount{big.NewInt(0)}
	s.cachedRainBalance = Amount{big.NewInt(0)}
	s.statusUpdated.Notify(s.SkipAccountStatus(), s.RainAccountStatus())

	return skipTotal, rainTotal, nil
}

func (s *SkipManager) sendFullBalanceToCollector(ctx context.Context, account *wallet.Account, txType types.CrowdfundedTransactionType, forMedia *string) (Amount, error) {
	err := s.receiveAndRegisterPendings(ctx, account, txType, forMedia)
	if err != nil {
		return Amount{}, stacktrace.Propagate(err, "failed to receive pendings in account")
	}

	// we use AccountInfo instead of balance because we want the balance including unconfirmed blocks
	info, err := s.rpc.AccountInfo(account.Address())
	if err != nil {
		return Amount{}, stacktrace.Propagate(err, "failed to get balance of account")
	}
	balance := &info.Balance.Int

	totalBalance := Amount{big.NewInt(0)}
	totalBalance.Add(totalBalance.Int, balance)

	if balance.Cmp(big.NewInt(0)) > 0 {
		_, err = account.Send(s.collectorAccountAddress, balance)
		if err != nil {
			return Amount{}, stacktrace.Propagate(err, "failed to empty account")
		}
	}
	return totalBalance, nil
}

func (s *SkipManager) receiveAndRegisterPendings(ctxCtx context.Context, account *wallet.Account, txType types.CrowdfundedTransactionType, forMedia *string) error {
	recvPendings, err := account.ReceiveAndReturnPendings(dustThreshold)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	if len(recvPendings) == 0 {
		return nil
	}

	ctx, err := BeginTransaction(ctxCtx)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	defer ctx.Rollback()

	transactions := []*types.CrowdfundedTransaction{}
	now := time.Now()
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
		s.crowdfundedTransactionReceived.Notify(tx)
	}

	err = types.InsertCrowdfundedTransactions(ctx, transactions)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	return stacktrace.Propagate(ctx.Commit(), "")
}

// SkipAccountStatus returns the status of the skip account
type SkipAccountStatus struct {
	SkipStatus proto.SkipStatus
	Address    string
	Balance    Amount
	Threshold  Amount
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
	Balance Amount
}

func (s *SkipManager) RainAccountStatus() *RainAccountStatus {
	return &RainAccountStatus{
		Address: s.rainAccount.Address(),
		Balance: s.cachedRainBalance,
	}
}

func (s *SkipManager) StatusUpdated() *event.Event {
	return s.statusUpdated
}

func (s *SkipManager) UpdateSkipThreshold() {
	status := s.computeSkipStatus()
	if status != proto.SkipStatus_SKIP_STATUS_ALLOWED && status != proto.SkipStatus_SKIP_STATUS_END_OF_MEDIA_PERIOD {
		s.currentSkipThreshold = Amount{big.NewInt(1).Exp(big.NewInt(2), big.NewInt(128), big.NewInt(0))}
	} else {
		s.currentSkipThreshold = s.pricer.ComputeCrowdfundedSkipPricing()
	}
	s.statusUpdated.Notify(s.SkipAccountStatus(), s.RainAccountStatus())
}

func (s *SkipManager) SetCrowdfundedSkippingEnabled(enabled bool) {
	s.skippingEnabled = enabled
	s.UpdateSkipThreshold()
}
