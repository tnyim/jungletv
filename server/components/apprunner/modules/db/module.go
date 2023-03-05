package db

import (
	"context"
	"time"

	"github.com/dop251/goja"
	"github.com/dop251/goja_nodejs/require"
	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/server/components/apprunner/gojautil"
	"github.com/tnyim/jungletv/server/components/apprunner/modules"
	"github.com/tnyim/jungletv/utils/transaction"
)

// ModuleName is the name by which this module can be require()d in a script
const ModuleName = "jungletv:db"

type dbModule struct {
	runtime   *goja.Runtime
	runOnLoop gojautil.ScheduleFunctionNoError
	ctx       context.Context // just to pass the sqalx node around...
}

// New returns a new db module
func New(runOnLoop gojautil.ScheduleFunctionNoError) modules.NativeModule {
	return &dbModule{runOnLoop: runOnLoop}
}

func (m *dbModule) ModuleLoader() require.ModuleLoader {
	return func(runtime *goja.Runtime, module *goja.Object) {
		m.runtime = runtime
		exports := module.Get("exports").(*goja.Object)
		exports.Set("query", m.query)
	}
}
func (m *dbModule) ModuleName() string {
	return ModuleName
}
func (m *dbModule) AutoRequire() (bool, string) {
	return false, ""
}
func (m *dbModule) ExecutionResumed(ctx context.Context) {
	m.ctx = ctx
}
func (m *dbModule) ExecutionPaused() {
	m.ctx = nil
}

func (m *dbModule) query(call goja.FunctionCall) goja.Value {
	if len(call.Arguments) < 1 {
		panic(m.runtime.NewTypeError("Missing argument"))
	}
	queryValue := call.Argument(0)
	var query string
	err := m.runtime.ExportTo(queryValue, &query)
	if err != nil {
		panic(m.runtime.NewTypeError("First argument to query must be a string"))
	}

	args := make([]interface{}, len(call.Arguments)-1)
	for i, callArg := range call.Arguments[1:] {
		err := m.runtime.ExportTo(callArg, &args[i])
		if err != nil {
			panic(m.runtime.NewTypeError("Failed to convert query parameter"))
		}
	}

	return gojautil.DoAsyncWithTransformer(m.runtime, m.runOnLoop, func() ([]map[string]interface{}, gojautil.PromiseResultTransformer[[]map[string]interface{}]) {
		ctx, err := transaction.Begin(m.ctx)
		if err != nil {
			panic(m.runtime.NewGoError(stacktrace.Propagate(err, "")))
		}
		defer ctx.Rollback() // force tx to be read-only

		rows, err := ctx.Tx().QueryxContext(ctx, query, args...)
		if err != nil {
			panic(m.runtime.NewGoError(stacktrace.Propagate(err, "")))
		}

		result := []map[string]interface{}{}
		for rows.Next() {
			rowResult := make(map[string]interface{})
			err = rows.MapScan(rowResult)
			if err != nil {
				panic(m.runtime.NewGoError(stacktrace.Propagate(err, "")))
			}
			result = append(result, rowResult)
		}

		return result, func(runtime *goja.Runtime, result []map[string]interface{}) interface{} {
			// we can modify the result in place without any problems
			for _, row := range result {
				for k := range row {
					if t, ok := row[k].(time.Time); ok {
						row[k] = gojautil.ToJSDate(runtime, t)
					}
				}
			}
			return result
		}
	})
}