package event

import (
	"context"
	"sync"

	"github.com/smallnest/chanx"
	"github.com/tnyim/jungletv/utils/fastcollection"
)

// Event is an event including dispatching mechanism
type Event[T any] interface {
	// Subscribe returns a channel that will receive notification events.
	// The returned function should be called when one wishes to unsubscribe
	Subscribe(bufferStrategy BufferStrategy) (<-chan T, func())

	// SubscribeUsingCallback subscribes to an event by calling the provided function with the argument passed on Notify
	// The returned function should be called when one wishes to unsubscribe
	SubscribeUsingCallback(bufferStrategy BufferStrategy, cbFunction func(arg T)) func()

	// Notify notifies subscribers that the event has occurred.
	// deferNotification controls whether an attempt will be made at late delivery if there are no subscribers to this event at the time of notification
	// (subject to the buffer strategy chosen on the subscription side)
	Notify(param T, deferNotification bool)

	// Close notifies subscribers that no more events will be sent
	Close()

	// Unsubscribed returns an event that is notified with the current subscriber count whenever a subscriber unsubscribes
	// from this event. This allows references to the event to be manually freed in code patterns that require it.
	Unsubscribed() Event[int]
}

type event[T any] struct {
	mu                    sync.RWMutex
	bufferFirstOrNoneSubs fastcollection.FastCollection[nonBlockingSub[T]]
	bufferLatestSubs      fastcollection.FastCollection[nonBlockingSub[T]]
	bufferAllSubs         fastcollection.FastCollection[*chanx.UnboundedChan[T]]
	closed                bool
	pendingNotifications  []T
	onUnsubscribed        Event[int]
}

type nonBlockingSub[T any] chan T

// BufferStrategy defines how much buffering happens on the receiving side for event subscribers
type BufferStrategy int

const (
	// BufferNone: subscribers will be notified only if they are actively waiting on the channel.
	// (logically, it follows that any notifications happening inbetween channel reads will be lost)
	BufferNone = iota

	// BufferFirst: subscribers will be notified on the next channel read, even if they are not actively waiting on the channel.
	// They will receive the first notification that was sent after their latest read.
	// If more than one notification happens inbetween channel reads, they will be lost.
	BufferFirst

	// BufferLatest: subscribers will be notified on the next channel read, even if they are not actively waiting on the channel.
	// They will receive the latest notification that was sent after their latest read.
	// If more than one notification happens inbetween channel reads, they will be lost.
	BufferLatest

	// BufferAll: subscribers will be notified exactly as many times as the event is fired,
	// even if those notifications happen when they are not waiting on the channel.
	// The order of the events is preserved.
	BufferAll
)

// New returns a new Event
func New[T any]() Event[T] {
	return &event[T]{}
}

// Subscribe returns a channel that will receive notification events.
func (e *event[T]) Subscribe(bufferStrategy BufferStrategy) (<-chan T, func()) {
	e.mu.Lock()
	defer e.mu.Unlock()

	ctx, cancelCtx := context.WithCancel(context.Background())

	var subID int
	var retChan <-chan T
	switch bufferStrategy {
	case BufferNone:
		subChan := make(chan T)
		subID = e.bufferFirstOrNoneSubs.Insert(nonBlockingSub[T](subChan))
		retChan = subChan
	case BufferFirst:
		subChan := make(chan T, 1)
		subID = e.bufferFirstOrNoneSubs.Insert(nonBlockingSub[T](subChan))
		retChan = subChan
	case BufferLatest:
		subChan := make(chan T, 1)
		subID = e.bufferLatestSubs.Insert(nonBlockingSub[T](subChan))
		retChan = subChan
	case BufferAll:
		subChan := chanx.NewUnboundedChan[T](ctx, 1)
		subID = e.bufferAllSubs.Insert(subChan)
		retChan = subChan.Out
	default:
		panic("invalid buffer strategy")
	}

	if !e.closed && e.pendingNotifications != nil {
		for _, pending := range e.pendingNotifications {
			e.notifyNowWithinMutex(pending)
		}
		e.pendingNotifications = nil
	}

	var unsubscribed bool
	return retChan, func() {
		e.unsubscribe(subID, bufferStrategy, &unsubscribed)
		cancelCtx()
	}
}

// SubscribeUsingCallback subscribes to an event by calling the provided function with the argument passed on Notify
// The returned function should be called when one wishes to unsubscribe
func (e *event[T]) SubscribeUsingCallback(bufferStrategy BufferStrategy, cbFunction func(arg T)) func() {
	ch, unsub := e.Subscribe(bufferStrategy)
	go func() {
		defer unsub()
		for {
			param, ok := <-ch
			if !ok {
				return
			}
			cbFunction(param)
		}
	}()
	return unsub
}

// unsubscribe removes the provided channel from the list of subscriptions, i.e. the channel will no longer be notified.
// It also closes the channel.
func (e *event[T]) unsubscribe(subID int, bufferStrategy BufferStrategy, unsubscribed *bool) {
	e.mu.Lock()
	defer e.mu.Unlock()

	if *unsubscribed {
		return
	}
	*unsubscribed = true

	switch bufferStrategy {
	case BufferNone:
		fallthrough
	case BufferFirst:
		sub := e.bufferFirstOrNoneSubs.Delete(subID)
		if !e.closed {
			close(sub)
		}
	case BufferLatest:
		sub := e.bufferLatestSubs.Delete(subID)
		if !e.closed {
			close(sub)
		}
	case BufferAll:
		subChan := e.bufferAllSubs.Delete(subID)
		if !e.closed {
			close(subChan.In) // this is important, to destroy the internal goroutine of the UnboundedChan
		}
	default:
		panic("invalid buffer strategy")
	}

	if e.onUnsubscribed != nil {
		e.onUnsubscribed.Notify(e.len(), false)
	}
}

func (e *event[T]) len() int {
	return e.bufferFirstOrNoneSubs.Len() + e.bufferLatestSubs.Len() + e.bufferAllSubs.Len()
}

// Notify notifies subscribers that the event has occurred.
// deferNotification controls whether an attempt will be made at late delivery if there are no subscribers to this event at the time of notification
// (subject to the chosen BufferStrategy on the subscription side)
func (e *event[T]) Notify(param T, deferNotification bool) {
	shouldReturn := func() bool {
		e.mu.RLock()
		defer e.mu.RUnlock()

		if e.closed {
			return true
		}

		if !(deferNotification && e.len() == 0) {
			e.notifyNowWithinMutex(param)
			return true
		}
		return false
	}()

	if shouldReturn {
		return
	}

	e.mu.Lock()
	defer e.mu.Unlock()
	// must do checks again since conditions may have changed while we reacquired the lock
	if e.closed {
		return
	}
	if e.len() > 0 {
		// we have a subscriber now, notify as normal and quit
		e.notifyNowWithinMutex(param)
		return
	}
	e.pendingNotifications = append(e.pendingNotifications, param)
}

func (e *event[T]) notifyNowWithinMutex(param T) {
	for _, entry := range e.bufferFirstOrNoneSubs.UnsafeBackingArray {
		// no need to check if the entry is valid as sends on a nil channel block (and since we're using the select with default case, they won't block)
		select {
		case entry.Content <- param:
		default:
		}
	}
	for _, entry := range e.bufferLatestSubs.UnsafeBackingArray {
		// no need to check if the entry is valid before checking the condition as we'll do a non-blocking read anyway

		// empty the 1-buffered channel before replacing with latest entry
		select {
		case <-entry.Content:
		default:
		}

		select {
		case entry.Content <- param:
		default:
		}
	}
	for _, entry := range e.bufferAllSubs.UnsafeBackingArray {
		if entry.NextDeleteIdx < 0 {
			entry.Content.In <- param
		}
	}
}

// Close notifies subscribers that no more events will be sent
func (e *event[T]) Close() {
	e.mu.Lock()
	defer e.mu.Unlock()

	if e.closed {
		return
	}
	e.closed = true

	for _, entry := range e.bufferFirstOrNoneSubs.UnsafeBackingArray {
		if entry.NextDeleteIdx < 0 {
			close(entry.Content)
		}
	}
	for _, entry := range e.bufferLatestSubs.UnsafeBackingArray {
		if entry.NextDeleteIdx < 0 {
			close(entry.Content)
		}
	}
	for _, entry := range e.bufferAllSubs.UnsafeBackingArray {
		if entry.NextDeleteIdx < 0 {
			close(entry.Content.In)
		}
	}
}

// Unsubscribed returns an event that is notified with the current subscriber count whenever a subscriber unsubscribes
// from this event. This allows references to the event to be manually freed in code patterns that require it.
func (e *event[T]) Unsubscribed() Event[int] {
	e.mu.Lock()
	defer e.mu.Unlock()

	// onUnsubscribed is lazily initialized to avoid infinite recursion on New()
	if e.onUnsubscribed == nil {
		e.onUnsubscribed = New[int]()
	}
	return e.onUnsubscribed
}
