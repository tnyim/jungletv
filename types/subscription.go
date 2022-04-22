package types

import (
	"errors"
	"time"

	sq "github.com/Masterminds/squirrel"
	"github.com/gbl08ma/sqalx"
	"github.com/lib/pq"
	"github.com/palantir/stacktrace"
)

// Subscription represents a user subscription
type Subscription struct {
	RewardsAddress string    `dbKey:"true"`
	StartsAt       time.Time `dbKey:"true"`
	EndsAt         time.Time
	PaymentTxs     pq.Int64Array
}

// GetSubscriptions returns all subscriptions in the database
func GetSubscriptions(node sqalx.Node, pagParams *PaginationParams) ([]*Subscription, uint64, error) {
	s := sdb.Select().
		OrderBy("subscription.starts_at, subscription.rewards_address DESC")
	s = applyPaginationParameters(s, pagParams)
	return GetWithSelectAndCount[*Subscription](node, s)
}

// ErrNoSubscription is returned when we can not find the specified subscription
var ErrNoSubscription = errors.New("subscription not found")

// GetCurrentSubscription returns the current subscription for the given address at the given time,
// or ErrNoCurrentSubscription if the address is/was not subscribed at the given time
func GetCurrentSubscriptionAtTime(node sqalx.Node, address string, at time.Time) (*Subscription, error) {
	s := sdb.Select().
		Where(sq.Eq{"subscription.rewards_address": address}).
		Where(sq.LtOrEq{"subscription.starts_at": at}).
		Where(sq.Gt{"subscription.ends_at": at})
	items, _, err := GetWithSelectAndCount[*Subscription](node, s)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	if len(items) == 0 {
		return nil, stacktrace.Propagate(ErrNoSubscription, "")
	}
	return items[0], nil
}

// Update updates or inserts the Subscription
func (obj *Subscription) Update(node sqalx.Node) error {
	return Update(node, obj)
}
