package server

import (
	"context"
	"database/sql"
	"errors"
	"time"

	"github.com/bwmarrin/snowflake"
	"github.com/jmoiron/sqlx"
	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/server/auth"
	"github.com/tnyim/jungletv/utils/transaction"
)

// ErrChatMessageNotFound is returned by a ChatStore when LoadMessage or DeleteMessage does not find the given message
var ErrChatMessageNotFound = errors.New("chat message not found")

// ChatStore can save and load chat messages
type ChatStore interface {
	StoreMessage(context.Context, *ChatMessage) (*string, error)
	DeleteMessage(context.Context, snowflake.ID) (*ChatMessage, error)
	LoadMessagesSince(context.Context, User, time.Time) ([]*ChatMessage, error)
	LoadNumLatestMessages(context.Context, User, int) ([]*ChatMessage, error)
	LoadNumLatestMessagesFromUser(context.Context, User, int) ([]*ChatMessage, error)
	LoadMessage(context.Context, snowflake.ID) (*ChatMessage, error)
	SetUserNickname(context.Context, User, *string) error
}

// ChatStoreDatabase stores messages in the database
type ChatStoreDatabase struct {
	nicknameCache UserCache
}

// NewChatStoreDatabase initializes and returns a new ChatStoreDatabase
func NewChatStoreDatabase(nicknameCache UserCache) *ChatStoreDatabase {
	return &ChatStoreDatabase{
		nicknameCache: nicknameCache,
	}
}

type dbChatMsg struct {
	ID           snowflake.ID  `db:"id"`
	CreatedAt    time.Time     `db:"created_at"`
	Author       *string       `db:"author"`
	Content      string        `db:"content"`
	Reference    *snowflake.ID `db:"reference"`
	Shadowbanned bool          `db:"shadowbanned"`
}

type dbChatMsgWithReference struct {
	ID                    snowflake.ID  `db:"id"`
	CreatedAt             time.Time     `db:"created_at"`
	Author                *string       `db:"author"`
	AuthorPermissionLevel *string       `db:"author_permission_level"`
	Content               string        `db:"content"`
	Reference             *snowflake.ID `db:"reference"`
	Shadowbanned          bool          `db:"shadowbanned"`
	ReferenceID           *snowflake.ID `db:"reference_id"`
	ReferenceCreatedAt    *time.Time    `db:"reference_created_at"`
	ReferenceAuthor       *string       `db:"reference_author"`
	ReferenceContent      *string       `db:"reference_content"`
	Address               *string       `db:"address"`
	PermissionLevel       *string       `db:"permission_level"`
	Nickname              *string       `db:"nickname"`
	ReferenceNickname     *string       `db:"reference_nickname"`
}

func (s *ChatStoreDatabase) StoreMessage(ctxCtx context.Context, m *ChatMessage) (*string, error) {
	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	defer ctx.Rollback()

	message := dbChatMsg{
		ID:           m.ID,
		CreatedAt:    m.CreatedAt,
		Content:      m.Content,
		Shadowbanned: m.Shadowbanned,
	}

	var nickname *string
	if m.Author != nil && !m.Author.IsUnknown() {
		a := m.Author.Address()
		message.Author = &a

		err = ctx.Tx().GetContext(ctx, &nickname, `
		INSERT INTO chat_user ("address", permission_level, nickname)
		VALUES ($1, $2, $3)
		ON CONFLICT ("address") DO UPDATE SET permission_level = $2
		RETURNING nickname`,
			a, m.Author.PermissionLevel(), nil,
		)
		if err != nil {
			return nil, stacktrace.Propagate(err, "")
		}
		userToSave := NewAddressOnlyUserWithPermissionLevel(a, m.Author.PermissionLevel())
		userToSave.SetNickname(nickname)
		err = s.nicknameCache.CacheUser(ctx, userToSave)
		if err != nil {
			return nil, stacktrace.Propagate(err, "")
		}
	}
	if m.Reference != nil {
		message.Reference = &m.Reference.ID
	}
	_, err = ctx.Tx().NamedExecContext(ctx, `
		INSERT INTO chat_message (id, created_at, author, content, reference, shadowbanned)
		VALUES (:id, :created_at, :author, :content, :reference, :shadowbanned)`,
		message,
	)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	return nickname, stacktrace.Propagate(ctx.Commit(), "")
}

func (s *ChatStoreDatabase) DeleteMessage(ctxCtx context.Context, id snowflake.ID) (*ChatMessage, error) {
	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	defer ctx.Rollback()

	_, err = ctx.ExecContext(ctx, `UPDATE chat_message SET reference = NULL WHERE reference = $1`, id.Int64())
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	var deletedMsg dbChatMsg

	err = ctx.Tx().GetContext(ctx, &deletedMsg, `
		DELETE FROM chat_message WHERE id = $1
			RETURNING id, created_at, author, content, reference, shadowbanned
	`, id.Int64())
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrChatMessageNotFound
		}
		return nil, stacktrace.Propagate(err, "")
	}

	return &ChatMessage{
		ID:           deletedMsg.ID,
		CreatedAt:    deletedMsg.CreatedAt,
		Author:       NewAddressOnlyUser(*deletedMsg.Author),
		Content:      deletedMsg.Content,
		Shadowbanned: deletedMsg.Shadowbanned,
	}, stacktrace.Propagate(ctx.Commit(), "")
}

func (s *ChatStoreDatabase) LoadMessagesSince(ctxCtx context.Context, includeShadowbanned User, since time.Time) ([]*ChatMessage, error) {
	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	defer ctx.Commit() // read-only tx

	var messages []dbChatMsgWithReference

	author := "<matches nobody>"
	if includeShadowbanned != nil {
		author = includeShadowbanned.Address()
	}

	err = ctx.Tx().SelectContext(ctx, &messages, `
		SELECT
			a.id AS id,
			a.created_at AS created_at,
			a.author AS author,
			a.content AS content,
			a.reference AS reference,
			a.shadowbanned AS shadowbanned,
			b.id AS reference_id,
			b.created_at AS reference_created_at,
			b.author AS reference_author,
			b.content AS reference_content
		FROM
			chat_message a
			LEFT JOIN chat_message b ON a.reference = b.id
			LEFT JOIN chat_user u ON a.author = u.address
		WHERE created_at > $1 AND (a.shadowbanned = false OR a.author = $2)
		ORDER BY created_at ASC
	`, since, author)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrChatMessageNotFound
		}
		return nil, stacktrace.Propagate(err, "")
	}

	chatMessages := make([]*ChatMessage, len(messages))
	for i, message := range messages {
		chatMessages[i] = s.dbMsgWithReferenceToChatMessage(message)
	}

	return chatMessages, nil
}

func (s *ChatStoreDatabase) LoadNumLatestMessages(ctxCtx context.Context, includeShadowbanned User, num int) ([]*ChatMessage, error) {
	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	defer ctx.Commit() // read-only tx

	var messages []dbChatMsgWithReference

	author := "<matches nobody>"
	if includeShadowbanned != nil {
		author = includeShadowbanned.Address()
	}

	err = ctx.Tx().SelectContext(ctx, &messages, `
		SELECT
			a.id AS id,
			a.created_at AS created_at,
			a.author AS author,
			a.content AS content,
			a.reference AS reference,
			a.shadowbanned AS shadowbanned,
			b.id AS reference_id,
			b.created_at AS reference_created_at,
			b.author AS reference_author,
			b.content AS reference_content,
			u.address AS address,
			u.permission_level AS permission_level,
			u.nickname AS nickname,
			v.nickname AS reference_nickname
		FROM
			chat_message a
			LEFT JOIN chat_message b ON a.reference = b.id
			LEFT JOIN chat_user u ON a.author = u.address
			LEFT JOIN chat_user v ON b.author = v.address
		WHERE a.shadowbanned = false OR a.author = $1
		ORDER BY a.created_at DESC
		LIMIT $2
	`, author, num)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrChatMessageNotFound
		}
		return nil, stacktrace.Propagate(err, "")
	}

	chatMessages := make([]*ChatMessage, len(messages))
	for i, message := range messages {
		chatMessages[i] = s.dbMsgWithReferenceToChatMessage(message)
	}

	for i, j := 0, len(chatMessages)-1; i < j; i, j = i+1, j-1 {
		chatMessages[i], chatMessages[j] = chatMessages[j], chatMessages[i]
	}

	return chatMessages, nil
}

func (s *ChatStoreDatabase) LoadNumLatestMessagesFromUser(ctxCtx context.Context, user User, num int) ([]*ChatMessage, error) {
	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	defer ctx.Commit() // read-only tx

	var messages []dbChatMsgWithReference

	err = ctx.Tx().SelectContext(ctx, &messages, `
		SELECT
			a.id AS id,
			a.created_at AS created_at,
			a.author AS author,
			a.content AS content,
			a.reference AS reference,
			a.shadowbanned AS shadowbanned,
			b.id AS reference_id,
			b.created_at AS reference_created_at,
			b.author AS reference_author,
			b.content AS reference_content,
			u.address AS address,
			u.permission_level AS permission_level,
			u.nickname AS nickname
		FROM
			chat_message a
			LEFT JOIN chat_message b ON a.reference = b.id
			LEFT JOIN chat_user u ON a.author = u.address
		WHERE a.author = $1
		ORDER BY created_at DESC
		LIMIT $2
	`, user.Address(), num)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrChatMessageNotFound
		}
		return nil, stacktrace.Propagate(err, "")
	}

	chatMessages := make([]*ChatMessage, len(messages))
	for i, message := range messages {
		chatMessages[i] = s.dbMsgWithReferenceToChatMessage(message)
	}

	for i, j := 0, len(chatMessages)-1; i < j; i, j = i+1, j-1 {
		chatMessages[i], chatMessages[j] = chatMessages[j], chatMessages[i]
	}

	return chatMessages, nil
}

func (s *ChatStoreDatabase) LoadMessage(ctxCtx context.Context, id snowflake.ID) (*ChatMessage, error) {
	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	defer ctx.Commit() // read-only tx

	var message dbChatMsgWithReference

	err = ctx.Tx().GetContext(ctx, &message, `
		SELECT
			a.id AS id,
			a.created_at AS created_at,
			a.author AS author,
			a.content AS content,
			a.reference AS reference,
			a.shadowbanned AS shadowbanned,
			b.id AS reference_id,
			b.created_at AS reference_created_at,
			b.author AS reference_author,
			b.content AS reference_content,
			u.address AS address,
			u.permission_level AS permission_level,
			u.nickname AS nickname
		FROM
			chat_message a
			LEFT JOIN chat_message b ON a.reference = b.id
			LEFT JOIN chat_user u ON a.author = u.address
		WHERE a.id = $1
	`, id.Int64())
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrChatMessageNotFound
		}
		return nil, stacktrace.Propagate(err, "")
	}

	return s.dbMsgWithReferenceToChatMessage(message), nil
}

func (s *ChatStoreDatabase) dbMsgWithReferenceToChatMessage(message dbChatMsgWithReference) *ChatMessage {
	chatMessage := &ChatMessage{
		ID:        message.ID,
		CreatedAt: message.CreatedAt,
		Content:   message.Content,
	}
	if message.Author != nil {
		chatMessage.Author = NewAddressOnlyUserWithPermissionLevel(*message.Author, auth.PermissionLevel(*message.PermissionLevel))
		chatMessage.Author.SetNickname(message.Nickname)
	}
	if message.ReferenceID != nil {
		chatMessage.Reference = &ChatMessage{
			ID:        *message.ReferenceID,
			CreatedAt: *message.ReferenceCreatedAt,
			Content:   *message.ReferenceContent,
		}
		if message.ReferenceAuthor != nil {
			chatMessage.Reference.Author = NewAddressOnlyUser(*message.ReferenceAuthor)
			chatMessage.Reference.Author.SetNickname(message.ReferenceNickname)
		}
	}
	return chatMessage
}

func (s *ChatStoreDatabase) SetUserNickname(ctxCtx context.Context, user User, nickname *string) error {
	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	defer ctx.Rollback()

	levelsAbove := []string{}
	for permLevel, order := range auth.PermissionLevelOrder {
		if order > auth.PermissionLevelOrder[user.PermissionLevel()] {
			levelsAbove = append(levelsAbove, string(permLevel))
		}
	}

	if len(levelsAbove) > 0 {
		rows := []int{}
		query, args, err := sqlx.In(`
		SELECT 1 FROM chat_user WHERE nickname = ? AND permission_level IN (?)`,
			nickname, levelsAbove)
		if err != nil {
			return stacktrace.Propagate(err, "")
		}
		query = ctx.Rebind(query)
		err = ctx.Tx().SelectContext(ctx, &rows, query, args...)
		if err != nil {
			return stacktrace.Propagate(err, "")
		}

		if len(rows) > 0 {
			return stacktrace.NewError("this nickname is in use by a user with more privileges")
		}
	}

	_, err = ctx.ExecContext(ctx, `
		INSERT INTO chat_user ("address", permission_level, nickname)
		VALUES ($1, $2, $3)
		ON CONFLICT ("address") DO UPDATE SET nickname = $3`,
		user.Address(), user.PermissionLevel(), nickname,
	)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	user.SetNickname(nickname)
	err = s.nicknameCache.CacheUser(ctx, user)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	return stacktrace.Propagate(ctx.Commit(), "")
}
