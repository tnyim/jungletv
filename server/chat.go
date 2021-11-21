package server

import (
	"context"
	"fmt"
	"log"
	"math/big"
	"regexp"
	"strings"
	"time"

	"github.com/JohannesKaufmann/html-to-markdown/escape"
	"github.com/bwmarrin/snowflake"
	"github.com/palantir/stacktrace"
	"github.com/sethvargo/go-limiter"
	"github.com/sethvargo/go-limiter/memorystore"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/server/auth"
	"github.com/tnyim/jungletv/types"
	"github.com/tnyim/jungletv/utils/event"
	"google.golang.org/protobuf/types/known/timestamppb"
	"gopkg.in/alexcesaro/statsd.v2"
)

// ChatManager handles the chat system
type ChatManager struct {
	log                   *log.Logger
	statsClient           *statsd.Client
	store                 ChatStore
	idNode                *snowflake.Node
	rateLimiter           limiter.Store
	slowmodeRateLimiter   limiter.Store
	nickChangeRateLimiter limiter.Store
	moderationStore       ModerationStore

	enabled        bool
	slowmode       bool
	disabledReason ChatDisabledReason
	chatEnabled    *event.Event
	chatDisabled   *event.Event
	messageCreated *event.Event
	messageDeleted *event.Event
}

func NewChatManager(log *log.Logger, statsClient *statsd.Client, store ChatStore, moderationStore ModerationStore) (*ChatManager, error) {
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

	return &ChatManager{
		log:                   log,
		statsClient:           statsClient,
		store:                 store,
		idNode:                node,
		rateLimiter:           rateLimiter,
		slowmodeRateLimiter:   slowmodeRateLimiter,
		nickChangeRateLimiter: nickChangeRateLimiter,
		enabled:               true,
		moderationStore:       moderationStore,

		chatEnabled:    event.New(),
		chatDisabled:   event.New(),
		messageCreated: event.New(),
		messageDeleted: event.New(),
	}, nil
}

func (c *ChatManager) Worker(ctx context.Context, s *grpcServer) error {
	mediaChangedC, mediaChangedU := s.mediaQueue.mediaChanged.Subscribe(event.AtLeastOnceGuarantee)
	defer mediaChangedU()

	entryAddedC, entryAddedU := s.mediaQueue.entryAdded.Subscribe(event.AtLeastOnceGuarantee)
	defer entryAddedU()

	ownEntryRemovedC, ownEntryRemovedU := s.mediaQueue.ownEntryRemoved.Subscribe(event.AtLeastOnceGuarantee)
	defer ownEntryRemovedU()

	rewardsDistributedC, rewardsDistributedU := s.rewardsHandler.rewardsDistributed.Subscribe(event.AtLeastOnceGuarantee)
	defer rewardsDistributedU()

	crowdfundedSkippedC, crowdfundedSkippedU := s.skipManager.crowdfundedSkip.Subscribe(event.AtLeastOnceGuarantee)
	defer crowdfundedSkippedU()

	crowdfundedTransactionReceivedC, crowdfundedTransactionReceivedU := s.skipManager.crowdfundedTransactionReceived.Subscribe(event.AtLeastOnceGuarantee)
	defer crowdfundedTransactionReceivedU()

	announcementsUpdatedC, announcementsUpdatedU := s.announcementsUpdated.Subscribe(event.AtLeastOnceGuarantee)
	defer announcementsUpdatedU()

	for {
		select {
		case v := <-mediaChangedC:
			var err error
			if v[0] == nil {
				_, err = s.chat.CreateSystemMessage(ctx, "_The queue is now empty._")
			} else {
				title := escape.MarkdownCharacters(
					v[0].(MediaQueueEntry).MediaInfo().Title())
				_, err = s.chat.CreateSystemMessage(ctx, fmt.Sprintf("_Now playing:_ %s", title))
			}
			if err != nil {
				return stacktrace.Propagate(err, "")
			}
		case v := <-entryAddedC:
			t := v[0].(string)
			entry := v[1].(MediaQueueEntry)
			if !entry.RequestedBy().IsUnknown() {
				name, err := s.getChatFriendlyUserName(ctx, entry.RequestedBy().Address())
				if err != nil {
					return stacktrace.Propagate(err, "")
				}
				name = escape.MarkdownCharacters(name)
				title := escape.MarkdownCharacters(entry.MediaInfo().Title())
				switch t {
				case "enqueue":
					_, err = s.chat.CreateSystemMessage(ctx, fmt.Sprintf(
						"_%s just enqueued_ %s", name, title))
				case "play_after_next":
					_, err = s.chat.CreateSystemMessage(ctx, fmt.Sprintf(
						"_%s just set_ %s _to play after the current video_",
						name, title))
				case "play_now":
					_, err = s.chat.CreateSystemMessage(ctx, fmt.Sprintf(
						"_%s just skipped the previous video!_", name))
				}
				if err != nil {
					return stacktrace.Propagate(err, "")
				}
			}
		case v := <-ownEntryRemovedC:
			entry := v[0].(MediaQueueEntry)
			name, err := s.getChatFriendlyUserName(ctx, entry.RequestedBy().Address())
			if err != nil {
				return stacktrace.Propagate(err, "")
			}
			name = escape.MarkdownCharacters(name)
			title := escape.MarkdownCharacters(entry.MediaInfo().Title())
			_, err = s.chat.CreateSystemMessage(ctx, fmt.Sprintf(
				"_%s just removed their own queue entry_ %s", name, title))
			if err != nil {
				return stacktrace.Propagate(err, "")
			}
		case v := <-rewardsDistributedC:
			amount := v[0].(Amount)
			eligibleCount := v[1].(int)
			enqueuerTip := v[2].(Amount)
			mediaEntry := v[3].(MediaQueueEntry)
			exp := new(big.Int).Exp(big.NewInt(10), big.NewInt(29), nil)
			banStr := new(big.Rat).SetFrac(amount.Int, exp).FloatString(2)

			message := ""
			if enqueuerTip.Cmp(big.NewInt(0)) > 0 && !mediaEntry.RequestedBy().IsUnknown() {
				name, err := s.getChatFriendlyUserName(ctx, mediaEntry.RequestedBy().Address())
				if err != nil {
					return stacktrace.Propagate(err, "")
				}
				tipBanStr := new(big.Rat).SetFrac(enqueuerTip.Int, exp).FloatString(2)
				name = escape.MarkdownCharacters(name)
				message = fmt.Sprintf(
					"_**%s BAN** distributed among %d spectators and **%s BAN** tipped to %s._", banStr, eligibleCount, tipBanStr, name)
			} else {
				message = fmt.Sprintf(
					"_**%s BAN** distributed among %d spectators._", banStr, eligibleCount)
			}
			_, err := s.chat.CreateSystemMessage(ctx, message)
			if err != nil {
				return stacktrace.Propagate(err, "")
			}
		case v := <-crowdfundedSkippedC:
			amount := v[0].(Amount)
			exp := new(big.Int).Exp(big.NewInt(10), big.NewInt(29), nil)
			banStr := new(big.Rat).SetFrac(amount.Int, exp).FloatString(2)

			_, err := s.chat.CreateSystemMessage(ctx, fmt.Sprintf(
				"_Spectators paid **%s BAN** to skip the previous video!_", banStr))
			if err != nil {
				return stacktrace.Propagate(err, "")
			}
		case v := <-crowdfundedTransactionReceivedC:
			tx := v[0].(*types.CrowdfundedTransaction)

			name, err := s.getChatFriendlyUserName(ctx, tx.FromAddress)
			if err != nil {
				return stacktrace.Propagate(err, "")
			}
			name = escape.MarkdownCharacters(name)

			exp := new(big.Int).Exp(big.NewInt(10), big.NewInt(29), nil)
			banStr := new(big.Rat).SetFrac(tx.Amount.BigInt(), exp).FloatString(2)

			msg := ""
			switch tx.TransactionType {
			case types.CrowdfundedTransactionTypeSkip:
				msg = fmt.Sprintf("_%s just contributed **%s BAN** to skipping the current video!_", name, banStr)
			case types.CrowdfundedTransactionTypeRain:
				msg = fmt.Sprintf("_%s just increased the rewards for the current video by **%s BAN**!_", name, banStr)
			}
			if msg != "" {
				_, err = s.chat.CreateSystemMessage(ctx, msg)
				if err != nil {
					return stacktrace.Propagate(err, "")
				}
			}
		case <-announcementsUpdatedC:
			_, err := s.chat.CreateSystemMessage(ctx, "_**Announcements updated!**_")
			if err != nil {
				return stacktrace.Propagate(err, "")
			}
		case <-ctx.Done():
			s.log.Println("Chat system message sender done")
			return nil
		}
	}
}

var newlineReducingRegexp = regexp.MustCompile("\n\n\n+")

func (c *ChatManager) CreateMessage(ctx context.Context, author User, content string, reference *ChatMessage) (*ChatMessage, error) {
	if !c.enabled {
		return nil, stacktrace.NewError("chat currently disabled")
	}

	banned, err := c.moderationStore.LoadUserBannedFromChat(ctx, author.Address(), auth.RemoteAddressFromContext(ctx))
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	var ok bool
	if (c.slowmode || banned) && !UserPermissionLevelIsAtLeast(author, auth.AdminPermissionLevel) {
		_, _, _, ok, err = c.slowmodeRateLimiter.Take(ctx, author.Address())
	} else {
		_, _, _, ok, err = c.rateLimiter.Take(ctx, author.Address())
	}

	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	if !ok {
		return nil, stacktrace.NewError("rate limit reached")
	}

	content = strings.TrimSpace(content)
	// replace groups of more than 2 newlines with 2 newlines
	content = newlineReducingRegexp.ReplaceAllString(content, "\n\n")

	m := &ChatMessage{
		ID:           c.idNode.Generate(),
		CreatedAt:    time.Now(),
		Author:       author,
		Content:      content,
		Reference:    reference,
		Shadowbanned: banned,
	}
	nickname, err := c.store.StoreMessage(ctx, m)
	if err != nil {
		return nil, stacktrace.Propagate(err, "failed to store chat message")
	}
	if m.Author != nil {
		m.Author.SetNickname(nickname)
	}
	c.messageCreated.Notify(m)
	go c.statsClient.Count("chat_message_created", 1)
	return m, nil
}

func (c *ChatManager) CreateSystemMessage(ctx context.Context, content string) (*ChatMessage, error) {
	m := &ChatMessage{
		ID:        c.idNode.Generate(),
		CreatedAt: time.Now(),
		Content:   content,
	}
	_, err := c.store.StoreMessage(ctx, m)
	if err != nil {
		return nil, stacktrace.Propagate(err, "failed to store chat message")
	}
	c.messageCreated.Notify(m)
	return m, nil
}

func (c *ChatManager) DeleteMessage(ctx context.Context, id snowflake.ID) (*ChatMessage, error) {
	message, err := c.store.DeleteMessage(ctx, id)
	if err != nil {
		return nil, stacktrace.Propagate(err, "failed to delete chat message")
	}
	c.messageDeleted.Notify(id)
	return message, nil
}

func (c *ChatManager) SetNickname(ctxCtx context.Context, user User, nickname *string, bypassRatelimit bool) error {
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

func (c *ChatManager) LoadMessagesSince(ctx context.Context, includeShadowbanned User, since time.Time) ([]*ChatMessage, error) {
	messages, err := c.store.LoadMessagesSince(ctx, includeShadowbanned, since)
	return messages, stacktrace.Propagate(err, "could not load chat messages")
}

func (c *ChatManager) LoadNumLatestMessages(ctx context.Context, includeShadowbanned User, num int) ([]*ChatMessage, error) {
	messages, err := c.store.LoadNumLatestMessages(ctx, includeShadowbanned, num)
	return messages, stacktrace.Propagate(err, "could not load chat messages")
}

func (c *ChatManager) LoadNumLatestMessagesFromUser(ctx context.Context, user User, num int) ([]*ChatMessage, error) {
	messages, err := c.store.LoadNumLatestMessages(ctx, user, num)
	return messages, stacktrace.Propagate(err, "could not load chat messages")
}

func (c *ChatManager) LoadMessage(ctx context.Context, id snowflake.ID) (*ChatMessage, error) {
	messages, err := c.store.LoadMessage(ctx, id)
	return messages, stacktrace.Propagate(err, "could not load chat messages")
}

func (c *ChatManager) Enabled() (bool, ChatDisabledReason) {
	return c.enabled, c.disabledReason
}

func (c *ChatManager) EnableChat() {
	if !c.enabled {
		c.enabled = true
		c.chatEnabled.Notify()
	}
}

func (c *ChatManager) DisableChat(reason ChatDisabledReason) {
	if c.enabled {
		c.enabled = false
		c.disabledReason = reason
		c.chatDisabled.Notify(reason)
	}
}

func (c *ChatManager) SetSlowModeEnabled(enabled bool) {
	c.slowmode = enabled
}

// ChatMessage represents a single chat message
type ChatMessage struct {
	ID           snowflake.ID
	CreatedAt    time.Time
	Author       User
	Content      string
	Reference    *ChatMessage // may be nil
	Shadowbanned bool
}

func (m *ChatMessage) SerializeForAPI(ctx context.Context, userSerializer APIUserSerializer) *proto.ChatMessage {
	msg := &proto.ChatMessage{
		Id:        m.ID.Int64(),
		CreatedAt: timestamppb.New(m.CreatedAt),
	}
	if m.Author != nil {
		msg.Message = &proto.ChatMessage_UserMessage{
			UserMessage: &proto.UserChatMessage{
				Author:  userSerializer(ctx, m.Author),
				Content: m.Content,
			},
		}
	} else {
		msg.Message = &proto.ChatMessage_SystemMessage{
			SystemMessage: &proto.SystemChatMessage{
				Content: m.Content,
			},
		}
	}
	if m.Reference != nil {
		msg.Reference = m.Reference.SerializeForAPI(ctx, userSerializer)
	}
	return msg
}

// ChatDisabledReason specifies the reason why chat is disabled
type ChatDisabledReason int

const (
	ChatDisabledReasonUnspecified ChatDisabledReason = iota
	ChatDisabledReasonModeratorNotPresent
)

func (r ChatDisabledReason) SerializeForAPI() proto.ChatDisabledReason {
	switch r {
	default:
		fallthrough
	case ChatDisabledReasonUnspecified:
		return proto.ChatDisabledReason_UNSPECIFIED
	case ChatDisabledReasonModeratorNotPresent:
		return proto.ChatDisabledReason_MODERATOR_NOT_PRESENT
	}
}
