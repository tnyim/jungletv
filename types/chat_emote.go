package types

import (
	"github.com/gbl08ma/sqalx"
)

// ChatEmote represents a chat emote
type ChatEmote struct {
	ID                      int64 `dbKey:"true"`
	Shortcode               string
	Animated                bool
	AvailableForNewMessages bool
	RequiresSubscription    bool
}

// GetChatEmotes returns all chat emotes in the database
func GetChatEmotes(node sqalx.Node, pagParams *PaginationParams) ([]*ChatEmote, uint64, error) {
	s := sdb.Select().
		OrderBy("chat_emote.id DESC")
	s = applyPaginationParameters(s, pagParams)
	return GetWithSelectAndCount[*ChatEmote](node, s)
}

// Update updates or inserts the ChatEmote
func (obj *ChatEmote) Update(node sqalx.Node) error {
	return Update(node, obj)
}

// Delete deletes the ChatEmote
func (obj *ChatEmote) Delete(node sqalx.Node) error {
	return Delete(node, obj)
}
