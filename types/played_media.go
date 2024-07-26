package types

import (
	"database/sql"
	"time"

	sq "github.com/Masterminds/squirrel"
	"github.com/jmoiron/sqlx/types"
	"github.com/palantir/stacktrace"
	"github.com/shopspring/decimal"
	"github.com/tnyim/jungletv/utils/transaction"
)

// PlayedMedia is media that has played on the service
type PlayedMedia struct {
	ID          string `dbKey:"true"`
	EnqueuedAt  time.Time
	StartedAt   time.Time
	EndedAt     sql.NullTime
	MediaLength Duration
	MediaOffset Duration
	RequestedBy string
	RequestCost decimal.Decimal
	Unskippable bool
	MediaType   MediaType
	MediaID     string `dbColumn:"media_id"`
	MediaInfo   types.JSONText
}

// GetPlayedMediaFilters contains the filters to pass to GetPlayedMedia. Different conditions are ANDed together
type GetPlayedMediaFilters struct {
	ExcludeDisallowed       bool
	ExcludeCurrentlyPlaying bool
	StartedSince            time.Time
	StartedUntil            time.Time
	EnqueuedSince           time.Time
	EnqueuedUntil           time.Time
	TextFilter              string
	OrderBy                 GetPlayedMediaOrderBy
}

// GetPlayedMediaOrderBy specifies how to order the results of GetPlayedMedia
type GetPlayedMediaOrderBy string

// GetPlayedMediaOrderByStartedAtAsc sorts the results of GetPlayedMedia by StartedAt in ascending order
var GetPlayedMediaOrderByStartedAtAsc GetPlayedMediaOrderBy = "played_media.started_at ASC"

// GetPlayedMediaOrderByStartedAtDesc sorts the results of GetPlayedMedia by StartedAt in descending order
var GetPlayedMediaOrderByStartedAtDesc GetPlayedMediaOrderBy = "played_media.started_at DESC"

// GetPlayedMediaOrderByEnqueuedAtAsc sorts the results of GetPlayedMedia by EnqueuedAt in ascending order
var GetPlayedMediaOrderByEnqueuedAtAsc GetPlayedMediaOrderBy = "played_media.enqueued_at ASC"

// GetPlayedMediaOrderByEnqueuedAtDesc sorts the results of GetPlayedMedia by EnqueuedAt in descending order
var GetPlayedMediaOrderByEnqueuedAtDesc GetPlayedMediaOrderBy = "played_media.enqueued_at DESC"

// GetPlayedMedia returns all played media in the database according to the given filters
func GetPlayedMedia(ctx transaction.WrappingContext, filters GetPlayedMediaFilters, pagParams *PaginationParams) ([]*PlayedMedia, uint64, error) {
	orderBy := "played_media.started_at DESC"
	if filters.OrderBy != "" {
		orderBy = string(filters.OrderBy)
	}
	s := sdb.Select().
		OrderBy(orderBy)
	if filters.ExcludeDisallowed {
		s = s.LeftJoin(`disallowed_media ON
				disallowed_media.media_type = played_media.media_type AND
				disallowed_media.media_id = played_media.media_id`).
			Where(sq.Eq{"disallowed_media.media_type": nil})
	}
	if filters.ExcludeCurrentlyPlaying {
		s = s.Where(sq.NotEq{"played_media.ended_at": nil})
	}
	if !filters.StartedSince.IsZero() {
		s = s.Where(sq.Gt{"played_media.started_at": filters.StartedSince})
	}
	if !filters.StartedUntil.IsZero() {
		s = s.Where(sq.LtOrEq{"played_media.started_at": filters.StartedUntil})
	}
	if !filters.EnqueuedSince.IsZero() {
		s = s.Where(sq.Gt{"played_media.enqueued_at": filters.EnqueuedSince})
	}
	if !filters.EnqueuedUntil.IsZero() {
		s = s.Where(sq.LtOrEq{"played_media.enqueued_at": filters.EnqueuedUntil})
	}
	if filters.TextFilter != "" {
		s = s.Where(sq.Or{
			sq.Eq{"played_media.media_id": filters.TextFilter},
			sq.Expr("UPPER(played_media.media_info->>'title') LIKE UPPER(?)", "%"+filters.TextFilter+"%"),
		})
	}
	s = applyPaginationParameters(s, pagParams)
	m, c, err := GetWithSelectAndCount[*PlayedMedia](ctx, s)
	return m, c, stacktrace.Propagate(err, "")
}

// GetPlayedMediaWithIDs returns the played media with the specified IDs
func GetPlayedMediaWithIDs(ctx transaction.WrappingContext, ids []string) (map[string]*PlayedMedia, error) {
	s := sdb.Select().
		Where(sq.Eq{"played_media.id": ids})
	items, err := GetWithSelect[*PlayedMedia](ctx, s)
	if err != nil {
		return map[string]*PlayedMedia{}, stacktrace.Propagate(err, "")
	}

	result := make(map[string]*PlayedMedia, len(items))
	for i := range items {
		result[items[i].ID] = items[i]
	}
	return result, nil
}

// GetPlayedMediaRequestedBySince returns the played media that had been requested by the given address and which is
// playing or has finished playing since the specified moment
func GetPlayedMediaRequestedBySince(ctx transaction.WrappingContext, requestedBy string, since time.Time) ([]*PlayedMedia, error) {
	s := sdb.Select().
		From("played_media").
		Where(sq.Eq{"played_media.requested_by": requestedBy}).
		Where(sq.Gt{"COALESCE(played_media.ended_at, NOW())": since})
	m, err := GetWithSelect[*PlayedMedia](ctx, s)
	return m, stacktrace.Propagate(err, "")
}

// LastPlaysOfMedia returns the times the specified media was played since the specified time
func LastPlaysOfMedia(ctx transaction.WrappingContext, since time.Time, mediaType MediaType, mediaID string) ([]*PlayedMedia, error) {
	s := sdb.Select().
		Where(sq.Gt{"COALESCE(played_media.ended_at, NOW())": since}).
		Where(sq.Eq{"played_media.media_type": string(mediaType)}).
		Where(sq.Eq{"played_media.media_id": mediaID}).
		OrderBy("started_at DESC").Limit(1)
	m, err := GetWithSelect[*PlayedMedia](ctx, s)
	return m, stacktrace.Propagate(err, "")
}

// SumRequestCostsOfAddressSince returns the sum of all request costs of an address since the specified time
func SumRequestCostsOfAddressSince(ctx transaction.WrappingContext, address string, since time.Time) (decimal.Decimal, error) {
	ctx, err := transaction.Begin(ctx)
	if err != nil {
		return decimal.Decimal{}, stacktrace.Propagate(err, "")
	}
	defer ctx.Commit() // read-only tx

	var totalAmount decimal.Decimal
	err = sdb.Select("COALESCE(SUM(played_media.request_cost), 0)").
		From("played_media").
		Where(sq.Eq{"played_media.requested_by": address}).
		Where(sq.Gt{"played_media.started_at": since}).
		RunWith(ctx).QueryRowContext(ctx).Scan(&totalAmount)
	if err != nil {
		return decimal.Decimal{}, stacktrace.Propagate(err, "")
	}
	return totalAmount, nil
}

// CountRequestsOfAddressSince returns the count and total play time of all the requests by an address since the specified time
func CountRequestsOfAddressSince(ctx transaction.WrappingContext, address string, since time.Time) (int, Duration, error) {
	ctx, err := transaction.Begin(ctx)
	if err != nil {
		return 0, 0, stacktrace.Propagate(err, "")
	}
	defer ctx.Commit() // read-only tx

	var count int
	var length Duration
	err = sdb.Select("COUNT(*), COALESCE(SUM(COALESCE(played_media.ended_at, NOW()) - played_media.started_at), '0 seconds')").
		From("played_media").
		Where(sq.Eq{"played_media.requested_by": address}).
		Where(sq.Gt{"played_media.started_at": since}).
		RunWith(ctx).QueryRowContext(ctx).Scan(&count, &length)
	if err != nil {
		return 0, 0, stacktrace.Propagate(err, "")
	}
	return count, length, nil
}

// LastRequestsOfAddress returns the most recent played medias requested by the specified address
func LastRequestsOfAddress(ctx transaction.WrappingContext, address string, count int, excludeDisallowed bool) ([]*PlayedMedia, error) {
	s := sdb.Select().
		Where(sq.Eq{"played_media.requested_by": address})
	if excludeDisallowed {
		s = s.LeftJoin(`disallowed_media ON
				disallowed_media.media_type = played_media.media_type AND
				disallowed_media.media_id = played_media.media_id`).
			Where(sq.Eq{"disallowed_media.media_type": nil})
	}
	s = s.OrderBy("started_at DESC").Limit(uint64(count))
	m, err := GetWithSelect[*PlayedMedia](ctx, s)
	return m, stacktrace.Propagate(err, "")
}

// Update updates or inserts the PlayedMedia
func (obj *PlayedMedia) Update(ctx transaction.WrappingContext) error {
	return Update(ctx, obj)
}

// Delete deletes the PlayedMedia
func (obj *PlayedMedia) Delete(ctx transaction.WrappingContext) error {
	return Delete(ctx, obj)
}

// PlayedMediaRaffleEntry is the raffle entry representation of a played media entry
// It corresponds to the same DB entry as PlayedMedia, it's just a different "view" over it
type PlayedMediaRaffleEntry struct {
	TicketNumber int `dbColumnRaw:"ROW_NUMBER() OVER (ORDER BY played_media.started_at) AS ticket_number"`
	RequestedBy  string
	MediaID      string `dbColumn:"media_id"`
}

func (p *PlayedMediaRaffleEntry) tableName() string {
	return "played_media"
}

var applicationsExcludedFromRaffleCutoff = time.Date(2024, 2, 1, 0, 0, 0, 0, time.UTC)

// GetPlayedMediaRaffleEntriesBetween returns the played media raffle entries in the specified time period
func GetPlayedMediaRaffleEntriesBetween(ctx transaction.WrappingContext, onOrAfter time.Time, before time.Time) ([]*PlayedMediaRaffleEntry, error) {
	s := sdb.Select().
		Where(sq.GtOrEq{"played_media.started_at": onOrAfter}).
		Where(sq.Lt{"played_media.started_at": before}).
		Where(sq.Like{"played_media.requested_by": "ban_%"}). // exclude entries without requester and with requesters from alien chains
		OrderBy("played_media.started_at")

	if onOrAfter.After(applicationsExcludedFromRaffleCutoff) || before.After(applicationsExcludedFromRaffleCutoff) {
		s = s.Where(sq.Expr("played_media.requested_by NOT IN (SELECT \"address\" FROM chat_user WHERE application_id IS NOT NULL)"))
	}

	values, err := GetWithSelect[*PlayedMediaRaffleEntry](ctx, s)
	return values, stacktrace.Propagate(err, "")
}

// CountMediaRaffleEntriesBetween counts the played media raffle entries in the specified time period
func CountMediaRaffleEntriesBetween(ctx transaction.WrappingContext, onOrAfter time.Time, before time.Time) (int, error) {
	ctx, err := transaction.Begin(ctx)
	if err != nil {
		return 0, stacktrace.Propagate(err, "")
	}
	defer ctx.Commit() // read-only tx

	s := sdb.Select("COUNT(*)").
		From("played_media").
		Where(sq.GtOrEq{"played_media.started_at": onOrAfter}).
		Where(sq.Lt{"played_media.started_at": before}).
		Where(sq.Like{"played_media.requested_by": "ban_%"}) // exclude entries without requester and with requesters from alien chains

	if onOrAfter.After(applicationsExcludedFromRaffleCutoff) || before.After(applicationsExcludedFromRaffleCutoff) {
		s = s.Where(sq.Expr("played_media.requested_by NOT IN (SELECT \"address\" FROM chat_user WHERE application_id IS NOT NULL)"))
	}

	var count int
	err = s.RunWith(ctx).QueryRowContext(ctx).Scan(&count)
	return count, stacktrace.Propagate(err, "")
}

// CountMediaRaffleEntriesRequestedByBetween counts the played media raffle entries in the specified time period that belong to the specified user
func CountMediaRaffleEntriesRequestedByBetween(ctx transaction.WrappingContext, onOrAfter time.Time, before time.Time, user string) (int, error) {
	ctx, err := transaction.Begin(ctx)
	if err != nil {
		return 0, stacktrace.Propagate(err, "")
	}
	defer ctx.Commit() // read-only tx

	s := sdb.Select("COUNT(*)").
		From("played_media").
		Where(sq.GtOrEq{"played_media.started_at": onOrAfter}).
		Where(sq.Lt{"played_media.started_at": before}).
		Where(sq.Eq{"played_media.requested_by": user})

	if onOrAfter.After(applicationsExcludedFromRaffleCutoff) || before.After(applicationsExcludedFromRaffleCutoff) {
		// this shouldn't really matter because applications normally won't be requesting the count of their raffle entries, in any case:
		s = s.Where(sq.Expr("played_media.requested_by NOT IN (SELECT \"address\" FROM chat_user WHERE application_id IS NOT NULL)"))
	}

	var count int
	err = s.RunWith(ctx).QueryRowContext(ctx).Scan(&count)
	return count, stacktrace.Propagate(err, "")
}
