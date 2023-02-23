package event

// NoArgEvent is an Event without arguments
type NoArgEvent interface {
	// Subscribe returns a channel that will receive notification events.
	// The returned function should be called when one wishes to unsubscribe
	Subscribe(guaranteeType BufferStrategy) (<-chan struct{}, func())

	// SubscribeUsingCallback subscribes to an event by calling the provided function with the argument passed on Notify
	// The returned function should be called when one wishes to unsubscribe
	SubscribeUsingCallback(guaranteeType BufferStrategy, cbFunction func()) func()

	// Notify notifies subscribers that the event has occurred.
	// deferNotification controls whether an attempt will be made at late delivery if there are no subscribers to this event at the time of notification
	// (subject to the GuaranteeType guarantees on the subscription side)
	Notify(deferNotification bool)

	// Close notifies subscribers that no more events will be sent
	Close()

	// Unsubscribed returns an event that is notified with the current subscriber count whenever a subscriber unsubscribes
	// from this event. This allows references to the event to be manually freed in code patterns that require it.
	Unsubscribed() Event[int]
}

type noArgEvent struct {
	Event[struct{}]
}

// New returns a new NoArgEvent
func NewNoArg() NoArgEvent {
	e := &noArgEvent{
		Event: New[struct{}](),
	}
	return e
}

// SubscribeUsingCallback is a convenience wrapper around the underlying event SubscribeUsingCallback
// so that callback functions do not need to accept a useless empty parameter
func (e *noArgEvent) SubscribeUsingCallback(guaranteeType BufferStrategy, cbFunction func()) func() {
	cbFn := func(_ struct{}) {
		cbFunction()
	}
	return e.Event.SubscribeUsingCallback(guaranteeType, cbFn)
}

// Notify is a convenience wrapper around the underlying event Notify
// so that the caller doesn't need to provide an useless empty parameter
func (e *noArgEvent) Notify(deferNotification bool) {
	e.Event.Notify(struct{}{}, deferNotification)
}
