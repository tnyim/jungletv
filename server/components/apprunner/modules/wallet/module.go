package wallet

import (
	"context"
	"math/big"
	"strings"
	"sync"
	"time"

	"github.com/dop251/goja"
	"github.com/dop251/goja_nodejs/require"
	"github.com/hectorchu/gonano/wallet"
	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/server/components/apprunner/gojautil"
	"github.com/tnyim/jungletv/server/components/apprunner/modules"
	"github.com/tnyim/jungletv/server/components/payment"
	"github.com/tnyim/jungletv/server/components/pricer"
	"github.com/tnyim/jungletv/utils/event"
)

// ModuleName is the name by which this module can be require()d in a script
const ModuleName = "jungletv:wallet"

// WalletModule allows interactions with an application's wallet
type WalletModule interface {
	modules.NativeModule
	DebitFromApplicationWallet(amount payment.Amount) error
}

type walletModule struct {
	runtime            *goja.Runtime
	appContext         modules.ApplicationContext
	applicationWallet  *wallet.Wallet
	applicationAccount *wallet.Account
	paymentAccountPool *payment.PaymentAccountPool
	defaultRep         string
	executionWaitGroup *sync.WaitGroup
}

// New returns a new wallet module
func New(appContext modules.ApplicationContext, applicationWallet *wallet.Wallet, paymentAccountPool *payment.PaymentAccountPool, defaultRepresentative string) WalletModule {
	account := applicationWallet.GetAccount(appContext.ApplicationUser().Address())

	return &walletModule{
		appContext:         appContext,
		applicationWallet:  applicationWallet,
		paymentAccountPool: paymentAccountPool,
		applicationAccount: account,
		defaultRep:         defaultRepresentative,
	}
}

func (m *walletModule) IsNodeBuiltin() bool {
	return false
}

func (m *walletModule) ModuleLoader() require.ModuleLoader {
	return func(runtime *goja.Runtime, module *goja.Object) {
		m.runtime = runtime
		exports := module.Get("exports").(*goja.Object)
		exports.Set("getBalance", m.getBalance)
		exports.Set("send", m.send)
		exports.Set("receivePayment", m.receivePayment)
		exports.Set("compareAmounts", m.compareAmounts)
		exports.Set("formatAmount", m.formatAmount)
		exports.Set("parseAmount", m.parseAmount)
		exports.Set("addAmounts", m.addAmounts)
		exports.Set("negateAmount", m.negateAmount)

		exports.DefineAccessorProperty("address", m.runtime.ToValue(func(call goja.FunctionCall) goja.Value {
			return m.runtime.ToValue(m.applicationAccount.Address())
		}), goja.Undefined(), goja.FLAG_FALSE, goja.FLAG_TRUE)
	}
}
func (m *walletModule) ModuleName() string {
	return ModuleName
}
func (m *walletModule) AutoRequire() (bool, string) {
	return false, ""
}
func (m *walletModule) ExecutionResumed(_ context.Context, wg *sync.WaitGroup) {
	m.executionWaitGroup = wg
}

func (m *walletModule) DebitFromApplicationWallet(amount payment.Amount) error {
	if amount.Cmp(big.NewInt(0)) == 0 {
		return nil
	}

	_, err := m.sendFromApplicationWallet(nil, wallet.SendDestination{Account: m.paymentAccountPool.DefaultCollectorAccountAddress(), Amount: amount.Int})
	if err != nil {
		return stacktrace.Propagate(err, "failed to send to the collector account")
	}
	return nil
}

// EmptyApplicationWallet is meant to be used when deleting an application
// this is not a very clean approach but it's better than copying the code into the app editor,
// or bringing up a true app instance just to delete the app (which would be unclean in its own ways)
func EmptyApplicationWallet(applicationWallet *wallet.Wallet, paymentAccountPool *payment.PaymentAccountPool) error {
	// build an incomplete module so we can use the helper functions

	accountIndex := uint32(0)
	account, err := applicationWallet.NewAccount(&accountIndex)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	m := &walletModule{
		applicationWallet:  applicationWallet,
		applicationAccount: account,
		paymentAccountPool: paymentAccountPool,
		// this rep is only used if the account had receivable balance but hadn't been opened
		// doesn't really matter since the account will be emptied anyway
		defaultRep: account.Address(),
	}

	balance, err := m.receivePendingsAndGetSendableBalance()
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	err = m.DebitFromApplicationWallet(balance)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	return nil
}

// DO NOT CALL SYNCHRONOUSLY in the JS main loop, as it's slow.
func (m *walletModule) sendFromApplicationWallet(customRep *string, destinations ...wallet.SendDestination) ([]string, error) {
	totalBalance, err := m.receivePendingsAndGetSendableBalance()
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	totalToSend := big.NewInt(0)
	for _, destination := range destinations {
		cmp := destination.Amount.Cmp(big.NewInt(0))
		if cmp <= 0 {
			return nil, stacktrace.NewError("cannot debit a non-positive amount from the application wallet")
		}
		totalToSend.Add(totalToSend, destination.Amount)
	}

	if totalBalance.Cmp(totalToSend) < 0 {
		// total balance including confirmed receives won't be enough
		return nil, stacktrace.NewError("insufficient balance")
	}

	// we don't need to wait for the confirmation of the receives we've already submitted
	// see https://docs.nano.org/integration-guides/key-management/#transaction-order-and-correctness

	if customRep != nil {
		err := m.applicationAccount.SetRep(*customRep)
		if err != nil {
			return nil, stacktrace.Propagate(err, "failed to set representative for future blocks")
		}
	}

	// the error handling for SendMultiple doesn't seem very good so we do it this way
	// it's less optimal than it could be (we keep fetching the balance for the account in Send), we might optimize this one day
	hashes := make([]string, 0, len(destinations))
	for _, destination := range destinations {
		hash, err := m.applicationAccount.Send(destination.Account, destination.Amount)
		if err != nil {
			return nil, stacktrace.Propagate(err, "failed to send to the destination accounts")
		}
		hashes = append(hashes, hash.String())
	}
	return hashes, nil
}

// DO NOT CALL SYNCHRONOUSLY in the JS main loop, as it's slow.
// in addition to receiving pendings, the first return value of this function includes only the usable balance (excluding dust)
// this "usable balance" includes receivable amounts whose sends are confirmed
// it does not wait for the confirmation of the receives
// this follows the process suggested in
// https://docs.nano.org/integration-guides/key-management/#transaction-order-and-correctness
func (m *walletModule) receivePendingsAndGetSendableBalance() (payment.Amount, error) {
	balance := big.NewInt(0)
	info, err := m.applicationWallet.RPC.AccountInfo(m.applicationAccount.Address())
	if err != nil {
		if !strings.Contains(err.Error(), "Account not found") {
			return payment.Amount{}, stacktrace.Propagate(err, "failed to fetch account info")
		}
		// set the representative for future blocks
		// otherwise gonano will use its own default rep
		m.applicationAccount.SetRep(m.defaultRep)
	} else {
		balance = &info.Balance.Int
	}

	// this includes only pendings whose sends are confirmed, so it's fine
	pendings, err := m.applicationAccount.ReceiveAndReturnPendings(pricer.DustThreshold)
	if err != nil {
		return payment.Amount{}, stacktrace.Propagate(err, "failed to receive pendings")
	}

	toReceiveFromPendings := big.NewInt(0)
	for _, pending := range pendings {
		toReceiveFromPendings.Add(toReceiveFromPendings, &pending.Amount.Int)
	}

	return payment.NewAmount(balance, toReceiveFromPendings), nil
}

func (m *walletModule) getBalance(call goja.FunctionCall) goja.Value {
	return gojautil.DoAsync(m.appContext, m.runtime, func(actx gojautil.AsyncContext) string {
		balance, err := m.receivePendingsAndGetSendableBalance()
		if err != nil {
			panic(m.runtime.NewGoError(stacktrace.Propagate(err, "")))
		}
		return balance.SerializeForAPI()
	})
}

func (m *walletModule) send(call goja.FunctionCall) goja.Value {
	if len(call.Arguments) < 2 {
		panic(m.runtime.NewTypeError("Missing argument"))
	}

	destinationAddress := call.Argument(0).String()
	gojautil.ValidateBananoAddress(m.runtime, destinationAddress, "Invalid destination address")

	amount, err := payment.NewAmountFromAPIString(call.Argument(1).String())
	if err != nil || amount.Cmp(big.NewInt(0)) <= 0 {
		panic(m.runtime.NewTypeError("Invalid amount"))
	}

	var customRep *string
	if len(call.Arguments) > 2 && !goja.IsUndefined(call.Argument(2)) && !goja.IsNull(call.Argument(2)) {
		rep := call.Argument(2).String()
		gojautil.ValidateBananoAddress(m.runtime, rep, "Invalid representative address")
		customRep = &rep
	}

	return gojautil.DoAsync(m.appContext, m.runtime, func(actx gojautil.AsyncContext) string {
		hashes, err := m.sendFromApplicationWallet(customRep, wallet.SendDestination{Account: destinationAddress, Amount: amount.Int})
		if err != nil {
			panic(m.runtime.NewGoError(stacktrace.Propagate(err, "")))
		}
		return hashes[0]
	})
}

func (m *walletModule) receivePayment(call goja.FunctionCall) goja.Value {
	if len(call.Arguments) < 1 {
		panic(m.runtime.NewTypeError("Missing argument"))
	}

	var timeoutms int64
	err := m.runtime.ExportTo(call.Argument(0), &timeoutms)
	if err != nil {
		panic(m.runtime.NewTypeError("First argument to receivePayment must be an integer"))
	}

	if timeoutms < 20*1000 {
		panic(m.runtime.NewTypeError("First argument to receivePayment must not be shorter than twenty seconds"))
	}

	if timeoutms > 10*60*1000 {
		panic(m.runtime.NewTypeError("First argument to receivePayment must not be longer than ten minutes"))
	}

	timeout := time.Duration(timeoutms) * time.Millisecond

	return gojautil.DoAsyncWithTransformer(m.appContext, m.runtime, func(actx gojautil.AsyncContext) (struct{}, gojautil.PromiseResultTransformer[struct{}]) {
		return m.receivePaymentAsyncCb(actx, timeout)
	})
}

func (m *walletModule) receivePaymentAsyncCb(actx gojautil.AsyncContext, timeout time.Duration) (struct{}, gojautil.PromiseResultTransformer[struct{}]) {
	paymentReceiver, err := m.paymentAccountPool.ReceivePaymentIntoCollectorAccount(m.applicationAccount.Address())
	if err != nil {
		panic(actx.NewGoError(stacktrace.Propagate(err, "")))
	}

	eventAdapter := gojautil.NewEventAdapter(m.appContext)

	closed := event.NewNoArg()

	gojautil.AdaptEvent(eventAdapter, paymentReceiver.PaymentReceived(), "paymentreceived", func(vm *goja.Runtime, arg payment.PaymentReceivedEventArgs) *goja.Object {
		o := vm.NewObject()
		o.Set("amount", arg.Amount.SerializeForAPI())
		o.Set("senderAmount", arg.SenderAmount.SerializeForAPI())
		o.Set("senderCurrency", arg.SenderCurrency)
		o.Set("from", arg.From)
		o.Set("blockHash", arg.BlockHash)
		o.Set("balance", arg.Balance.SerializeForAPI())
		return o
	})
	gojautil.AdaptNoArgEvent(eventAdapter, closed, "closed", nil)

	// these contexts should live past the resolution of the promise, so don't use the async context
	workerCtx, workerCancelFn := context.WithDeadline(m.appContext.ExecutionContext(), time.Now().Add(timeout))
	workerDone := make(chan struct{})
	adapterCtx, adapterCancelFn := context.WithCancel(m.appContext.ExecutionContext())

	jsPaymentReceiver := &jsPaymentReceiver{
		m:               m,
		paymentReceiver: paymentReceiver,
		closed:          closed,
		workerCancelFn:  workerCancelFn,
		adapterCancelFn: adapterCancelFn,
	}

	go jsPaymentReceiver.worker(workerCtx, workerDone)

	return struct{}{}, func(vm *goja.Runtime, _ struct{}) interface{} {
		// calling StartOrResume here instead of in the asynchronous code ensures that the Add call on the WaitGroup is not concurrent with the Wait call that happens after VM interruption
		eventAdapter.StartOrResume(adapterCtx, m.executionWaitGroup, m.runtime)

		paymentReceiverObject := vm.NewObject()
		paymentReceiverObject.Set("addEventListener", eventAdapter.AddEventListener)
		paymentReceiverObject.Set("removeEventListener", eventAdapter.RemoveEventListener)
		paymentReceiverObject.Set("close", jsPaymentReceiver.makeCloseFn(vm, workerDone))

		paymentReceiverObject.DefineAccessorProperty("address", vm.ToValue(func(call goja.FunctionCall) goja.Value {
			return m.runtime.ToValue(paymentReceiver.Address())
		}), goja.Undefined(), goja.FLAG_FALSE, goja.FLAG_TRUE)

		paymentReceiverObject.DefineAccessorProperty("closed", vm.ToValue(func(call goja.FunctionCall) goja.Value {
			jsPaymentReceiver.isClosedMu.Lock()
			defer jsPaymentReceiver.isClosedMu.Unlock()
			return m.runtime.ToValue(jsPaymentReceiver.isClosed)
		}), goja.Undefined(), goja.FLAG_FALSE, goja.FLAG_TRUE)

		paymentReceiverObject.DefineAccessorProperty("balance", vm.ToValue(func(call goja.FunctionCall) goja.Value {
			return m.runtime.ToValue(paymentReceiver.ReceivableBalance().SerializeForAPI())
		}), goja.Undefined(), goja.FLAG_FALSE, goja.FLAG_TRUE)

		return paymentReceiverObject
	}
}

type jsPaymentReceiver struct {
	m               *walletModule
	paymentReceiver payment.PaymentReceiver
	closed          event.NoArgEvent

	isClosedMu sync.Mutex
	isClosed   bool

	workerCancelFn  context.CancelFunc
	adapterCancelFn context.CancelFunc
}

func (r *jsPaymentReceiver) makeCloseFn(vm *goja.Runtime, workerDone <-chan struct{}) func(call goja.FunctionCall) goja.Value {
	return func(call goja.FunctionCall) goja.Value {
		return gojautil.DoAsync(r.m.appContext, vm, func(actx gojautil.AsyncContext) goja.Value {
			r.workerCancelFn()
			<-workerDone
			return goja.Undefined()
		})
	}
}

func (r *jsPaymentReceiver) worker(ctx context.Context, workerDone chan<- struct{}) {
	<-ctx.Done()
	<-r.paymentReceiver.Close()

	// kick off "closed" event, waiting for the event to finish propagating before shutting down the event adapter
	// what follows is a bit of a hack that considers the implementation details of the event adapter
	// the order of events here is carefully planned
	var unsubbedU func()
	unsubbedU = r.closed.Unsubscribed().SubscribeUsingCallback(event.BufferAll, func(activeSubs int) {
		if activeSubs == 0 {
			unsubbedU()
			r.adapterCancelFn()
			close(workerDone) // this unblocks any Promises returned by close()
		}
	})

	func() {
		r.isClosedMu.Lock()
		defer r.isClosedMu.Unlock()
		r.isClosed = true
		r.closed.Notify(false)
	}()

	r.closed.Close() // should it be running, this will cause the SubscribeWithCallback worker within the event adapter to return, unsubscribing and leading to our callback above

	// because it is possible that no JS code had actually subscribed to the "closed" event,
	// let's ensure our callback above runs at least once with activeSubs set to 0, by subscribing to the event and immediately unsubscribing
	// we must do this only after we are subscribed to closed.Unsubscribed()
	_, u := r.closed.Subscribe(event.BufferFirst)
	u()
}
