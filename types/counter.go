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

// GetCounters returns all registered counters
func GetCounters(node sqalx.Node, pagParams *PaginationParams) ([]*Counter, uint64, error) {
	s := sdb.Select().
		OrderBy("counter.counter_name ASC")
	s = applyPaginationParameters(s, pagParams)
	return GetWithSelectAndCount[*Counter](node, s)
}

// GetCountersWithNames returns the counters with the specified names
func GetCountersWithNames(node sqalx.Node, names []string) (map[string]*Counter, error) {
	s := sdb.Select().
		Where(sq.Eq{"counter.counter_name": names})
	items, err := GetWithSelect[*Counter](node, s)
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
