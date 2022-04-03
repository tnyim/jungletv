package chatmanager

import (
	"context"
	"regexp"
	"strings"
	"time"

	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/server/auth"
	authinterceptor "github.com/tnyim/jungletv/server/interceptors/auth"
	"github.com/tnyim/jungletv/server/stores/chat"
)

var newlineReducingRegexp = regexp.MustCompile("\n\n\n+")

func (c *Manager) CreateMessage(ctx context.Context, author auth.User, content string, reference *chat.Message, attachments []chat.MessageAttachmentStorage) (*chat.Message, error) {
	if !c.enabled {
		return nil, stacktrace.NewError("chat currently disabled")
	}

	banned, err := c.moderationStore.LoadUserBannedFromChat(ctx, author.Address(), authinterceptor.RemoteAddressFromContext(ctx))
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	var ok bool
	if (c.slowmode || banned) && !auth.UserPermissionLevelIsAtLeast(author, auth.AdminPermissionLevel) {
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

	content, err = c.processEmotesForStorage(ctx, author, content)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	attachments, err = c.processAttachments(ctx, author, attachments)
	if err != nil {
		return nil, stacktrace.Propagate(err, "failed to process attachments")
	}

	m := &chat.Message{
		ID:           c.idNode.Generate(),
		CreatedAt:    time.Now(),
		Author:       author,
		Content:      content,
		Reference:    reference,
		Shadowbanned: banned,
		Attachments:  attachments,
	}
	nickname, err := c.store.StoreMessage(ctx, m)
	if err != nil {
		return nil, stacktrace.Propagate(err, "failed to store chat message")
	}
	if m.Author != nil {
		m.Author.SetNickname(nickname)
	}

	err = c.processEmotesForLoadingMessage(ctx, m)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	for _, a := range m.Attachments {
		loaded, err := c.AttachmentLoader(ctx, a.SerializeForDatabase(ctx))
		if err != nil {
			return nil, stacktrace.Propagate(err, "")
		} else if loaded != nil && loaded != (chat.MessageAttachmentView)(nil) {
			m.AttachmentsView = append(m.AttachmentsView, loaded)
		}
	}

	c.messageCreated.Notify(MessageCreatedEventArgs{m, m.SerializeForAPI(ctx, c.userSerializer)})
	go c.statsClient.Count("chat_message_created", 1)
	return m, nil
}

func (c *Manager) CreateSystemMessage(ctx context.Context, content string) (*chat.Message, error) {
	var err error
	content, err = c.processEmotesForStorage(ctx, nil, content)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	m := &chat.Message{
		ID:        c.idNode.Generate(),
		CreatedAt: time.Now(),
		Content:   content,
	}
	_, err = c.store.StoreMessage(ctx, m)
	if err != nil {
		return nil, stacktrace.Propagate(err, "failed to store chat message")
	}

	err = c.processEmotesForLoadingMessage(ctx, m)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	c.messageCreated.Notify(MessageCreatedEventArgs{m, m.SerializeForAPI(ctx, c.userSerializer)})
	return m, nil
}

func (c *Manager) processAttachments(ctx context.Context, author auth.User, attachments []chat.MessageAttachmentStorage) ([]chat.MessageAttachmentStorage, error) {
	for _, attachment := range attachments {
		aCost, ok := attachment.(chat.MessageAttachmentStorageWithCost)
		if !ok {
			continue
		}
		err := c.pointsManager.CreateTransaction(ctx, author, aCost.PointsTxType(), -aCost.PointsCost())
		if err != nil {
			return nil, stacktrace.Propagate(err, "")
		}
	}
	return attachments, nil
}
