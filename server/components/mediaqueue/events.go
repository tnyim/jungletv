package mediaqueue

import (
	"github.com/tnyim/jungletv/server/auth"
	"github.com/tnyim/jungletv/server/media"
	"github.com/tnyim/jungletv/utils/event"
)

// EntryAddedEventArg is the argument of the event for when a queue entry is added
type EntryAddedEventArg struct {
	AddType string
	Entry   media.QueueEntry
}

// EntryMovedEventArg is the argument of the event for when a queue entry is moved
type EntryMovedEventArg struct {
	User  auth.User
	Entry media.QueueEntry
	Up    bool
}

// QueueUpdated is the event that is fired when the queue is updated in any way
func (q *MediaQueue) QueueUpdated() *event.NoArgEvent {
	return q.queueUpdated
}

// SkippingAllowedUpdated is the event that is fired when the ability to skip entries is enabled or disabled
func (q *MediaQueue) SkippingAllowedUpdated() *event.NoArgEvent {
	return q.skippingAllowedUpdated
}

// MediaChanged is the event that is fired when the currently playing entry changes
func (q *MediaQueue) MediaChanged() *event.Event[media.QueueEntry] {
	return q.mediaChanged
}

// EntryAdded is the event that is fired when an entry is added to the queue
func (q *MediaQueue) EntryAdded() *event.Event[EntryAddedEventArg] {
	return q.entryAdded
}

// DeepEntryRemoved is the event that is fired when an entry other than the currently played one is removed from the queue
func (q *MediaQueue) DeepEntryRemoved() *event.Event[media.QueueEntry] {
	return q.deepEntryRemoved
}

// OwnEntryRemoved is the event that is fired when a user removes one of their own queue entries
func (q *MediaQueue) OwnEntryRemoved() *event.Event[media.QueueEntry] {
	return q.ownEntryRemoved
}

// EntryMoved is the event that is fired when a queue entry is moved up or down
func (q *MediaQueue) EntryMoved() *event.Event[EntryMovedEventArg] {
	return q.entryMoved
}
