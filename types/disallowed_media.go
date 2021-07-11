package types

import (
	"time"

	sq "github.com/Masterminds/squirrel"
	"github.com/gbl08ma/sqalx"
	"github.com/palantir/stacktrace"
)

// DisallowedMedia is media that can't be played on the service
type DisallowedMedia struct {
	ID                string `dbKey:"true"`
	DisallowedBy      string
	DisallowedAt      time.Time
	MediaType         MediaType
	YouTubeVideoID    *string `dbColumn:"yt_video_id"`
	YouTubeVideoTitle *string `dbColumn:"yt_video_title"`
}

// getDisallowedMediaWithSelect returns a slice with all disallowed media that match the conditions in sbuilder
func getDisallowedMediaWithSelect(node sqalx.Node, sbuilder sq.SelectBuilder) ([]*DisallowedMedia, uint64, error) {
	values, totalCount, err := GetWithSelect(node, &DisallowedMedia{}, sbuilder, true)
	if err != nil {
		return nil, totalCount, err
	}

	converted := make([]*DisallowedMedia, len(values))
	for i := range values {
		converted[i] = values[i].(*DisallowedMedia)
	}

	return converted, totalCount, nil
}

// GetDisallowedMedia returns all disallowed media in the database
func GetDisallowedMedia(node sqalx.Node, pagParams *PaginationParams) ([]*DisallowedMedia, uint64, error) {
	s := sdb.Select().
		OrderBy("disallowed_media.disallowed_at DESC")
	s = applyPaginationParameters(s, pagParams)
	return getDisallowedMediaWithSelect(node, s)
}

// GetDisallowedMediaWithIDs returns the disallowed media with the specified IDs
func GetDisallowedMediaWithIDs(node sqalx.Node, ids []string) (map[string]*DisallowedMedia, error) {
	s := sdb.Select().
		Where(sq.Eq{"disallowed_media.id": ids})
	items, _, err := getDisallowedMediaWithSelect(node, s)
	if err != nil {
		return map[string]*DisallowedMedia{}, stacktrace.Propagate(err, "")
	}

	result := make(map[string]*DisallowedMedia, len(items))
	for i := range items {
		result[items[i].ID] = items[i]
	}
	return result, nil
}

// GetDisallowedMedia returns all disallowed media of the specified type
func GetDisallowedMediaWithType(node sqalx.Node, mediaType MediaType, pagParams *PaginationParams) ([]*DisallowedMedia, uint64, error) {
	s := sdb.Select().
		Where(sq.Eq{"disallowed_media.media_type": string(mediaType)}).
		OrderBy("disallowed_media.media_type DESC")
	s = applyPaginationParameters(s, pagParams)
	return getDisallowedMediaWithSelect(node, s)
}

// GetDisallowedMedia returns all disallowed media of the given type that matches the specified filter
func GetDisallowedMediaWithTypeAndFilter(node sqalx.Node, mediaType MediaType, filter string, pagParams *PaginationParams) ([]*DisallowedMedia, uint64, error) {
	s := sdb.Select().
		Where(sq.Eq{"disallowed_media.media_type": string(mediaType)}).
		Where(sq.Or{
			sq.Eq{"disallowed_media.id": filter},
			sq.Eq{"disallowed_media.yt_video_id": filter},
			sq.Like{"UPPER(disallowed_media.yt_video_title)": sq.Expr("UPPER(?)", filter)},
		}).
		OrderBy("disallowed_media.media_type DESC")
	s = applyPaginationParameters(s, pagParams)
	return getDisallowedMediaWithSelect(node, s)
}

// IsMediaAllowed returns whether the specified media is allowed
func IsMediaAllowed(node sqalx.Node, mediaType MediaType, ytVideoID string) (bool, error) {
	s := sdb.Select()
	switch mediaType {
	case MediaTypeYouTubeVideo:
		s = s.Where(sq.And{
			sq.Eq{"disallowed_media.media_type": string(mediaType)},
			sq.Eq{"disallowed_media.yt_video_id": ytVideoID},
		})
	default:
		return false, stacktrace.NewError("invalid media type")
	}
	m, _, err := getDisallowedMediaWithSelect(node, s)
	if err != nil {
		return false, stacktrace.Propagate(err, "")
	}
	return len(m) == 0, nil
}

// Update updates or inserts the DisallowedMedia
func (obj *DisallowedMedia) Update(node sqalx.Node) error {
	return Update(node, obj)
}

// Delete deletes the DisallowedMedia
func (obj *DisallowedMedia) Delete(node sqalx.Node) error {
	return Delete(node, obj)
}
