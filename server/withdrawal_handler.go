package server

import (
	"context"
	"log"
	"math/big"
	"time"

	"github.com/hectorchu/gonano/rpc"
	"github.com/hectorchu/gonano/wallet"
	"github.com/palantir/stacktrace"
	uuid "github.com/satori/go.uuid"
	"github.com/shopspring/decimal"
	"github.com/tnyim/jungletv/types"
	"github.com/tnyim/jungletv/utils/event"
	"gopkg.in/alexcesaro/statsd.v2"
)

// WithdrawalHandler handles withdrawals
type WithdrawalHandler struct {
	log                          *log.Logger
	statsClient                  *statsd.Client
	collectorAccountQueue        chan func(*wallet.Account, rpc.Client, rpc.Client)
	completingPendingWithdrawals bool

	pendingWithdrawalCreated *event.Event
}

func NewWithdrawalHandler(log *log.Logger,
	statsClient *statsd.Client,
	collectorAccountQueue chan func(*wallet.Account, rpc.Client, rpc.Client)) *WithdrawalHandler {
	return &WithdrawalHandler{
		log:                   log,
		statsClient:           statsClient,
		collectorAccountQueue: collectorAccountQueue,

		pendingWithdrawalCreated: event.New(),
	}
}

// Worker waits for pending withdrawals and completes them
func (w *WithdrawalHandler) Worker(ctx context.Context) error {
	onPendingWithdrawalCreated := w.pendingWithdrawalCreated.Subscribe(event.AtLeastOnceGuarantee)
	defer w.pendingWithdrawalCreated.Unsubscribe(onPendingWithdrawalCreated)

	t := time.NewTicker(5 * time.Minute)
	for {
		select {
		case <-onPendingWithdrawalCreated:
			err := w.CompleteAllPendingWithdrawals(ctx)
			if err != nil {
				return stacktrace.Propagate(err, "")
			}
		case <-t.C:
			err := w.CompleteAllPendingWithdrawals(ctx)
			if err != nil {
				return stacktrace.Propagate(err, "")
			}
			err = w.AutoWithdrawBalances(ctx)
			if err != nil {
				return stacktrace.Propagate(err, "")
			}
		case <-ctx.Done():
			return nil
		}
	}
}

// AutoWithdrawBalances initiates withdrawals for all balances that match the automatic withdrawal criteria
func (w *WithdrawalHandler) AutoWithdrawBalances(ctxCtx context.Context) error {
	ctx, err := BeginTransaction(ctxCtx)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	defer ctx.Rollback()

	threshold := new(big.Int).Mul(BananoUnit, big.NewInt(10)) // 10 BAN

	balances, err := types.GetRewardBalancesReadyForAutoWithdrawal(ctx, decimal.NewFromBigInt(threshold, 0), time.Now().Add(-24*time.Hour))
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	err = w.WithdrawBalances(ctx, balances)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	return stacktrace.Propagate(ctx.Commit(), "")
}

// WithdrawBalances initiates withdraws for the specified balances
func (w *WithdrawalHandler) WithdrawBalances(ctxCtx context.Context, balances []*types.RewardBalance) error {
	if len(balances) == 0 {
		return nil
	}
	ctx, err := BeginTransaction(ctxCtx)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	defer ctx.Rollback()

	now := time.Now()
	pendingWithdrawals := make([]*types.PendingWithdrawal, len(balances))
	userAccounts := make([]string, len(balances))
	for i, balance := range balances {
		pendingWithdrawals[i] = &types.PendingWithdrawal{
			RewardsAddress: balance.RewardsAddress,
			Amount:         balance.Balance,
			StartedAt:      now,
		}
		userAccounts[i] = balance.RewardsAddress
	}

	err = types.ZeroRewardBalanceOfAddresses(ctx, userAccounts)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	err = types.InsertPendingWithdrawals(ctx, pendingWithdrawals)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	ctx.DeferToCommit(func() { w.pendingWithdrawalCreated.Notify(pendingWithdrawals) })
	return stacktrace.Propagate(ctx.Commit(), "")
}

// CompleteAllPendingWithdrawals completes all pending withdrawals
// If the process is interrupted, it's possible that not all pending withdrawals will have gone out
// In that case, the ones that did not go out will remain as pending withdrawals
func (w *WithdrawalHandler) CompleteAllPendingWithdrawals(ctxCtx context.Context) error {
	if w.completingPendingWithdrawals {
		return nil
	}
	w.completingPendingWithdrawals = true
	defer func() { w.completingPendingWithdrawals = false }()

	ctx, err := BeginTransaction(ctxCtx)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	defer ctx.Commit() // read-only tx EXCLUSIVELY for obtaining a list of pending withdrawals

	pendingWithdrawals, err := types.GetPendingWithdrawals(ctx)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	if len(pendingWithdrawals) == 0 {
		return nil
	}

	// CompleteWithdrawals should not use this transaction, it should use individual transactions internally
	// that will lock-delete the specific pending_withdrawal row as it proceeds
	err = w.CompleteWithdrawals(ctxCtx, pendingWithdrawals)
	return stacktrace.Propagate(err, "")
}

// CompleteWithdrawals completes the specified pending withdrawals
// (do not pass a transaction as context)
// If the process is interrupted, it's possible that not all pending withdrawals will have gone out
// In that case, the ones that did not go out will remain as pending withdrawals
func (w *WithdrawalHandler) CompleteWithdrawals(ctxCtx context.Context, pending []*types.PendingWithdrawal) error {
	for _, p := range pending {
		err := w.CompleteWithdrawal(ctxCtx, p)
		if err != nil {
			return stacktrace.Propagate(err, "")
		}
	}
	return nil
}

// CompleteWithdrawal completes the specified withdrawal in a fully separate database transaction
// (do not pass a transaction as context)
// It removes the pending withdrawal, sends the transaction to the network and creates a matching completed withdrawal
func (w *WithdrawalHandler) CompleteWithdrawal(ctxCtx context.Context, pending *types.PendingWithdrawal) error {
	timing := w.statsClient.NewTiming()
	defer timing.Send("complete_withdrawal")
	ctx, err := BeginTransaction(ctxCtx)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	defer ctx.Rollback() // if things go wrong, the delete of the pending_withdrawal is rolled back

	// this call will error if the pending withdrawal no longer exists (avoids double spends)
	err = pending.Delete(ctx)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	done := make(chan struct{})
	var blockHash rpc.BlockHash
	w.collectorAccountQueue <- func(collectorAccount *wallet.Account, _, _ rpc.Client) {
		blockHash, err = collectorAccount.Send(pending.RewardsAddress, pending.Amount.BigInt())
		done <- struct{}{}
	}
	<-done
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	withdrawal := &types.Withdrawal{
		ID:             uuid.NewV4().String(),
		RewardsAddress: pending.RewardsAddress,
		Amount:         pending.Amount,
		StartedAt:      pending.StartedAt,
		CompletedAt:    time.Now(),
		TxHash:         blockHash.String(),
	}
	err = withdrawal.Insert(ctx)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	return stacktrace.Propagate(ctx.Commit(), "")
}
