package usercache

import (
	"context"
	"database/sql"
	"errors"
	"time"

	"github.com/Yiling-J/theine-go"
	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/buildconfig"
	"github.com/tnyim/jungletv/server/auth"
	"github.com/tnyim/jungletv/utils/transaction"
)

// UserCache caches public user information
type UserCache interface {
	GetOrFetchUser(ctx context.Context, address string) (auth.User, error)
	CacheUser(ctx context.Context, user auth.User) error
}

// MemoryUserCache is a memory-based nickname cache
type MemoryUserCache struct {
	c *theine.LoadingCache[string, auth.User]
}

// NewInMemory returns a new MemoryUserCache
func NewInMemory() (*MemoryUserCache, error) {
	c := &MemoryUserCache{}
	var err error
	c.c, err = theine.NewBuilder[string, auth.User](buildconfig.ExpectedConcurrentUsers).Loading(c.cacheLoader).Build()
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	return c, nil
}

// GetOrFetchUser loads user info from cache, falling back to the database if necessary
func (c *MemoryUserCache) GetOrFetchUser(ctxCtx context.Context, address string) (auth.User, error) {
	user, err := c.c.Get(ctxCtx, address)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	return user, nil
}

func (c *MemoryUserCache) cacheLoader(ctxCtx context.Context, address string) (theine.Loaded[auth.User], error) {
	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return theine.Loaded[auth.User]{}, stacktrace.Propagate(err, "")
	}
	defer ctx.Commit() // read-only tx

	var userRecord struct {
		Nickname        *string
		PermissionLevel string  `db:"permission_level"`
		ApplicationID   *string `db:"application_id"`
	}
	err = ctx.Tx().GetContext(ctx, &userRecord,
		`SELECT nickname, permission_level, application_id FROM chat_user WHERE address = $1`, address)
	if err != nil {
		if !errors.Is(err, sql.ErrNoRows) {
			return theine.Loaded[auth.User]{}, stacktrace.Propagate(err, "")
		}
		// no nickname for this user
		// this behavior is not ideal but matches what we had before...
		return theine.Loaded[auth.User]{
			Value: nil,
			Cost:  1,
			TTL:   1 * time.Hour,
		}, nil
	}

	user := auth.BuildNonAuthorizedUser(
		address, auth.PermissionLevel(userRecord.PermissionLevel), userRecord.Nickname, userRecord.ApplicationID)
	return theine.Loaded[auth.User]{
		Value: user,
		Cost:  1,
		TTL:   1 * time.Hour,
	}, nil
}

// CacheUser saves user information in cache
func (c *MemoryUserCache) CacheUser(_ context.Context, user auth.User) error {
	if user == nil || user.IsUnknown() {
		return stacktrace.NewError("attempt to cache invalid user")
	}
	c.c.SetWithTTL(user.Address(), user, 1, 1*time.Hour)
	return nil
}
