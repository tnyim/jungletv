package gojautil

import (
	"context"
	"sync"

	"github.com/dop251/goja"
	"github.com/tnyim/jungletv/server/components/apprunner/modules"
	"github.com/tnyim/jungletv/utils/event"
	"golang.org/x/exp/maps"
	"golang.org/x/exp/slices"
)

// EventAdapter adapts a series of event.Event to events that can be used in goja scripts
type EventAdapter struct {
	appContext  modules.ApplicationContext
	runtime     *goja.Runtime
	this        struct{}
	running     bool
	mu          sync.RWMutex
	knownEvents map[string]*knownEvent
}

// NewEventAdapter returns a new EventAdapter
func NewEventAdapter(appContext modules.ApplicationContext) *EventAdapter {
	return &EventAdapter{
		appContext:  appContext,
		this:        struct{}{},
		knownEvents: make(map[string]*knownEvent),
	}
}

type knownEvent struct {
	// subscribeFn is built by AdaptEvent/AdaptNoArgEvent.
	// it will be called when the first listener is added to the event, and unsubFn will be set to the function it'll return.
	// subscribeFn will also be called when resuming execution with a different context, for events that already had listeners attached
	subscribeFn func() func()
	// in addition to being called when the last listener is removed from the event by RemoveEventListener,
	// unsubFn will also be called when pausing execution, i.e. terminating an execution context
	unsubFn func()

	// listeners are added/removed from the goja runtime, in AddEventListener/RemoveEventListener
	listeners []eventListener
}

type eventListener struct {
	value    goja.Value
	callable goja.Callable
}

// AddEventListener should be exposed to the goja runtime so scripts can attach event handlers
func (a *EventAdapter) AddEventListener(call goja.FunctionCall) goja.Value {
	if len(call.Arguments) < 2 {
		panic(a.runtime.NewTypeError("Missing argument"))
	}
	eventValue := call.Argument(0)
	listenerValue := call.Argument(1)

	callback, ok := goja.AssertFunction(listenerValue)
	if !ok {
		panic(a.runtime.NewTypeError("Invalid callback specified as second argument"))
	}

	event := eventValue.String()

	a.mu.Lock()
	defer a.mu.Unlock()

	if e, ok := a.knownEvents[event]; ok {
		if len(e.listeners) == 0 {
			e.unsubFn = e.subscribeFn()
		}
		e.listeners = append(e.listeners, eventListener{
			value:    listenerValue,
			callable: callback,
		})

		return goja.Undefined()
	}
	panic(a.runtime.NewTypeError("Unknown event '%s'", event))
}

// RemoveEventListener should be exposed to the goja runtime so scripts can detach event handlers
func (a *EventAdapter) RemoveEventListener(call goja.FunctionCall) goja.Value {
	if len(call.Arguments) < 2 {
		panic(a.runtime.NewTypeError("Missing argument"))
	}
	eventValue := call.Argument(0)
	listenerValue := call.Argument(1)

	event := eventValue.String()

	a.mu.Lock()
	defer a.mu.Unlock()

	if e, ok := a.knownEvents[event]; ok {
		for i, listener := range e.listeners {
			if listener.value.SameAs(listenerValue) {
				e.listeners = slices.Delete(e.listeners, i, i+1)
				if len(e.listeners) == 0 {
					e.unsubFn()
				}
				break
			}
		}

		return goja.Undefined()
	}
	panic(a.runtime.NewTypeError("Unknown event '%s'", event))
}

// StartOrResume should be called when execution starts/resumes with a different context
// StartOrResume may be safely called multiple times in a row
func (a *EventAdapter) StartOrResume(ctx context.Context, wg *sync.WaitGroup, runtime *goja.Runtime) {
	a.runtime = runtime

	a.mu.Lock()
	defer a.mu.Unlock()

	if a.running {
		return
	}
	a.running = true

	events := maps.Values(a.knownEvents)
	for _, e := range events {
		// resume adapters for events that have listeners attached
		if len(e.listeners) > 0 {
			e.unsubFn = e.subscribeFn()
		}
	}

	wg.Add(1)
	go a.pauseLater(ctx, wg)
}

func (a *EventAdapter) pauseLater(ctx context.Context, wg *sync.WaitGroup) {
	<-ctx.Done()
	defer wg.Done()

	a.mu.Lock()
	defer a.mu.Unlock()

	if !a.running {
		return
	}
	a.running = false

	events := maps.Values(a.knownEvents)
	for _, e := range events {
		// if a knownEvent has listeners, it's guaranteed that its subscribeFn has been called and
		// that its unsubFn has been set to the return value of the subscribeFn
		if len(e.listeners) > 0 {
			e.unsubFn()
		}
	}
}

// AdaptEvent sets an EventAdapter to adapt an event.Event, exposing an event of type `eventType` to the scripting runtime
func AdaptEvent[T any](a *EventAdapter, ev event.Event[T], eventType string, transformArgFn func(*goja.Runtime, T) *goja.Object) {
	a.mu.Lock()
	defer a.mu.Unlock()

	if _, ok := a.knownEvents[eventType]; ok {
		panic("event already adapted")
	}

	a.knownEvents[eventType] = &knownEvent{
		subscribeFn: func() func() { return eventSubscribeFunction(a, ev, eventType, transformArgFn) },
	}
}

// AdaptNoArgEvent sets an EventAdapter to adapt an event.NoArgEvent, exposing an event of type `eventType` to the scripting runtime
func AdaptNoArgEvent(a *EventAdapter, ev event.NoArgEvent, eventType string, transformArgFn func(*goja.Runtime) *goja.Object) {
	a.mu.Lock()
	defer a.mu.Unlock()

	if _, ok := a.knownEvents[eventType]; ok {
		panic("event already adapted")
	}

	a.knownEvents[eventType] = &knownEvent{
		subscribeFn: func() func() { return noArgEventSubscribeFunction(a, ev, eventType, transformArgFn) },
	}
}

func eventSubscribeFunction[T any](a *EventAdapter, ev event.Event[T], eventType string, transformArgFn func(*goja.Runtime, T) *goja.Object) func() {
	return ev.SubscribeUsingCallback(event.BufferAll, func(arg T) {
		var listeners []eventListener
		func() {
			a.mu.RLock()
			defer a.mu.RUnlock()
			listeners = append(listeners, a.knownEvents[eventType].listeners...)
		}()

		for _, listener := range listeners {
			listenerCopy := listener
			a.appContext.Schedule(func(vm *goja.Runtime) error {
				result := vm.NewObject()
				if transformArgFn != nil {
					r := transformArgFn(vm, arg)
					if r != nil {
						result = r
					}
				}
				result.Set("type", eventType)
				_, err := listenerCopy.callable(vm.ToValue(a.this), result)
				return err
			})
		}
	})
}

func noArgEventSubscribeFunction(a *EventAdapter, ev event.NoArgEvent, eventType string, transformArgFn func(*goja.Runtime) *goja.Object) func() {
	return ev.SubscribeUsingCallback(event.BufferAll, func() {
		var listeners []eventListener
		func() {
			a.mu.RLock()
			defer a.mu.RUnlock()
			listeners = append(listeners, a.knownEvents[eventType].listeners...)
		}()

		for _, listener := range listeners {
			listenerCopy := listener
			a.appContext.Schedule(func(vm *goja.Runtime) error {
				result := vm.NewObject()
				if transformArgFn != nil {
					r := transformArgFn(vm)
					if r != nil {
						result = r
					}
				}
				result.Set("type", eventType)
				_, err := listenerCopy.callable(vm.ToValue(a.this), result)
				return err
			})
		}
	})
}
