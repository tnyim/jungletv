package chat

import (
	"context"
	"database/sql"
	"errors"
	"log"
	"strings"
	"sync"
	"time"

	"github.com/bwmarrin/snowflake"
	"github.com/jmoiron/sqlx"
	"github.com/lib/pq"
	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/server/auth"
	"github.com/tnyim/jungletv/server/usercache"
	"github.com/tnyim/jungletv/utils/transaction"
)

// ErrChatMessageNotFound is returned by a ChatStore when LoadMessage or DeleteMessage does not find the given message
var ErrChatMessageNotFound = errors.New("chat message not found")

// Store can save and load chat messages
type Store interface {
	StoreMessage(context.Context, *Message) (*string, error)
	DeleteMessage(context.Context, snowflake.ID) (*Message, error)
	LoadMessagesBetween(context.Context, auth.User, time.Time, time.Time) ([]*Message, error)
	LoadNumLatestMessages(context.Context, auth.User, int) ([]*Message, error)
	LoadNumLatestMessagesFromUser(context.Context, auth.User, int) ([]*Message, error)
	LoadMessage(context.Context, snowflake.ID) (*Message, error)
	SetUserNickname(context.Context, auth.User, *string) error
	GetUserNickname(context.Context, auth.User) *string
	SetAttachmentLoaderForType(attachmentType string, attachmentLoader AttachmentLoader)
	LoadAttachment(ctx context.Context, attachmentString string) (MessageAttachmentView, error)
}

// AttachmentLoader transforms a DB-serialized attachment storage model into the respective view model
type AttachmentLoader func(context.Context, string) (MessageAttachmentView, error)

// ChatStoreDatabase stores messages in the database
type ChatStoreDatabase struct {
	log                 *log.Logger
	nicknameCache       usercache.UserCache
	attachmentLoaders   map[string]AttachmentLoader
	attachmentLoadersMu sync.RWMutex
}

// NewStoreDatabase initializes and returns a new ChatStoreDatabase
func NewStoreDatabase(log *log.Logger, nicknameCache usercache.UserCache) *ChatStoreDatabase {
	return &ChatStoreDatabase{
		log:               log,
		nicknameCache:     nicknameCache,
		attachmentLoaders: make(map[string]AttachmentLoader),
	}
}

func (s *ChatStoreDatabase) SetAttachmentLoaderForType(attachmentType string, attachmentLoader AttachmentLoader) {
	s.attachmentLoadersMu.Lock()
	defer s.attachmentLoadersMu.Unlock()
	s.attachmentLoaders[attachmentType] = attachmentLoader
}

type dbChatMsg struct {
	ID           snowflake.ID   `db:"id"`
	CreatedAt    time.Time      `db:"created_at"`
	Author       *string        `db:"author"`
	Content      string         `db:"content"`
	Reference    *snowflake.ID  `db:"reference"`
	Shadowbanned bool           `db:"shadowbanned"`
	Attachments  pq.StringArray `db:"attachments"`
}

type dbChatMsgWithReference struct {
	ID                 snowflake.ID   `db:"id"`
	CreatedAt          time.Time      `db:"created_at"`
	Author             *string        `db:"author"`
	Content            string         `db:"content"`
	Reference          *snowflake.ID  `db:"reference"`
	Shadowbanned       bool           `db:"shadowbanned"`
	Attachments        pq.StringArray `db:"attachments"`
	ReferenceID        *snowflake.ID  `db:"reference_id"`
	ReferenceCreatedAt *time.Time     `db:"reference_created_at"`
	ReferenceAuthor    *string        `db:"reference_author"`
	ReferenceContent   *string        `db:"reference_content"`
	Address            *string        `db:"address"`
	PermissionLevel    *string        `db:"permission_level"`
	Nickname           *string        `db:"nickname"`
	ApplicationID      *string        `db:"application_id"`
	ReferenceNickname  *string        `db:"reference_nickname"`
}

func (s *ChatStoreDatabase) StoreMessage(ctxCtx context.Context, m *Message) (*string, error) {
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
		Attachments:  pq.StringArray{},
	}

	for _, attachment := range m.Attachments {
		message.Attachments = append(message.Attachments, attachment.AttachmentType()+":"+attachment.SerializeForDatabase(ctx))
	}

	var nickname *string
	if m.Author != nil && !m.Author.IsUnknown() {
		a := m.Author.Address()
		message.Author = &a

		var returning struct {
			Nickname      *string `db:"nickname"`
			ApplicationID *string `db:"application_id"`
		}

		var applicationID *string
		if id := m.Author.ApplicationID(); id != "" {
			applicationID = &id
		}

		err = ctx.Tx().GetContext(ctx, &returning, `
		INSERT INTO chat_user ("address", permission_level, nickname, application_id)
		VALUES ($1, $2, $3, $4)
		ON CONFLICT ("address") DO UPDATE SET permission_level = $2
		RETURNING nickname, application_id`,
			a, m.Author.PermissionLevel(), nil, applicationID,
		)
		if err != nil {
			return nil, stacktrace.Propagate(err, "")
		}
		nickname = returning.Nickname
		err = s.nicknameCache.CacheUser(ctx, auth.BuildNonAuthorizedUser(a, m.Author.PermissionLevel(), returning.Nickname, returning.ApplicationID))
		if err != nil {
			return nil, stacktrace.Propagate(err, "")
		}
	}
	if m.Reference != nil {
		message.Reference = &m.Reference.ID
	}
	_, err = ctx.Tx().NamedExecContext(ctx, `
		INSERT INTO chat_message (id, created_at, author, content, reference, shadowbanned, attachments)
		VALUES (:id, :created_at, :author, :content, :reference, :shadowbanned, :attachments)`,
		message,
	)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	return nickname, stacktrace.Propagate(ctx.Commit(), "")
}

func (s *ChatStoreDatabase) DeleteMessage(ctxCtx context.Context, id snowflake.ID) (*Message, error) {
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
			RETURNING id, created_at, author, content, reference, shadowbanned, attachments
	`, id.Int64())
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrChatMessageNotFound
		}
		return nil, stacktrace.Propagate(err, "")
	}

	attachments := []MessageAttachmentView{}
	for _, a := range deletedMsg.Attachments {
		loaded, err := s.LoadAttachment(ctx, a)
		if err != nil {
			log.Println(stacktrace.Propagate(err, ""))
		} else if loaded != nil && loaded != (MessageAttachmentView)(nil) {
			attachments = append(attachments, loaded)
		}
	}

	return &Message{
		ID:              deletedMsg.ID,
		CreatedAt:       deletedMsg.CreatedAt,
		Author:          auth.NewAddressOnlyUser(*deletedMsg.Author),
		Content:         deletedMsg.Content,
		Shadowbanned:    deletedMsg.Shadowbanned,
		AttachmentsView: attachments,
	}, stacktrace.Propagate(ctx.Commit(), "")
}

func (s *ChatStoreDatabase) LoadMessagesBetween(ctxCtx context.Context, includeShadowbanned auth.User, since, until time.Time) ([]*Message, error) {
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
		a.attachments AS attachments,
		b.id AS reference_id,
		b.created_at AS reference_created_at,
		b.author AS reference_author,
		b.content AS reference_content,
		u.address AS address,
		u.permission_level AS permission_level,
		u.nickname AS nickname,
		u.application_id AS application_id,
		v.nickname AS reference_nickname
		FROM
			chat_message a
			LEFT JOIN chat_message b ON a.reference = b.id
			LEFT JOIN chat_user u ON a.author = u.address
			LEFT JOIN chat_user v ON b.author = v.address
		WHERE
			a.created_at > $1 AND
			a.created_at < $2 AND
			(a.shadowbanned = false OR a.author = $3)
		ORDER BY a.created_at ASC
	`, since, until, author)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrChatMessageNotFound
		}
		return nil, stacktrace.Propagate(err, "")
	}

	chatMessages := make([]*Message, len(messages))
	for i, message := range messages {
		chatMessages[i] = s.dbMsgWithReferenceToChatMessage(ctx, message)
	}

	return chatMessages, nil
}

func (s *ChatStoreDatabase) LoadNumLatestMessages(ctxCtx context.Context, includeShadowbanned auth.User, num int) ([]*Message, error) {
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
			a.attachments AS attachments,
			b.id AS reference_id,
			b.created_at AS reference_created_at,
			b.author AS reference_author,
			b.content AS reference_content,
			u.address AS address,
			u.permission_level AS permission_level,
			u.application_id AS application_id,
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

	chatMessages := make([]*Message, len(messages))
	for i, message := range messages {
		chatMessages[i] = s.dbMsgWithReferenceToChatMessage(ctx, message)
	}

	for i, j := 0, len(chatMessages)-1; i < j; i, j = i+1, j-1 {
		chatMessages[i], chatMessages[j] = chatMessages[j], chatMessages[i]
	}

	return chatMessages, nil
}

func (s *ChatStoreDatabase) LoadNumLatestMessagesFromUser(ctxCtx context.Context, user auth.User, num int) ([]*Message, error) {
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
			a.attachments AS attachments,
			b.id AS reference_id,
			b.created_at AS reference_created_at,
			b.author AS reference_author,
			b.content AS reference_content,
			u.address AS address,
			u.permission_level AS permission_level,
			u.application_id AS application_id,
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

	chatMessages := make([]*Message, len(messages))
	for i, message := range messages {
		chatMessages[i] = s.dbMsgWithReferenceToChatMessage(ctx, message)
	}

	for i, j := 0, len(chatMessages)-1; i < j; i, j = i+1, j-1 {
		chatMessages[i], chatMessages[j] = chatMessages[j], chatMessages[i]
	}

	return chatMessages, nil
}

func (s *ChatStoreDatabase) LoadMessage(ctxCtx context.Context, id snowflake.ID) (*Message, error) {
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
			a.attachments AS attachments,
			b.id AS reference_id,
			b.created_at AS reference_created_at,
			b.author AS reference_author,
			b.content AS reference_content,
			u.address AS address,
			u.permission_level AS permission_level,
			u.application_id AS application_id,
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

	return s.dbMsgWithReferenceToChatMessage(ctx, message), nil
}

func (s *ChatStoreDatabase) dbMsgWithReferenceToChatMessage(ctx context.Context, message dbChatMsgWithReference) *Message {
	chatMessage := &Message{
		ID:        message.ID,
		CreatedAt: message.CreatedAt,
		Content:   message.Content,
	}
	if message.Author != nil {
		chatMessage.Author = auth.BuildNonAuthorizedUser(*message.Author, auth.PermissionLevel(*message.PermissionLevel), message.Nickname, message.ApplicationID)
	}
	if message.ReferenceID != nil {
		chatMessage.Reference = &Message{
			ID:        *message.ReferenceID,
			CreatedAt: *message.ReferenceCreatedAt,
			Content:   *message.ReferenceContent,
		}
		if message.ReferenceAuthor != nil {
			chatMessage.Reference.Author = auth.NewAddressOnlyUser(*message.ReferenceAuthor)
			chatMessage.Reference.Author.SetNickname(message.ReferenceNickname)
		}
	}
	for _, a := range message.Attachments {
		loaded, err := s.LoadAttachment(ctx, a)
		if err != nil {
			log.Println(stacktrace.Propagate(err, ""))
		} else if loaded != nil && loaded != (MessageAttachmentView)(nil) {
			chatMessage.AttachmentsView = append(chatMessage.AttachmentsView, loaded)
		}
	}
	return chatMessage
}

func (s *ChatStoreDatabase) SetUserNickname(ctxCtx context.Context, user auth.User, nickname *string) error {
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

	if len(levelsAbove) == 0 {
		levelsAbove = []string{"INVALID"}
	}

	rows := []int{}
	query, args, err := sqlx.In(`
		SELECT 1
		FROM chat_user
		WHERE (
				nickname = ? OR (nickname IS NULL AND application_id = ?)
			) AND (
				permission_level IN (?) OR application_id IS NOT NULL
			)`,
		nickname, nickname, levelsAbove)
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

	var applicationID *string
	if id := user.ApplicationID(); id != "" {
		applicationID = &id
	}

	_, err = ctx.ExecContext(ctx, `
		INSERT INTO chat_user ("address", permission_level, nickname, application_id)
		VALUES ($1, $2, $3, $4)
		ON CONFLICT ("address") DO UPDATE SET nickname = $3`,
		user.Address(), user.PermissionLevel(), nickname, applicationID,
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

func (s *ChatStoreDatabase) GetUserNickname(ctx context.Context, user auth.User) *string {
	if user == nil || user.IsUnknown() {
		return nil
	}
	user, err := s.nicknameCache.GetOrFetchUser(ctx, user.Address())
	if err != nil {
		return nil
	}
	if user != nil && !user.IsUnknown() {
		return user.Nickname()
	}
	return nil
}

func (s *ChatStoreDatabase) LoadAttachment(ctx context.Context, attachmentString string) (MessageAttachmentView, error) {
	s.attachmentLoadersMu.RLock()
	defer s.attachmentLoadersMu.RUnlock()

	parts := strings.SplitN(attachmentString, ":", 2)
	if loader, ok := s.attachmentLoaders[parts[0]]; ok {
		data := ""
		if len(parts) > 1 {
			data = parts[1]
		}
		view, err := loader(ctx, data)
		if err != nil {
			return nil, stacktrace.Propagate(err, "")
		}
		return view, nil
	}
	return nil, stacktrace.NewError("unknown attachment type")
}
