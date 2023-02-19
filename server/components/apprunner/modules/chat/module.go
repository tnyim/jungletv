package chat

import (
	"context"
	"fmt"
	"sync"

	"github.com/dop251/goja"
	"github.com/dop251/goja_nodejs/require"
	"github.com/tnyim/jungletv/server/components/apprunner/modules"
	"github.com/tnyim/jungletv/server/components/chatmanager"
	"github.com/tnyim/jungletv/utils/event"
	"golang.org/x/exp/slices"
)

// ModuleName is the name by which this module can be require()d in a script
const ModuleName = "jungletv:chat"

var knownEvents = []string{"messagecreated"}

type chatModule struct {
	runtime     *goja.Runtime
	exports     *goja.Object
	chatManager *chatmanager.Manager
	schedule    modules.ScheduleFunction
	this        struct{}
	doneCh      chan struct{}

	listeners map[string][]goja.Callable
	mu        sync.RWMutex
}

// New returns a new chat module
func New(chatManager *chatmanager.Manager, schedule modules.ScheduleFunction) modules.NativeModule {
	return &chatModule{
		chatManager: chatManager,
		schedule:    schedule,
		doneCh:      make(chan struct{}),
		listeners:   make(map[string][]goja.Callable),
	}
}

func (m *chatModule) ModuleLoader() require.ModuleLoader {
	return func(runtime *goja.Runtime, module *goja.Object) {
		m.runtime = runtime
		m.exports = module.Get("exports").(*goja.Object)
		m.exports.Set("addEventListener", m.addEventListener)
	}
}
func (m *chatModule) ModuleName() string {
	return ModuleName
}
func (m *chatModule) AutoRequire() (bool, string) {
	return false, ""
}

func (m *chatModule) ExecutionResumed(ctx context.Context) {
	go func() {
		defer m.chatManager.OnMessageCreated().SubscribeUsingCallback(event.AtLeastOnceGuarantee, func(arg chatmanager.MessageCreatedEventArgs) {
			m.mu.RLock()
			defer m.mu.RUnlock()

			for _, listener := range m.listeners["messagecreated"] {
				m.schedule(func(vm *goja.Runtime) error {
					_, err := listener(vm.ToValue(m.this), vm.ToValue(map[string]interface{}{
						"type":    "messagecreated",
						"message": arg.Message,
					}))
					return err
				})
			}
		})()

		<-m.doneCh
	}()
}

func (m *chatModule) ExecutionPaused() {
	m.doneCh <- struct{}{}
}

func (m *chatModule) addEventListener(call goja.FunctionCall) goja.Value {
	eventValue := call.Argument(0)
	if goja.IsUndefined(eventValue) {
		return m.runtime.NewTypeError("Missing argument")
	}
	listenerValue := call.Argument(1)
	if goja.IsUndefined(listenerValue) {
		return m.runtime.NewTypeError("Missing argument")
	}

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
	m.listeners[event] = append(m.listeners[event], callback)

	return nil
}
