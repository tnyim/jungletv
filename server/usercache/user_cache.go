package usercache

import (
	"context"
	"time"

	"github.com/palantir/stacktrace"
	"github.com/patrickmn/go-cache"
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
	c *cache.Cache[string, auth.User]
}

// NewInMemory returns a new MemoryUserCache
func NewInMemory() *MemoryUserCache {
	return &MemoryUserCache{
		c: cache.New[string, auth.User](1*time.Hour, 11*time.Minute),
	}
}

// GetOrFetchUser loads user info from cache, falling back to the database if necessary
func (c *MemoryUserCache) GetOrFetchUser(ctxCtx context.Context, address string) (auth.User, error) {
	i, present := c.c.Get(address)
	if present {
		return *i, nil
	}

	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	defer ctx.Commit() // read-only tx

	var userRecord struct {
		Nickname        *string
		PermissionLevel string `db:"permission_level"`
	}
	err = ctx.Tx().GetContext(ctx, &userRecord, `SELECT nickname, permission_level FROM chat_user WHERE address = $1`, address)
	if err != nil {
		// no nickname for this user
		return nil, nil
	}

	user := auth.NewAddressOnlyUserWithPermissionLevel(address, auth.PermissionLevel(userRecord.PermissionLevel))
	user.SetNickname(userRecord.Nickname)

	c.c.SetDefault(address, user)
	return user, nil
}

// CacheUser saves user information in cache
func (c *MemoryUserCache) CacheUser(_ context.Context, user auth.User) error {
	if user == nil || user.IsUnknown() {
		return stacktrace.NewError("attempt to cache invalid user")
	}
	c.c.SetDefault(user.Address(), user)
	return nil
}
