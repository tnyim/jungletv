package chatmanager

import (
	"github.com/bwmarrin/snowflake"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/server/auth"
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

// OnUserBlockedBy returns an event that is fired when the specified user blocks another user
// The latter user will be sent as the event argument
func (c *Manager) OnUserBlockedBy(user auth.User) *event.Event[string] {
	if user == nil || user.IsUnknown() {
		// will never fire, and satisfies the consumer
		return event.New[string]()
	}

	c.userBlockedByMutex.Lock()
	defer c.userBlockedByMutex.Unlock()

	address := user.Address()

	if e, ok := c.userBlockedBy[address]; ok {
		return e
	}

	e := event.New[string]()
	var unsubscribe func()
	unsubscribe = e.Unsubscribed().SubscribeUsingCallback(event.AtLeastOnceGuarantee, func(subscriberCount int) {
		if subscriberCount == 0 {
			c.userBlockedByMutex.Lock()
			defer c.userBlockedByMutex.Unlock()
			delete(c.userBlockedBy, address)
			unsubscribe()
		}
	})
	c.userBlockedBy[address] = e
	return e
}

// OnUserUnblockedBy returns an event that is fired when the specified user unblocks another user
// The latter user will be sent as the event argument
func (c *Manager) OnUserUnblockedBy(user auth.User) *event.Event[string] {
	if user == nil || user.IsUnknown() {
		// will never fire, and satisfies the consumer
		return event.New[string]()
	}

	c.userUnblockedByMutex.Lock()
	defer c.userUnblockedByMutex.Unlock()

	address := user.Address()

	if e, ok := c.userUnblockedBy[address]; ok {
		return e
	}

	e := event.New[string]()
	var unsubscribe func()
	unsubscribe = e.Unsubscribed().SubscribeUsingCallback(event.AtLeastOnceGuarantee, func(subscriberCount int) {
		if subscriberCount == 0 {
			c.userUnblockedByMutex.Lock()
			defer c.userUnblockedByMutex.Unlock()
			delete(c.userUnblockedBy, address)
			unsubscribe()
		}
	})
	c.userUnblockedBy[address] = e
	return e
}
