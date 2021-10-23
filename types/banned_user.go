package types

import (
	"database/sql"
	"time"

	sq "github.com/Masterminds/squirrel"
	"github.com/gbl08ma/sqalx"
	"github.com/palantir/stacktrace"
)

// BannedUser is a user ban
type BannedUser struct {
	BanID            string `dbKey:"true"`
	BannedAt         time.Time
	BannedUntil      sql.NullTime
	Address          string
	RemoteAddress    string
	FromChat         bool
	FromEnqueuing    bool
	FromRewards      bool
	Reason           string
	UnbanReason      string
	ModeratorAddress string
	ModeratorName    string
}

// getBannedUserWithSelect returns a slice with all user bans that match the conditions in sbuilder
func getBannedUserWithSelect(node sqalx.Node, sbuilder sq.SelectBuilder) ([]*BannedUser, uint64, error) {
	values, totalCount, err := GetWithSelect(node, &BannedUser{}, sbuilder, true)
	if err != nil {
		return nil, totalCount, stacktrace.Propagate(err, "")
	}

	converted := make([]*BannedUser, len(values))
	for i := range values {
		converted[i] = values[i].(*BannedUser)
	}

	return converted, totalCount, nil
}

// GetBannedUserWithIDs returns the user bans with the specified IDs
func GetBannedUserWithIDs(node sqalx.Node, ids []string) (map[string]*BannedUser, error) {
	s := sdb.Select().
		Where(sq.Eq{"banned_user.ban_id": ids})
	items, _, err := getBannedUserWithSelect(node, s)
	if err != nil {
		return map[string]*BannedUser{}, stacktrace.Propagate(err, "")
	}

	result := make(map[string]*BannedUser, len(items))
	for i := range items {
		result[items[i].BanID] = items[i]
	}
	return result, nil
}

// GetBannedUsersAtInstant returns a slice with all user bans in effect at the specified instant
func GetBannedUsersAtInstant(node sqalx.Node, instant time.Time) ([]*BannedUser, error) {
	s := sdb.Select().
		From("banned_user").
		Where(sq.Lt{"banned_user.banned_at": instant}).
		Where(sq.Or{
			sq.Expr("banned_user.banned_until IS NULL"),
			sq.GtOrEq{"banned_user.banned_until": instant},
		})
	m, _, err := getBannedUserWithSelect(node, s)
	return m, stacktrace.Propagate(err, "")
}

// Update updates or inserts the BannedUser
func (obj *BannedUser) Update(node sqalx.Node) error {
	return Update(node, obj)
}
