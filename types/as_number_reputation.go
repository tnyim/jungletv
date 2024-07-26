package types

import (
	"time"

	sq "github.com/Masterminds/squirrel"
	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/utils/transaction"
)

// ASNumberReputation registers the reputation of an Autonomous System by its number
type ASNumberReputation struct {
	ASNumber  int `dbKey:"true" dbColumn:"as_number"`
	IsProxy   bool
	CreatedAt time.Time
	UpdatedAt time.Time
}

func (obj *ASNumberReputation) tableName() string {
	return "as_number_reputation"
}

// GetASNumberReputations returns all registered reputations
func GetASNumberReputations(ctx transaction.WrappingContext, pagParams *PaginationParams) ([]*ASNumberReputation, uint64, error) {
	s := sdb.Select().
		OrderBy("as_number_reputation.as_number ASC")
	s = applyPaginationParameters(s, pagParams)
	return GetWithSelectAndCount[*ASNumberReputation](ctx, s)
}

// GetProxyASNumberReputations returns all AS numbers marked as proxy
func GetProxyASNumberReputations(ctx transaction.WrappingContext, pagParams *PaginationParams) ([]*ASNumberReputation, uint64, error) {
	s := sdb.Select().
		Where(sq.Eq{"as_number_reputation.is_proxy": true}).
		OrderBy("as_number_reputation.as_number ASC")
	s = applyPaginationParameters(s, pagParams)
	return GetWithSelectAndCount[*ASNumberReputation](ctx, s)
}

// GetASNumberReputationsWithNumbers returns the reputations with the specified numbers
func GetASNumberReputationsWithNumbers(ctx transaction.WrappingContext, numbers int) (map[int]*ASNumberReputation, error) {
	s := sdb.Select().
		Where(sq.Eq{"as_number_reputation.as_number": numbers})
	items, err := GetWithSelect[*ASNumberReputation](ctx, s)
	if err != nil {
		return map[int]*ASNumberReputation{}, stacktrace.Propagate(err, "")
	}

	result := make(map[int]*ASNumberReputation, len(items))
	for i := range items {
		result[items[i].ASNumber] = items[i]
	}
	return result, nil
}

// Update updates or inserts the ASNumberReputation
func (obj *ASNumberReputation) Update(ctx transaction.WrappingContext) error {
	return Update(ctx, obj)
}

// Delete deletes the ASNumberReputation
func (obj *ASNumberReputation) Delete(ctx transaction.WrappingContext) error {
	return Delete(ctx, obj)
}
