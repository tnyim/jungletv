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

// getCrowdfundedTransactionWithSelect returns a slice with all crowdfunded transactions that match the conditions in sbuilder
func getCrowdfundedTransactionWithSelect(node sqalx.Node, sbuilder sq.SelectBuilder) ([]*CrowdfundedTransaction, uint64, error) {
	values, totalCount, err := GetWithSelect(node, &CrowdfundedTransaction{}, sbuilder, false)
	if err != nil {
		return nil, 0, stacktrace.Propagate(err, "")
	}

	converted := make([]*CrowdfundedTransaction, len(values))
	for i := range values {
		converted[i] = values[i].(*CrowdfundedTransaction)
	}

	return converted, totalCount, nil
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
