package server

import (
	"context"
	"time"

	"github.com/palantir/stacktrace"
	"github.com/patrickmn/go-cache"
)

// NicknameCache caches public user information
type NicknameCache interface {
	GetOrFetchNickname(ctx context.Context, address string) (*string, error)
	CacheNickname(ctx context.Context, address string, nickname *string) error
}

// MemoryNicknameCache is a memory-based nickname cache
type MemoryNicknameCache struct {
	c *cache.Cache
}

// NewMemoryNicknameCache returns a new MemoryNicknameCache
func NewMemoryNicknameCache() *MemoryNicknameCache {
	return &MemoryNicknameCache{
		c: cache.New(1*time.Hour, 11*time.Minute),
	}
}

// LoadUser loads user info from cache, falling back to the database if necessary
func (c *MemoryNicknameCache) GetOrFetchNickname(ctxCtx context.Context, address string) (*string, error) {
	i, present := c.c.Get(address)
	if !present {
		ctx, err := BeginTransaction(ctxCtx)
		if err != nil {
			return nil, stacktrace.Propagate(err, "")
		}
		defer ctx.Commit() // read-only tx

		var nickname *string
		err = ctx.Tx().GetContext(ctx, &nickname, `SELECT nickname FROM chat_user WHERE address = $1`, address)
		if err != nil {
			// no nickname for this user
			return nil, nil
		}

		c.c.SetDefault(address, nickname)
		return nickname, nil
	}
	return i.(*string), nil
}

// CacheNickname saves a nickname in cache
func (c *MemoryNicknameCache) CacheNickname(_ context.Context, address string, nickname *string) error {
	c.c.SetDefault(address, nickname)
	return nil
}
