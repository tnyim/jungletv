package types

import (
	"time"

	sq "github.com/Masterminds/squirrel"
	"github.com/gbl08ma/sqalx"
	"github.com/palantir/stacktrace"
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
func GetConnectionWithIDs(node sqalx.Node, ids []string) (map[string]*Connection, error) {
	s := sdb.Select().
		Where(sq.Eq{"connection.id": ids})
	items, err := GetWithSelect[*Connection](node, s)
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
func GetConnectionsForRewardsAddress(node sqalx.Node, address string) ([]*Connection, error) {
	s := sdb.Select().
		Where(sq.Eq{"connection.rewards_address": address})
	items, err := GetWithSelect[*Connection](node, s)
	if err != nil {
		return []*Connection{}, stacktrace.Propagate(err, "")
	}
	return items, nil
}

// GetConnectionsForServiceAndRewardsAddress returns the connections to the given service of the specified rewards address
func GetConnectionsForServiceAndRewardsAddress(node sqalx.Node, service ConnectionService, address string) ([]*Connection, error) {
	s := sdb.Select().
		Where(sq.Eq{"connection.rewards_address": address}).
		Where(sq.Eq{"connection.service": service})
	items, err := GetWithSelect[*Connection](node, s)
	if err != nil {
		return []*Connection{}, stacktrace.Propagate(err, "")
	}
	return items, nil
}

// Update updates or inserts the Connection
func (obj *Connection) Update(node sqalx.Node) error {
	return Update(node, obj)
}

// Delete deletes the Connection
func (obj *Connection) Delete(node sqalx.Node) error {
	return Delete(node, obj)
}
