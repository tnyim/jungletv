package ipc

import (
	"context"
	"sync"

	"github.com/dop251/goja"
	"github.com/dop251/goja_nodejs/require"
	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/server/components/apprunner/modules"
	"golang.org/x/exp/slices"
)

// ModuleName is the name by which this module can be require()d in a script
const ModuleName = "jungletv:ipc"

// IPCModule manages communication between an application instance and other application instances
type IPCModule interface {
	modules.NativeModule
	// HandleMessage must be called inside the event loop
	HandleMessage(vm *goja.Runtime, sourceApplicationID string, serializedMessage string)
}

// MessageSender sends messages to other application instances
type MessageSender interface {
	SendMessageToApplication(applicationID string, serializedMessage string) error
}

type ipcModule struct {
	runtime          *goja.Runtime
	exports          *goja.Object
	eventListeners   map[string][]eventListener
	messageSender    MessageSender
	jsonUnmarshaller goja.Callable
	jsonMarshaller   goja.Callable
}

type eventListener struct {
	value    goja.Value
	callable goja.Callable
}

// New returns a new RPC module
func New(messageSender MessageSender) IPCModule {
	return &ipcModule{
		eventListeners: make(map[string][]eventListener),
		messageSender:  messageSender,
	}
}

func (m *ipcModule) IsNodeBuiltin() bool {
	return false
}

func (m *ipcModule) ModuleLoader() require.ModuleLoader {
	return func(runtime *goja.Runtime, module *goja.Object) {
		m.runtime = runtime
		m.exports = module.Get("exports").(*goja.Object)
		m.exports.Set("addEventListener", m.addEventListener)
		m.exports.Set("removeEventListener", m.removeEventListener)
		m.exports.Set("emitToApplication", m.emitToApplication)

		unmarshallerValue, err := runtime.RunString(`(arg) => JSON.parse(arg, (key, value) => key === "__proto__" ? undefined : value)`)
		if err != nil {
			panic(stacktrace.Propagate(err, ""))
		}

		var ok bool
		m.jsonUnmarshaller, ok = goja.AssertFunction(unmarshallerValue)
		if !ok {
			panic("could not assert message unmarshaller function")
		}

		json := runtime.Get("JSON").(*goja.Object)
		m.jsonMarshaller, ok = goja.AssertFunction(json.Get("stringify"))
		if !ok {
			panic("could not assert message marshaller function")
		}
	}
}
func (m *ipcModule) ModuleName() string {
	return ModuleName
}
func (m *ipcModule) AutoRequire() (bool, string) {
	return false, ""
}
func (m *ipcModule) ExecutionResumed(ctx context.Context, _ *sync.WaitGroup, runtime *goja.Runtime) {
	m.runtime = runtime
}
func (m *ipcModule) ExecutionPaused() {}

var gojaUndefined = goja.Undefined()

// to be called inside the loop
func (m *ipcModule) HandleMessage(vm *goja.Runtime, sourceApplicationID string, serializedMessage string) {
	// no need to sync access to m.eventListeners as it can only be accessed inside the loop
	handlers := m.eventListeners["message"]

	if len(handlers) == 0 {
		return
	}

	data, err := m.jsonUnmarshaller(gojaUndefined, vm.ToValue(serializedMessage))
	if err != nil {
		panic(err)
	}
	for _, h := range handlers {
		eventContext := vm.NewObject()
		eventContext.Set("source", sourceApplicationID)
		eventContext.Set("data", data)
		_, _ = h.callable(gojaUndefined, eventContext)
	}
}

func (m *ipcModule) addEventListener(call goja.FunctionCall) goja.Value {
	if len(call.Arguments) < 2 {
		panic(m.runtime.NewTypeError("Missing argument"))
	}
	eventValue := call.Argument(0)
	listenerValue := call.Argument(1)

	callback, ok := goja.AssertFunction(listenerValue)
	if !ok {
		panic(m.runtime.NewTypeError("Invalid callback specified as second argument"))
	}

	event := eventValue.String()

	if event != "message" {
		panic(m.runtime.NewTypeError("Unknown event '%s'", event))
	}

	m.eventListeners[event] = append(m.eventListeners[event], eventListener{
		value:    listenerValue,
		callable: callback,
	})
	return gojaUndefined

}

func (m *ipcModule) removeEventListener(call goja.FunctionCall) goja.Value {
	if len(call.Arguments) < 2 {
		panic(m.runtime.NewTypeError("Missing argument"))
	}
	eventValue := call.Argument(0)
	listenerValue := call.Argument(1)

	event := eventValue.String()

	if event != "message" {
		panic(m.runtime.NewTypeError("Unknown event '%s'", event))
	}

	// no need to sync access to m.eventListeners as it can only be accessed inside the loop
	for i, listener := range m.eventListeners[event] {
		if listener.value.SameAs(listenerValue) {
			m.eventListeners[event] = slices.Delete(m.eventListeners[event], i, i+1)
			break
		}
	}
	return gojaUndefined
}

func (m *ipcModule) emitToApplication(call goja.FunctionCall) goja.Value {
	if len(call.Arguments) < 2 {
		panic(m.runtime.NewTypeError("Missing argument"))
	}

	applicationID := call.Argument(0).String()

	data, err := m.jsonMarshaller(gojaUndefined, call.Argument(1))
	if err != nil {
		panic(err)
	}

	serializedMessage := data.String()
	// this ignores any errors
	go m.messageSender.SendMessageToApplication(applicationID, serializedMessage)

	return gojaUndefined
}
