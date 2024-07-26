package types

import (
	"database/sql"
	"time"

	sq "github.com/Masterminds/squirrel"
	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/utils/transaction"
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

// GetBannedUsers returns all registered user bans, starting with the most recent one
func GetBannedUsers(ctx transaction.WrappingContext, filter string, pagParams *PaginationParams) ([]*BannedUser, uint64, error) {
	s := sdb.Select().
		OrderBy("banned_user.banned_at DESC, banned_user.ban_id ASC")
	if filter != "" {
		s = s.Where(sq.Or{
			sq.Eq{"banned_user.ban_id": filter},
			sq.Expr("UPPER(banned_user.address) LIKE '%' || UPPER(?) || '%'", filter),
			sq.Expr("UPPER(banned_user.remote_address) LIKE '%' || UPPER(?) || '%'", filter),
			sq.Expr("UPPER(banned_user.reason) LIKE '%' || UPPER(?) || '%'", filter),
			sq.Expr("UPPER(banned_user.unban_reason) LIKE '%' || UPPER(?) || '%'", filter),
		})
	}
	s = applyPaginationParameters(s, pagParams)
	return GetWithSelectAndCount[*BannedUser](ctx, s)
}

// GetBannedUserWithIDs returns the user bans with the specified IDs
func GetBannedUserWithIDs(ctx transaction.WrappingContext, ids []string) (map[string]*BannedUser, error) {
	s := sdb.Select().
		Where(sq.Eq{"banned_user.ban_id": ids})
	items, err := GetWithSelect[*BannedUser](ctx, s)
	if err != nil {
		return map[string]*BannedUser{}, stacktrace.Propagate(err, "")
	}

	result := make(map[string]*BannedUser, len(items))
	for i := range items {
		result[items[i].BanID] = items[i]
	}
	return result, nil
}

// GetBannedUsersAtInstant returns a slice with all user bans in effect at the specified instant, starting with the most recent one
func GetBannedUsersAtInstant(ctx transaction.WrappingContext, instant time.Time, filter string, pagParams *PaginationParams) ([]*BannedUser, uint64, error) {
	s := sdb.Select().
		From("banned_user").
		Where(sq.Lt{"banned_user.banned_at": instant}).
		Where(sq.Or{
			sq.Expr("banned_user.banned_until IS NULL"),
			sq.GtOrEq{"banned_user.banned_until": instant},
		}).
		OrderBy("banned_user.banned_at DESC, banned_user.ban_id ASC")
	if filter != "" {
		s = s.Where(sq.Or{
			sq.Eq{"banned_user.ban_id": filter},
			sq.Expr("UPPER(banned_user.address) LIKE '%' || UPPER(?) || '%'", filter),
			sq.Expr("UPPER(banned_user.remote_address) LIKE '%' || UPPER(?) || '%'", filter),
			sq.Expr("UPPER(banned_user.reason) LIKE '%' || UPPER(?) || '%'", filter),
			sq.Expr("UPPER(banned_user.unban_reason) LIKE '%' || UPPER(?) || '%'", filter),
		})
	}
	s = applyPaginationParameters(s, pagParams)
	return GetWithSelectAndCount[*BannedUser](ctx, s)
}

// Update updates or inserts the BannedUser
func (obj *BannedUser) Update(ctx transaction.WrappingContext) error {
	return Update(ctx, obj)
}
