package event

import (
	"errors"
	"reflect"
	"sync"
)

// Event is an event including dispatching mechanism
type Event struct {
	mu                        sync.RWMutex
	subs                      []subscription
	closed                    bool
	pendingNotification       bool
	pendingNotificationParams []interface{}
}

type subscription struct {
	ch       chan []interface{}
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
func New() *Event {
	e := &Event{}
	return e
}

// Subscribe returns a channel that will receive notification events.
func (e *Event) Subscribe(guaranteeType GuaranteeType) <-chan []interface{} {
	e.mu.Lock()
	defer e.mu.Unlock()

	var s subscription
	switch guaranteeType {
	case AtMostOnceGuarantee:
		s = subscription{
			ch:       make(chan []interface{}),
			blocking: false,
		}
	case AtLeastOnceGuarantee:
		s = subscription{
			ch:       make(chan []interface{}, 1),
			blocking: false,
		}
	case ExactlyOnceGuarantee:
		s = subscription{
			ch:       make(chan []interface{}),
			blocking: true,
		}
	default:
		panic("invalid guarantee type")
	}

	e.subs = append(e.subs, s)
	if e.pendingNotification {
		e.notifyNowWithinMutex(e.pendingNotificationParams...)
		e.pendingNotification = false
		e.pendingNotificationParams = []interface{}{}
	}
	return s.ch
}

// SubscribeUsingCallback subscribes to an event by calling the provided function with the arguments passed on Notify
// The only type checking is performed at runtime when the event is fired, so be careful
// The returned function should be called when one wishes to unsubscribe
func (e *Event) SubscribeUsingCallback(guaranteeType GuaranteeType, cbFunction interface{}) func() {
	ch := e.Subscribe(guaranteeType)
	go func() {
		for {
			params, ok := <-ch
			if !ok {
				return
			}
			err := call(cbFunction, params...)
			if err != nil {
				panic(err)
			}
		}
	}()
	return func() {
		// this will close ch and cause the goroutine above to return
		e.Unsubscribe(ch)
	}
}

// Unsubscribe removes the provided channel from the list of subscriptions, i.e. the channel will no longer be notified.
// It also closes the channel.
func (e *Event) Unsubscribe(ch <-chan []interface{}) {
	e.mu.Lock()
	defer e.mu.Unlock()

	for i := range e.subs {
		if e.subs[i].ch == ch {
			close(e.subs[i].ch)
			e.subs[i] = e.subs[len(e.subs)-1]
			e.subs = e.subs[:len(e.subs)-1]
			return
		}
	}
}

// Notify notifies subscribers that the event has occurred
func (e *Event) Notify(params ...interface{}) {
	e.mu.RLock()
	defer e.mu.RUnlock()

	if e.closed {
		return
	}

	if len(e.subs) > 0 {
		e.notifyNowWithinMutex(params...)
	} else {
		e.pendingNotification = true
		e.pendingNotificationParams = params
	}
}

func (e *Event) notifyNowWithinMutex(params ...interface{}) {
	for _, sub := range e.subs {
		if sub.blocking {
			go func(sch chan []interface{}) {
				sch <- params
			}(sub.ch)
		} else {
			select {
			case sub.ch <- params:
			default:
			}
		}
	}
}

// Close notifies subscribers that no more events will be sent
func (e *Event) Close() {
	e.mu.Lock()
	defer e.mu.Unlock()

	if !e.closed {
		e.closed = true
		for _, sub := range e.subs {
			close(sub.ch)
		}
	}
}

func call(fn interface{}, params ...interface{}) error {
	var (
		f     = reflect.ValueOf(fn)
		t     = f.Type()
		numIn = t.NumIn()
		in    = make([]reflect.Value, 0, numIn)
	)

	if t.IsVariadic() {
		n := numIn - 1
		if len(params) < n {
			return errors.New("parameters mismatched")
		}
		for _, param := range params[:n] {
			in = append(in, reflect.ValueOf(param))
		}
		s := reflect.MakeSlice(t.In(n), 0, len(params[n:]))
		for _, param := range params[n:] {
			s = reflect.Append(s, reflect.ValueOf(param))
		}
		in = append(in, s)

		f.CallSlice(in)

		return nil
	}

	if len(params) != numIn {
		return errors.New("parameters mismatched")
	}
	for _, param := range params {
		in = append(in, reflect.ValueOf(param))
	}

	f.Call(in)
	return nil
}
