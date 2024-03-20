package event

import "sync"

// Keyed is a set of key-addressable events
type Keyed[KeyType comparable, ArgType any] interface {
	Subscribe(key KeyType, guaranteeType BufferStrategy) (<-chan ArgType, func())
	SubscribeUsingCallback(key KeyType, guaranteeType BufferStrategy, cbFunction func(arg ArgType)) func()
	Notify(key KeyType, param ArgType, deferNotification bool)
	NotifyAll(param ArgType)
	Close(key KeyType)
	Unsubscribed(key KeyType) Event[int]
}

type keyed[KeyType comparable, ArgType any] struct {
	mu                   sync.RWMutex
	events               map[KeyType]*event[ArgType]
	pendingNotifications map[KeyType][]ArgType
}

// NewKeyed returns a new Keyed event
func NewKeyed[KeyType comparable, ArgType any]() Keyed[KeyType, ArgType] {
	return &keyed[KeyType, ArgType]{
		events:               make(map[KeyType]*event[ArgType]),
		pendingNotifications: make(map[KeyType][]ArgType),
	}
}

// getOrCreateEvent returns the event associated with the specified key, creating it if it doesn't exist yet
// The event is automatically cleaned up once all subscribers unsubscribe
// MUST run inside write lock of k.mu
func (k *keyed[KeyType, ArgType]) getOrCreateEvent(key KeyType) Event[ArgType] {
	if e, ok := k.events[key]; ok {
		return e
	}

	e := New[ArgType]().(*event[ArgType])
	var unsubscribe func()
	unsubscribe = e.Unsubscribed().SubscribeUsingCallback(BufferFirst, func(subscriberCount int) {
		if subscriberCount == 0 {
			k.mu.Lock()
			defer k.mu.Unlock()
			delete(k.events, key)
			delete(k.pendingNotifications, key)
			unsubscribe()
		}
	})
	k.events[key] = e
	return e
}

// Subscribe returns a channel that will receive notification events for the specified key
func (k *keyed[KeyType, ArgType]) Subscribe(key KeyType, guaranteeType BufferStrategy) (<-chan ArgType, func()) {
	// by locking and unlocking outside of the getOrCreateEvent function, we ensure that the subscription happens inside the lock
	// and therefore we don't lose track of any Notify calls
	k.mu.Lock()
	defer k.mu.Unlock()

	event := k.getOrCreateEvent(key)
	// pass the responsibility of sending delayed notifications onto the event
	for _, delayed := range k.pendingNotifications[key] {
		event.Notify(delayed, true)
	}
	delete(k.pendingNotifications, key)
	return event.Subscribe(guaranteeType)
}

// SubscribeUsingCallback subscribes to an event by calling the provided function with the argument passed on Notify
// The returned function should be called when one wishes to unsubscribe
func (k *keyed[KeyType, ArgType]) SubscribeUsingCallback(key KeyType, guaranteeType BufferStrategy, cbFunction func(arg ArgType)) func() {
	// by locking and unlocking outside of the getOrCreateEvent function, we ensure that the subscription happens inside the lock
	// and therefore we don't lose track of any Notify calls
	k.mu.Lock()
	defer k.mu.Unlock()

	event := k.getOrCreateEvent(key)
	// pass the responsibility of sending delayed notifications onto the event
	for _, delayed := range k.pendingNotifications[key] {
		event.Notify(delayed, true)
	}
	delete(k.pendingNotifications, key)
	return event.SubscribeUsingCallback(guaranteeType, cbFunction)
}

// Notify notifies subscribers that the event has occurred
func (k *keyed[KeyType, ArgType]) Notify(key KeyType, param ArgType, deferNotification bool) {
	k.mu.RLock()
	rUnlock := true
	defer func() {
		if rUnlock {
			k.mu.RUnlock()
		}
	}()

	// do not use the `getOrCreateEvent` function as we do not want to create an event if one doesn't exist
	if e, ok := k.events[key]; ok {
		e.Notify(param, deferNotification)
	} else if deferNotification {
		// event doesn't exist, store for later so we can notify the first subscriber for this key
		k.mu.RUnlock()
		rUnlock = false

		k.mu.Lock()
		defer k.mu.Unlock()
		// must do checks again since conditions may have changed while we reacquired the lock
		if _, ok := k.events[key]; ok {
			e.Notify(param, deferNotification)
		} else {
			k.pendingNotifications[key] = append(k.pendingNotifications[key], param)
		}
	}
}

// NotifyAll notifies all subscribers regardless of key with the same event argument
func (k *keyed[KeyType, ArgType]) NotifyAll(param ArgType) {
	k.mu.RLock()
	defer k.mu.RUnlock()
	for _, e := range k.events {
		e.Notify(param, false)
	}
}

// Close notifies subscribers for this key that no more events will be sent for this key
func (k *keyed[KeyType, ArgType]) Close(key KeyType) {
	k.mu.RLock()
	defer k.mu.RUnlock()

	// do not use the `getOrCreateEvent` function as we do not want to create an event if one doesn't exist
	if e, ok := k.events[key]; ok {
		e.Close()
	}
}

// Unsubscribed returns an event that is notified with the current subscriber count whenever a subscriber unsubscribes
// from the event for this key. This allows references to the event to be manually freed in code patterns that require it.
func (k *keyed[KeyType, ArgType]) Unsubscribed(key KeyType) Event[int] {
	k.mu.Lock()
	defer k.mu.Unlock()
	return k.getOrCreateEvent(key).Unsubscribed()
}
