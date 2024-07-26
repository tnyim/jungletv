package types

import (
	"time"

	sq "github.com/Masterminds/squirrel"
	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/utils/transaction"
)

// Connection represents a connection between a user identity and an external service
type Connection struct {
	ID                string `dbKey:"true"`
	Service           ConnectionService
	RewardsAddress    string
	Name              string
	CreatedAt         time.Time
	UpdatedAt         time.Time
	OAuthRefreshToken *string `dbColumn:"oauth_refresh_token"`
}

// GetConnectionWithIDs returns the connections with the specified IDs
func GetConnectionWithIDs(ctx transaction.WrappingContext, ids []string) (map[string]*Connection, error) {
	s := sdb.Select().
		Where(sq.Eq{"connection.id": ids})
	items, err := GetWithSelect[*Connection](ctx, s)
	if err != nil {
		return map[string]*Connection{}, stacktrace.Propagate(err, "")
	}

	result := make(map[string]*Connection, len(items))
	for i := range items {
		result[items[i].ID] = items[i]
	}
	return result, nil
}

// GetConnectionsForRewardsAddress returns the connections of the specified rewards address
func GetConnectionsForRewardsAddress(ctx transaction.WrappingContext, address string) ([]*Connection, error) {
	s := sdb.Select().
		Where(sq.Eq{"connection.rewards_address": address})
	items, err := GetWithSelect[*Connection](ctx, s)
	if err != nil {
		return []*Connection{}, stacktrace.Propagate(err, "")
	}
	return items, nil
}

// GetConnectionsForServiceAndRewardsAddress returns the connections to the given service of the specified rewards address
func GetConnectionsForServiceAndRewardsAddress(ctx transaction.WrappingContext, service ConnectionService, address string) ([]*Connection, error) {
	s := sdb.Select().
		Where(sq.Eq{"connection.rewards_address": address}).
		Where(sq.Eq{"connection.service": service})
	items, err := GetWithSelect[*Connection](ctx, s)
	if err != nil {
		return []*Connection{}, stacktrace.Propagate(err, "")
	}
	return items, nil
}

// Update updates or inserts the Connection
func (obj *Connection) Update(ctx transaction.WrappingContext) error {
	return Update(ctx, obj)
}

// Delete deletes the Connection
func (obj *Connection) Delete(ctx transaction.WrappingContext) error {
	return Delete(ctx, obj)
}
