package chat

import (
	"context"
	"sync"
	"time"

	"github.com/bwmarrin/snowflake"
	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/types"
	"github.com/tnyim/jungletv/utils/transaction"
)

// EmoteCache caches chat emote information
type EmoteCache struct {
	mutex            sync.RWMutex
	lastUpdated      time.Time
	cachedEmotes     []*types.ChatEmote
	cachedEmotesByID map[snowflake.ID]*types.ChatEmote
}

func (c *EmoteCache) ChatEmotes(ctx context.Context) ([]*types.ChatEmote, error) {
	c.mutex.RLock()

	if time.Since(c.lastUpdated) <= 1*time.Minute {
		defer c.mutex.RUnlock()
		return c.cachedEmotes, nil
	}

	// unlock because we need to get a write lock instead
	c.mutex.RUnlock()

	// will upgrade to write lock, this operation is not atomic,
	// we will check the condition again inside the function
	emotes, err := c.refreshCache(ctx)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	return emotes, nil
}

func (c *EmoteCache) EmoteByID(ctx context.Context, id snowflake.ID) (*types.ChatEmote, bool) {
	// don't check for need to update cache here - calls to ChatEmotes will be frequent enough to keep things sufficiently updated
	c.mutex.RLock()
	defer c.mutex.RUnlock()
	emote, found := c.cachedEmotesByID[id]
	return emote, found
}

func (c *EmoteCache) refreshCache(ctxCtx context.Context) ([]*types.ChatEmote, error) {
	c.mutex.Lock()
	defer c.mutex.Unlock()

	// repeat check inside write lock
	if time.Since(c.lastUpdated) <= 1*time.Minute {
		return c.cachedEmotes, nil
	}

	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	defer ctx.Commit() // read-only tx

	emotes, _, err := types.GetChatEmotes(ctx, nil)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	c.cachedEmotes = emotes

	c.cachedEmotesByID = make(map[snowflake.ID]*types.ChatEmote)
	for _, emote := range emotes {
		c.cachedEmotesByID[snowflake.ID(emote.ID)] = emote
	}
	return emotes, nil
}
