package rpc

import (
	"context"

	"github.com/dop251/goja"
	"github.com/dop251/goja_nodejs/require"
	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/server/auth"
	"github.com/tnyim/jungletv/server/components/apprunner/gojautil"
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
	// returns either a goja.Value (if the method handler is synchronous) or a channel where a goja.Value will later be sent (if the method handler returns a Promise)
	HandleInvocation(vm *goja.Runtime, user auth.User, pageID, method string, args []string) InvocationResult
	// HandleEvent must be called inside the event loop
	HandleEvent(vm *goja.Runtime, user auth.User, trusted bool, pageID, event string, args []string)

	GlobalEventEmitted() event.Event[ClientEventData]
	PageEventEmitted() event.Keyed[string, ClientEventData]
	UserEventEmitted() event.Keyed[string, ClientEventData]
	PageUserEventEmitted() event.Keyed[PageUserTuple, ClientEventData]
}

type InvocationResult struct {
	Synchronous bool
	Value       string // if synchronous
	AsyncResult <-chan PromiseResult
}

type PromiseResult struct {
	Rejected       bool
	Value          goja.Value
	JSONMarshaller goja.Callable
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

	userSerializer gojautil.UserSerializer

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

// New returns a new RPC module
func New(userSerializer gojautil.UserSerializer) RPCModule {
	return &rpcModule{
		handlers:       make(map[string]handler),
		eventListeners: make(map[string][]eventListener),

		userSerializer: userSerializer,

		onGlobalEvent:   event.New[ClientEventData](),
		onPageEvent:     event.NewKeyed[string, ClientEventData](),
		onUserEvent:     event.NewKeyed[string, ClientEventData](),
		onPageUserEvent: event.NewKeyed[PageUserTuple, ClientEventData](),
	}
}

func (m *rpcModule) IsNodeBuiltin() bool {
	return false
}

func (m *rpcModule) ModuleLoader() require.ModuleLoader {
	return func(runtime *goja.Runtime, module *goja.Object) {
		m.runtime = runtime
		m.exports = module.Get("exports").(*goja.Object)
		m.exports.Set("registerMethod", m.registerMethod)
		m.exports.Set("unregisterMethod", m.unregisterMethod)
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

		json := runtime.Get("JSON").(*goja.Object)
		m.jsonMarshaller, ok = goja.AssertFunction(json.Get("stringify"))
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
func (m *rpcModule) ExecutionResumed(_ context.Context) {}

var gojaUndefined = goja.Undefined()

// to be called inside the loop
func (m *rpcModule) HandleInvocation(vm *goja.Runtime, user auth.User, pageID, method string, args []string) InvocationResult {
	// no need to sync access to m.handlers as it can only be accessed inside the loop
	h, ok := m.handlers[method]
	if !ok {
		panic(vm.NewTypeError("Unknown method"))
	}

	if !auth.UserPermissionLevelIsAtLeast(user, h.minPermissionLevel) {
		panic(vm.NewTypeError("Insufficient permissions"))
	}

	callContext := vm.NewObject()
	callContext.Set("page", pageID)
	callContext.Set("trusted", false)
	callContext.DefineAccessorProperty("sender", m.userSerializer.BuildUserGetter(vm, user), nil, goja.FLAG_FALSE, goja.FLAG_TRUE)

	// unmarshal args
	callableArgs := make([]goja.Value, len(args)+1)
	callableArgs[0] = callContext
	for i, arg := range args {
		var err error
		callableArgs[i+1], err = m.jsonUnmarshaller(gojaUndefined, vm.ToValue(arg))
		if err != nil {
			panic(err)
		}
	}

	result, err := h.callable(gojaUndefined, callableArgs...)
	if err != nil {
		panic(err)
	}

	gojaPromise, ok := result.Export().(*goja.Promise)
	if !ok {
		resultJSON, err := m.jsonMarshaller(gojaUndefined, result)
		if err != nil {
			panic(err)
		}

		return InvocationResult{
			Synchronous: true,
			Value:       resultJSON.String(),
		}
	}

	promiseObject := result.ToObject(vm)

	// await for resolution in a separate goroutine and return the value in a channel
	resultChan := make(chan PromiseResult, 1)
	// set up an empty catch function so we don't fall into the "Uncaught (in promise)" log message from our promise rejection tracker
	// since we pass the exception to the client and through the appbridge, the "Uncaughtness" is up to the client side to decide
	catch, ok := goja.AssertFunction(promiseObject.Get("catch"))
	if !ok {
		panic("could not get catch method from Promise")
	}
	result, err = catch(result, vm.ToValue(func() {}))
	if err != nil {
		panic(err)
	}

	// and set up a finally function so we can return the result/exception to the client when the promise resolves
	// make sure this finally is chained on the catch above, otherwise parallel resolution shenanigans come into play, and we still get the "Uncaught" messsage
	// (explanation: https://stackoverflow.com/a/72302273)
	finally, ok := goja.AssertFunction(promiseObject.Get("finally"))
	if !ok {
		panic("could not get finally method from Promise")
	}
	finally(result, vm.ToValue(func() {
		resultChan <- PromiseResult{
			Rejected:       gojaPromise.State() != goja.PromiseStateFulfilled,
			Value:          gojaPromise.Result(),
			JSONMarshaller: m.jsonMarshaller,
		}
	}))

	return InvocationResult{
		Synchronous: false,
		AsyncResult: resultChan,
	}
}

// to be called inside the loop
func (m *rpcModule) HandleEvent(vm *goja.Runtime, user auth.User, trusted bool, pageID, event string, args []string) {
	// no need to sync access to m.eventListeners as it can only be accessed inside the loop
	handlers := m.eventListeners[event]

	for _, h := range handlers {
		eventContext := vm.NewObject()
		eventContext.Set("page", pageID)
		eventContext.Set("trusted", trusted)
		eventContext.DefineAccessorProperty("sender", m.userSerializer.BuildUserGetter(vm, user), nil, goja.FLAG_FALSE, goja.FLAG_TRUE)

		// unmarshal args
		callableArgs := make([]goja.Value, len(args)+1)
		callableArgs[0] = eventContext
		for i, arg := range args {
			var err error
			callableArgs[i+1], err = m.jsonUnmarshaller(gojaUndefined, vm.ToValue(arg))
			if err != nil {
				panic(err)
			}
		}

		_, _ = h.callable(gojaUndefined, callableArgs...)
	}
}

func (m *rpcModule) registerMethod(call goja.FunctionCall) goja.Value {
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

	return gojaUndefined
}

func (m *rpcModule) unregisterMethod(call goja.FunctionCall) goja.Value {
	if len(call.Arguments) < 1 {
		panic(m.runtime.NewTypeError("Missing argument"))
	}

	// no need to sync access to m.handlers as it can only be accessed inside the loop
	delete(m.handlers, call.Argument(0).String())

	return gojaUndefined
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
	return gojaUndefined

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
	return gojaUndefined
}

func (m *rpcModule) buildEventData(call goja.FunctionCall, argOffset int) ClientEventData {
	data := ClientEventData{
		EventName: call.Argument(argOffset).String(),
		EventArgs: make([]string, len(call.Arguments)-1-argOffset),
	}

	for i, arg := range call.Arguments[argOffset+1:] {
		v, err := m.jsonMarshaller(gojaUndefined, arg)
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
	return gojaUndefined
}

func (m *rpcModule) emitToPage(call goja.FunctionCall) goja.Value {
	if len(call.Arguments) < 2 {
		panic(m.runtime.NewTypeError("Missing argument"))
	}

	pageID := call.Argument(0).String()
	m.onPageEvent.Notify(pageID, m.buildEventData(call, 1), false)
	return gojaUndefined
}

func (m *rpcModule) emitToUser(call goja.FunctionCall) goja.Value {
	if len(call.Arguments) < 2 {
		panic(m.runtime.NewTypeError("Missing argument"))
	}

	userValue := call.Argument(0)
	user := ""
	// make it so that passing null or undefined actually targets unauthenticated users
	if !goja.IsUndefined(userValue) && !goja.IsNull(userValue) {
		user = userValue.String()
		gojautil.ValidateBananoAddress(m.runtime, user, "Invalid user address")
	}

	m.onUserEvent.Notify(user, m.buildEventData(call, 1), false)
	return gojaUndefined
}

func (m *rpcModule) emitToPageUser(call goja.FunctionCall) goja.Value {
	if len(call.Arguments) < 3 {
		panic(m.runtime.NewTypeError("Missing argument"))
	}

	pageID := call.Argument(0).String()
	userValue := call.Argument(1)
	user := ""
	// make it so that passing null or undefined actually targets unauthenticated users
	if !goja.IsUndefined(userValue) && !goja.IsNull(userValue) {
		user = userValue.String()
		gojautil.ValidateBananoAddress(m.runtime, user, "Invalid user address")
	}

	m.onPageUserEvent.Notify(
		PageUserTuple{Page: pageID, User: user},
		m.buildEventData(call, 2),
		false)
	return gojaUndefined
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
