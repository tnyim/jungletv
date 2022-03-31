package types

import (
	sq "github.com/Masterminds/squirrel"
	"github.com/gbl08ma/sqalx"
	"github.com/palantir/stacktrace"
)

// PointsBalance is the points balance of an address
type PointsBalance struct {
	RewardsAddress string `dbKey:"true"`
	Balance        int
}

// GetPointsBalanceForAddress returns the points balance of the given address
func GetPointsBalanceForAddress(node sqalx.Node, address string) (*PointsBalance, error) {
	s := sdb.Select().
		Where(sq.Eq{"points_balance.rewards_address": address})
	items, err := GetWithSelect[*PointsBalance](node, s)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	if len(items) == 0 {
		return &PointsBalance{
			RewardsAddress: address,
		}, nil
	}
	return items[0], nil
}

// AdjustPointsBalanceOfAddress adjusts the points balance of the specified address by the specified amount
func AdjustPointsBalanceOfAddress(node sqalx.Node, address string, amount int) error {
	tx, err := node.Beginx()
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	defer tx.Rollback()

	// a CHECK (balance >= 0) exists in the table to prevent overdraw, even in concurrent transactions
	builder := sdb.Insert("points_balance").Columns("rewards_address", "balance").Values(address, amount)
	query, args, err := builder.Suffix(`
		ON CONFLICT (rewards_address)
		DO UPDATE SET balance = points_balance.balance + EXCLUDED.balance`).
		ToSql()
	logger.Println(query, args, err)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	balances := []*RewardBalance{}
	err = tx.Tx().Select(&balances, query, args...)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	return stacktrace.Propagate(tx.Commit(), "")
}
