package keyvalue

import (
	"context"
	"errors"

	"github.com/dop251/goja"
	"github.com/dop251/goja_nodejs/require"
	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/server/components/apprunner/modules"
	"github.com/tnyim/jungletv/types"
	"github.com/tnyim/jungletv/utils/transaction"
)

// ModuleName is the name by which this module can be require()d in a script
const ModuleName = "jungletv:keyvalue"

type keyValueModule struct {
	runtime       *goja.Runtime
	ctx           context.Context // just to pass the sqalx node around...
	applicationID string
}

// New returns a new keyvalue module
func New(applicationID string) modules.NativeModule {
	return &keyValueModule{
		applicationID: applicationID,
	}
}

func (m *keyValueModule) IsNodeBuiltin() bool {
	return false
}

func (m *keyValueModule) ModuleLoader() require.ModuleLoader {
	return func(runtime *goja.Runtime, module *goja.Object) {
		m.runtime = runtime
		exports := module.Get("exports").(*goja.Object)
		exports.Set("key", m.key)
		exports.Set("getItem", m.getItem)
		exports.Set("setItem", m.setItem)
		exports.Set("removeItem", m.removeItem)
		exports.Set("clear", m.clear)
		exports.DefineAccessorProperty("length", m.runtime.ToValue(m.length), nil, goja.FLAG_FALSE, goja.FLAG_FALSE)
	}
}
func (m *keyValueModule) ModuleName() string {
	return ModuleName
}
func (m *keyValueModule) AutoRequire() (bool, string) {
	return false, ""
}
func (m *keyValueModule) ExecutionResumed(ctx context.Context) {
	m.ctx = ctx
}
func (m *keyValueModule) ExecutionPaused() {
	m.ctx = nil
}

func (m *keyValueModule) key(call goja.FunctionCall) goja.Value {
	if len(call.Arguments) < 1 {
		panic(m.runtime.NewTypeError("Missing argument"))
	}
	indexValue := call.Argument(0)
	var index uint64
	err := m.runtime.ExportTo(indexValue, &index)
	if err != nil {
		panic(m.runtime.NewTypeError("First argument to getItem must be an unsigned integer"))
	}

	ctx, err := transaction.Begin(m.ctx)
	if err != nil {
		panic(m.runtime.NewGoError(stacktrace.Propagate(err, "")))
	}
	defer ctx.Commit() // read-only tx

	value, err := types.GetApplicationValueByIndex(ctx, m.applicationID, index)
	if errors.Is(err, types.ErrApplicationValueNotFound) {
		return goja.Null()
	} else if err != nil {
		panic(m.runtime.NewGoError(stacktrace.Propagate(err, "")))
	}
	return m.runtime.ToValue(value.Key)
}

func (m *keyValueModule) getItem(call goja.FunctionCall) goja.Value {
	if len(call.Arguments) < 1 {
		panic(m.runtime.NewTypeError("Missing argument"))
	}
	keyValue := call.Argument(0)
	var key string
	err := m.runtime.ExportTo(keyValue, &key)
	if err != nil {
		panic(m.runtime.NewTypeError("First argument to getItem must be a string"))
	}
	if len(key) > 2048 {
		panic(m.runtime.NewTypeError("First argument to getItem is longer than 2048 characters"))
	}

	ctx, err := transaction.Begin(m.ctx)
	if err != nil {
		panic(m.runtime.NewGoError(stacktrace.Propagate(err, "")))
	}
	defer ctx.Commit() // read-only tx

	value, err := types.GetApplicationValue(ctx, m.applicationID, key)
	if errors.Is(err, types.ErrApplicationValueNotFound) {
		return goja.Null()
	} else if err != nil {
		panic(m.runtime.NewGoError(stacktrace.Propagate(err, "")))
	}
	return m.runtime.ToValue(value.Value)
}

func (m *keyValueModule) setItem(call goja.FunctionCall) goja.Value {
	if len(call.Arguments) < 2 {
		panic(m.runtime.NewTypeError("Missing argument"))
	}
	keyValue := call.Argument(0)
	valueValue := call.Argument(1)

	var key, value string
	err := m.runtime.ExportTo(keyValue, &key)
	if err != nil {
		panic(m.runtime.NewTypeError("First argument to setItem must be a string"))
	}
	err = m.runtime.ExportTo(valueValue, &value)
	if err != nil {
		panic(m.runtime.NewTypeError("Second argument to setItem must be a string"))
	}
	if len(key) > 2048 {
		panic(m.runtime.NewTypeError("First argument to setItem is longer than 2048 characters"))
	}

	ctx, err := transaction.Begin(m.ctx)
	if err != nil {
		panic(m.runtime.NewGoError(stacktrace.Propagate(err, "")))
	}
	defer ctx.Rollback()

	v := &types.ApplicationValue{
		ApplicationID: m.applicationID,
		Key:           key,
		Value:         value,
	}

	err = v.Update(ctx)
	if err != nil {
		panic(m.runtime.NewGoError(stacktrace.Propagate(err, "")))
	}

	err = ctx.Commit()
	if err != nil {
		panic(m.runtime.NewGoError(stacktrace.Propagate(err, "")))
	}
	return goja.Undefined()
}

func (m *keyValueModule) removeItem(call goja.FunctionCall) goja.Value {
	if len(call.Arguments) < 1 {
		panic(m.runtime.NewTypeError("Missing argument"))
	}
	keyValue := call.Argument(0)

	var key string
	err := m.runtime.ExportTo(keyValue, &key)
	if err != nil {
		panic(m.runtime.NewTypeError("First argument to removeItem must be a string"))
	}
	if len(key) > 2048 {
		panic(m.runtime.NewTypeError("First argument to removeItem is longer than 2048 characters"))
	}

	ctx, err := transaction.Begin(m.ctx)
	if err != nil {
		panic(m.runtime.NewGoError(stacktrace.Propagate(err, "")))
	}
	defer ctx.Rollback()

	v := &types.ApplicationValue{
		ApplicationID: m.applicationID,
		Key:           key,
	}

	err = v.Delete(ctx)
	if err != nil {
		panic(m.runtime.NewGoError(stacktrace.Propagate(err, "")))
	}

	err = ctx.Commit()
	if err != nil {
		panic(m.runtime.NewGoError(stacktrace.Propagate(err, "")))
	}
	return goja.Undefined()
}

func (m *keyValueModule) clear(call goja.FunctionCall) goja.Value {
	ctx, err := transaction.Begin(m.ctx)
	if err != nil {
		panic(m.runtime.NewGoError(stacktrace.Propagate(err, "")))
	}
	defer ctx.Rollback()

	err = types.ClearApplicationValuesForApplication(ctx, m.applicationID)
	if err != nil {
		panic(m.runtime.NewGoError(stacktrace.Propagate(err, "")))
	}

	err = ctx.Commit()
	if err != nil {
		panic(m.runtime.NewGoError(stacktrace.Propagate(err, "")))
	}
	return goja.Undefined()
}

func (m *keyValueModule) length() goja.Value {
	ctx, err := transaction.Begin(m.ctx)
	if err != nil {
		panic(m.runtime.NewGoError(stacktrace.Propagate(err, "")))
	}
	defer ctx.Commit() // read-only tx

	count, err := types.CountApplicationValuesForApplication(ctx, m.applicationID)
	if err != nil {
		panic(m.runtime.NewGoError(stacktrace.Propagate(err, "")))
	}

	return m.runtime.ToValue(count)
}
