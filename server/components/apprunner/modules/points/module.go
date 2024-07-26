package points

import (
	"context"
	"errors"
	"fmt"
	"strings"
	"sync"
	"time"

	"github.com/bytedance/sonic"
	"github.com/dop251/goja"
	"github.com/dop251/goja_nodejs/require"
	"github.com/palantir/stacktrace"
	"github.com/samber/lo"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/server/auth"
	"github.com/tnyim/jungletv/server/components/apprunner/gojautil"
	"github.com/tnyim/jungletv/server/components/apprunner/modules"
	"github.com/tnyim/jungletv/server/components/pointsmanager"
	"github.com/tnyim/jungletv/types"
	"github.com/tnyim/jungletv/utils/transaction"
)

// ModuleName is the name by which this module can be require()d in a script
const ModuleName = "jungletv:points"

type pointsModule struct {
	runtime        *goja.Runtime
	exports        *goja.Object
	pointsManager  *pointsmanager.Manager
	dateSerializer func(time.Time) interface{}
	eventAdapter   *gojautil.EventAdapter

	appContext modules.ApplicationContext
}

// New returns a new points module
func New(appContext modules.ApplicationContext, pointsManager *pointsmanager.Manager) modules.NativeModule {
	return &pointsModule{
		pointsManager: pointsManager,
		appContext:    appContext,
		eventAdapter:  gojautil.NewEventAdapter(appContext),
	}
}

func (m *pointsModule) IsNodeBuiltin() bool {
	return false
}

func (m *pointsModule) ModuleLoader() require.ModuleLoader {
	return func(runtime *goja.Runtime, module *goja.Object) {
		m.runtime = runtime
		m.dateSerializer = func(t time.Time) interface{} {
			return gojautil.SerializeTime(runtime, t)
		}
		m.exports = module.Get("exports").(*goja.Object)
		m.exports.Set("createTransaction", m.createTransaction)
		m.exports.Set("getBalance", m.getBalance)
		m.exports.Set("getNiceSubscription", m.getNiceSubscription)
		m.exports.Set("addEventListener", m.eventAdapter.AddEventListener)
		m.exports.Set("removeEventListener", m.eventAdapter.RemoveEventListener)

		gojautil.AdaptEvent(m.eventAdapter, m.pointsManager.OnTransactionCreated(), "transactioncreated", func(vm *goja.Runtime, arg *types.PointsTx) *goja.Object {
			t := map[string]interface{}{}
			t["transaction"] = serializePointsTransactionForJS(arg, m.dateSerializer)
			return vm.ToValue(t).ToObject(vm)
		})
		gojautil.AdaptEvent(m.eventAdapter, m.pointsManager.OnTransactionUpdated(), "transactionupdated", func(vm *goja.Runtime, arg pointsmanager.TransactionUpdatedEventArgs) *goja.Object {
			t := map[string]interface{}{}
			t["transaction"] = serializePointsTransactionForJS(arg.Transaction, m.dateSerializer)
			t["pointsAdjustment"] = arg.AdjustmentValue
			return vm.ToValue(t).ToObject(vm)
		})
	}
}
func (m *pointsModule) ModuleName() string {
	return ModuleName
}
func (m *pointsModule) AutoRequire() (bool, string) {
	return false, ""
}

func (m *pointsModule) ExecutionResumed(ctx context.Context, wg *sync.WaitGroup) {
	m.eventAdapter.StartOrResume(ctx, wg, m.runtime)
}

func (m *pointsModule) createTransaction(call goja.FunctionCall) goja.Value {
	if len(call.Arguments) < 3 {
		panic(m.runtime.NewTypeError("Missing argument"))
	}
	userValue := call.Argument(0)
	userAddress := userValue.String()

	gojautil.ValidateBananoAddress(m.runtime, userAddress, "Invalid user address")

	user := auth.NewAddressOnlyUser(userAddress)

	description := call.Argument(1).String()
	if description == "" {
		panic(m.runtime.NewTypeError("Transaction description is empty"))
	}

	var value int
	err := m.runtime.ExportTo(call.Argument(2), &value)
	if err != nil || value == 0 {
		panic(m.runtime.NewTypeError("Third argument to createTransaction must be a non-zero integer"))
	}

	tx, err := m.pointsManager.CreateTransaction(m.appContext.ExecutionContext(), user, types.PointsTxTypeApplicationDefined, value, pointsmanager.TxExtraField{
		Key:   "application_id",
		Value: m.appContext.ApplicationID(),
	}, pointsmanager.TxExtraField{
		Key:   "application_version",
		Value: m.appContext.ApplicationVersion(),
	}, pointsmanager.TxExtraField{
		Key:   "description",
		Value: description,
	})
	if err != nil {
		if errors.Is(err, types.ErrInsufficientPointsBalance) {
			// ideally this should be a range error, but goja doesn't expose
			panic(m.runtime.NewTypeError("Insufficient points balance"))
		}
		panic(m.runtime.NewGoError(stacktrace.Propagate(err, "")))
	}

	return m.runtime.ToValue(serializePointsTransactionForJS(tx, m.dateSerializer))
}

func serializePointsTransactionForJS(tx *types.PointsTx, dateSerializer func(time.Time) interface{}) map[string]interface{} {
	e := map[string]interface{}{}
	_ = sonic.Unmarshal(tx.Extra, &e)

	txTypeProto := proto.PointsTransactionType(tx.Type)
	typeString := strings.TrimPrefix(txTypeProto.String(), "POINTS_TRANSACTION_TYPE_")
	typeString = strings.ToLower(typeString)

	return map[string]interface{}{
		"id":              fmt.Sprint(tx.ID), // JS deals poorly with int64
		"address":         tx.RewardsAddress,
		"createdAt":       dateSerializer(tx.CreatedAt),
		"updatedAt":       dateSerializer(tx.UpdatedAt),
		"value":           tx.Value,
		"transactionType": typeString,
		"extra":           e,
	}
}

func (m *pointsModule) getBalance(call goja.FunctionCall) goja.Value {
	if len(call.Arguments) < 1 {
		panic(m.runtime.NewTypeError("Missing argument"))
	}

	userValue := call.Argument(0)
	userAddress := userValue.String()

	gojautil.ValidateBananoAddress(m.runtime, userAddress, "Invalid user address")

	ctx, err := transaction.Begin(m.appContext.ExecutionContext())
	if err != nil {
		panic(m.runtime.NewGoError(stacktrace.Propagate(err, "")))
	}
	defer ctx.Commit() // read-only tx

	balance, err := types.GetPointsBalanceForAddress(ctx, userAddress)
	if err != nil {
		panic(m.runtime.NewGoError(stacktrace.Propagate(err, "")))
	}

	return m.runtime.ToValue(balance.Balance)
}

func (m *pointsModule) getNiceSubscription(call goja.FunctionCall) goja.Value {
	if len(call.Arguments) < 1 {
		panic(m.runtime.NewTypeError("Missing argument"))
	}

	userValue := call.Argument(0)
	userAddress := userValue.String()

	gojautil.ValidateBananoAddress(m.runtime, userAddress, "Invalid user address")

	subscription, err := m.pointsManager.GetCurrentUserSubscription(m.appContext.ExecutionContext(), auth.NewAddressOnlyUser(userAddress))
	if err != nil {
		panic(m.runtime.NewGoError(stacktrace.Propagate(err, "")))
	}

	if subscription == nil {
		return goja.Null()
	}

	return m.runtime.ToValue(serializeSubscriptionForJS(subscription, m.dateSerializer))
}

func serializeSubscriptionForJS(subscription *types.Subscription, dateSerializer func(time.Time) interface{}) map[string]interface{} {
	return map[string]interface{}{
		"address":  subscription.RewardsAddress,
		"startsAt": dateSerializer(subscription.StartsAt),
		"endsAt":   dateSerializer(subscription.EndsAt),

		// JS deals poorly with int64
		"paymentTransactions": lo.Map(subscription.PaymentTxs, func(item int64, index int) string {
			return fmt.Sprint(item)
		}),
	}
}
