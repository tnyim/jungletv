package chat

import (
	"context"
	"fmt"
	"sync"

	"github.com/bwmarrin/snowflake"
	"github.com/dop251/goja"
	"github.com/dop251/goja_nodejs/require"
	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/server/components/apprunner/modules"
	"github.com/tnyim/jungletv/server/components/chatmanager"
	"github.com/tnyim/jungletv/utils/event"
	"golang.org/x/exp/slices"
)

// ModuleName is the name by which this module can be require()d in a script
const ModuleName = "jungletv:chat"

type chatModule struct {
	runtime     *goja.Runtime
	exports     *goja.Object
	chatManager *chatmanager.Manager
	schedule    modules.ScheduleFunction
	this        struct{}
	doneCh      chan struct{}

	executionContext context.Context
	listeners        map[string][]eventListener
	mu               sync.RWMutex
}

type eventListener struct {
	value    goja.Value
	callable goja.Callable
}

// New returns a new chat module
func New(chatManager *chatmanager.Manager, schedule modules.ScheduleFunction) modules.NativeModule {
	return &chatModule{
		chatManager: chatManager,
		schedule:    schedule,
		doneCh:      make(chan struct{}),
		listeners:   make(map[string][]eventListener),
	}
}

func (m *chatModule) ModuleLoader() require.ModuleLoader {
	return func(runtime *goja.Runtime, module *goja.Object) {
		m.runtime = runtime
		m.exports = module.Get("exports").(*goja.Object)
		m.exports.Set("addEventListener", m.addEventListener)
		m.exports.Set("removeEventListener", m.removeEventListener)
		m.exports.Set("createSystemMessage", m.createSystemMessage)
	}
}
func (m *chatModule) ModuleName() string {
	return ModuleName
}
func (m *chatModule) AutoRequire() (bool, string) {
	return false, ""
}

func adaptEvent[T any](m *chatModule, ev event.Event[T], eventType string, transformArgFn func(*goja.Runtime, T) goja.Value) func() {
	return ev.SubscribeUsingCallback(event.BufferFirst, func(arg T) {
		m.mu.RLock()
		defer m.mu.RUnlock()

		for _, listener := range m.listeners[eventType] {
			m.schedule(func(vm *goja.Runtime) error {
				_, err := listener.callable(vm.ToValue(m.this), transformArgFn(vm, arg))
				return err
			})
		}
	})
}

func adaptNoArgEvent(m *chatModule, ev event.NoArgEvent, eventType string, transformArgFn func(*goja.Runtime) goja.Value) func() {
	return ev.SubscribeUsingCallback(event.BufferFirst, func() {
		m.mu.RLock()
		defer m.mu.RUnlock()

		for _, listener := range m.listeners[eventType] {
			m.schedule(func(vm *goja.Runtime) error {
				_, err := listener.callable(vm.ToValue(m.this), transformArgFn(vm))
				return err
			})
		}
	})
}

var knownEvents = []string{"chatenabled", "chatdisabled", "messagecreated", "messagedeleted"}

func (m *chatModule) ExecutionResumed(ctx context.Context) {
	m.executionContext = ctx
	go func() {
		defer adaptNoArgEvent(m, m.chatManager.OnChatEnabled(), "chatenabled", func(vm *goja.Runtime) goja.Value {
			return vm.ToValue(map[string]interface{}{
				"type": "chatenabled",
			})
		})()
		defer adaptEvent(m, m.chatManager.OnChatDisabled(), "chatdisabled", func(vm *goja.Runtime, arg chatmanager.DisabledReason) goja.Value {
			return vm.ToValue(map[string]interface{}{
				"type":    "chatdisabled",
				"message": arg.SerializeForAPI(),
			})
		})()
		defer adaptEvent(m, m.chatManager.OnMessageCreated(), "messagecreated", func(vm *goja.Runtime, arg chatmanager.MessageCreatedEventArgs) goja.Value {
			return vm.ToValue(map[string]interface{}{
				"type":    "messagecreated",
				"message": arg.Message.SerializeForJS(ctx),
			})
		})()
		defer adaptEvent(m, m.chatManager.OnMessageDeleted(), "messagedeleted", func(vm *goja.Runtime, arg snowflake.ID) goja.Value {
			return vm.ToValue(map[string]interface{}{
				"type":      "messagedeleted",
				"messageID": arg.String(),
			})
		})()

		<-m.doneCh
	}()
}

func (m *chatModule) ExecutionPaused() {
	m.executionContext = nil
	m.doneCh <- struct{}{}
}

func (m *chatModule) addEventListener(call goja.FunctionCall) goja.Value {
	if len(call.Arguments) < 2 {
		return m.runtime.NewTypeError("Missing argument")
	}
	eventValue := call.Argument(0)
	listenerValue := call.Argument(1)

	callback, ok := goja.AssertFunction(listenerValue)
	if !ok {
		return m.runtime.NewTypeError("Invalid callback specified as second argument")
	}

	event := eventValue.String()

	if !slices.Contains(knownEvents, event) {
		return m.runtime.NewTypeError(fmt.Sprintf("Unknown event %s", event))
	}

	m.mu.Lock()
	defer m.mu.Unlock()
	m.listeners[event] = append(m.listeners[event], eventListener{
		value:    listenerValue,
		callable: callback,
	})

	return goja.Undefined()
}

func (m *chatModule) removeEventListener(call goja.FunctionCall) goja.Value {
	if len(call.Arguments) < 2 {
		return m.runtime.NewTypeError("Missing argument")
	}
	eventValue := call.Argument(0)
	listenerValue := call.Argument(1)

	event := eventValue.String()

	if !slices.Contains(knownEvents, event) {
		return m.runtime.NewTypeError(fmt.Sprintf("Unknown event %s", event))
	}

	m.mu.Lock()
	defer m.mu.Unlock()
	for i, listener := range m.listeners[event] {
		if listener.value.SameAs(listenerValue) {
			m.listeners[event] = slices.Delete(m.listeners[event], i, i+1)
			break
		}
	}

	return goja.Undefined()
}

func (m *chatModule) createSystemMessage(call goja.FunctionCall) goja.Value {
	if len(call.Arguments) < 1 {
		return m.runtime.NewTypeError("Missing argument")
	}
	contentValue := call.Argument(0)

	message, err := m.chatManager.CreateSystemMessage(m.executionContext, contentValue.String())
	if err != nil {
		return m.runtime.NewGoError(stacktrace.Propagate(err, ""))
	}

	return m.runtime.ToValue(message.SerializeForJS(m.executionContext))
}
