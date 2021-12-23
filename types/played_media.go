package types

import (
	"database/sql"
	"time"

	sq "github.com/Masterminds/squirrel"
	"github.com/gbl08ma/sqalx"
	"github.com/palantir/stacktrace"
	"github.com/shopspring/decimal"
)

// PlayedMedia is media that has played on the service
type PlayedMedia struct {
	ID                string `dbKey:"true"`
	EnqueuedAt        time.Time
	StartedAt         time.Time
	EndedAt           sql.NullTime
	MediaLength       Duration
	MediaOffset       Duration
	RequestedBy       string
	RequestCost       decimal.Decimal
	Unskippable       bool
	MediaType         MediaType
	YouTubeVideoID    *string `dbColumn:"yt_video_id"`
	YouTubeVideoTitle *string `dbColumn:"yt_video_title"`
}

// getPlayedMediaWithSelect returns a slice with all disallowed media that match the conditions in sbuilder
func getPlayedMediaWithSelect(node sqalx.Node, sbuilder sq.SelectBuilder) ([]*PlayedMedia, uint64, error) {
	values, totalCount, err := GetWithSelect(node, &PlayedMedia{}, sbuilder, true)
	if err != nil {
		return nil, totalCount, stacktrace.Propagate(err, "")
	}

	converted := make([]*PlayedMedia, len(values))
	for i := range values {
		converted[i] = values[i].(*PlayedMedia)
	}

	return converted, totalCount, nil
}

// GetPlayedMediaWithIDs returns the played media with the specified IDs
func GetPlayedMediaWithIDs(node sqalx.Node, ids []string) (map[string]*PlayedMedia, error) {
	s := sdb.Select().
		Where(sq.Eq{"played_media.id": ids})
	items, _, err := getPlayedMediaWithSelect(node, s)
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
func GetPlayedMediaRequestedBySince(node sqalx.Node, requestedBy string, since time.Time) ([]*PlayedMedia, error) {
	s := sdb.Select().
		From("played_media").
		Where(sq.Eq{"played_media.requested_by": requestedBy}).
		Where(sq.Gt{"COALESCE(played_media.ended_at, NOW())": since})
	m, _, err := getPlayedMediaWithSelect(node, s)
	return m, stacktrace.Propagate(err, "")
}

// LastPlaysOfMedia returns the times the specified media was played since the specified time
func LastPlaysOfMedia(node sqalx.Node, since time.Time, mediaType MediaType, ytVideoID string) ([]*PlayedMedia, error) {
	s := sdb.Select().
		Where(sq.Gt{"COALESCE(played_media.ended_at, NOW())": since})
	switch mediaType {
	case MediaTypeYouTubeVideo:
		s = s.Where(sq.And{
			sq.Eq{"played_media.media_type": string(mediaType)},
			sq.Eq{"played_media.yt_video_id": ytVideoID},
		})
	default:
		return []*PlayedMedia{}, stacktrace.NewError("invalid media type")
	}
	s = s.OrderBy("started_at DESC").Limit(1)
	m, _, err := getPlayedMediaWithSelect(node, s)
	return m, stacktrace.Propagate(err, "")
}

// SumRequestCostsOfAddressSince returns the sum of all request costs of an address since the specified time
func SumRequestCostsOfAddressSince(node sqalx.Node, address string, since time.Time) (decimal.Decimal, error) {
	tx, err := node.Beginx()
	if err != nil {
		return decimal.Decimal{}, stacktrace.Propagate(err, "")
	}
	defer tx.Commit() // read-only tx

	var totalAmount decimal.Decimal
	err = sdb.Select("COALESCE(SUM(played_media.request_cost), 0)").
		From("played_media").
		Where(sq.Eq{"played_media.requested_by": address}).
		Where(sq.Gt{"played_media.started_at": since}).
		RunWith(tx).QueryRow().Scan(&totalAmount)
	if err != nil {
		return decimal.Decimal{}, stacktrace.Propagate(err, "")
	}
	return totalAmount, nil
}

// CountRequestsOfAddressSince returns the count and total play time of all the requests by an address since the specified time
func CountRequestsOfAddressSince(node sqalx.Node, address string, since time.Time) (int, Duration, error) {
	tx, err := node.Beginx()
	if err != nil {
		return 0, 0, stacktrace.Propagate(err, "")
	}
	defer tx.Commit() // read-only tx

	var count int
	var length Duration
	err = sdb.Select("COUNT(*), COALESCE(SUM(COALESCE(played_media.ended_at, NOW()) - played_media.started_at), '0 seconds')").
		From("played_media").
		Where(sq.Eq{"played_media.requested_by": address}).
		Where(sq.Gt{"played_media.started_at": since}).
		RunWith(tx).QueryRow().Scan(&count, &length)
	if err != nil {
		return 0, 0, stacktrace.Propagate(err, "")
	}
	return count, length, nil
}

// Update updates or inserts the PlayedMedia
func (obj *PlayedMedia) Update(node sqalx.Node) error {
	return Update(node, obj)
}

// Delete deletes the PlayedMedia
func (obj *PlayedMedia) Delete(node sqalx.Node) error {
	return Delete(node, obj)
}

// PlayedMediaRaffleEntry is the raffle entry representation of a played media entry
// It corresponds to the same DB entry as PlayedMedia, it's just a different "view" over it
type PlayedMediaRaffleEntry struct {
	TicketNumber   int `dbColumnRaw:"ROW_NUMBER() OVER (ORDER BY played_media.started_at) AS ticket_number"`
	RequestedBy    string
	YouTubeVideoID *string `dbColumn:"yt_video_id"`
}

func (p *PlayedMediaRaffleEntry) tableName() string {
	return "played_media"
}

// GetPlayedMediaRaffleEntriesBetween returns the played media raffle entries in the specified time period
func GetPlayedMediaRaffleEntriesBetween(node sqalx.Node, onOrAfter time.Time, before time.Time) ([]*PlayedMediaRaffleEntry, error) {
	s := sdb.Select().
		Where(sq.GtOrEq{"played_media.started_at": onOrAfter}).
		Where(sq.Lt{"played_media.started_at": before}).
		Where(sq.NotEq{"requested_by": ""}).
		OrderBy("played_media.started_at")

	values, _, err := GetWithSelect(node, &PlayedMediaRaffleEntry{}, s, false)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	converted := make([]*PlayedMediaRaffleEntry, len(values))
	for i := range values {
		converted[i] = values[i].(*PlayedMediaRaffleEntry)
	}
	return converted, nil
}

// CountMediaRaffleEntriesBetween counts the played media raffle entries in the specified time period
func CountMediaRaffleEntriesBetween(node sqalx.Node, onOrAfter time.Time, before time.Time) (int, error) {
	tx, err := node.Beginx()
	if err != nil {
		return 0, stacktrace.Propagate(err, "")
	}
	defer tx.Commit() // read-only tx

	s := sdb.Select("COUNT(*)").
		From("played_media").
		Where(sq.GtOrEq{"played_media.started_at": onOrAfter}).
		Where(sq.Lt{"played_media.started_at": before}).
		Where(sq.NotEq{"requested_by": ""})

	var count int
	err = s.RunWith(tx).QueryRow().Scan(&count)
	return count, stacktrace.Propagate(err, "")
}

// CountMediaRaffleEntriesRequestedByBetween counts the played media raffle entries in the specified time period that belong to the specified user
func CountMediaRaffleEntriesRequestedByBetween(node sqalx.Node, onOrAfter time.Time, before time.Time, user string) (int, error) {
	tx, err := node.Beginx()
	if err != nil {
		return 0, stacktrace.Propagate(err, "")
	}
	defer tx.Commit() // read-only tx

	s := sdb.Select("COUNT(*)").
		From("played_media").
		Where(sq.GtOrEq{"played_media.started_at": onOrAfter}).
		Where(sq.Lt{"played_media.started_at": before}).
		Where(sq.Eq{"requested_by": user})

	var count int
	err = s.RunWith(tx).QueryRow().Scan(&count)
	return count, stacktrace.Propagate(err, "")
}
