package types

import (
	"time"

	sq "github.com/Masterminds/squirrel"
	"github.com/gbl08ma/sqalx"
	"github.com/palantir/stacktrace"
	"github.com/shopspring/decimal"
)

// RewardBalance represents the balance of not-yet-withdrawn rewards for a user
type RewardBalance struct {
	RewardsAddress string          `db:"rewards_address" dbKey:"true"`
	Balance        decimal.Decimal `db:"balance"`
	UpdatedAt      time.Time       `db:"updated_at"`
}

// getRewardBalanceWithSelect returns a slice with all reward balances that match the conditions in sbuilder
func getRewardBalanceWithSelect(node sqalx.Node, sbuilder sq.SelectBuilder) ([]*RewardBalance, uint64, error) {
	values, totalCount, err := GetWithSelect(node, &RewardBalance{}, sbuilder, true)
	if err != nil {
		return nil, totalCount, err
	}

	converted := make([]*RewardBalance, len(values))
	for i := range values {
		converted[i] = values[i].(*RewardBalance)
	}

	return converted, totalCount, nil
}

// GetRewardBalanceOfAddress returns the reward balance for the specified address, if one exists
func GetRewardBalanceOfAddress(node sqalx.Node, address string) (*RewardBalance, error) {
	s := sdb.Select().
		Where(sq.Eq{"reward_balance.rewards_address": address})
	items, _, err := getRewardBalanceWithSelect(node, s)
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
func GetRewardBalancesReadyForAutoWithdrawal(node sqalx.Node, minBalance decimal.Decimal, unchangedSince time.Time) ([]*RewardBalance, error) {
	s := sdb.Select().
		Where(sq.Gt{"reward_balance.balance": decimal.Zero}).
		Where(sq.Or{
			sq.GtOrEq{"reward_balance.balance": minBalance},
			sq.Lt{"reward_balance.updated_at": unchangedSince},
		}).
		Where(sq.Expr("reward_balance.rewards_address NOT IN (SELECT rewards_address FROM pending_withdrawal)"))
	items, _, err := getRewardBalanceWithSelect(node, s)
	return items, stacktrace.Propagate(err, "")
}

// GetTotalOfRewardBalances returns the sum of all balances
func GetTotalOfRewardBalances(node sqalx.Node) (decimal.Decimal, error) {
	tx, err := node.Beginx()
	if err != nil {
		return decimal.Zero, stacktrace.Propagate(err, "")
	}
	defer tx.Commit() // read-only tx

	var tPtr *decimal.Decimal // the sum may be NULL if there are no rows
	err = sdb.Select("SUM(balance)").From("reward_balance").RunWith(tx).Scan(&tPtr)
	if tPtr == nil {
		return decimal.Zero, nil
	}
	return *tPtr, stacktrace.Propagate(err, "")
}

// AdjustRewardBalanceOfAddresses adjusts the balance of the specified addresses by the specified amount
func AdjustRewardBalanceOfAddresses(node sqalx.Node, addresses []string, amount decimal.Decimal) ([]*RewardBalance, error) {
	tx, err := node.Beginx()
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	defer tx.Rollback()

	now := time.Now()
	valueMaps := make([]map[string]interface{}, len(addresses))
	for i, address := range addresses {
		valueMaps[i] = map[string]interface{}{
			"rewards_address": address,
			"balance":         amount,
			"updated_at":      now,
		}
	}

	balances := []*RewardBalance{}

	err = tx.Tx().Select(&balances, `
		INSERT INTO reward_balance (rewards_address, balance, updated_at)
		VALUES (:rewards_address, :balance, :updated_at)
		ON CONFLICT (rewards_address)
		DO UPDATE SET balance = balance + EXCLUDED.balance, updated_at = EXCLUDED.updated_at
		RETURNING rewards_address, balance, updated_at`,
		valueMaps)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	return balances, stacktrace.Propagate(tx.Commit(), "")
}

// ZeroRewardBalanceOfAddresses zeroes the balance of the specified addresses
func ZeroRewardBalanceOfAddresses(node sqalx.Node, addresses []string) error {
	tx, err := node.Beginx()
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	defer tx.Rollback()

	_, err = sdb.Update("reward_balance").
		Set("balance", decimal.Zero).
		Set("updated_at", time.Now()).
		Where(sq.Eq{"rewards_address": addresses}).
		RunWith(tx).Exec()
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	return stacktrace.Propagate(tx.Commit(), "")
}
