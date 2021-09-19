package types

import (
	"time"

	sq "github.com/Masterminds/squirrel"
	"github.com/gbl08ma/sqalx"
	"github.com/lann/builder"
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

// getReceivedRewardWithSelect returns a slice with all received rewards that match the conditions in sbuilder
func getReceivedRewardWithSelect(node sqalx.Node, sbuilder sq.SelectBuilder) ([]*ReceivedReward, uint64, error) {
	tx, err := node.Beginx()
	if err != nil {
		return nil, 0, stacktrace.Propagate(err, "")
	}
	defer tx.Commit() // read-only tx

	values, _, err := GetWithSelect(tx, &ReceivedReward{}, sbuilder, false)
	if err != nil {
		return nil, 0, err
	}

	// let's get the total count with a separate query, as it's much more performant than using the window function on large tables

	// bit of a dirty hack
	sbuilder = builder.Delete(sbuilder, "Columns").(sq.SelectBuilder)
	sbuilder = builder.Delete(sbuilder, "OrderByParts").(sq.SelectBuilder)
	sbuilder = sbuilder.Column("COUNT(*)").From("received_reward").RemoveLimit().RemoveOffset()

	logger.Println(sbuilder.ToSql())
	totalCount := uint64(0)
	err = sbuilder.RunWith(tx).QueryRow().Scan(&totalCount)
	if err != nil {
		return nil, 0, stacktrace.Propagate(err, "")
	}

	converted := make([]*ReceivedReward, len(values))
	for i := range values {
		converted[i] = values[i].(*ReceivedReward)
	}

	return converted, totalCount, nil
}

// GetReceivedRewardsForAddress returns received rewards for the specified address, starting with the latest
func GetReceivedRewardsForAddress(node sqalx.Node, address string, pagParams *PaginationParams) ([]*ReceivedReward, uint64, error) {
	s := sdb.Select().
		Where(sq.Eq{"received_reward.rewards_address": address}).
		OrderBy("received_reward.received_at DESC")
	s = applyPaginationParameters(s, pagParams)
	return getReceivedRewardWithSelect(node, s)
}

// InsertReceivedRewards inserts the passed received rewards in the database
func InsertReceivedRewards(node sqalx.Node, items []*ReceivedReward) error {
	c := make([]interface{}, len(items))
	for i := range items {
		c[i] = items[i]
	}
	return stacktrace.Propagate(Insert(node, c...), "")
}
