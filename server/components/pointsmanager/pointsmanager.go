package pointsmanager

import (
	"context"
	"time"

	"github.com/bwmarrin/snowflake"
	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/server/auth"
	"github.com/tnyim/jungletv/types"
	"github.com/tnyim/jungletv/utils/transaction"
)

// CreateTransaction creates a points transaction
func CreateTransaction(ctxCtx context.Context, snowflakeNode *snowflake.Node, forUser auth.User, txType types.PointsTxType, value int) error {
	err := validateBalanceMovement(txType, value)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	defer ctx.Rollback()

	// the following query is atomic
	// doing it like this ensures that the curBalance+value < 0 check is made relative to the right PreviousTxID
	// the DB schema constraints and triggers will ensure that we don't insert a PointsTx with the wrong PreviousTxID
	latestID, curBalance, err := types.GetLatestPointsTxIDAndBalanceForAddress(ctx, forUser.Address())
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	if curBalance+value < 0 {
		return stacktrace.NewError("this transaction would cause a negative balance")
	}

	tx := &types.PointsTx{
		ID:           snowflakeNode.Generate().Int64(),
		PreviousTxID: latestID,
		Address:      forUser.Address(),
		CreatedAt:    time.Now(),
		Value:        value,
		Type:         txType,
	}
	err = tx.Insert(ctx)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	return stacktrace.Propagate(ctx.Commit(), "")
}

func validateBalanceMovement(txType types.PointsTxType, value int) error {
	dirType, found := pointsTxAllowedDirectionByType[txType]
	if !found || dirType == pointsTxDirectionUnknown {
		return stacktrace.NewError("allowed value movement directions unspecified for given transaction type")
	}
	if value > 0 && dirType == pointsTxDirectionDecrease {
		return stacktrace.NewError("value must not be positive for the given transaction type")
	} else if value < 0 && dirType == pointsTxDirectionIncrease {
		return stacktrace.NewError("value must not be negative for the given transaction type")
	}
	return nil
}

type pointsTxDirection int

const (
	pointsTxDirectionUnknown pointsTxDirection = iota
	pointsTxDirectionIncrease
	pointsTxDirectionIncreaseOrDecrease
	pointsTxDirectionDecrease
)

var pointsTxAllowedDirectionByType = map[types.PointsTxType]pointsTxDirection{
	types.PointsTxTypeActivityChallengeReward: pointsTxDirectionIncrease,
	types.PointsTxTypeChatActivityReward:      pointsTxDirectionIncrease,
	types.PointsTxTypeMediaEnqueuedReward:     pointsTxDirectionIncrease,
}
