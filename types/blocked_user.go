package types

import (
	"errors"
	"time"

	sq "github.com/Masterminds/squirrel"
	"github.com/gbl08ma/sqalx"
	"github.com/palantir/stacktrace"
)

// BlockedUser represents a blocked user
type BlockedUser struct {
	ID        string `dbKey:"true"`
	Address   string
	BlockedBy string
	CreatedAt time.Time
}

// getBlockedUserWithSelect returns a slice with all blocked users that match the conditions in sbuilder
func getBlockedUserWithSelect(node sqalx.Node, sbuilder sq.SelectBuilder) ([]*BlockedUser, uint64, error) {
	values, totalCount, err := GetWithSelect(node, &BlockedUser{}, sbuilder, true)
	if err != nil {
		return nil, totalCount, stacktrace.Propagate(err, "")
	}

	converted := make([]*BlockedUser, len(values))
	for i := range values {
		converted[i] = values[i].(*BlockedUser)
	}

	return converted, totalCount, nil
}

// GetUsersBlockedByAddress returns the users blocked by the specified address.
func GetUsersBlockedByAddress(node sqalx.Node, address string, pagParams *PaginationParams) ([]*BlockedUser, uint64, error) {
	s := sdb.Select().
		Where(sq.Eq{"blocked_user.blocked_by": address}).
		OrderBy("blocked_user.created_at", "blocked_user.id")
	s = applyPaginationParameters(s, pagParams)
	items, total, err := getBlockedUserWithSelect(node, s)
	return items, total, stacktrace.Propagate(err, "")
}

// ErrBlockedUserNotFound is returned when we can not find the specified blocked user
var ErrBlockedUserNotFound = errors.New("blocked user not found")

// GetBlockedUserByID returns the user block specified by the given ID
func GetBlockedUserByID(node sqalx.Node, id string) (*BlockedUser, error) {
	s := sdb.Select().
		Where(sq.Eq{"blocked_user.id": id})
	items, _, err := getBlockedUserWithSelect(node, s)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	if len(items) == 0 {
		return nil, stacktrace.Propagate(ErrBlockedUserNotFound, "")
	}

	return items[0], nil
}

// GetBlockedUserByID returns the user block specified by the given ID
func GetBlockedUserByAddress(node sqalx.Node, address string, blockedBy string) (*BlockedUser, error) {
	s := sdb.Select().
		Where(sq.Eq{"blocked_user.address": address}).
		Where(sq.Eq{"blocked_user.blocked_by": blockedBy})
	items, _, err := getBlockedUserWithSelect(node, s)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	if len(items) == 0 {
		return nil, stacktrace.Propagate(ErrBlockedUserNotFound, "")
	}

	return items[0], nil
}

// Update updates or inserts the BlockedUser
func (obj *BlockedUser) Update(node sqalx.Node) error {
	return Update(node, obj)
}

// Delete deletes the BlockedUser
func (obj *BlockedUser) Delete(node sqalx.Node) error {
	return Delete(node, obj)
}
