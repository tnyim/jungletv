package types

import (
	"errors"
	"time"

	sq "github.com/Masterminds/squirrel"
	"github.com/gbl08ma/sqalx"
	"github.com/lann/builder"
	"github.com/palantir/stacktrace"
	"github.com/shopspring/decimal"
)

// Withdrawal represents a completed withdrawal
type Withdrawal struct {
	TxHash         string `dbKey:"true"`
	RewardsAddress string
	Amount         decimal.Decimal
	StartedAt      time.Time
	CompletedAt    time.Time
}

// getWithdrawalWithSelect returns a slice with all withdrawals that match the conditions in sbuilder
func getWithdrawalWithSelect(node sqalx.Node, sbuilder sq.SelectBuilder) ([]*Withdrawal, uint64, error) {
	tx, err := node.Beginx()
	if err != nil {
		return nil, 0, stacktrace.Propagate(err, "")
	}
	defer tx.Commit() // read-only tx

	values, err := GetWithSelect[*Withdrawal](node, sbuilder)
	if err != nil {
		return nil, 0, stacktrace.Propagate(err, "")
	}

	// let's get the total count with a separate query, as it's much more performant than using the window function on large tables

	// bit of a dirty hack
	sbuilder = builder.Delete(sbuilder, "Columns").(sq.SelectBuilder)
	sbuilder = builder.Delete(sbuilder, "OrderByParts").(sq.SelectBuilder)
	sbuilder = sbuilder.Column("COUNT(*)").From("withdrawal").RemoveLimit().RemoveOffset()

	logger.Println(sbuilder.ToSql())
	totalCount := uint64(0)
	err = sbuilder.RunWith(tx).QueryRow().Scan(&totalCount)
	if err != nil {
		return nil, 0, stacktrace.Propagate(err, "")
	}

	return values, totalCount, nil
}

// GetWithdrawals returns all completed withdrawals in the database
func GetWithdrawals(node sqalx.Node, pagParams *PaginationParams) ([]*Withdrawal, uint64, error) {
	s := sdb.Select().
		OrderBy("withdrawal.started_at DESC")
	s = applyPaginationParameters(s, pagParams)
	return getWithdrawalWithSelect(node, s)
}

// GetWithdrawalsCompletedBefore returns the withdrawals completed in the specified interval
func GetWithdrawalsCompletedBetween(node sqalx.Node, after, before time.Time, pagParams *PaginationParams) ([]*Withdrawal, uint64, error) {
	s := sdb.Select().
		Where(sq.Gt{"withdrawal.completed_at": after}).
		Where(sq.Lt{"withdrawal.completed_at": before}).
		OrderBy("withdrawal.started_at DESC")
	s = applyPaginationParameters(s, pagParams)
	return getWithdrawalWithSelect(node, s)
}

// ErrWithdrawalNotFound is returned when we can not find the specified withdrawal
var ErrWithdrawalNotFound = errors.New("withdrawal not found")

// GetWithdrawal returns the completed withdrawal with the given hash
func GetWithdrawal(node sqalx.Node, txHash string) (*Withdrawal, error) {
	s := sdb.Select().
		Where(sq.Eq{"withdrawal.tx_hash": txHash})
	withdrawals, _, err := getWithdrawalWithSelect(node, s)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	if len(withdrawals) == 0 {
		return nil, stacktrace.Propagate(ErrWithdrawalNotFound, "")
	}
	return withdrawals[0], nil
}

// GetWithdrawalsForAddress returns completed withdrawals to the specified address, starting with the latest
func GetWithdrawalsForAddress(node sqalx.Node, address string, pagParams *PaginationParams) ([]*Withdrawal, uint64, error) {
	s := sdb.Select().
		Where(sq.Eq{"withdrawal.rewards_address": address}).
		OrderBy("withdrawal.started_at DESC")
	s = applyPaginationParameters(s, pagParams)
	return getWithdrawalWithSelect(node, s)
}

// SumWithdrawalsToAddressSince returns the sum of all withdrawals to an address since the specified time
func SumWithdrawalsToAddressSince(node sqalx.Node, address string, since time.Time) (decimal.Decimal, error) {
	tx, err := node.Beginx()
	if err != nil {
		return decimal.Decimal{}, stacktrace.Propagate(err, "")
	}
	defer tx.Commit() // read-only tx

	var totalAmount decimal.Decimal
	err = sdb.Select("COALESCE(SUM(withdrawal.amount), 0)").
		From("withdrawal").
		Where(sq.Eq{"withdrawal.rewards_address": address}).
		Where(sq.Gt{"withdrawal.started_at": since}).
		RunWith(tx).QueryRow().Scan(&totalAmount)
	if err != nil {
		return decimal.Decimal{}, stacktrace.Propagate(err, "")
	}
	return totalAmount, nil
}

// Insert inserts the Withdrawal
func (obj *Withdrawal) Insert(node sqalx.Node) error {
	return Insert(node, obj)
}

// Delete deletes the Withdrawal
func (obj *Withdrawal) Delete(node sqalx.Node) error {
	return Delete(node, obj)
}
