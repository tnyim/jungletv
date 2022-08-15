package withdrawalhandler

import (
	"context"
	"encoding/hex"
	"fmt"
	"log"
	"math/big"
	"time"

	"github.com/DisgoOrg/disgohook/api"
	"github.com/hectorchu/gonano/rpc"
	"github.com/hectorchu/gonano/wallet"
	"github.com/palantir/stacktrace"
	"github.com/shopspring/decimal"
	"github.com/tnyim/jungletv/server/components/payment"
	"github.com/tnyim/jungletv/server/components/pricer"
	"github.com/tnyim/jungletv/types"
	"github.com/tnyim/jungletv/utils/event"
	"github.com/tnyim/jungletv/utils/transaction"
	"gopkg.in/alexcesaro/statsd.v2"
)

// Handler handles withdrawals
type Handler struct {
	log                          *log.Logger
	modLogWebhook                api.WebhookClient
	statsClient                  *statsd.Client
	collectorAccountQueue        chan func(*wallet.Account, *rpc.Client, *rpc.Client)
	completingPendingWithdrawals bool
	rpcClient                    *rpc.Client

	pendingWithdrawalCreated *event.Event[[]*types.PendingWithdrawal]

	highestSeenBlockCount uint64
}

func New(log *log.Logger,
	statsClient *statsd.Client,
	collectorAccountQueue chan func(*wallet.Account, *rpc.Client, *rpc.Client),
	rpcClient *rpc.Client,
	modLogWebhook api.WebhookClient) *Handler {
	return &Handler{
		log:                   log,
		statsClient:           statsClient,
		collectorAccountQueue: collectorAccountQueue,
		rpcClient:             rpcClient,
		modLogWebhook:         modLogWebhook,

		pendingWithdrawalCreated: event.New[[]*types.PendingWithdrawal](),
	}
}

// Worker waits for pending withdrawals and completes them
func (w *Handler) Worker(ctx context.Context) error {
	onPendingWithdrawalCreated, pendingWithdrawalCreatedU := w.pendingWithdrawalCreated.Subscribe(event.AtLeastOnceGuarantee)
	defer pendingWithdrawalCreatedU()

	t := time.NewTicker(5 * time.Minute)
	defer t.Stop()
	firstCheckTimer := time.NewTimer(1 * time.Minute)
	defer firstCheckTimer.Stop()
	checkTicker := time.NewTicker(1 * time.Hour)
	defer checkTicker.Stop()
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
		case <-firstCheckTimer.C:
			err := w.warnAboutInvalidWithdrawals(ctx)
			if err != nil {
				return stacktrace.Propagate(err, "")
			}
		case <-checkTicker.C:
			err := w.warnAboutInvalidWithdrawals(ctx)
			if err != nil {
				return stacktrace.Propagate(err, "")
			}

			if w.isNodeSynced() {
				err = w.findAndUndoInvalidWithdrawals(ctx)
				if err != nil {
					return stacktrace.Propagate(err, "")
				}
			}
		case <-ctx.Done():
			return nil
		}
	}
}

// AutoWithdrawBalances initiates withdrawals for all balances that match the automatic withdrawal criteria
func (w *Handler) AutoWithdrawBalances(ctxCtx context.Context) error {
	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	defer ctx.Rollback()

	threshold := new(big.Int).Mul(pricer.BananoUnit, big.NewInt(10)) // 10 BAN

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
func (w *Handler) WithdrawBalances(ctxCtx context.Context, balances []*types.RewardBalance) error {
	if len(balances) == 0 {
		return nil
	}
	ctx, err := transaction.Begin(ctxCtx)
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

	ctx.DeferToCommit(func() { w.pendingWithdrawalCreated.Notify(pendingWithdrawals, false) })
	return stacktrace.Propagate(ctx.Commit(), "")
}

// CompleteAllPendingWithdrawals completes all pending withdrawals
// If the process is interrupted, it's possible that not all pending withdrawals will have gone out
// In that case, the ones that did not go out will remain as pending withdrawals
func (w *Handler) CompleteAllPendingWithdrawals(ctxCtx context.Context) error {
	if w.completingPendingWithdrawals {
		return nil
	}
	w.completingPendingWithdrawals = true
	defer func() { w.completingPendingWithdrawals = false }()

	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	defer ctx.Commit() // read-only tx EXCLUSIVELY for obtaining a list of pending withdrawals

	pendingWithdrawals, err := types.GetPendingWithdrawals(ctx)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	go w.statsClient.Gauge("pending_withdrawals", len(pendingWithdrawals))
	if len(pendingWithdrawals) == 0 {
		return nil
	}

	// CompleteWithdrawals should not use this transaction, it should use individual transactions internally
	// that will lock-delete the specific pending_withdrawal row as it proceeds
	err = w.CompleteWithdrawals(ctxCtx, pendingWithdrawals)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	go w.statsClient.Gauge("pending_withdrawals", 0)
	return nil
}

// CompleteWithdrawals completes the specified pending withdrawals
// (do not pass a transaction as context)
// If the process is interrupted, it's possible that not all pending withdrawals will have gone out
// In that case, the ones that did not go out will remain as pending withdrawals
func (w *Handler) CompleteWithdrawals(ctxCtx context.Context, pending []*types.PendingWithdrawal) error {
	for i, p := range pending {
		err := w.CompleteWithdrawal(ctxCtx, p, i == 0)
		if err != nil {
			return stacktrace.Propagate(err, "")
		}
	}
	return nil
}

// CompleteWithdrawal completes the specified withdrawal in a fully separate database transaction
// (do not pass a transaction as context)
// It removes the pending withdrawal, sends the transaction to the network and creates a matching completed withdrawal
func (w *Handler) CompleteWithdrawal(ctxCtx context.Context, pending *types.PendingWithdrawal, recvPending bool) error {
	timing := w.statsClient.NewTiming()
	defer timing.Send("complete_withdrawal")
	ctx, err := transaction.Begin(ctxCtx)
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
	w.collectorAccountQueue <- func(collectorAccount *wallet.Account, _, _ *rpc.Client) {
		if recvPending {
			err = collectorAccount.ReceivePendings(pricer.DustThreshold)
			if err != nil {
				w.log.Printf("Error receiving pendings on collector account: %v", err)
			}
		}
		blockHash, err = collectorAccount.Send(pending.RewardsAddress, pending.Amount.BigInt())
		done <- struct{}{}
	}
	<-done
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	withdrawal := &types.Withdrawal{
		TxHash:         blockHash.String(),
		RewardsAddress: pending.RewardsAddress,
		Amount:         pending.Amount,
		StartedAt:      pending.StartedAt,
		CompletedAt:    time.Now(),
	}
	err = withdrawal.Insert(ctx)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	return stacktrace.Propagate(ctx.Commit(), "")
}

// findInvalidWithdrawals checks the supposedly complete withdrawals to see if their blocks are still in the ledger
// (no matter if confirmed or not). If they are not, it adds their hashes to the slice that is returned
// In (ba)nano v22+ the work watcher has been removed and it's possible that a block submitted with RPC action "publish"
// actually never confirms on the ledger (this can happen e.g. if the node is having internet connectivity issues)
func (w *Handler) findInvalidWithdrawals(ctxCtx context.Context, minAge time.Duration, maxAge time.Duration) ([]string, payment.Amount, error) {
	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return nil, payment.Amount{}, stacktrace.Propagate(err, "")
	}
	defer ctx.Commit() // read-only tx

	result := []string{}

	now := time.Now()
	checkBefore := now.Add(-minAge)
	checkAfter := now.Add(-maxAge)

	batchSize := uint64(200)
	total := decimal.Zero
	for offset := uint64(0); ; offset += batchSize {
		withdrawals, _, err := types.GetWithdrawalsCompletedBetween(ctx, checkAfter, checkBefore, &types.PaginationParams{
			Offset: offset,
			Limit:  batchSize,
		})
		if err != nil {
			return nil, payment.Amount{}, stacktrace.Propagate(err, "")
		}
		if len(withdrawals) == 0 {
			break
		}

		blockHashes := []rpc.BlockHash{}
		for _, withdrawal := range withdrawals {
			bh, err := hex.DecodeString(withdrawal.TxHash)
			if err != nil {
				return nil, payment.Amount{}, stacktrace.Propagate(err, "invalid hex in withdrawal block hash")
			}
			blockHashes = append(blockHashes, rpc.BlockHash(bh))
		}

		blocksInfo, _, err := w.rpcClient.BlocksInfoIncludingNotFound(blockHashes)
		if err != nil {
			return nil, payment.Amount{}, stacktrace.Propagate(err, "")
		}

		for _, withdrawal := range withdrawals {
			_, ok := blocksInfo[withdrawal.TxHash]
			if !ok {
				result = append(result, withdrawal.TxHash)
				total = total.Add(withdrawal.Amount)
			}
		}
	}

	return result, payment.NewAmountFromDecimal(total), nil
}

// undoInvalidWithdrawal undoes a withdrawal which was not found on the ledger after a tolerance period
// It does not confirm that the withdrawal was indeed not found
func (w *Handler) undoInvalidWithdrawal(ctxCtx context.Context, txHash string) error {
	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	defer ctx.Rollback()

	withdrawal, err := types.GetWithdrawal(ctx, txHash)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	err = withdrawal.Delete(ctx)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	_, err = types.AdjustRewardBalanceOfAddresses(ctx, []string{withdrawal.RewardsAddress}, withdrawal.Amount)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	return stacktrace.Propagate(ctx.Commit(), "")
}

func (w *Handler) warnAboutInvalidWithdrawals(ctx context.Context) error {
	closeToBeingUndone, _, err := w.findInvalidWithdrawals(ctx, 10*time.Second, 48*time.Hour)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	for _, withdrawalThatMightBeUndone := range closeToBeingUndone {
		w.log.Printf("complete withdrawal %s was not found on the ledger and may be undone soon", withdrawalThatMightBeUndone)
		if w.modLogWebhook != nil {
			_, err = w.modLogWebhook.SendContent(
				fmt.Sprintf("Complete withdrawal `%s` was not found on the ledger and is close to being undone.\n"+
					"You may use a block explorer to confirm that this block hash was indeed unseen outside of our node",
					withdrawalThatMightBeUndone))
			if err != nil {
				w.log.Println("Failed to send mod log webhook:", err)
			}
		}
	}
	return nil
}

// findAndUndoInvalidWithdrawals finds recent withdrawals whose blocks are not on-chain, deletes them from our system
// and restores their value in the users' balances
func (w *Handler) findAndUndoInvalidWithdrawals(ctxCtx context.Context) error {
	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	defer ctx.Rollback()

	txToUndo, totalAmount, err := w.findInvalidWithdrawals(ctx, 1*time.Hour, 48*time.Hour)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	if len(txToUndo) == 0 {
		return nil
	}

	w.log.Printf("found %d withdrawals whose blocks are not on the ledger, with a total amount of %s. Undoing...", len(txToUndo), totalAmount.String())

	for _, txHash := range txToUndo {
		err = w.undoInvalidWithdrawal(ctx, txHash)
		if err != nil {
			return stacktrace.Propagate(err, "")
		}
		w.log.Printf("undid withdrawal %s", txHash)
		if w.modLogWebhook != nil {
			_, err = w.modLogWebhook.SendContent(fmt.Sprintf("Undid withdrawal `%s`", txHash))
			if err != nil {
				w.log.Println("Failed to send mod log webhook:", err)
			}
		}
	}
	go w.statsClient.Count("withdrawal_undone", len(txToUndo))
	return stacktrace.Propagate(ctx.Commit(), "")
}

func (w *Handler) isNodeSynced() bool {
	cemented, count, _, err := w.rpcClient.BlockCount()
	if err != nil {
		return false
	}
	if count < w.highestSeenBlockCount {
		// this means we switched nodes to one where the ledger has fewer registered blocks
		return false
	}
	w.highestSeenBlockCount = count
	return count-cemented < 10
	// TODO also look at the result of RPC "action": "telemetry" (not supported by gonano yet)
	// to compare our block count to the peer's average
}

// PendingWithdrawalsCreated is the event that is fired when new pending withdrawals are created
func (w *Handler) PendingWithdrawalsCreated() *event.Event[[]*types.PendingWithdrawal] {
	return w.pendingWithdrawalCreated
}
