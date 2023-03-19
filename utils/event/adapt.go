package event

// Adapt converts one event with a given argument type to one with a different argument type
func Adapt[OrigArgType any, DestArgType any](origEvent Event[OrigArgType], origToDestMapper func(OrigArgType) DestArgType, destToOrigMapper func(DestArgType) OrigArgType) Event[DestArgType] {
	return &adaptedEvent[OrigArgType, DestArgType]{
		origEvent:        origEvent,
		origToDestMapper: origToDestMapper,
		destToOrigMapper: destToOrigMapper,
	}
}

type adaptedEvent[OrigArgType any, DestArgType any] struct {
	origEvent        Event[OrigArgType]
	origToDestMapper func(OrigArgType) DestArgType
	destToOrigMapper func(DestArgType) OrigArgType
}

func (a *adaptedEvent[OrigArgType, T]) Subscribe(bufferStrategy BufferStrategy) (<-chan T, func()) {
	destCh := make(chan T)
	destUnsub := a.origEvent.SubscribeUsingCallback(bufferStrategy, func(arg OrigArgType) {
		destCh <- a.origToDestMapper(arg)
	})
	return destCh, destUnsub
}

func (a *adaptedEvent[OrigArgType, T]) SubscribeUsingCallback(bufferStrategy BufferStrategy, cbFunction func(arg T)) func() {
	return a.origEvent.SubscribeUsingCallback(bufferStrategy, func(arg OrigArgType) {
		cbFunction(a.origToDestMapper(arg))
	})
}

func (a *adaptedEvent[OrigArgType, T]) Notify(param T, deferNotification bool) {
	a.origEvent.Notify(a.destToOrigMapper(param), deferNotification)
}

func (a *adaptedEvent[OrigArgType, T]) Close() {
	a.origEvent.Close()
}

func (a *adaptedEvent[OrigArgType, T]) Unsubscribed() Event[int] {
	return a.origEvent.Unsubscribed()
}
