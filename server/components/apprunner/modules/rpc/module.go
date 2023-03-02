package rpc

import (
	"context"
	"sync"

	"github.com/dop251/goja"
	"github.com/dop251/goja_nodejs/require"
	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/server/auth"
	"github.com/tnyim/jungletv/server/components/apprunner/modules"
)

// ModuleName is the name by which this module can be require()d in a script
const ModuleName = "jungletv:rpc"

// RPCModule manages client-initiated RPC for an application
type RPCModule interface {
	modules.NativeModule
	// HandleInvocation must be called inside the event loop
	HandleInvocation(vm *goja.Runtime, user auth.User, method string, args []string) goja.Value
}

type rpcModule struct {
	runtime          *goja.Runtime
	exports          *goja.Object
	handlers         map[string]handler
	argUnmarshaller  goja.Callable
	returnMarshaller goja.Callable
	mu               sync.RWMutex
}

type handler struct {
	callable           goja.Callable
	minPermissionLevel auth.PermissionLevel
}

// New returns a new pages module
func New() RPCModule {
	return &rpcModule{
		handlers: make(map[string]handler),
	}
}

func (m *rpcModule) ModuleLoader() require.ModuleLoader {
	return func(runtime *goja.Runtime, module *goja.Object) {
		m.runtime = runtime
		m.exports = module.Get("exports").(*goja.Object)
		m.exports.Set("setMethodHandler", m.setMethodHandler)
		m.exports.Set("removeMethodHandler", m.removeMethodHandler)

		unmarshallerValue, err := runtime.RunString(`
		(function(args) {
			let r = [];
			for (let arg of args) {
				r.push(JSON.parse(arg, (key, value) => key === "__proto__" ? undefined : value));
			}
			return r;
		})`)
		if err != nil {
			panic(stacktrace.Propagate(err, ""))
		}

		var ok bool
		m.argUnmarshaller, ok = goja.AssertFunction(unmarshallerValue)
		if !ok {
			panic("could not assert argument unmarshaller function")
		}

		marshallerValue, err := runtime.RunString(`JSON.stringify`)
		if err != nil {
			panic(stacktrace.Propagate(err, ""))
		}

		m.returnMarshaller, ok = goja.AssertFunction(marshallerValue)
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
func (m *rpcModule) HandleInvocation(vm *goja.Runtime, user auth.User, method string, args []string) goja.Value {
	m.mu.RLock()
	defer m.mu.RUnlock()

	h, ok := m.handlers[method]
	if !ok {
		panic(vm.NewTypeError("Unknown method"))
	}

	if auth.PermissionLevelOrder[h.minPermissionLevel] > auth.PermissionLevelOrder[user.PermissionLevel()] {
		panic(vm.NewTypeError("Insufficient permissions"))
	}

	// unmarshal args
	jsArgs := vm.ToValue(args)
	parsedArgs, err := m.argUnmarshaller(goja.Undefined(), jsArgs)
	if err != nil {
		panic(err)
	}
	var parsedArgsArray []goja.Value
	err = vm.ExportTo(parsedArgs, &parsedArgsArray)
	if err != nil {
		panic(vm.NewGoError(stacktrace.Propagate(err, "")))
	}

	jsUser := goja.Undefined()
	if user != nil && !user.IsUnknown() {
		jsUser = vm.ToValue(map[string]interface{}{
			"address":         user.Address(),
			"nickname":        user.Nickname(),
			"permissionLevel": user.PermissionLevel(),
		})
	}

	completeArgs := []goja.Value{jsUser}
	completeArgs = append(completeArgs, parsedArgsArray...)

	result, err := h.callable(goja.Undefined(), completeArgs...)
	if err != nil {
		panic(err)
	}

	resultJSON, err := m.returnMarshaller(goja.Undefined(), result)
	if err != nil {
		panic(err)
	}

	return resultJSON
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

	m.mu.Lock()
	defer m.mu.Unlock()

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

	m.mu.Lock()
	defer m.mu.Unlock()

	delete(m.handlers, call.Argument(0).String())

	return goja.Undefined()
}
