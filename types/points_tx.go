package types

import (
	"errors"
	"time"

	sq "github.com/Masterminds/squirrel"
	"github.com/jmoiron/sqlx/types"
	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/utils/transaction"
)

// PointsTx is a points transaction
type PointsTx struct {
	ID             int64 `dbKey:"true"`
	RewardsAddress string
	CreatedAt      time.Time
	UpdatedAt      time.Time
	Value          int
	Type           PointsTxType
	Extra          types.JSONText
}

// GetPointsTxForAddress returns all the points transactions for the given address
func GetPointsTxForAddress(ctx transaction.WrappingContext, address string, pagParams *PaginationParams) ([]*PointsTx, uint64, error) {
	s := sdb.Select().
		Where(sq.Eq{"points_tx.rewards_address": address}).
		OrderBy("points_tx.created_at DESC")
	s = applyPaginationParameters(s, pagParams)
	return GetWithSelectAndCount[*PointsTx](ctx, s)
}

// ErrPointsTxNotFound is returned when we can not find the specified points transaction
var ErrPointsTxNotFound = errors.New("points transaction not found")

// GetLatestPointsTxForAddress returns the most recent points transaction for the given address
func GetLatestPointsTxForAddress(ctx transaction.WrappingContext, address string) (*PointsTx, error) {
	s := sdb.Select().
		Where(subQueryEq(
			"points_tx.id",
			sq.Select("MAX(e.id)").
				From("points_tx e").
				Where(sq.Eq{"e.rewards_address": address}),
		))
	txs, err := GetWithSelect[*PointsTx](ctx, s)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	if len(txs) == 0 {
		return nil, stacktrace.Propagate(ErrPointsTxNotFound, "")
	}
	return txs[0], nil
}

// GetLatestPointsTxForAddress returns the most recent points transaction of the given type for the given address
func GetLatestPointsTxOfTypeForAddress(ctx transaction.WrappingContext, txType PointsTxType, address string) (*PointsTx, error) {
	s := sdb.Select().
		Where(subQueryEq(
			"points_tx.id",
			sq.Select("MAX(e.id)").
				From("points_tx e").
				Where(sq.Eq{"e.rewards_address": address}).
				Where(sq.Eq{"e.type": txType}),
		))
	txs, err := GetWithSelect[*PointsTx](ctx, s)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	if len(txs) == 0 {
		return nil, stacktrace.Propagate(ErrPointsTxNotFound, "")
	}
	return txs[0], nil
}

// Insert inserts the PointsTx
func (obj *PointsTx) Insert(ctx transaction.WrappingContext) error {
	return Insert(ctx, obj)
}

// AdjustValue adjusts the value of the PointsTx by the specified amount.
func (obj *PointsTx) AdjustValue(ctx transaction.WrappingContext, value int) error {
	ctx, err := transaction.Begin(ctx)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	defer ctx.Rollback()

	now := time.Now()

	_, err = sdb.Update("points_tx").
		Set("value", sq.Expr("value + ?", value)).
		Set("updated_at", now).
		Where(sq.Eq{"id": obj.ID}).
		RunWith(ctx).ExecContext(ctx)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	obj.Value += value
	obj.UpdatedAt = time.Now()

	return stacktrace.Propagate(ctx.Commit(), "")
}

type PointsTxType int

const (
	PointsTxTypeActivityChallengeReward     PointsTxType = 1
	PointsTxTypeChatActivityReward          PointsTxType = 2
	PointsTxTypeMediaEnqueuedReward         PointsTxType = 3
	PointsTxTypeChatGifAttachment           PointsTxType = 4
	PointsTxTypeManualAdjustment            PointsTxType = 5
	PointsTxTypeMediaEnqueuedRewardReversal PointsTxType = 6
	PointsTxTypeConversionFromBanano        PointsTxType = 7
	PointsTxTypeQueueEntryReordering        PointsTxType = 8
	PointsTxTypeMonthlySubscription         PointsTxType = 9
	PointsTxTypeSkipThresholdReduction      PointsTxType = 10
	PointsTxTypeSkipThresholdIncrease       PointsTxType = 11
	PointsTxTypeConcealedEntryEnqueuing     PointsTxType = 12
	PointsTxTypeApplicationDefined          PointsTxType = 13
)
