package types

import (
	"time"

	sq "github.com/Masterminds/squirrel"
	"github.com/gbl08ma/sqalx"
	"github.com/palantir/stacktrace"
	"github.com/shopspring/decimal"
)

type CrowdfundedTransactionType string

const CrowdfundedTransactionTypeSkip CrowdfundedTransactionType = "skip"
const CrowdfundedTransactionTypeRain CrowdfundedTransactionType = "rain"

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
func SumCrowdfundedTransactionsFromAddressSince(node sqalx.Node, address string, since time.Time) (decimal.Decimal, error) {
	tx, err := node.Beginx()
	if err != nil {
		return decimal.Decimal{}, stacktrace.Propagate(err, "")
	}
	defer tx.Commit() // read-only tx

	var totalAmount decimal.Decimal
	err = sdb.Select("COALESCE(SUM(crowdfunded_transaction.amount), 0)").
		From("crowdfunded_transaction").
		Where(sq.Eq{"crowdfunded_transaction.from_address": address}).
		Where(sq.Gt{"crowdfunded_transaction.received_at": since}).
		RunWith(tx).QueryRow().Scan(&totalAmount)
	if err != nil {
		return decimal.Decimal{}, stacktrace.Propagate(err, "")
	}
	return totalAmount, nil
}

// InsertCrowdfundedTransactions inserts the passed received rewards in the database
func InsertCrowdfundedTransactions(node sqalx.Node, items []*CrowdfundedTransaction) error {
	c := make([]interface{}, len(items))
	for i := range items {
		c[i] = items[i]
	}
	return stacktrace.Propagate(Insert(node, c...), "")
}

// SetMediaOfCrowdfundedTransactionsWithoutMedia sets the ForMedia field of all crowdfunded transactions without one to the specified value
func SetMediaOfCrowdfundedTransactionsWithoutMedia(node sqalx.Node, mediaID string) error {
	tx, err := node.Beginx()
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	defer tx.Rollback()

	_, err = sdb.Update("crowdfunded_transaction").
		Set("for_media", mediaID).
		Where("for_media IS NULL").
		RunWith(tx).Exec()
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	return stacktrace.Propagate(tx.Commit(), "")
}
