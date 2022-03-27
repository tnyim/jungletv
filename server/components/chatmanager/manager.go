package chatmanager

import (
	"context"
	"log"
	"sync"
	"time"

	"github.com/bwmarrin/snowflake"
	"github.com/palantir/stacktrace"
	"github.com/sethvargo/go-limiter"
	"github.com/sethvargo/go-limiter/memorystore"
	"github.com/tnyim/jungletv/server/auth"
	"github.com/tnyim/jungletv/server/stores/blockeduser"
	"github.com/tnyim/jungletv/server/stores/chat"
	"github.com/tnyim/jungletv/server/stores/moderation"
	"github.com/tnyim/jungletv/utils/event"
	"gopkg.in/alexcesaro/statsd.v2"
)

// Manager handles the chat system
type Manager struct {
	log                   *log.Logger
	statsClient           *statsd.Client
	store                 chat.Store
	idNode                *snowflake.Node
	rateLimiter           limiter.Store
	slowmodeRateLimiter   limiter.Store
	nickChangeRateLimiter limiter.Store
	moderationStore       moderation.Store
	blockedUserStore      blockeduser.Store
	emoteCache            *chat.EmoteCache
	userSerializer        auth.APIUserSerializer

	enabled        bool
	slowmode       bool
	disabledReason DisabledReason
	chatEnabled    *event.NoArgEvent
	chatDisabled   *event.Event[DisabledReason]
	messageCreated *event.Event[MessageCreatedEventArgs]
	messageDeleted *event.Event[snowflake.ID]

	userBlockedByMutex   sync.RWMutex
	userBlockedBy        map[string]*event.Event[string]
	userUnblockedByMutex sync.RWMutex
	userUnblockedBy      map[string]*event.Event[string]
}

// New returns an initialized chat Manager
func New(log *log.Logger, statsClient *statsd.Client,
	store chat.Store, moderationStore moderation.Store, blockStore blockeduser.Store,
	userSerializer auth.APIUserSerializer) (*Manager, error) {
	node, err := snowflake.NewNode(1)
	if err != nil {
		return nil, stacktrace.Propagate(err, "failed to create snowflake node")
	}

	rateLimiter, err := memorystore.New(&memorystore.Config{
		Tokens:   15,
		Interval: 30 * time.Second,
	})
	if err != nil {
		return nil, stacktrace.Propagate(err, "failed to create rate limiter")
	}

	slowmodeRateLimiter, err := memorystore.New(&memorystore.Config{
		Tokens:   1,
		Interval: 20 * time.Second,
	})
	if err != nil {
		return nil, stacktrace.Propagate(err, "failed to create slowmode rate limiter")
	}

	nickChangeRateLimiter, err := memorystore.New(&memorystore.Config{
		Tokens:   1,
		Interval: 1 * time.Minute,
	})
	if err != nil {
		return nil, stacktrace.Propagate(err, "failed to create slowmode rate limiter")
	}

	return &Manager{
		log:                   log,
		statsClient:           statsClient,
		store:                 store,
		idNode:                node,
		rateLimiter:           rateLimiter,
		slowmodeRateLimiter:   slowmodeRateLimiter,
		nickChangeRateLimiter: nickChangeRateLimiter,
		enabled:               true,
		moderationStore:       moderationStore,
		blockedUserStore:      blockStore,
		emoteCache:            &chat.EmoteCache{},
		userSerializer:        userSerializer,

		userBlockedBy:   make(map[string]*event.Event[string]),
		userUnblockedBy: make(map[string]*event.Event[string]),

		chatEnabled:    event.NewNoArg(),
		chatDisabled:   event.New[DisabledReason](),
		messageCreated: event.New[MessageCreatedEventArgs](),
		messageDeleted: event.New[snowflake.ID](),
	}, nil
}

func (c *Manager) DeleteMessage(ctx context.Context, id snowflake.ID) (*chat.Message, error) {
	message, err := c.store.DeleteMessage(ctx, id)
	if err != nil {
		return nil, stacktrace.Propagate(err, "failed to delete chat message")
	}
	c.messageDeleted.Notify(id)
	return message, nil
}

func (c *Manager) SetNickname(ctxCtx context.Context, user auth.User, nickname *string, bypassRatelimit bool) error {
	if !bypassRatelimit {
		_, _, _, ok, err := c.nickChangeRateLimiter.Take(ctxCtx, user.Address())
		if err != nil {
			return stacktrace.Propagate(err, "")
		}
		if !ok {
			return stacktrace.NewError("rate limit reached")
		}
	}

	return stacktrace.Propagate(c.store.SetUserNickname(ctxCtx, user, nickname), "")
}
