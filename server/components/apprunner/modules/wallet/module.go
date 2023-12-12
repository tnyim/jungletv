package wallet

import (
	"context"
	"math/big"
	"strings"
	"sync"

	"github.com/dop251/goja"
	"github.com/dop251/goja_nodejs/require"
	"github.com/hectorchu/gonano/util"
	"github.com/hectorchu/gonano/wallet"
	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/server/components/apprunner/gojautil"
	"github.com/tnyim/jungletv/server/components/apprunner/modules"
	"github.com/tnyim/jungletv/server/components/payment"
	"github.com/tnyim/jungletv/server/components/pricer"
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
	ctx                context.Context // just to pass the sqalx node around...
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
		exports.Set("getApplicationBalance", m.getApplicationBalance)
		exports.Set("send", m.send)

		exports.DefineAccessorProperty("applicationAddress", m.runtime.ToValue(func(call goja.FunctionCall) goja.Value {
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
func (m *walletModule) ExecutionResumed(ctx context.Context, _ *sync.WaitGroup) {
	m.ctx = ctx
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

func (m *walletModule) getApplicationBalance(call goja.FunctionCall) goja.Value {
	return gojautil.DoAsync(m.runtime, m.appContext.ScheduleNoError, func(actx gojautil.AsyncContext) string {
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
	_, err := util.AddressToPubkey(destinationAddress)
	if err != nil || destinationAddress[:4] != "ban_" { // we must check for ban since AddressToPubkey accepts nano too
		panic(m.runtime.NewTypeError("Invalid destination address"))
	}

	amount, err := payment.NewAmountFromAPIString(call.Argument(1).String())
	if err != nil || amount.Cmp(big.NewInt(0)) <= 0 {
		panic(m.runtime.NewTypeError("Invalid amount"))
	}

	var customRep *string
	if len(call.Arguments) > 2 && !goja.IsUndefined(call.Argument(2)) && !goja.IsNull(call.Argument(2)) {
		rep := call.Argument(2).String()
		_, err := util.AddressToPubkey(rep)
		if err != nil || rep[:4] != "ban_" { // we must check for ban since AddressToPubkey accepts nano too
			panic(m.runtime.NewTypeError("Invalid representative address"))
		}
		customRep = &rep
	}

	return gojautil.DoAsync(m.runtime, m.appContext.ScheduleNoError, func(actx gojautil.AsyncContext) string {
		hashes, err := m.sendFromApplicationWallet(customRep, wallet.SendDestination{Account: destinationAddress, Amount: amount.Int})
		if err != nil {
			panic(m.runtime.NewGoError(stacktrace.Propagate(err, "")))
		}
		return hashes[0]
	})
}
