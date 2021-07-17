package types

import (
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

// getPendingWithdrawalWithSelect returns a slice with all pending withdrawals that match the conditions in sbuilder
func getPendingWithdrawalWithSelect(node sqalx.Node, sbuilder sq.SelectBuilder) ([]*PendingWithdrawal, uint64, error) {
	values, totalCount, err := GetWithSelect(node, &PendingWithdrawal{}, sbuilder, true)
	if err != nil {
		return nil, totalCount, err
	}

	converted := make([]*PendingWithdrawal, len(values))
	for i := range values {
		converted[i] = values[i].(*PendingWithdrawal)
	}

	return converted, totalCount, nil
}

// GetPendingWithdrawals returns all pending withdrawals
func GetPendingWithdrawals(node sqalx.Node) ([]*PendingWithdrawal, error) {
	s := sdb.Select().
		OrderBy("pending_withdrawal.started_at DESC")
	p, _, err := getPendingWithdrawalWithSelect(node, s)
	return p, stacktrace.Propagate(err, "")
}

// AddressHasPendingWithdrawal returns whether an address has a pending withdrawal
func AddressHasPendingWithdrawal(node sqalx.Node, address string) (bool, error) {
	s := sdb.Select().
		Where(sq.Eq{"pending_withdrawal.rewards_address": address})
	p, _, err := getPendingWithdrawalWithSelect(node, s)
	return len(p) > 0, stacktrace.Propagate(err, "")
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
