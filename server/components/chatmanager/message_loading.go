package chatmanager

import (
	"context"
	"time"

	"github.com/bwmarrin/snowflake"
	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/server/auth"
	"github.com/tnyim/jungletv/server/stores/chat"
)

func (c *Manager) LoadMessagesSince(ctx context.Context, includeShadowbanned auth.User, since time.Time) ([]*chat.Message, error) {
	messages, err := c.store.LoadMessagesSince(ctx, includeShadowbanned, since)
	if err != nil {
		return nil, stacktrace.Propagate(err, "could not load chat messages")
	}
	err = c.processEmotesForLoadingMessages(ctx, messages)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	return messages, nil
}

func (c *Manager) LoadNumLatestMessages(ctx context.Context, includeShadowbanned auth.User, num int) ([]*chat.Message, []*proto.ChatMessage, error) {
	messages, err := c.store.LoadNumLatestMessages(ctx, includeShadowbanned, num)
	if err != nil {
		return nil, nil, stacktrace.Propagate(err, "could not load chat messages")
	}
	protoMessages := make([]*proto.ChatMessage, len(messages))
	for i := range messages {
		err = c.processEmotesForLoadingMessage(ctx, messages[i])
		if err != nil {
			return nil, nil, stacktrace.Propagate(err, "")
		}

		protoMessages[i] = messages[i].SerializeForAPI(ctx, c.userSerializer)
	}
	return messages, protoMessages, nil
}

func (c *Manager) LoadNumLatestMessagesFromUser(ctx context.Context, user auth.User, num int) ([]*chat.Message, []*proto.ChatMessage, error) {
	messages, err := c.store.LoadNumLatestMessages(ctx, user, num)
	if err != nil {
		return nil, nil, stacktrace.Propagate(err, "could not load chat messages")
	}
	protoMessages := make([]*proto.ChatMessage, len(messages))
	for i := range messages {
		err = c.processEmotesForLoadingMessage(ctx, messages[i])
		if err != nil {
			return nil, nil, stacktrace.Propagate(err, "")
		}

		protoMessages[i] = messages[i].SerializeForAPI(ctx, c.userSerializer)
	}
	return messages, protoMessages, nil
}

func (c *Manager) LoadMessage(ctx context.Context, id snowflake.ID) (*chat.Message, error) {
	message, err := c.store.LoadMessage(ctx, id)
	if err != nil {
		return nil, stacktrace.Propagate(err, "could not load chat messages")
	}
	err = c.processEmotesForLoadingMessage(ctx, message)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	return message, nil
}
