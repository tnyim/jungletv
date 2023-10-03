package db

import (
	"context"
	"fmt"
	"math"
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
	runtime    *goja.Runtime
	appContext modules.ApplicationContext
	ctx        context.Context // just to pass the sqalx node around...
}

// New returns a new db module
func New(appContext modules.ApplicationContext) modules.NativeModule {
	return &dbModule{appContext: appContext}
}

func (m *dbModule) IsNodeBuiltin() bool {
	return false
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

	return gojautil.DoAsyncWithTransformer(m.runtime, m.appContext.ScheduleNoError, func(actx gojautil.AsyncContext) ([]map[string]interface{}, gojautil.PromiseResultTransformer[[]map[string]interface{}]) {
		ctx, err := transaction.Begin(m.ctx)
		if err != nil {
			panic(actx.NewGoError(stacktrace.Propagate(err, "")))
		}
		defer ctx.Rollback() // force tx to be read-only

		rows, err := ctx.Tx().QueryxContext(ctx, query, args...)
		if err != nil {
			panic(actx.NewGoError(stacktrace.Propagate(err, "")))
		}

		result := []map[string]interface{}{}
		for rows.Next() {
			rowResult := make(map[string]interface{})
			err = rows.MapScan(rowResult)
			if err != nil {
				panic(actx.NewGoError(stacktrace.Propagate(err, "")))
			}
			result = append(result, rowResult)
		}

		return result, func(runtime *goja.Runtime, result []map[string]interface{}) interface{} {
			// we can modify the result in place without any problems
			for _, row := range result {
				for k := range row {
					switch t := row[k].(type) {
					case time.Time:
						row[k] = gojautil.SerializeTime(runtime, t)
					case int64:
						// safe JS integers range from -(2^53-1) to 2^53-1 inclusive
						// we only pass ints that fit in 32 bits as numbers, to allow some margin for math on them
						// wider integers get converted to string (in our DB, these usually correspond to snowflake-like IDs)
						if t < math.MinInt32 || t > math.MaxInt32 {
							row[k] = fmt.Sprint(t)
						}
					}
				}
			}
			return result
		}
	})
}
