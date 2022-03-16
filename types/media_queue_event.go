package types

import (
	"errors"
	"time"

	sq "github.com/Masterminds/squirrel"
	"github.com/gbl08ma/sqalx"
	"github.com/palantir/stacktrace"
)

// MediaQueueEvent represents a noteworthy media queue event
type MediaQueueEvent struct {
	CreatedAt time.Time `dbKey:"true"`
	EventType MediaQueueEventType
}

// MediaQueueEventType represents a type of media queue event
type MediaQueueEventType string

// MediaQueueFilled is the media queue event type for when the queue becomes non-empty
const MediaQueueFilled MediaQueueEventType = "filled"

// MediaQueueEmptied is the media queue event type for when the queue becomes empty
const MediaQueueEmptied MediaQueueEventType = "emptied"

// ErrMediaQueueEventNotFound is returned when we can not find the specified media queue event
var ErrMediaQueueEventNotFound = errors.New("media queue event not found")

// GetMostRecentMediaQueueEventWithType returns the most recent media queue event with the given type
func GetMostRecentMediaQueueEventWithType(node sqalx.Node, eventType ...MediaQueueEventType) (*MediaQueueEvent, error) {
	s := sdb.Select().
		Where(subQueryEq(
			"media_queue_event.created_at",
			sq.Select("MAX(e.created_at)").
				From("media_queue_event e").
				Where(sq.Eq{"media_queue_event.event_type": eventType}),
		))
	events, err := GetWithSelect[*MediaQueueEvent](node, s)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	if len(events) == 0 {
		return nil, stacktrace.Propagate(ErrMediaQueueEventNotFound, "")
	}
	return events[0], nil
}

// InsertMediaQueueEvents inserts the passed received rewards in the database
func InsertMediaQueueEvents(node sqalx.Node, items []*MediaQueueEvent) error {
	c := make([]interface{}, len(items))
	for i := range items {
		c[i] = items[i]
	}
	return stacktrace.Propagate(Insert(node, c...), "")
}
