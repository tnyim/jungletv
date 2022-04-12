package event

import (
	"sync"
)

// Event is an event including dispatching mechanism
type Event[T any] struct {
	mu                       sync.RWMutex
	subs                     []subscription[T]
	closed                   bool
	pendingNotification      bool
	pendingNotificationParam T
	onUnsubscribed           *Event[int]
}

type subscription[T any] struct {
	ch       chan T
	blocking bool
}

// GuaranteeType defines what delivery guarantees event subscribers get
type GuaranteeType int

const (
	AtMostOnceGuarantee = iota
	AtLeastOnceGuarantee
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
	if e.pendingNotification {
		e.notifyNowWithinMutex(e.pendingNotificationParam)
		e.pendingNotification = false
		var zeroValue T
		e.pendingNotificationParam = zeroValue
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
				e.onUnsubscribed.Notify(newLen)
			}
			return
		}
	}
}

// Notify notifies subscribers that the event has occurred
func (e *Event[T]) Notify(param T) {
	e.mu.RLock()
	defer e.mu.RUnlock()

	if e.closed {
		return
	}

	if len(e.subs) > 0 {
		e.notifyNowWithinMutex(param)
	} else {
		e.pendingNotification = true
		e.pendingNotificationParam = param
	}
}

func (e *Event[T]) notifyNowWithinMutex(param T) {
	for _, sub := range e.subs {
		if sub.blocking {
			go func(sch chan T) {
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
