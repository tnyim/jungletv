package types

import (
	"time"

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

// Insert inserts the Withdrawal
func (obj *Withdrawal) Insert(node sqalx.Node) error {
	return Insert(node, obj)
}
