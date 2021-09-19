package types

import (
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

	values, _, err := GetWithSelect(tx, &Withdrawal{}, sbuilder, false)
	if err != nil {
		return nil, 0, err
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

	converted := make([]*Withdrawal, len(values))
	for i := range values {
		converted[i] = values[i].(*Withdrawal)
	}

	return converted, totalCount, nil
}

// GetWithdrawalsForAddress returns completed withdrawals to the specified address, starting with the latest
func GetWithdrawalsForAddress(node sqalx.Node, address string, pagParams *PaginationParams) ([]*Withdrawal, uint64, error) {
	s := sdb.Select().
		Where(sq.Eq{"withdrawal.rewards_address": address}).
		OrderBy("withdrawal.started_at DESC")
	s = applyPaginationParameters(s, pagParams)
	return getWithdrawalWithSelect(node, s)
}

// Insert inserts the Withdrawal
func (obj *Withdrawal) Insert(node sqalx.Node) error {
	return Insert(node, obj)
}
