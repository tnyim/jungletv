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
	StartedAt         time.Time
	EndedAt           sql.NullTime
	MediaLength       Duration
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
		return nil, totalCount, err
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

// LastPlayTimeOfMedia returns the last time the specified media was played, or a zero time if it has never been played
func LastPlayTimeOfMedia(node sqalx.Node, mediaType MediaType, ytVideoID string) (time.Time, error) {
	s := sdb.Select()
	switch mediaType {
	case MediaTypeYouTubeVideo:
		s = s.Where(sq.And{
			sq.Eq{"played_media.media_type": string(mediaType)},
			sq.Eq{"played_media.yt_video_id": ytVideoID},
		})
	default:
		return time.Time{}, stacktrace.NewError("invalid media type")
	}
	s = s.OrderBy("started_at DESC").Limit(1)
	m, _, err := getPlayedMediaWithSelect(node, s)
	if err != nil {
		return time.Time{}, stacktrace.Propagate(err, "")
	}
	if len(m) == 0 {
		return time.Time{}, nil
	}
	return m[0].StartedAt, nil
}

// Update updates or inserts the PlayedMedia
func (obj *PlayedMedia) Update(node sqalx.Node) error {
	return Update(node, obj)
}

// Delete deletes the PlayedMedia
func (obj *PlayedMedia) Delete(node sqalx.Node) error {
	return Delete(node, obj)
}
