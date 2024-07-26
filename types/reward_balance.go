package types

import (
	"time"

	sq "github.com/Masterminds/squirrel"
	"github.com/palantir/stacktrace"
	"github.com/shopspring/decimal"
	"github.com/tnyim/jungletv/utils/transaction"
)

// RewardBalance represents the balance of not-yet-withdrawn rewards for a user
type RewardBalance struct {
	RewardsAddress string          `db:"rewards_address" dbKey:"true"`
	Balance        decimal.Decimal `db:"balance"`
	UpdatedAt      time.Time       `db:"updated_at"`
}

// GetRewardBalanceOfAddress returns the reward balance for the specified address, if one exists
func GetRewardBalanceOfAddress(ctx transaction.WrappingContext, address string) (*RewardBalance, error) {
	s := sdb.Select().
		Where(sq.Eq{"reward_balance.rewards_address": address})
	items, err := GetWithSelect[*RewardBalance](ctx, s)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	if len(items) == 0 {
		return &RewardBalance{
			RewardsAddress: address,
		}, nil
	}
	return items[0], nil
}

// GetRewardBalancesReadyForAutoWithdrawal returns rewards balances
// that are ready for automated withdrawal according to the passed parameters
func GetRewardBalancesReadyForAutoWithdrawal(ctx transaction.WrappingContext, minBalance decimal.Decimal, unchangedSince time.Time) ([]*RewardBalance, error) {
	s := sdb.Select().
		Where(sq.Gt{"reward_balance.balance": decimal.Zero}).
		Where(sq.Or{
			sq.GtOrEq{"reward_balance.balance": minBalance},
			sq.Lt{"reward_balance.updated_at": unchangedSince},
		}).
		Where(sq.Expr("reward_balance.rewards_address NOT IN (SELECT rewards_address FROM pending_withdrawal)"))
	items, err := GetWithSelect[*RewardBalance](ctx, s)
	return items, stacktrace.Propagate(err, "")
}

// GetTotalOfRewardBalances returns the sum of all balances
func GetTotalOfRewardBalances(ctx transaction.WrappingContext) (decimal.Decimal, error) {
	ctx, err := transaction.Begin(ctx)
	if err != nil {
		return decimal.Zero, stacktrace.Propagate(err, "")
	}
	defer ctx.Commit() // read-only tx

	var tPtr *decimal.Decimal // the sum may be NULL if there are no rows
	err = sdb.Select("SUM(balance)").From("reward_balance").RunWith(ctx).ScanContext(ctx, &tPtr)
	if tPtr == nil {
		return decimal.Zero, nil
	}
	return *tPtr, stacktrace.Propagate(err, "")
}

// AdjustRewardBalanceOfAddresses adjusts the balance of the specified addresses by the specified amount
func AdjustRewardBalanceOfAddresses(ctx transaction.WrappingContext, addresses []string, amount decimal.Decimal) ([]*RewardBalance, error) {
	ctx, err := transaction.Begin(ctx)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	defer ctx.Rollback()

	now := time.Now()

	builder := sdb.Insert("reward_balance").Columns("rewards_address", "balance", "updated_at")
	for _, address := range addresses {
		builder = builder.Values(address, amount, now)
	}
	query, args, err := builder.Suffix(`
		ON CONFLICT (rewards_address)
		DO UPDATE SET balance = reward_balance.balance + EXCLUDED.balance, updated_at = EXCLUDED.updated_at
		RETURNING rewards_address, balance, updated_at`).
		ToSql()
	logger.Println(query, args, err)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	balances := []*RewardBalance{}
	err = ctx.Tx().SelectContext(ctx, &balances, query, args...)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	return balances, stacktrace.Propagate(ctx.Commit(), "")
}

// ZeroRewardBalanceOfAddresses zeroes the balance of the specified addresses
func ZeroRewardBalanceOfAddresses(ctx transaction.WrappingContext, addresses []string) error {
	ctx, err := transaction.Begin(ctx)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	defer ctx.Rollback()

	_, err = sdb.Update("reward_balance").
		Set("balance", decimal.Zero).
		Set("updated_at", time.Now()).
		Where(sq.Eq{"rewards_address": addresses}).
		RunWith(ctx).ExecContext(ctx)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	return stacktrace.Propagate(ctx.Commit(), "")
}
