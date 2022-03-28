package types

import (
	"database/sql"
	"errors"
	"time"

	sq "github.com/Masterminds/squirrel"
	"github.com/gbl08ma/sqalx"
	"github.com/palantir/stacktrace"
)

// PointsTx is a points transaction
type PointsTx struct {
	ID           int64 `dbKey:"true"`
	PreviousTxID sql.NullInt64
	Address      string
	CreatedAt    time.Time
	Value        int
	Type         PointsTxType
	Extra        string
}

// GetPointsTxForAddress returns all the points transactions for the given address
func GetPointsTxForAddress(node sqalx.Node, address string, pagParams *PaginationParams) ([]*PointsTx, uint64, error) {
	s := sdb.Select().
		Where(sq.Eq{"points_tx.address": address}).
		OrderBy("points_tx.created_at DESC")
	s = applyPaginationParameters(s, pagParams)
	return GetWithSelectAndCount[*PointsTx](node, s)
}

// ErrPointsTxNotFound is returned when we can not find the specified points transaction
var ErrPointsTxNotFound = errors.New("points transaction not found")

// GetLatestPointsTxForAddress returns the most recent points transaction for the given address
func GetLatestPointsTxForAddress(node sqalx.Node, address string) (*PointsTx, error) {
	s := sdb.Select().
		Where(subQueryEq(
			"points_tx.id",
			sq.Select("MAX(e.id)").
				From("points_tx e").
				Where(sq.Eq{"a.address": address}),
		))
	txs, err := GetWithSelect[*PointsTx](node, s)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	if len(txs) == 0 {
		return nil, stacktrace.Propagate(ErrPointsTxNotFound, "")
	}
	return txs[0], nil
}

// GetLatestPointsTxIDAndBalanceForAddress returns the ID of the most recent transaction for the given address
// and the corresponding points balance in an atomic query. Used when preparing a new points transaction
func GetLatestPointsTxIDAndBalanceForAddress(node sqalx.Node, address string) (sql.NullInt64, int, error) {
	tx, err := node.Beginx()
	if err != nil {
		return sql.NullInt64{}, 0, stacktrace.Propagate(err, "")
	}
	defer tx.Commit() // read-only tx

	s := sdb.Select("MAX(points_tx.id), SUM(points_tx.value)").
		From("points_tx").
		Where(sq.Eq{"points_tx.address": address})

	var id sql.NullInt64
	var balance sql.NullInt32
	err = s.RunWith(tx).Scan(&id, &balance)
	if err != nil && errors.Is(err, sql.ErrNoRows) {
		return id, 0, nil
	} else if err != nil {
		return id, 0, stacktrace.Propagate(err, "")
	}
	b := 0
	if balance.Valid {
		b = int(balance.Int32)
	}
	return id, b, nil
}

// Insert inserts the PointsTx
func (obj *PointsTx) Insert(node sqalx.Node) error {
	return Insert(node, obj)
}

// IncreaseValue increases the value of the PointsTx by the specified amount. The amount must be positive.
// Updates to reduce transaction value are not supported since they break the invariants that prevent TOCTOU issues like
// double-spends on concurrent database transactions.
func (obj *PointsTx) IncreaseValue(node sqalx.Node, value int) error {
	if value < 0 {
		return stacktrace.NewError("transaction values can only be updated to a larger value")
	}

	tx, err := node.Beginx()
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	defer tx.Rollback()

	_, err = sdb.Update("points_tx").
		Set("value", sq.Expr("value + ?", value)).
		Where(sq.Eq{"id": obj.ID}).
		RunWith(tx).Exec()
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	return stacktrace.Propagate(tx.Commit(), "")
}

type PointsTxType string

const (
	PointsTxTypeActivityChallengeReward PointsTxType = "activity_challenge_reward"
	PointsTxTypeChatActivityReward      PointsTxType = "chat_activity_reward"
	PointsTxTypeMediaEnqueuedReward     PointsTxType = "media_enqueued_reward"
)
