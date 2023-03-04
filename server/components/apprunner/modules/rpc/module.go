package rpc

import (
	"context"

	"github.com/dop251/goja"
	"github.com/dop251/goja_nodejs/require"
	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/server/auth"
	"github.com/tnyim/jungletv/server/components/apprunner/modules"
	"github.com/tnyim/jungletv/utils/event"
	"golang.org/x/exp/slices"
)

// ModuleName is the name by which this module can be require()d in a script
const ModuleName = "jungletv:rpc"

// RPCModule manages client-initiated RPC for an application
type RPCModule interface {
	modules.NativeModule
	// HandleInvocation must be called inside the event loop
	HandleInvocation(vm *goja.Runtime, user auth.User, pageID, method string, args []string) goja.Value
	// HandleEvent must be called inside the event loop
	HandleEvent(vm *goja.Runtime, user auth.User, pageID, event string, args []string)

	GlobalEventEmitted() event.Event[ClientEventData]
	PageEventEmitted() event.Keyed[string, ClientEventData]
	UserEventEmitted() event.Keyed[string, ClientEventData]
	PageUserEventEmitted() event.Keyed[PageUserTuple, ClientEventData]
}

type PageUserTuple struct {
	Page string
	User string
}

type ClientEventData struct {
	EventName string
	EventArgs []string
}

type rpcModule struct {
	runtime          *goja.Runtime
	exports          *goja.Object
	handlers         map[string]handler
	eventListeners   map[string][]eventListener
	jsonUnmarshaller goja.Callable
	jsonMarshaller   goja.Callable

	onGlobalEvent   event.Event[ClientEventData]
	onPageEvent     event.Keyed[string, ClientEventData]
	onUserEvent     event.Keyed[string, ClientEventData]
	onPageUserEvent event.Keyed[PageUserTuple, ClientEventData]
}

type handler struct {
	callable           goja.Callable
	minPermissionLevel auth.PermissionLevel
}

type eventListener struct {
	value    goja.Value
	callable goja.Callable
}

// New returns a new pages module
func New() RPCModule {
	return &rpcModule{
		handlers:       make(map[string]handler),
		eventListeners: make(map[string][]eventListener),

		onGlobalEvent:   event.New[ClientEventData](),
		onPageEvent:     event.NewKeyed[string, ClientEventData](),
		onUserEvent:     event.NewKeyed[string, ClientEventData](),
		onPageUserEvent: event.NewKeyed[PageUserTuple, ClientEventData](),
	}
}

func (m *rpcModule) ModuleLoader() require.ModuleLoader {
	return func(runtime *goja.Runtime, module *goja.Object) {
		m.runtime = runtime
		m.exports = module.Get("exports").(*goja.Object)
		m.exports.Set("setMethodHandler", m.setMethodHandler)
		m.exports.Set("removeMethodHandler", m.removeMethodHandler)
		m.exports.Set("addEventListener", m.addEventListener)
		m.exports.Set("removeEventListener", m.removeEventListener)
		m.exports.Set("emitToAll", m.emitToAll)
		m.exports.Set("emitToPage", m.emitToPage)
		m.exports.Set("emitToUser", m.emitToUser)
		m.exports.Set("emitToPageUser", m.emitToPageUser)

		unmarshallerValue, err := runtime.RunString(`(arg) => JSON.parse(arg, (key, value) => key === "__proto__" ? undefined : value)`)
		if err != nil {
			panic(stacktrace.Propagate(err, ""))
		}

		var ok bool
		m.jsonUnmarshaller, ok = goja.AssertFunction(unmarshallerValue)
		if !ok {
			panic("could not assert argument unmarshaller function")
		}

		marshallerValue, err := runtime.RunString(`JSON.stringify`)
		if err != nil {
			panic(stacktrace.Propagate(err, ""))
		}

		m.jsonMarshaller, ok = goja.AssertFunction(marshallerValue)
		if !ok {
			panic("could not assert return value marshaller function")
		}
	}
}
func (m *rpcModule) ModuleName() string {
	return ModuleName
}
func (m *rpcModule) AutoRequire() (bool, string) {
	return false, ""
}
func (m *rpcModule) ExecutionResumed(ctx context.Context) {}
func (m *rpcModule) ExecutionPaused()                     {}

// to be called inside the loop
func (m *rpcModule) HandleInvocation(vm *goja.Runtime, user auth.User, pageID, method string, args []string) goja.Value {
	// no need to sync access to m.handlers as it can only be accessed inside the loop
	h, ok := m.handlers[method]
	if !ok {
		panic(vm.NewTypeError("Unknown method"))
	}

	if auth.PermissionLevelOrder[h.minPermissionLevel] > auth.PermissionLevelOrder[user.PermissionLevel()] {
		panic(vm.NewTypeError("Insufficient permissions"))
	}

	callContext := map[string]interface{}{
		"page":   pageID,
		"sender": goja.Undefined(),
	}
	if user != nil && !user.IsUnknown() {
		callContext["sender"] = map[string]interface{}{
			"address":         user.Address(),
			"nickname":        user.Nickname(),
			"permissionLevel": user.PermissionLevel(),
		}
	}

	// unmarshal args
	callableArgs := make([]goja.Value, len(args)+1)
	callableArgs[0] = vm.ToValue(callContext)
	for i, arg := range args {
		var err error
		callableArgs[i+1], err = m.jsonUnmarshaller(goja.Undefined(), vm.ToValue(arg))
		if err != nil {
			panic(err)
		}
	}

	result, err := h.callable(goja.Undefined(), callableArgs...)
	if err != nil {
		panic(err)
	}

	resultJSON, err := m.jsonMarshaller(goja.Undefined(), result)
	if err != nil {
		panic(err)
	}

	return resultJSON
}

// to be called inside the loop
func (m *rpcModule) HandleEvent(vm *goja.Runtime, user auth.User, pageID, event string, args []string) {
	// no need to sync access to m.eventListeners as it can only be accessed inside the loop
	handlers := m.eventListeners[event]

	for _, h := range handlers {
		eventContext := map[string]interface{}{
			"page":   pageID,
			"sender": goja.Undefined(),
		}
		if user != nil && !user.IsUnknown() {
			eventContext["sender"] = map[string]interface{}{
				"address":         user.Address(),
				"nickname":        user.Nickname(),
				"permissionLevel": user.PermissionLevel(),
			}
		}

		// unmarshal args
		callableArgs := make([]goja.Value, len(args)+1)
		callableArgs[0] = vm.ToValue(eventContext)
		for i, arg := range args {
			var err error
			callableArgs[i+1], err = m.jsonUnmarshaller(goja.Undefined(), vm.ToValue(arg))
			if err != nil {
				panic(err)
			}
		}

		_, _ = h.callable(goja.Undefined(), callableArgs...)
	}
}

func (m *rpcModule) setMethodHandler(call goja.FunctionCall) goja.Value {
	if len(call.Arguments) < 3 {
		panic(m.runtime.NewTypeError("Missing argument"))
	}

	methodName := call.Argument(0).String()
	minPermissionLevel, err := auth.ParsePermissionLevel(call.Argument(1).String())
	if err != nil {
		panic(m.runtime.NewTypeError("Invalid permission level specified as second argument"))
	}
	callable, ok := goja.AssertFunction(call.Argument(2))
	if !ok {
		panic(m.runtime.NewTypeError("Invalid callback specified as third argument"))
	}

	// no need to sync access to m.handlers as it can only be accessed inside the loop
	m.handlers[methodName] = handler{
		callable:           callable,
		minPermissionLevel: minPermissionLevel,
	}

	return goja.Undefined()
}

func (m *rpcModule) removeMethodHandler(call goja.FunctionCall) goja.Value {
	if len(call.Arguments) < 1 {
		panic(m.runtime.NewTypeError("Missing argument"))
	}

	// no need to sync access to m.handlers as it can only be accessed inside the loop
	delete(m.handlers, call.Argument(0).String())

	return goja.Undefined()
}

func (m *rpcModule) addEventListener(call goja.FunctionCall) goja.Value {
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

	m.eventListeners[event] = append(m.eventListeners[event], eventListener{
		value:    listenerValue,
		callable: callback,
	})
	return goja.Undefined()

}

func (m *rpcModule) removeEventListener(call goja.FunctionCall) goja.Value {
	if len(call.Arguments) < 2 {
		panic(m.runtime.NewTypeError("Missing argument"))
	}
	eventValue := call.Argument(0)
	listenerValue := call.Argument(1)

	event := eventValue.String()

	// no need to sync access to m.eventListeners as it can only be accessed inside the loop
	for i, listener := range m.eventListeners[event] {
		if listener.value.SameAs(listenerValue) {
			m.eventListeners[event] = slices.Delete(m.eventListeners[event], i, i+1)
			break
		}
	}
	return goja.Undefined()
}

func (m *rpcModule) buildEventData(call goja.FunctionCall, argOffset int) ClientEventData {
	data := ClientEventData{
		EventName: call.Argument(argOffset).String(),
		EventArgs: make([]string, len(call.Arguments)-1-argOffset),
	}

	for i, arg := range call.Arguments[argOffset+1:] {
		v, err := m.jsonMarshaller(goja.Undefined(), arg)
		if err != nil {
			panic(err)
		}
		data.EventArgs[i] = v.String()
	}
	return data
}

func (m *rpcModule) emitToAll(call goja.FunctionCall) goja.Value {
	if len(call.Arguments) < 1 {
		panic(m.runtime.NewTypeError("Missing argument"))
	}

	m.onGlobalEvent.Notify(m.buildEventData(call, 0), false)
	return goja.Undefined()
}

func (m *rpcModule) emitToPage(call goja.FunctionCall) goja.Value {
	if len(call.Arguments) < 2 {
		panic(m.runtime.NewTypeError("Missing argument"))
	}

	pageID := call.Argument(1).String()
	m.onPageEvent.Notify(pageID, m.buildEventData(call, 1), false)
	return goja.Undefined()
}

func (m *rpcModule) emitToUser(call goja.FunctionCall) goja.Value {
	if len(call.Arguments) < 2 {
		panic(m.runtime.NewTypeError("Missing argument"))
	}

	userValue := call.Argument(1)
	user := ""
	// make it so that passing null or undefined actually targets unauthenticated users
	if !goja.IsUndefined(userValue) && !goja.IsNull(userValue) {
		user = userValue.String()
	}

	m.onUserEvent.Notify(user, m.buildEventData(call, 1), false)
	return goja.Undefined()
}

func (m *rpcModule) emitToPageUser(call goja.FunctionCall) goja.Value {
	if len(call.Arguments) < 3 {
		panic(m.runtime.NewTypeError("Missing argument"))
	}

	pageID := call.Argument(1).String()
	userValue := call.Argument(2)
	user := ""
	// make it so that passing null or undefined actually targets unauthenticated users
	if !goja.IsUndefined(userValue) && !goja.IsNull(userValue) {
		user = userValue.String()
	}

	m.onPageUserEvent.Notify(
		PageUserTuple{Page: pageID, User: user},
		m.buildEventData(call, 2),
		false)
	return goja.Undefined()
}

func (m *rpcModule) GlobalEventEmitted() event.Event[ClientEventData] {
	return m.onGlobalEvent
}

func (m *rpcModule) PageEventEmitted() event.Keyed[string, ClientEventData] {
	return m.onPageEvent
}

func (m *rpcModule) UserEventEmitted() event.Keyed[string, ClientEventData] {
	return m.onUserEvent
}

func (m *rpcModule) PageUserEventEmitted() event.Keyed[PageUserTuple, ClientEventData] {
	return m.onPageUserEvent
}
