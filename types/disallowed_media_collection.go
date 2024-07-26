package types

import (
	"time"

	sq "github.com/Masterminds/squirrel"
	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/utils/transaction"
)

// DisallowedMediaCollection is a set of media that can't be played on the service
type DisallowedMediaCollection struct {
	ID              string `dbKey:"true"`
	DisallowedBy    string
	DisallowedAt    time.Time
	CollectionType  MediaCollectionType
	CollectionID    string `dbColumn:"collection_id"`
	CollectionTitle string
}

// GetDisallowedMediaCollections returns all disallowed media collections in the database
func GetDisallowedMediaCollections(ctx transaction.WrappingContext, pagParams *PaginationParams) ([]*DisallowedMediaCollection, uint64, error) {
	s := sdb.Select().
		OrderBy("disallowed_media_collection.disallowed_at DESC")
	s = applyPaginationParameters(s, pagParams)
	return GetWithSelectAndCount[*DisallowedMediaCollection](ctx, s)
}

// GetDisallowedMediaCollectionsWithIDs returns the disallowed media cpllections with the specified IDs
func GetDisallowedMediaCollectionsWithIDs(ctx transaction.WrappingContext, ids []string) (map[string]*DisallowedMediaCollection, error) {
	s := sdb.Select().
		Where(sq.Eq{"disallowed_media_collection.id": ids})
	items, err := GetWithSelect[*DisallowedMediaCollection](ctx, s)
	if err != nil {
		return map[string]*DisallowedMediaCollection{}, stacktrace.Propagate(err, "")
	}

	result := make(map[string]*DisallowedMediaCollection, len(items))
	for i := range items {
		result[items[i].ID] = items[i]
	}
	return result, nil
}

// GetDisallowedMediaCollectionsWithFilter returns all disallowed media collections that match the specified filter
func GetDisallowedMediaCollectionsWithFilter(ctx transaction.WrappingContext, filter string, pagParams *PaginationParams) ([]*DisallowedMediaCollection, uint64, error) {
	s := sdb.Select().
		Where(sq.Or{
			sq.Eq{"disallowed_media_collection.id": filter},
			sq.Eq{"disallowed_media_collection.collection_id": filter},
			sq.Expr("UPPER(disallowed_media_collection.collection_title) LIKE UPPER(?)", "%"+filter+"%"),
		}).
		OrderBy("disallowed_media_collection.disallowed_at DESC")
	s = applyPaginationParameters(s, pagParams)
	return GetWithSelectAndCount[*DisallowedMediaCollection](ctx, s)
}

// GetDisallowedMediaCollectionWithType returns all disallowed media collections of the specified type
func GetDisallowedMediaCollectionWithType(ctx transaction.WrappingContext, collectionType MediaCollectionType, pagParams *PaginationParams) ([]*DisallowedMediaCollection, uint64, error) {
	s := sdb.Select().
		Where(sq.Eq{"disallowed_media_collection.collection_type": string(collectionType)}).
		OrderBy("disallowed_media_collection.collection_type DESC")
	s = applyPaginationParameters(s, pagParams)
	return GetWithSelectAndCount[*DisallowedMediaCollection](ctx, s)
}

// GetDisallowedMediaCollectionsWithTypeAndFilter returns all disallowed media collections of the given type that match the specified filter
func GetDisallowedMediaCollectionsWithTypeAndFilter(ctx transaction.WrappingContext, collectionType MediaCollectionType, filter string, pagParams *PaginationParams) ([]*DisallowedMediaCollection, uint64, error) {
	s := sdb.Select().
		Where(sq.Eq{"disallowed_media_collection.collection_type": string(collectionType)}).
		Where(sq.Or{
			sq.Eq{"disallowed_media_collection.id": filter},
			sq.Eq{"disallowed_media_collection.collection_id": filter},
			sq.Expr("UPPER(disallowed_media_collection.collection_title) LIKE UPPER(?)", "%"+filter+"%"),
		}).
		OrderBy("disallowed_media_collection.disallowed_at DESC")
	s = applyPaginationParameters(s, pagParams)
	return GetWithSelectAndCount[*DisallowedMediaCollection](ctx, s)
}

// IsMediaCollectionAllowed returns whether the specified media is allowed
func IsMediaCollectionAllowed(ctx transaction.WrappingContext, collectionType MediaCollectionType, collectionID string) (bool, error) {
	s := sdb.Select().
		Where(sq.Eq{"disallowed_media_collection.collection_type": string(collectionType)}).
		Where(sq.Eq{"disallowed_media_collection.collection_id": collectionID})
	m, err := GetWithSelect[*DisallowedMediaCollection](ctx, s)
	if err != nil {
		return false, stacktrace.Propagate(err, "")
	}
	return len(m) == 0, nil
}

// Update updates or inserts the DisallowedMediaCollection
func (obj *DisallowedMediaCollection) Update(ctx transaction.WrappingContext) error {
	return Update(ctx, obj)
}

// Delete deletes the DisallowedMediaCollection
func (obj *DisallowedMediaCollection) Delete(ctx transaction.WrappingContext) error {
	return Delete(ctx, obj)
}
