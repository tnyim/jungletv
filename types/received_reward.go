package types

import (
	"time"

	"github.com/gbl08ma/sqalx"
	"github.com/palantir/stacktrace"
	"github.com/shopspring/decimal"
)

// ReceivedReward represents a reward received by a user for consuming media
type ReceivedReward struct {
	ID             string `dbKey:"true"`
	RewardsAddress string
	ReceivedAt     time.Time
	Amount         decimal.Decimal
	Media          string
}

// InsertReceivedRewards inserts the passed received rewards in the database
func InsertReceivedRewards(node sqalx.Node, items []*ReceivedReward) error {
	c := make([]interface{}, len(items))
	for i := range items {
		c[i] = items[i]
	}
	return stacktrace.Propagate(Insert(node, c...), "")
}
