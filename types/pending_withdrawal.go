package types

import (
	"database/sql"
	"errors"
	"time"

	sq "github.com/Masterminds/squirrel"
	"github.com/gbl08ma/sqalx"
	"github.com/palantir/stacktrace"
	"github.com/shopspring/decimal"
)

// PendingWithdrawal represents a withdrawal that has been initiated but is not yet completed
type PendingWithdrawal struct {
	RewardsAddress string `dbKey:"true"`
	Amount         decimal.Decimal
	StartedAt      time.Time
}

// GetPendingWithdrawals returns all pending withdrawals
func GetPendingWithdrawals(node sqalx.Node) ([]*PendingWithdrawal, error) {
	s := sdb.Select().
		OrderBy("pending_withdrawal.started_at DESC, pending_withdrawal.rewards_address")
	p, err := GetWithSelect[*PendingWithdrawal](node, s)
	return p, stacktrace.Propagate(err, "")
}

// AddressHasPendingWithdrawal returns whether an address has a pending withdrawal
func AddressHasPendingWithdrawal(node sqalx.Node, address string) (bool, int, int, error) {
	tx, err := node.Beginx()
	if err != nil {
		return false, 0, 0, stacktrace.Propagate(err, "")
	}
	defer tx.Commit() // read-only tx

	var position int
	var total int
	err = sdb.Select("position", "total").
		FromSelect(
			sdb.Select(
				"rewards_address",
				"ROW_NUMBER() OVER (ORDER BY pending_withdrawal.started_at DESC, pending_withdrawal.rewards_address) AS position",
				"SUM(COUNT(*)) OVER () AS total").
				From("pending_withdrawal").
				GroupBy("rewards_address"), "queue_position").
		Where(sq.Eq{"rewards_address": address}).
		RunWith(tx).Scan(&position, &total)
	if err != nil && errors.Is(err, sql.ErrNoRows) {
		return false, 0, 0, nil
	} else if err != nil {
		return false, 0, 0, stacktrace.Propagate(err, "")
	}
	return true, position, total, nil
}

// InsertPendingWithdrawals inserts the passed pending withdrawals in the database
func InsertPendingWithdrawals(node sqalx.Node, items []*PendingWithdrawal) error {
	c := make([]interface{}, len(items))
	for i := range items {
		c[i] = items[i]
	}
	return stacktrace.Propagate(Insert(node, c...), "")
}

// Delete deletes the PendingWithdrawal and errors if the pending withdrawal no longer exists
func (obj *PendingWithdrawal) Delete(node sqalx.Node) error {
	return MustDelete(node, obj)
}
