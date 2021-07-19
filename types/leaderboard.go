package types

import (
	"fmt"
	"time"

	"github.com/gbl08ma/sqalx"
	"github.com/jmoiron/sqlx"
	"github.com/palantir/stacktrace"
	"github.com/shopspring/decimal"
)

// EnqueueLeaderboardEntry represents a enqueue leaderboard entry
type EnqueueLeaderboardEntry struct {
	RowNum     int
	Position   int
	Address    string
	Nickname   string
	TotalSpent decimal.Decimal
}

// EnqueueLeaderboardBetween returns the enqueue leaderboard for the specified period
func EnqueueLeaderboardBetween(node sqalx.Node, start, end time.Time, size int, showNeighbors int, mustIncludes ...string) ([]EnqueueLeaderboardEntry, error) {
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
	SELECT requested_by, nickname, s, position, rownum
	FROM lb
	LEFT JOIN chat_user ON lb.requested_by = chat_user.address
	WHERE rownum <= ?`

	if len(mustIncludes) > 0 {
		query += fmt.Sprintf(" OR EXISTS (SELECT 1 FROM mi WHERE ABS(rownum - mirn) <= %d)", showNeighbors)
	} else {
		mustIncludes = []string{"<never matches>"}
	}

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

	entries := []EnqueueLeaderboardEntry{}
	for rows.Next() {
		entry := EnqueueLeaderboardEntry{}
		var nickname *string
		err := rows.Scan(&entry.Address, &nickname, &entry.TotalSpent, &entry.Position, &entry.RowNum)
		if err != nil {
			return entries, stacktrace.Propagate(err, "")
		}
		if nickname != nil {
			entry.Nickname = *nickname
		}
		entries = append(entries, entry)
	}
	return entries, stacktrace.Propagate(rows.Err(), "")
}
