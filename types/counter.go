package types

import (
	"time"

	sq "github.com/Masterminds/squirrel"
	"github.com/gbl08ma/sqalx"
	"github.com/palantir/stacktrace"
)

// Counter is a multipurpose integer counter
type Counter struct {
	CounterName  string `dbKey:"true"`
	CounterValue int
	UpdatedAt    time.Time
}

// getCounterWithSelect returns a slice with all counters that match the conditions in sbuilder
func getCounterWithSelect(node sqalx.Node, sbuilder sq.SelectBuilder) ([]*Counter, uint64, error) {
	values, totalCount, err := GetWithSelect(node, &Counter{}, sbuilder, true)
	if err != nil {
		return nil, totalCount, stacktrace.Propagate(err, "")
	}

	converted := make([]*Counter, len(values))
	for i := range values {
		converted[i] = values[i].(*Counter)
	}

	return converted, totalCount, nil
}

// GetCounters returns all registered counters
func GetCounters(node sqalx.Node, filter string, pagParams *PaginationParams) ([]*Counter, uint64, error) {
	s := sdb.Select().
		OrderBy("counter.counter_name ASC")
	s = applyPaginationParameters(s, pagParams)
	return getCounterWithSelect(node, s)
}

// GetCountersWithNames returns the counters with the specified names
func GetCountersWithNames(node sqalx.Node, names []string) (map[string]*Counter, error) {
	s := sdb.Select().
		Where(sq.Eq{"counter.counter_name": names})
	items, _, err := getCounterWithSelect(node, s)
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
func (obj *Counter) Update(node sqalx.Node) error {
	return Update(node, obj)
}

// Delete deletes the Counter
func (obj *Counter) Delete(node sqalx.Node) error {
	return Delete(node, obj)
}
