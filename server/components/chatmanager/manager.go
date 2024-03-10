package chatmanager

import (
	"context"
	"log"
	"net/http"
	"time"

	"github.com/bwmarrin/snowflake"
	"github.com/palantir/stacktrace"
	"github.com/patrickmn/go-cache"
	"github.com/puzpuzpuz/xsync/v3"
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
	tenorGifCache                    *cache.Cache[string, *MessageAttachmentTenorGifView]
	getTenorGifInfoSingleflightGroup singleflight.Group

	enabled        bool
	slowmode       bool
	disabledReason DisabledReason
	chatEnabled    event.NoArgEvent
	chatDisabled   event.Event[DisabledReason]
	messageCreated event.Event[MessageCreatedEventArgs]
	messageDeleted event.Event[snowflake.ID]

	userBlockedBy       event.Keyed[string, string]
	userUnblockedBy     event.Keyed[string, string]
	userChangedNickname event.Keyed[string, string]

	userConnectionsCounts *xsync.MapOf[string, int]
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
	m := &Manager{
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
		tenorGifCache: cache.New[string, *MessageAttachmentTenorGifView](5*time.Minute, 1*time.Minute),

		userBlockedBy:   event.NewKeyed[string, string](),
		userUnblockedBy: event.NewKeyed[string, string](),

		userChangedNickname: event.NewKeyed[string, string](),

		chatEnabled:    event.NewNoArg(),
		chatDisabled:   event.New[DisabledReason](),
		messageCreated: event.New[MessageCreatedEventArgs](),
		messageDeleted: event.New[snowflake.ID](),

		userConnectionsCounts: xsync.NewMapOf[string, int](),
	}

	m.store.SetAttachmentLoaderForType(MessageAttachmentTypeTenorGif, m.getTenorGifInfo)

	return m, nil
}

func (c *Manager) SetAttachmentLoaderForType(attachmentType string, loader chat.AttachmentLoader) {
	c.store.SetAttachmentLoaderForType(attachmentType, loader)
}

func (c *Manager) DeleteMessage(ctx context.Context, id snowflake.ID) (*chat.Message, error) {
	message, err := c.store.DeleteMessage(ctx, id)
	if err != nil {
		return nil, stacktrace.Propagate(err, "failed to delete chat message")
	}
	c.messageDeleted.Notify(id, false)
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

func (c *Manager) GetNickname(ctxCtx context.Context, user auth.User) *string {
	return c.store.GetUserNickname(ctxCtx, user)
}

func (c *Manager) RegisterUserConnection(user auth.User) func() {
	if user == nil || user.IsUnknown() {
		return func() {}
	}

	a := user.Address()
	c.userConnectionsCounts.Compute(a, func(oldValue int, loaded bool) (newValue int, delete bool) {
		return oldValue + 1, false
	})

	return func() {
		c.userConnectionsCounts.Compute(a, func(oldValue int, loaded bool) (newValue int, delete bool) {
			return oldValue - 1, oldValue == 1
		})
	}
}

func (c *Manager) IsUserConnected(user auth.User) bool {
	if user == nil || user.IsUnknown() {
		return false
	}
	count, _ := c.userConnectionsCounts.Load(user.Address())
	return count > 0
}
