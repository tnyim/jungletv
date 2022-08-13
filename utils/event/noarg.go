package event

type NoArgEvent struct {
	*Event[struct{}]
}

// New returns a new NoArgEvent
func NewNoArg() *NoArgEvent {
	e := &NoArgEvent{
		Event: New[struct{}](),
	}
	return e
}

// SubscribeUsingCallback is a convenience wrapper around the underlying event SubscribeUsingCallback
// so that callback functions do not need to accept a useless empty parameter
func (e *NoArgEvent) SubscribeUsingCallback(guaranteeType GuaranteeType, cbFunction func()) func() {
	cbFn := func(_ struct{}) {
		cbFunction()
	}
	return e.Event.SubscribeUsingCallback(guaranteeType, cbFn)
}

// Notify is a convenience wrapper around the underlying event Notify
// so that the caller doesn't need to provide an useless empty parameter
func (e *NoArgEvent) Notify(deferNotification bool) {
	e.Event.Notify(struct{}{}, deferNotification)
}
