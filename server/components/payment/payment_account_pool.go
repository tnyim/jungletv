package payment

import (
	"context"
	"fmt"
	"log"
	"math/big"
	"sync"
	"time"

	"github.com/DisgoOrg/disgohook/api"
	"github.com/hectorchu/gonano/rpc"
	"github.com/hectorchu/gonano/wallet"
	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/utils/event"
	"gopkg.in/alexcesaro/statsd.v2"
)

type PaymentAccountPool struct {
	log                                     *log.Logger
	statsClient                             *statsd.Client
	availableAccounts                       map[*wallet.Account]struct{}
	wallet                                  *wallet.Wallet
	collectorAccountPendingBalanceWaitGroup *sync.WaitGroup
	accountsMutex                           sync.RWMutex
	repAddress                              string
	modLogWebhook                           api.WebhookClient
	dustThreshold                           Amount
	collectorAccountAddress                 string

	monitoredAccounts     map[string]*monitoredAccount
	monitoredAccountsLock sync.RWMutex
}

func New(log *log.Logger, statsClient *statsd.Client, w *wallet.Wallet, repAddress string, modLogWebhook api.WebhookClient,
	dustThreshold Amount, collectorAccountAddress string) *PaymentAccountPool {
	return &PaymentAccountPool{
		log:                                     log,
		statsClient:                             statsClient,
		availableAccounts:                       make(map[*wallet.Account]struct{}),
		wallet:                                  w,
		repAddress:                              repAddress,
		modLogWebhook:                           modLogWebhook,
		dustThreshold:                           dustThreshold,
		collectorAccountAddress:                 collectorAccountAddress,
		collectorAccountPendingBalanceWaitGroup: new(sync.WaitGroup),
		monitoredAccounts:                       make(map[string]*monitoredAccount),
	}
}

func (p *PaymentAccountPool) RequestAccount() (*wallet.Account, error) {
	for {
		paymentAccount, err := p.getAvailableAccount()
		if err != nil {
			return nil, stacktrace.Propagate(err, "")
		}
		// avoid using an address which still has leftover balance
		// (e.g. because someone sent banano too late and their ticket had already expired)
		// also has the benefit of checking the liveliness of the RPC server before letting people proceed to payment
		balance, pending, err := paymentAccount.Balance()
		if err != nil {
			return nil, stacktrace.Propagate(err, "failed to check balance for account %v", paymentAccount.Address())
		}
		balance.Add(balance, pending)

		// obtain the unconfirmed balance so this failsafe works properly when the network is super slow at confirming blocks
		accountInfo, err := p.wallet.RPC.AccountInfo(paymentAccount.Address())
		if err != nil {
			// an error most likely means unopened account, just continue
			accountInfo.Balance = &rpc.RawAmount{Int: *big.NewInt(0)}
		}

		if balance.Cmp(big.NewInt(0)) == 0 && accountInfo.Balance.Cmp(big.NewInt(0)) == 0 {
			return paymentAccount, nil
		}
		p.modLogWebhook.SendContent(fmt.Sprintf(
			"Address %v (%d) has unhandled balance! (gbl08ma will issue a refund)\n"+
				"Most likely, someone sent money to this address after their payment ticket had already expired.\n"+
				"This address has been removed from the payment account pool for the time being.",
			paymentAccount.Address(), paymentAccount.Index()))
	}
}

func (p *PaymentAccountPool) getAvailableAccount() (*wallet.Account, error) {
	p.accountsMutex.Lock()
	defer p.accountsMutex.Unlock()

	for a := range p.availableAccounts {
		delete(p.availableAccounts, a)
		return a, nil
	}

	newAccount, err := p.wallet.NewAccount(nil)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	err = newAccount.SetRep(p.repAddress)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	return newAccount, nil
}

func (p *PaymentAccountPool) ReturnAccount(account *wallet.Account) {
	p.accountsMutex.Lock()
	defer p.accountsMutex.Unlock()

	p.availableAccounts[account] = struct{}{}
}

type monitoredAccount struct {
	account                 *wallet.Account
	onPaymentReceived       *event.Event[PaymentReceivedEventArgs]
	onUnsubscribedUnsubFn   func()
	seenPendings            map[string]struct{}
	receivableBalance       Amount // this is the balance excluding dust. it is updated as we detect new receivables
	incrementedWaitingGroup bool
}

// PaymentReceivedEventArgs contains the data associated with the event that is fired when a payment is received
type PaymentReceivedEventArgs struct {
	Amount    Amount
	From      string
	Balance   Amount
	BlockHash string
}

func (p *PaymentAccountPool) ReceivePayment() (string, *event.Event[PaymentReceivedEventArgs], error) {
	account, err := p.RequestAccount()
	if err != nil {
		return "", nil, stacktrace.Propagate(err, "")
	}

	m := &monitoredAccount{
		account:           account,
		onPaymentReceived: event.New[PaymentReceivedEventArgs](),
		receivableBalance: NewAmount(),
		seenPendings:      make(map[string]struct{}),
	}

	m.onUnsubscribedUnsubFn = m.onPaymentReceived.Unsubscribed().SubscribeUsingCallback(event.ExactlyOnceGuarantee, func(subscriberCount int) {
		if subscriberCount == 0 {
			p.AbortReceivePayment(account.Address()) // will call onUnsubscribedUnsubFn for us
		}
	})

	p.monitoredAccountsLock.Lock()
	defer p.monitoredAccountsLock.Unlock()

	p.monitoredAccounts[account.Address()] = m
	return m.account.Address(), m.onPaymentReceived, nil
}

// AbortReceivePayment is meant to be used when the event returned from ReceivePayment is never subscribed to, but the
// caller still wants to free the account from the list of accounts monitored by the PaymentAccountPool
// If the event is subscribed to, then the PaymentAccountPool will automatically stop monitoring it once its subscriber
// count goes to zero
func (p *PaymentAccountPool) AbortReceivePayment(accountAddress string) {
	p.monitoredAccountsLock.Lock()
	defer p.monitoredAccountsLock.Unlock()

	if m, ok := p.monitoredAccounts[accountAddress]; ok {
		delete(p.monitoredAccounts, accountAddress)
		m.onPaymentReceived.Close()
		m.onUnsubscribedUnsubFn()
		go p.freePreviouslyMonitoredAccount(m)
	}
}

func (p *PaymentAccountPool) Worker(ctx context.Context, interval time.Duration) error {
	t := time.NewTicker(interval)
	defer t.Stop()
	for {
		select {
		case <-t.C:
			err := p.processPayments(ctx)
			if err != nil {
				return stacktrace.Propagate(err, "")
			}
		case <-ctx.Done():
			return nil
		}
	}
}

func (p *PaymentAccountPool) AwaitConclusionOfInFlightPayments() {
	p.collectorAccountPendingBalanceWaitGroup.Wait()
}

func (p *PaymentAccountPool) processPayments(ctx context.Context) error {
	// create a copy of the map so we don't hold the lock for so long
	monitoredAccountsCopy := make(map[string]*monitoredAccount)
	func() {
		p.monitoredAccountsLock.RLock()
		defer p.monitoredAccountsLock.RUnlock()
		for k, v := range p.monitoredAccounts {
			monitoredAccountsCopy[k] = v
		}
	}()

	go p.statsClient.Gauge("monitored_payment_accounts", len(monitoredAccountsCopy))
	t := p.statsClient.NewTiming()
	defer t.Send("process_payments")

	if len(monitoredAccountsCopy) == 0 {
		return nil
	}

	for _, m := range monitoredAccountsCopy {
		err := p.processPaymentForMonitoredAccount(ctx, m)
		if err != nil {
			return stacktrace.Propagate(err, "")
		}
	}

	return nil
}

func (p *PaymentAccountPool) processPaymentForMonitoredAccount(ctx context.Context, m *monitoredAccount) error {
	// note: both the RPC.Balance and RPC.AccountsPending calls return only confirmed blocks
	// so the RPC.Balance call done after RPC.AccountsPending should account for all pending receives that we'll
	// actually be able to receive
	allPendings, err := p.wallet.RPC.AccountsPending([]string{m.account.Address()}, -1,
		&rpc.RawAmount{Int: *p.dustThreshold.Int})
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	if len(allPendings) == 0 {
		return nil
	}

	pendings, ok := allPendings[m.account.Address()]
	if !ok {
		return stacktrace.NewError("account not present in pendings response")
	}

	for hash, pending := range pendings {
		_, alreadySeen := m.seenPendings[hash]
		if alreadySeen {
			continue
		}
		m.seenPendings[hash] = struct{}{}
		m.receivableBalance.Add(m.receivableBalance.Int, &pending.Amount.Int)
		if !m.incrementedWaitingGroup {
			p.collectorAccountPendingBalanceWaitGroup.Add(1)
			m.incrementedWaitingGroup = true
		}
		m.onPaymentReceived.Notify(PaymentReceivedEventArgs{
			Amount:    Amount{&pending.Amount.Int},
			From:      pending.Source,
			Balance:   m.receivableBalance,
			BlockHash: hash,
		})
	}

	return nil
}

func (p *PaymentAccountPool) freePreviouslyMonitoredAccount(m *monitoredAccount) {
	t := p.statsClient.NewTiming()
	defer t.Send("payment_account_final_operations")

	if m.incrementedWaitingGroup {
		defer p.collectorAccountPendingBalanceWaitGroup.Done()
	}

	retry := 0
	for ; retry < 5; retry++ {
		err := m.account.ReceivePendings(p.dustThreshold.Int)
		if err != nil {
			p.log.Printf("failed to receive pendings in account %v: %v", m.account.Address(), err)
			time.Sleep(5 * time.Second)
			continue
		}
		if m.receivableBalance.Cmp(big.NewInt(0)) > 0 {
			_, err = m.account.Send(p.collectorAccountAddress, m.receivableBalance.Int)
			if err != nil {
				p.log.Printf("failed to send balance in account %v to the collector account: %v", m.account.Address(), err)
				time.Sleep(5 * time.Second)
				continue
			}
		}
		break
	}

	if retry < 5 {
		// only reuse the account if no funds got stuck there
		p.ReturnAccount(m.account)
	} else {
		p.log.Printf("failed to clean up previously monitored account %v, not returning it to the pool", m.account.Address())
	}
}
