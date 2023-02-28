package gojautil

import (
	"sync"

	"github.com/dop251/goja"
	"github.com/tnyim/jungletv/utils/event"
	"golang.org/x/exp/maps"
	"golang.org/x/exp/slices"
)

// EventAdapter adapts a series of event.Event to events that can be used in goja scripts
type EventAdapter struct {
	runtime     *goja.Runtime
	schedule    ScheduleFunction
	this        struct{}
	unsubCh     chan bool
	mu          sync.RWMutex
	knownEvents map[string]*knownEvent
}

// NewEventAdapter returns a new EventAdapter
func NewEventAdapter(runtime *goja.Runtime, schedule ScheduleFunction) *EventAdapter {
	return &EventAdapter{
		runtime:     runtime,
		schedule:    schedule,
		this:        struct{}{},
		unsubCh:     make(chan bool),
		knownEvents: make(map[string]*knownEvent),
	}
}

type knownEvent struct {
	subscribeFn func() func()
	listeners   []eventListener
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
				break
			}
		}

		return goja.Undefined()
	}
	panic(a.runtime.NewTypeError("Unknown event '%s'", event))
}

// StartOrResume should be called when the owner module is imported AND when execution resumes with a different context
func (a *EventAdapter) StartOrResume() {
	go func() {
		for {
			breakLoop := false
			func() {
				a.mu.Lock()
				events := maps.Values(a.knownEvents)
				a.mu.Unlock()
				for _, e := range events {
					defer e.subscribeFn()()
				}

				breakLoop = <-a.unsubCh
			}()

			if breakLoop {
				return
			}
		}
	}()
}

// Pause should be called when the execution context terminates
func (a *EventAdapter) Pause() {
	a.unsubCh <- true
}

// AdaptEvent sets an EventAdapter to adapt an event.Event, exposing an event of type `eventType` to the scripting runtime
func AdaptEvent[T any](a *EventAdapter, ev event.Event[T], eventType string, transformArgFn func(*goja.Runtime, T) map[string]interface{}) {
	a.mu.Lock()
	defer a.mu.Unlock()

	if _, ok := a.knownEvents[eventType]; ok {
		panic("event already adapted")
	}

	a.knownEvents[eventType] = &knownEvent{
		subscribeFn: func() func() { return eventSubscribeFunction(a, ev, eventType, transformArgFn) },
	}
	select {
	case a.unsubCh <- false:
	default:
	}
}

// AdaptEvent sets an EventAdapter to adapt an event.NoArgEvent, exposing an event of type `eventType` to the scripting runtime
func AdaptNoArgEvent(a *EventAdapter, ev event.NoArgEvent, eventType string, transformArgFn func(*goja.Runtime) map[string]interface{}) {
	a.mu.Lock()
	defer a.mu.Unlock()

	if _, ok := a.knownEvents[eventType]; ok {
		panic("event already adapted")
	}

	a.knownEvents[eventType] = &knownEvent{
		subscribeFn: func() func() { return noArgEventSubscribeFunction(a, ev, eventType, transformArgFn) },
	}
	select {
	case a.unsubCh <- false:
	default:
	}
}

func eventSubscribeFunction[T any](a *EventAdapter, ev event.Event[T], eventType string, transformArgFn func(*goja.Runtime, T) map[string]interface{}) func() {
	return ev.SubscribeUsingCallback(event.BufferFirst, func(arg T) {
		var listeners []eventListener
		func() {
			a.mu.RLock()
			defer a.mu.RUnlock()
			listeners = append(listeners, a.knownEvents[eventType].listeners...)
		}()

		for _, listener := range listeners {
			listenerCopy := listener
			a.schedule(func(vm *goja.Runtime) error {
				result := map[string]interface{}{}
				if transformArgFn != nil {
					r := transformArgFn(vm, arg)
					if r != nil {
						result = r
					}
				}
				result["type"] = eventType
				_, err := listenerCopy.callable(vm.ToValue(a.this), vm.ToValue(result))
				return err
			})
		}
	})
}

func noArgEventSubscribeFunction(a *EventAdapter, ev event.NoArgEvent, eventType string, transformArgFn func(*goja.Runtime) map[string]interface{}) func() {
	return ev.SubscribeUsingCallback(event.BufferFirst, func() {
		var listeners []eventListener
		func() {
			a.mu.RLock()
			defer a.mu.RUnlock()
			listeners = append(listeners, a.knownEvents[eventType].listeners...)
		}()

		for _, listener := range listeners {
			listenerCopy := listener
			a.schedule(func(vm *goja.Runtime) error {
				result := map[string]interface{}{}
				if transformArgFn != nil {
					r := transformArgFn(vm)
					if r != nil {
						result = r
					}
				}
				result["type"] = eventType
				_, err := listenerCopy.callable(vm.ToValue(a.this), vm.ToValue(result))
				return err
			})
		}
	})
}
