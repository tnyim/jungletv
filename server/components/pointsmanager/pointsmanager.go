package pointsmanager

import (
	"context"
	"encoding/json"
	"errors"
	"sync"
	"time"

	"github.com/bwmarrin/snowflake"
	"github.com/palantir/stacktrace"
	"github.com/patrickmn/go-cache"
	"github.com/tnyim/jungletv/server/auth"
	"github.com/tnyim/jungletv/server/components/payment"
	"github.com/tnyim/jungletv/types"
	"github.com/tnyim/jungletv/utils/transaction"
)

// Manager manages user points
type Manager struct {
	workerContext      context.Context
	snowflakeNode      *snowflake.Node
	paymentAccountPool *payment.PaymentAccountPool

	bananoConversionFlows     map[string]*BananoConversionFlow
	bananoConversionFlowsLock sync.RWMutex

	subscriptionCache *cache.Cache[string, *types.Subscription]
}

// New returns a new initialized Manager
func New(workerContext context.Context, snowflakeNode *snowflake.Node, paymentAccountPool *payment.PaymentAccountPool) *Manager {
	return &Manager{
		workerContext:         workerContext,
		snowflakeNode:         snowflakeNode,
		paymentAccountPool:    paymentAccountPool,
		bananoConversionFlows: make(map[string]*BananoConversionFlow),
		subscriptionCache:     cache.New[string, *types.Subscription](30*time.Minute, 10*time.Minute),
	}
}

// CreateTransaction creates a points transaction
func (m *Manager) CreateTransaction(ctxCtx context.Context, forUser auth.User, txType types.PointsTxType, value int, extraFields ...TxExtraField) (int64, error) {
	err := validateBalanceMovement(txType, value)
	if err != nil {
		return 0, stacktrace.Propagate(err, "")
	}

	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return 0, stacktrace.Propagate(err, "")
	}
	defer ctx.Rollback()

	// a CHECK (balance >= 0) exists in the table to prevent overdraw, even in concurrent transactions
	err = types.AdjustPointsBalanceOfAddress(ctx, forUser.Address(), value)
	if err != nil {
		return 0, stacktrace.Propagate(err, "")
	}

	var lastTransaction *types.PointsTx
	if pointsTxTypeCanCollapse[txType] {
		// instead of creating a new transaction log entry, amend the last log entry if the transaction is of the same type
		lastTransaction, err = types.GetLatestPointsTxForAddress(ctx, forUser.Address())
		if err != nil {
			if !errors.Is(err, types.ErrPointsTxNotFound) {
				return 0, stacktrace.Propagate(err, "")
			}
			lastTransaction = nil
		} else if lastTransaction.Type != txType {
			// disallow amending if the latest transaction is not of the same type
			lastTransaction = nil
		}
	}

	if lastTransaction != nil {
		err = lastTransaction.AdjustValue(ctx, value)
		if err != nil {
			return 0, stacktrace.Propagate(err, "")
		}
		return 0, stacktrace.Propagate(ctx.Commit(), "")
	}

	extra := []byte{}
	extraFieldsMap := make(map[string]any)
	for _, field := range extraFields {
		extraFieldsMap[field.Key] = field.Value
	}

	for _, mandatoryFieldKey := range pointsTxTypeMandatoryExtraFields[txType] {
		if _, present := extraFieldsMap[mandatoryFieldKey]; !present {
			return 0, stacktrace.NewError("mandatory extra field %s not provided", mandatoryFieldKey)
		}
	}

	if len(extraFields) > 0 {
		extra, err = json.Marshal(extraFieldsMap)
		if err != nil {
			return 0, stacktrace.Propagate(err, "")
		}
	}
	now := time.Now()
	tx := &types.PointsTx{
		ID:             m.snowflakeNode.Generate().Int64(),
		RewardsAddress: forUser.Address(),
		CreatedAt:      now,
		UpdatedAt:      now,
		Value:          value,
		Type:           txType,
		Extra:          extra,
	}
	err = tx.Insert(ctx)
	if err != nil {
		return 0, stacktrace.Propagate(err, "")
	}
	return tx.ID, stacktrace.Propagate(ctx.Commit(), "")
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
	types.PointsTxTypeActivityChallengeReward:     pointsTxDirectionIncrease,
	types.PointsTxTypeChatActivityReward:          pointsTxDirectionIncrease,
	types.PointsTxTypeMediaEnqueuedReward:         pointsTxDirectionIncrease,
	types.PointsTxTypeChatGifAttachment:           pointsTxDirectionDecrease,
	types.PointsTxTypeManualAdjustment:            pointsTxDirectionIncreaseOrDecrease,
	types.PointsTxTypeMediaEnqueuedRewardReversal: pointsTxDirectionDecrease,
	types.PointsTxTypeConversionFromBanano:        pointsTxDirectionIncrease,
	types.PointsTxTypeQueueEntryReordering:        pointsTxDirectionDecrease,
	types.PointsTxTypeMonthlySubscription:         pointsTxDirectionDecrease,
	types.PointsTxTypeSkipThresholdReduction:      pointsTxDirectionDecrease,
	types.PointsTxTypeSkipThresholdIncrease:       pointsTxDirectionDecrease,
	types.PointsTxTypeConcealedEntryEnqueuing:     pointsTxDirectionDecrease,
}

// to save on DB storage space, for "uninteresting" transaction types, we collapse consecutive records of the same type
// into a single one, the value of which we amend as transactions occur, instead of creating new records
var pointsTxTypeCanCollapse = map[types.PointsTxType]bool{
	types.PointsTxTypeActivityChallengeReward: true,
	types.PointsTxTypeChatActivityReward:      true,
	types.PointsTxTypeSkipThresholdReduction:  true,
	types.PointsTxTypeSkipThresholdIncrease:   true,
}

var pointsTxTypeMandatoryExtraFields = map[types.PointsTxType][]string{
	types.PointsTxTypeMediaEnqueuedReward:         {"media"},
	types.PointsTxTypeManualAdjustment:            {"adjusted_by", "reason"},
	types.PointsTxTypeMediaEnqueuedRewardReversal: {"media"},
	types.PointsTxTypeConversionFromBanano:        {"tx_hash"},
	types.PointsTxTypeQueueEntryReordering:        {"media", "direction"},
	types.PointsTxTypeConcealedEntryEnqueuing:     {"media"},
}
