package types

import (
	"time"

	sq "github.com/Masterminds/squirrel"
	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/utils/transaction"
)

// Counter is a multipurpose integer counter
type Counter struct {
	CounterName  string `dbKey:"true"`
	CounterValue int
	UpdatedAt    time.Time
}

// GetCounters returns all registered counters
func GetCounters(ctx transaction.WrappingContext, pagParams *PaginationParams) ([]*Counter, uint64, error) {
	s := sdb.Select().
		OrderBy("counter.counter_name ASC")
	s = applyPaginationParameters(s, pagParams)
	return GetWithSelectAndCount[*Counter](ctx, s)
}

// GetCountersWithNames returns the counters with the specified names
func GetCountersWithNames(ctx transaction.WrappingContext, names []string) (map[string]*Counter, error) {
	s := sdb.Select().
		Where(sq.Eq{"counter.counter_name": names})
	items, err := GetWithSelect[*Counter](ctx, s)
	if err != nil {
		return map[string]*Counter{}, stacktrace.Propagate(err, "")
	}

	result := make(map[string]*Counter, len(items))
	for i := range items {
		result[items[i].CounterName] = items[i]
	}
	return result, nil
}

// Update updates or inserts the Counter
func (obj *Counter) Update(ctx transaction.WrappingContext) error {
	return Update(ctx, obj)
}

// Delete deletes the Counter
func (obj *Counter) Delete(ctx transaction.WrappingContext) error {
	return Delete(ctx, obj)
}
