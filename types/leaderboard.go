package types

import (
	"fmt"
	"time"

	"github.com/gbl08ma/sqalx"
	"github.com/jmoiron/sqlx"
	"github.com/palantir/stacktrace"
	"github.com/samber/lo"
	"github.com/shopspring/decimal"
)

// SpendingLeaderboardEntry represents a enqueue leaderboard entry
type SpendingLeaderboardEntry struct {
	RowNum        int
	Position      int
	Address       string
	Nickname      string
	ApplicationID string
	TotalSpent    decimal.Decimal
}

// EnqueueLeaderboardBetween returns the enqueue leaderboard for the specified period
func EnqueueLeaderboardBetween(node sqalx.Node, start, end time.Time, size int, showNeighbors int, mustIncludes ...string) ([]SpendingLeaderboardEntry, error) {
	tx, err := node.Beginx()
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	defer tx.Commit() // read-only tx

	query := `WITH lb AS (
		SELECT
			requested_by,
			SUM(request_cost) AS s,
			rank() OVER (ORDER BY SUM(request_cost) DESC) AS position,
			row_number() OVER (ORDER BY SUM(request_cost) DESC) AS rownum
		FROM played_media
		WHERE requested_by <> '' AND started_at BETWEEN ? AND ?
		GROUP BY requested_by
	),
	mi AS (
		SELECT DISTINCT rownum AS mirn FROM lb WHERE requested_by IN (?)
	)
	SELECT requested_by, nickname, application_id, s, position, rownum
	FROM lb
	LEFT JOIN chat_user ON lb.requested_by = chat_user.address
	WHERE rownum <= ?`

	if len(mustIncludes) > 0 {
		query += fmt.Sprintf(" OR EXISTS (SELECT 1 FROM mi WHERE ABS(rownum - mirn) <= %d)", showNeighbors)
	} else {
		mustIncludes = []string{"<never matches>"}
	}
	query += " ORDER BY position, rownum"

	query, args, err := sqlx.In(query, start, end, mustIncludes, size)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	query = tx.Rebind(query)

	rows, err := tx.Query(query, args...)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	defer rows.Close()

	entries := []SpendingLeaderboardEntry{}
	for rows.Next() {
		entry := SpendingLeaderboardEntry{}
		var nickname, applicationID *string
		err := rows.Scan(&entry.Address, &nickname, &applicationID, &entry.TotalSpent, &entry.Position, &entry.RowNum)
		if err != nil {
			return entries, stacktrace.Propagate(err, "")
		}
		entry.Nickname = lo.FromPtr(nickname)
		entry.ApplicationID = lo.FromPtr(applicationID)
		entries = append(entries, entry)
	}
	return entries, stacktrace.Propagate(rows.Err(), "")
}

// CrowdfundedTransactionLeaderboardBetween returns the community skip or the community tipping leaderboard for the specified period
func CrowdfundedTransactionLeaderboardBetween(node sqalx.Node, start, end time.Time, txType CrowdfundedTransactionType, size int, showNeighbors int, mustIncludes ...string) ([]SpendingLeaderboardEntry, error) {
	tx, err := node.Beginx()
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	defer tx.Commit() // read-only tx

	query := `WITH lb AS (
		SELECT
			from_address,
			SUM(amount) AS s,
			rank() OVER (ORDER BY SUM(amount) DESC) AS position,
			row_number() OVER (ORDER BY SUM(amount) DESC) AS rownum
		FROM crowdfunded_transaction
		WHERE transaction_type = ? AND received_at BETWEEN ? AND ?
		GROUP BY from_address
	),
	mi AS (
		SELECT DISTINCT rownum AS mirn FROM lb WHERE from_address IN (?)
	)
	SELECT from_address, nickname, application_id, s, position, rownum
	FROM lb
	LEFT JOIN chat_user ON lb.from_address = chat_user.address
	WHERE rownum <= ?`

	if len(mustIncludes) > 0 {
		query += fmt.Sprintf(" OR EXISTS (SELECT 1 FROM mi WHERE ABS(rownum - mirn) <= %d)", showNeighbors)
	} else {
		mustIncludes = []string{"<never matches>"}
	}
	query += " ORDER BY position, rownum"

	query, args, err := sqlx.In(query, txType, start, end, mustIncludes, size)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	query = tx.Rebind(query)

	rows, err := tx.Query(query, args...)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	defer rows.Close()

	entries := []SpendingLeaderboardEntry{}
	for rows.Next() {
		entry := SpendingLeaderboardEntry{}
		var nickname, applicationID *string
		err := rows.Scan(&entry.Address, &nickname, &applicationID, &entry.TotalSpent, &entry.Position, &entry.RowNum)
		if err != nil {
			return entries, stacktrace.Propagate(err, "")
		}
		entry.Nickname = lo.FromPtr(nickname)
		entry.ApplicationID = lo.FromPtr(applicationID)
		entries = append(entries, entry)
	}
	return entries, stacktrace.Propagate(rows.Err(), "")
}

// GlobalSpendingLeaderboardBetween returns the leaderboard for all forms of spending for the specified period
func GlobalSpendingLeaderboardBetween(node sqalx.Node, start, end time.Time, size int, showNeighbors int, mustIncludes ...string) ([]SpendingLeaderboardEntry, error) {
	tx, err := node.Beginx()
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	defer tx.Commit() // read-only tx

	query := `WITH lb AS (
		SELECT
			user_address,
			SUM(amount_spent) AS s,
			rank() OVER (ORDER BY SUM(amount_spent) DESC) AS position,
			row_number() OVER (ORDER BY SUM(amount_spent) DESC) AS rownum
		FROM (
			SELECT
				requested_by AS user_address,
				request_cost AS amount_spent
			FROM played_media
			WHERE requested_by <> '' AND started_at BETWEEN ? AND ?
			UNION ALL
			SELECT
				from_address AS user_address,
				amount AS amount_spent
			FROM crowdfunded_transaction
			WHERE received_at BETWEEN ? AND ?
		) AS all_spending
		GROUP BY user_address
	),
	mi AS (
		SELECT DISTINCT rownum AS mirn FROM lb WHERE user_address IN (?)
	)
	SELECT user_address, nickname, application_id, s, position, rownum
	FROM lb
	LEFT JOIN chat_user ON lb.user_address = chat_user.address
	WHERE rownum <= ?`

	if len(mustIncludes) > 0 {
		query += fmt.Sprintf(" OR EXISTS (SELECT 1 FROM mi WHERE ABS(rownum - mirn) <= %d)", showNeighbors)
	} else {
		mustIncludes = []string{"<never matches>"}
	}
	query += " ORDER BY position, rownum"

	query, args, err := sqlx.In(query, start, end, start, end, mustIncludes, size)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	query = tx.Rebind(query)

	rows, err := tx.Query(query, args...)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	defer rows.Close()

	entries := []SpendingLeaderboardEntry{}
	for rows.Next() {
		entry := SpendingLeaderboardEntry{}
		var nickname, applicationID *string
		err := rows.Scan(&entry.Address, &nickname, &applicationID, &entry.TotalSpent, &entry.Position, &entry.RowNum)
		if err != nil {
			return entries, stacktrace.Propagate(err, "")
		}
		entry.Nickname = lo.FromPtr(nickname)
		entry.ApplicationID = lo.FromPtr(applicationID)
		entries = append(entries, entry)
	}
	return entries, stacktrace.Propagate(rows.Err(), "")
}
