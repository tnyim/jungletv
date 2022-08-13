package event

import (
	"sync"
)

// Event is an event including dispatching mechanism
type Event[T any] struct {
	mu                   sync.RWMutex
	subs                 []subscription[T]
	closed               bool
	pendingNotifications []T
	onUnsubscribed       *Event[int]
}

type subscription[T any] struct {
	ch       chan T
	blocking bool
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
	ExactlyOnceGuarantee
)

// New returns a new Event
func New[T any]() *Event[T] {
	e := &Event[T]{}
	return e
}

// Subscribe returns a channel that will receive notification events.
func (e *Event[T]) Subscribe(guaranteeType GuaranteeType) (<-chan T, func()) {
	e.mu.Lock()
	defer e.mu.Unlock()

	var s subscription[T]
	switch guaranteeType {
	case AtMostOnceGuarantee:
		s = subscription[T]{
			ch:       make(chan T),
			blocking: false,
		}
	case AtLeastOnceGuarantee:
		s = subscription[T]{
			ch:       make(chan T, 1),
			blocking: false,
		}
	case ExactlyOnceGuarantee:
		s = subscription[T]{
			ch:       make(chan T),
			blocking: true,
		}
	default:
		panic("invalid guarantee type")
	}

	e.subs = append(e.subs, s)
	if !e.closed {
		for _, pending := range e.pendingNotifications {
			e.notifyNowWithinMutex(pending)
		}
		e.pendingNotifications = []T{}
	}
	return s.ch, func() { e.unsubscribe(s.ch) }
}

// SubscribeUsingCallback subscribes to an event by calling the provided function with the argument passed on Notify
// The returned function should be called when one wishes to unsubscribe
func (e *Event[T]) SubscribeUsingCallback(guaranteeType GuaranteeType, cbFunction func(arg T)) func() {
	ch, unsub := e.Subscribe(guaranteeType)
	go func() {
		for {
			param, ok := <-ch
			if !ok {
				unsub()
				return
			}
			cbFunction(param)
		}
	}()
	return unsub
}

// unsubscribe removes the provided channel from the list of subscriptions, i.e. the channel will no longer be notified.
// It also closes the channel.
func (e *Event[T]) unsubscribe(ch <-chan T) {
	e.mu.Lock()
	defer e.mu.Unlock()

	for i := range e.subs {
		if e.subs[i].ch == ch {
			close(e.subs[i].ch)
			newLen := len(e.subs) - 1
			e.subs[i] = e.subs[newLen]
			e.subs = e.subs[:newLen]
			if e.onUnsubscribed != nil {
				e.onUnsubscribed.Notify(newLen, false)
			}
			return
		}
	}
}

// Notify notifies subscribers that the event has occurred.
// deferNotification controls whether an attempt will be made at late delivery if there are no subscribers to this event at the time of notification
// (subject to the GuaranteeType guarantees on the subscription side)
func (e *Event[T]) Notify(param T, deferNotification bool) {
	e.mu.RLock()
	rUnlock := true
	defer func() {
		if rUnlock {
			e.mu.RUnlock()
		}
	}()

	if e.closed {
		return
	}

	if len(e.subs) > 0 {
		e.notifyNowWithinMutex(param)
	} else if deferNotification {
		e.mu.RUnlock()
		rUnlock = false

		e.mu.Lock()
		defer e.mu.Unlock()
		// must do checks again since conditions may have changed while we reacquired the lock
		if !e.closed && len(e.subs) == 0 {
			e.pendingNotifications = append(e.pendingNotifications, param)
		}
	}
}

func (e *Event[T]) notifyNowWithinMutex(param T) {
	for _, sub := range e.subs {
		if sub.blocking {
			go func(sch chan T) {
				defer func() {
					recover() // we don't care if we panic on sending to closed channels
					// (the point of us closing these channels is so goroutines like this one don't live forever)
				}()
				sch <- param
			}(sub.ch)
		} else {
			select {
			case sub.ch <- param:
			default:
			}
		}
	}
}

// Close notifies subscribers that no more events will be sent
func (e *Event[T]) Close() {
	e.mu.Lock()
	defer e.mu.Unlock()

	if !e.closed {
		e.closed = true
		for _, sub := range e.subs {
			close(sub.ch)
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
