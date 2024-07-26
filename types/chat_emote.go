package types

import "github.com/tnyim/jungletv/utils/transaction"

// ChatEmote represents a chat emote
type ChatEmote struct {
	ID                      int64 `dbKey:"true"`
	Shortcode               string
	Animated                bool
	AvailableForNewMessages bool
	RequiresSubscription    bool
}

// GetChatEmotes returns all chat emotes in the database
func GetChatEmotes(ctx transaction.WrappingContext, pagParams *PaginationParams) ([]*ChatEmote, uint64, error) {
	s := sdb.Select().
		OrderBy("chat_emote.id DESC")
	s = applyPaginationParameters(s, pagParams)
	return GetWithSelectAndCount[*ChatEmote](ctx, s)
}

// Update updates or inserts the ChatEmote
func (obj *ChatEmote) Update(ctx transaction.WrappingContext) error {
	return Update(ctx, obj)
}

// Delete deletes the ChatEmote
func (obj *ChatEmote) Delete(ctx transaction.WrappingContext) error {
	return Delete(ctx, obj)
}
