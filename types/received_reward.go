package types

import (
	"database/sql"
	"errors"
	"time"

	sq "github.com/Masterminds/squirrel"
	"github.com/lann/builder"
	"github.com/palantir/stacktrace"
	"github.com/shopspring/decimal"
	"github.com/tnyim/jungletv/utils/transaction"
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
func getReceivedRewardWithSelect(ctx transaction.WrappingContext, sbuilder sq.SelectBuilder) ([]*ReceivedReward, uint64, error) {
	ctx, err := transaction.Begin(ctx)
	if err != nil {
		return nil, 0, stacktrace.Propagate(err, "")
	}
	defer ctx.Commit() // read-only tx

	values, err := GetWithSelect[*ReceivedReward](ctx, sbuilder)
	if err != nil {
		return nil, 0, stacktrace.Propagate(err, "")
	}

	// let's get the total count with a separate query, as it's much more performant than using the window function on large tables
	// bit of a dirty hack
	sbuilder = builder.Delete(sbuilder, "Columns").(sq.SelectBuilder)
	sbuilder = builder.Delete(sbuilder, "OrderByParts").(sq.SelectBuilder)
	sbuilder = sbuilder.Column("COUNT(*)").From("received_reward").RemoveLimit().RemoveOffset()

	logger.Println(sbuilder.ToSql())
	totalCount := uint64(0)
	err = sbuilder.RunWith(ctx).QueryRowContext(ctx).Scan(&totalCount)
	if err != nil {
		return nil, 0, stacktrace.Propagate(err, "")
	}

	return values, totalCount, nil
}

// GetReceivedRewardsForAddress returns received rewards for the specified address, starting with the latest
func GetReceivedRewardsForAddress(ctx transaction.WrappingContext, address string, pagParams *PaginationParams) ([]*ReceivedReward, uint64, error) {
	// we have a custom implementation for this use case, because this table is quite big and
	// 1) we need to fetch the per-address total count from a separate table
	// 2) we need to ensure that, on the query that actually fetches the data, offset + limit <= total count (obtained in step 1)
	// otherwise we mislead the postgres planner/executor into thinking it should have found more entries than it actually did,
	// for addresses with few received rewards

	ctx, err := transaction.Begin(ctx)
	if err != nil {
		return nil, 0, stacktrace.Propagate(err, "")
	}
	defer ctx.Commit() // read-only tx

	// let's get the total count from an entirely separate table that is updated with triggers, as it's even more performant than COUNT(*)
	sbuilder := sdb.Select("count").
		From("received_reward_count_per_rewards_address").
		Where(sq.Eq{"received_reward_count_per_rewards_address.rewards_address": address})

	logger.Println(sbuilder.ToSql())
	totalCount := uint64(0)
	err = sbuilder.RunWith(ctx).QueryRowContext(ctx).Scan(&totalCount)
	if errors.Is(err, sql.ErrNoRows) || totalCount == 0 {
		return []*ReceivedReward{}, 0, nil
	}
	if err != nil {
		return nil, 0, stacktrace.Propagate(err, "")
	}

	sbuilder = sdb.Select().
		Where(sq.Eq{"received_reward.rewards_address": address}).
		OrderBy("received_reward.received_at DESC")

	// now we must apply the pagination parameters while ensuring that offset+limit<=totalCount,
	// otherwise the query will take 30+ seconds instead of less than 1
	if pagParams != nil {
		limit := pagParams.Limit
		if pagParams.Offset+limit > totalCount {
			limit = totalCount - pagParams.Offset
			if limit <= 0 {
				return []*ReceivedReward{}, totalCount, nil
			}
		}
		sbuilder = sbuilder.Offset(pagParams.Offset).Limit(limit)
	}

	values, err := GetWithSelect[*ReceivedReward](ctx, sbuilder)
	if err != nil {
		return nil, 0, stacktrace.Propagate(err, "")
	}

	return values, totalCount, nil
}

// InsertReceivedRewards inserts the passed received rewards in the database
func InsertReceivedRewards(ctx transaction.WrappingContext, items []*ReceivedReward) error {
	c := make([]interface{}, len(items))
	for i := range items {
		c[i] = items[i]
	}
	return stacktrace.Propagate(Insert(ctx, c...), "")
}
