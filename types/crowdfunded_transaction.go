package types

import (
	"time"

	sq "github.com/Masterminds/squirrel"
	"github.com/palantir/stacktrace"
	"github.com/shopspring/decimal"
	"github.com/tnyim/jungletv/utils/transaction"
)

type CrowdfundedTransactionType string

const CrowdfundedTransactionTypeSkip CrowdfundedTransactionType = "skip"
const CrowdfundedTransactionTypeRain CrowdfundedTransactionType = "rain"

var CrowdfundedTransactionTypes = []CrowdfundedTransactionType{CrowdfundedTransactionTypeSkip, CrowdfundedTransactionTypeRain}

// CrowdfundedTransaction represents a Skip & Tip transaction received by the service
type CrowdfundedTransaction struct {
	TxHash          string `dbKey:"true"`
	FromAddress     string
	Amount          decimal.Decimal
	ReceivedAt      time.Time
	TransactionType CrowdfundedTransactionType
	ForMedia        *string
}

// SumCrowdfundedTransactionsFromAddressSince returns the sum of all crowdfunded transactions from an address since the specified time
func SumCrowdfundedTransactionsFromAddressSince(ctx transaction.WrappingContext, address string, since time.Time) (decimal.Decimal, error) {
	ctx, err := transaction.Begin(ctx)
	if err != nil {
		return decimal.Decimal{}, stacktrace.Propagate(err, "")
	}
	defer ctx.Commit() // read-only tx

	var totalAmount decimal.Decimal
	err = sdb.Select("COALESCE(SUM(crowdfunded_transaction.amount), 0)").
		From("crowdfunded_transaction").
		Where(sq.Eq{"crowdfunded_transaction.from_address": address}).
		Where(sq.Gt{"crowdfunded_transaction.received_at": since}).
		RunWith(ctx).QueryRowContext(ctx).Scan(&totalAmount)
	if err != nil {
		return decimal.Decimal{}, stacktrace.Propagate(err, "")
	}
	return totalAmount, nil
}

// InsertCrowdfundedTransactions inserts the passed received rewards in the database
func InsertCrowdfundedTransactions(ctx transaction.WrappingContext, items []*CrowdfundedTransaction) error {
	c := make([]interface{}, len(items))
	for i := range items {
		c[i] = items[i]
	}
	return stacktrace.Propagate(Insert(ctx, c...), "")
}

// SetMediaOfCrowdfundedTransactionsWithoutMedia sets the ForMedia field of all crowdfunded transactions without one to the specified value
func SetMediaOfCrowdfundedTransactionsWithoutMedia(ctx transaction.WrappingContext, mediaID string) error {
	ctx, err := transaction.Begin(ctx)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	defer ctx.Rollback()

	_, err = sdb.Update("crowdfunded_transaction").
		Set("for_media", mediaID).
		Where("for_media IS NULL").
		RunWith(ctx).ExecContext(ctx)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	return stacktrace.Propagate(ctx.Commit(), "")
}
