package types

import (
	"errors"
	"time"

	sq "github.com/Masterminds/squirrel"
	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/utils/transaction"
)

// BlockedUser represents a blocked user
type BlockedUser struct {
	ID        string `dbKey:"true"`
	Address   string
	BlockedBy string
	CreatedAt time.Time
}

// GetUsersBlockedByAddress returns the users blocked by the specified address.
func GetUsersBlockedByAddress(ctx transaction.WrappingContext, address string, pagParams *PaginationParams) ([]*BlockedUser, uint64, error) {
	s := sdb.Select().
		Where(sq.Eq{"blocked_user.blocked_by": address}).
		OrderBy("blocked_user.created_at", "blocked_user.id")
	s = applyPaginationParameters(s, pagParams)
	items, total, err := GetWithSelectAndCount[*BlockedUser](ctx, s)
	return items, total, stacktrace.Propagate(err, "")
}

// ErrBlockedUserNotFound is returned when we can not find the specified blocked user
var ErrBlockedUserNotFound = errors.New("blocked user not found")

// GetBlockedUserByID returns the user block specified by the given ID
func GetBlockedUserByID(ctx transaction.WrappingContext, id string) (*BlockedUser, error) {
	s := sdb.Select().
		Where(sq.Eq{"blocked_user.id": id})
	items, err := GetWithSelect[*BlockedUser](ctx, s)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	if len(items) == 0 {
		return nil, stacktrace.Propagate(ErrBlockedUserNotFound, "")
	}

	return items[0], nil
}

// GetBlockedUserByID returns the user block specified by the given ID
func GetBlockedUserByAddress(ctx transaction.WrappingContext, address string, blockedBy string) (*BlockedUser, error) {
	s := sdb.Select().
		Where(sq.Eq{"blocked_user.address": address}).
		Where(sq.Eq{"blocked_user.blocked_by": blockedBy})
	items, err := GetWithSelect[*BlockedUser](ctx, s)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	if len(items) == 0 {
		return nil, stacktrace.Propagate(ErrBlockedUserNotFound, "")
	}

	return items[0], nil
}

// Update updates or inserts the BlockedUser
func (obj *BlockedUser) Update(ctx transaction.WrappingContext) error {
	return Update(ctx, obj)
}

// Delete deletes the BlockedUser
func (obj *BlockedUser) Delete(ctx transaction.WrappingContext) error {
	return Delete(ctx, obj)
}
