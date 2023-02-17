package event

import (
	"sync"

	"github.com/smallnest/chanx"
	"github.com/tnyim/jungletv/utils/fastcollection"
)

// Event is an event including dispatching mechanism
type Event[T any] struct {
	mu                   sync.RWMutex
	nonBlockingSubs      fastcollection.FastCollection[chan T]
	blockingSubs         fastcollection.FastCollection[*chanx.UnboundedChan[T]]
	closed               bool
	pendingNotifications []T
	onUnsubscribed       *Event[int]
}

// GuaranteeType defines what delivery guarantees event subscribers get
type GuaranteeType int

const (
	// AtMostOnceGuarantee: subscribers will be notified only if they are actively waiting on the channel.
	// (logically, it follows that any notifications happening inbetween channel reads will be lost)
	AtMostOnceGuarantee = iota

	// AtLeastOnceGuarantee: subscribers will be notified on the next channel read, even if they are not actively waiting on the channel.
	// If more than one notification happens inbetween channel reads, they will be lost.
	AtLeastOnceGuarantee

	// ExactlyOnceGuarantee: subscribers will be notified exactly as many times as the event is fired,
	// even if those notifications happen when they are not waiting on the channel.
	// The order of the events is preserved.
	ExactlyOnceGuarantee
)

// New returns a new Event
func New[T any]() *Event[T] {
	return &Event[T]{}
}

// Subscribe returns a channel that will receive notification events.
func (e *Event[T]) Subscribe(guaranteeType GuaranteeType) (<-chan T, func()) {
	e.mu.Lock()
	defer e.mu.Unlock()

	var subID int
	var retChan <-chan T
	switch guaranteeType {
	case AtMostOnceGuarantee:
		subChan := make(chan T)
		subID = e.nonBlockingSubs.Insert(subChan)
		retChan = subChan
	case AtLeastOnceGuarantee:
		subChan := make(chan T, 1)
		subID = e.nonBlockingSubs.Insert(subChan)
		retChan = subChan
	case ExactlyOnceGuarantee:
		subChan := chanx.NewUnboundedChan[T](1)
		subID = e.blockingSubs.Insert(subChan)
		retChan = subChan.Out
	default:
		panic("invalid guarantee type")
	}

	var unsubscribed bool
	if !e.closed && e.pendingNotifications != nil {
		for _, pending := range e.pendingNotifications {
			e.notifyNowWithinMutex(pending)
		}
		e.pendingNotifications = nil
	}
	return retChan, func() { e.unsubscribe(subID, guaranteeType, &unsubscribed) }
}

// SubscribeUsingCallback subscribes to an event by calling the provided function with the argument passed on Notify
// The returned function should be called when one wishes to unsubscribe
func (e *Event[T]) SubscribeUsingCallback(guaranteeType GuaranteeType, cbFunction func(arg T)) func() {
	ch, unsub := e.Subscribe(guaranteeType)
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
func (e *Event[T]) unsubscribe(subID int, guaranteeType GuaranteeType, unsubscribed *bool) {
	e.mu.Lock()
	defer e.mu.Unlock()

	if *unsubscribed {
		return
	}
	*unsubscribed = true

	switch guaranteeType {
	case AtMostOnceGuarantee:
		fallthrough
	case AtLeastOnceGuarantee:
		subChan := e.nonBlockingSubs.Delete(subID)
		close(subChan)
	case ExactlyOnceGuarantee:
		subChan := e.blockingSubs.Delete(subID)
		close(subChan.In) // this is important, to destroy the internal goroutine of the UnboundedChan
	default:
		panic("invalid guarantee type")
	}

	if e.onUnsubscribed != nil {
		e.onUnsubscribed.Notify(e.len(), false)
	}
}

func (e *Event[T]) len() int {
	return e.nonBlockingSubs.Len() + e.blockingSubs.Len()
}

// Notify notifies subscribers that the event has occurred.
// deferNotification controls whether an attempt will be made at late delivery if there are no subscribers to this event at the time of notification
// (subject to the GuaranteeType guarantees on the subscription side)
func (e *Event[T]) Notify(param T, deferNotification bool) {
	e.mu.RLock()

	if e.closed {
		e.mu.RUnlock()
		return
	}

	if e.len() > 0 {
		e.notifyNowWithinMutex(param)
	} else if deferNotification {
		e.mu.RUnlock()

		e.mu.Lock()
		defer e.mu.Unlock()
		// must do checks again since conditions may have changed while we reacquired the lock
		if !e.closed && e.len() == 0 {
			e.pendingNotifications = append(e.pendingNotifications, param)
		}
		return
	}
	e.mu.RUnlock()
}

func (e *Event[T]) notifyNowWithinMutex(param T) {
	for _, entry := range e.nonBlockingSubs.UnsafeBackingArray {
		// no need to check if the entry is valid as sends on a nil channel block (and since we're using the select with default case, they won't block)
		select {
		case entry.Content <- param:
		default:
		}
	}
	for _, entry := range e.blockingSubs.UnsafeBackingArray {
		if entry.NextDeleteIdx < 0 {
			entry.Content.In <- param
		}
	}
}

// Close notifies subscribers that no more events will be sent
func (e *Event[T]) Close() {
	e.mu.Lock()
	defer e.mu.Unlock()

	if !e.closed {
		e.closed = true
		for _, entry := range e.nonBlockingSubs.UnsafeBackingArray {
			if entry.NextDeleteIdx == -2 {
				close(entry.Content)
			}
		}
		for _, entry := range e.blockingSubs.UnsafeBackingArray {
			if entry.NextDeleteIdx == -2 {
				close(entry.Content.In)
			}
		}
	}
}

// Unsubscribed returns an event that is notified with the current subscriber count whenever a subscriber unsubscribes
// from this event. This allows references to the event to be manually freed in code patterns that require it.
func (e *Event[T]) Unsubscribed() *Event[int] {
	e.mu.Lock()
	defer e.mu.Unlock()

	// onUnsubscribed is lazily initialized to avoid infinite recursion on New()
	if e.onUnsubscribed == nil {
		e.onUnsubscribed = New[int]()
	}
	return e.onUnsubscribed
}
