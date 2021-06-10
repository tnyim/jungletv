package server

import (
	"context"
	"log"
	"time"

	"github.com/bwmarrin/snowflake"
	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/utils/event"
	"google.golang.org/protobuf/types/known/timestamppb"
)

// ChatManager handles the chat system
type ChatManager struct {
	log    *log.Logger
	store  ChatStore
	idNode *snowflake.Node

	enabled        bool
	disabledReason ChatDisabledReason
	chatEnabled    *event.Event
	chatDisabled   *event.Event
	messageCreated *event.Event
	messageDeleted *event.Event
}

func NewChatManager(log *log.Logger, store ChatStore) (*ChatManager, error) {
	node, err := snowflake.NewNode(1)
	if err != nil {
		return nil, stacktrace.Propagate(err, "failed to create snowflake node")
	}
	return &ChatManager{
		log:    log,
		store:  store,
		idNode: node,

		chatEnabled:    event.New(),
		chatDisabled:   event.New(),
		messageCreated: event.New(),
		messageDeleted: event.New(),
	}, nil
}

func (c *ChatManager) CreateMessage(ctx context.Context, author User, content string) (*ChatMessage, error) {
	if !c.enabled {
		return nil, stacktrace.NewError("chat currently disabled")
	}
	m := &ChatMessage{
		ID:        c.idNode.Generate(),
		CreatedAt: time.Now(),
		Author:    author,
		Content:   content,
	}
	err := c.store.StoreMessage(ctx, m)
	if err != nil {
		return nil, stacktrace.Propagate(err, "failed to store chat message")
	}
	c.messageCreated.Notify(m)
	return m, nil
}

func (c *ChatManager) DeleteMessage(ctx context.Context, id snowflake.ID) error {
	err := c.store.DeleteMessage(ctx, id)
	if err != nil {
		return stacktrace.Propagate(err, "failed to delete chat message")
	}
	c.messageDeleted.Notify(id)
	return nil
}

func (c *ChatManager) LoadMessagesSince(ctx context.Context, since time.Time) ([]*ChatMessage, error) {
	messages, err := c.store.LoadMessagesSince(ctx, since)
	return messages, stacktrace.Propagate(err, "could not load chat messages")
}

func (c *ChatManager) LoadNumLatestMessages(ctx context.Context, num int) ([]*ChatMessage, error) {
	messages, err := c.store.LoadNumLatestMessages(ctx, num)
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

// ChatMessage represents a single chat message
type ChatMessage struct {
	ID        snowflake.ID
	CreatedAt time.Time
	Author    User
	Content   string
}

func (m *ChatMessage) SerializeForAPI() *proto.ChatMessage {
	return &proto.ChatMessage{
		Id:        m.ID.Int64(),
		CreatedAt: timestamppb.New(m.CreatedAt),
		Author:    m.Author.SerializeForAPI(),
		Content:   m.Content,
	}
}

// ChatDisabledReason specifies the reason why chat is disabled
type ChatDisabledReason int

const (
	ChatDisabledReasonUnspecified ChatDisabledReason = iota
	ChatDisabledModeratorNotPresent
)

func (r ChatDisabledReason) SerializeForAPI() proto.ChatDisabledReason {
	switch r {
	default:
		fallthrough
	case ChatDisabledReasonUnspecified:
		return proto.ChatDisabledReason_UNSPECIFIED
	case ChatDisabledModeratorNotPresent:
		return proto.ChatDisabledReason_MODERATOR_NOT_PRESENT
	}
}
