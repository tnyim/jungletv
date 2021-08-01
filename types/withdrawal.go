package types

import (
	"time"

	sq "github.com/Masterminds/squirrel"
	"github.com/gbl08ma/sqalx"
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
	values, totalCount, err := GetWithSelect(node, &Withdrawal{}, sbuilder, true)
	if err != nil {
		return nil, totalCount, err
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
