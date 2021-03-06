package chatmanager

import (
	"context"
	"log"
	"net/http"
	"sync"
	"time"

	"github.com/bwmarrin/snowflake"
	"github.com/palantir/stacktrace"
	"github.com/patrickmn/go-cache"
	"github.com/sethvargo/go-limiter"
	"github.com/sethvargo/go-limiter/memorystore"
	"github.com/tnyim/jungletv/server/auth"
	"github.com/tnyim/jungletv/server/components/chatmanager/tenorclient"
	"github.com/tnyim/jungletv/server/components/pointsmanager"
	"github.com/tnyim/jungletv/server/stores/blockeduser"
	"github.com/tnyim/jungletv/server/stores/chat"
	"github.com/tnyim/jungletv/server/stores/moderation"
	"github.com/tnyim/jungletv/utils/event"
	"golang.org/x/sync/singleflight"
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
	gifSearchRateLimiter  limiter.Store
	moderationStore       moderation.Store
	blockedUserStore      blockeduser.Store
	emoteCache            *chat.EmoteCache
	userSerializer        auth.APIUserSerializer
	pointsManager         *pointsmanager.Manager

	tenorClient                      tenorclient.ClientWithResponsesInterface
	tenorAPIkey                      string
	tenorGifCache                    *cache.Cache[string, *chat.MessageAttachmentTenorGifView]
	getTenorGifInfoSingleflightGroup singleflight.Group

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

	userChangedNicknameMutex sync.RWMutex
	userChangedNickname      map[string]*event.Event[string]
}

// New returns an initialized chat Manager
func New(log *log.Logger, statsClient *statsd.Client,
	store chat.Store, moderationStore moderation.Store, blockStore blockeduser.Store,
	userSerializer auth.APIUserSerializer, pointsManager *pointsmanager.Manager, snowflakeNode *snowflake.Node,
	tenorAPIkey string) (*Manager, error) {
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

	gifSearchRateLimiter, err := memorystore.New(&memorystore.Config{
		Tokens:   1,
		Interval: 490 * time.Millisecond,
	})
	if err != nil {
		return nil, stacktrace.Propagate(err, "failed to create GIF search rate limiter")
	}

	tenorClient, err := tenorclient.NewClientWithResponses("https://g.tenor.com/", tenorclient.WithRequestEditorFn(func(ctx context.Context, req *http.Request) error {
		query := req.URL.Query()
		query.Del("key")
		query.Add("key", tenorAPIkey)
		req.URL.RawQuery = query.Encode()
		return nil
	}))
	if err != nil {
		return nil, stacktrace.Propagate(err, "failed to create Tenor client")
	}

	return &Manager{
		log:                   log,
		statsClient:           statsClient,
		store:                 store,
		idNode:                snowflakeNode,
		rateLimiter:           rateLimiter,
		slowmodeRateLimiter:   slowmodeRateLimiter,
		nickChangeRateLimiter: nickChangeRateLimiter,
		gifSearchRateLimiter:  gifSearchRateLimiter,
		enabled:               true,
		moderationStore:       moderationStore,
		blockedUserStore:      blockStore,
		emoteCache:            &chat.EmoteCache{},
		userSerializer:        userSerializer,
		pointsManager:         pointsManager,

		tenorClient:   tenorClient,
		tenorAPIkey:   tenorAPIkey,
		tenorGifCache: cache.New[string, *chat.MessageAttachmentTenorGifView](5*time.Minute, 1*time.Minute),

		userBlockedBy:   make(map[string]*event.Event[string]),
		userUnblockedBy: make(map[string]*event.Event[string]),

		userChangedNickname: make(map[string]*event.Event[string]),

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
