package pointsmanager

import (
	"context"
	"errors"
	"time"

	"github.com/bwmarrin/snowflake"
	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/server/auth"
	"github.com/tnyim/jungletv/types"
	"github.com/tnyim/jungletv/utils/transaction"
)

// Manager manages user points
type Manager struct {
	snowflakeNode *snowflake.Node
}

// New returns a new initialized Manager
func New(snowflakeNode *snowflake.Node) *Manager {
	return &Manager{
		snowflakeNode: snowflakeNode,
	}
}

// CreateTransaction creates a points transaction
func (m *Manager) CreateTransaction(ctxCtx context.Context, forUser auth.User, txType types.PointsTxType, value int) error {
	err := validateBalanceMovement(txType, value)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	defer ctx.Rollback()

	// a CHECK (balance >= 0) exists in the table to prevent overdraw, even in concurrent transactions
	err = types.AdjustPointsBalanceOfAddress(ctx, forUser.Address(), value)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	var lastTransaction *types.PointsTx
	if pointsTxTypeCanCollapse[txType] {
		// instead of creating a new transaction log entry, amend the last log entry if the transaction is of the same type
		lastTransaction, err = types.GetLatestPointsTxForAddress(ctx, forUser.Address())
		if err != nil {
			if !errors.Is(err, types.ErrPointsTxNotFound) {
				return stacktrace.Propagate(err, "")
			}
			lastTransaction = nil
		} else if lastTransaction.Type != txType {
			// disallow amending if the latest transaction is not of the same type
			lastTransaction = nil
		}
	}

	if lastTransaction != nil {
		err = lastTransaction.IncreaseValue(ctx, value)
		if err != nil {
			return stacktrace.Propagate(err, "")
		}
	} else {
		now := time.Now()
		tx := &types.PointsTx{
			ID:             m.snowflakeNode.Generate().Int64(),
			RewardsAddress: forUser.Address(),
			CreatedAt:      now,
			UpdatedAt:      now,
			Value:          value,
			Type:           txType,
		}
		err = tx.Insert(ctx)
		if err != nil {
			return stacktrace.Propagate(err, "")
		}
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
	types.PointsTxTypeChatGifAttachment:       pointsTxDirectionDecrease,
}

// to save on DB storage space, for "uninteresting" transaction types, we collapse consecutive records of the same type
// into a single one, the value of which we amend as transactions occur, instead of creating new records
var pointsTxTypeCanCollapse = map[types.PointsTxType]bool{
	types.PointsTxTypeActivityChallengeReward: true,
	types.PointsTxTypeChatActivityReward:      true,
}
