package chatmanager

import (
	"github.com/bwmarrin/snowflake"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/server/stores/chat"
	"github.com/tnyim/jungletv/utils/event"
)

// OnChatEnabled returns an event that is fired when chat is enabled
func (c *Manager) OnChatEnabled() *event.NoArgEvent {
	return c.chatEnabled
}

// OnChatDisabled returns an event that is fired when chat is disabled
func (c *Manager) OnChatDisabled() *event.Event[DisabledReason] {
	return c.chatDisabled
}

// MessageCreatedEventArgs contains the values for the MessageCreated event
type MessageCreatedEventArgs struct {
	Message                *chat.Message
	ProtobufRepresentation *proto.ChatMessage
}

// OnMessageCreated returns an event that is fired when a new chat message is created
func (c *Manager) OnMessageCreated() *event.Event[MessageCreatedEventArgs] {
	return c.messageCreated
}

// OnMessageDeleted returns an event that is fired when a chat message is deleted
func (c *Manager) OnMessageDeleted() *event.Event[snowflake.ID] {
	return c.messageDeleted
}

// OnUserBlockedBy returns a keyed event whose key is the reward address of an user and is fired when that user blocks another user
// The blocked user will be sent as the event argument
func (c *Manager) OnUserBlockedBy() *event.Keyed[string, string] {
	return c.userBlockedBy
}

// OnUserUnblockedBy returns a keyed event whose key is the reward address of an user and is fired when that user unblocks another user
// The unblocked user will be sent as the event argument
func (c *Manager) OnUserUnblockedBy() *event.Keyed[string, string] {
	return c.userUnblockedBy
}

// OnUserChangedNickname returns a keyed event whose key is the reward address of the user that changed nickname
// The new nickname will be sent as the event argument
func (c *Manager) OnUserChangedNickname() *event.Keyed[string, string] {
	return c.userChangedNickname
}
