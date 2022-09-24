package payment

import (
	"context"
	"math/big"
	"sync"
	"time"

	"github.com/hectorchu/gonano/rpc"
	"github.com/hectorchu/gonano/wallet"
	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/utils/event"
)

// monitoredAccount implements PaymentReceiver
type monitoredAccount struct {
	mu                      sync.RWMutex // mainly protects receivableBalance, as it is changed on both Revert and processPaymentsToAccount
	p                       *PaymentAccountPool
	account                 *wallet.Account
	onPaymentReceived       *event.Event[PaymentReceivedEventArgs]
	onUnsubscribedUnsubFn   func()
	seenPendings            map[string]struct{}
	receivableBalance       Amount // this is the balance excluding dust. it is updated as we detect new receivables
	incrementedWaitingGroup bool
}

func (m *monitoredAccount) Address() string {
	return m.account.Address()
}

func (m *monitoredAccount) PaymentReceived() *event.Event[PaymentReceivedEventArgs] {
	return m.onPaymentReceived
}

func (m *monitoredAccount) Revert(refundAddress string) error {
	// blocks payment processing for this account for a while, and therefore the main payment processing loop, but shouldn't be too bad as this is rare
	m.mu.Lock()
	defer m.mu.Unlock()

	retry := 0
	for ; retry < 5; retry++ {
		err := m.account.ReceivePendings(m.p.dustThreshold.Int)
		if err != nil {
			m.p.log.Printf("failed to receive pendings in account %v: %v", m.account.Address(), err)
			time.Sleep(5 * time.Second)
			continue
		}
		if m.receivableBalance.Cmp(big.NewInt(0)) > 0 {
			_, err = m.account.Send(refundAddress, m.receivableBalance.Int)
			if err != nil {
				m.p.log.Printf("failed to send balance in account %v to the refund address %v: %v", m.account.Address(), refundAddress, err)
				time.Sleep(5 * time.Second)
				continue
			}
		}
		break
	}

	if retry < 5 {
		m.receivableBalance = NewAmount()
	}
	return nil
}

func (m *monitoredAccount) abort() {
	m.p.monitoredAccountsLock.Lock()
	defer m.p.monitoredAccountsLock.Unlock()
	m.mu.Lock()
	defer m.mu.Unlock()

	if m, ok := m.p.monitoredAccounts[m.Address()]; ok {
		delete(m.p.monitoredAccounts, m.Address())
		m.onPaymentReceived.Close()
		m.onUnsubscribedUnsubFn()
		go m.p.freePreviouslyMonitoredAccount(m)
	}
}

func (m *monitoredAccount) processPaymentsToAccount(ctx context.Context) error {
	// note: both the RPC.Balance and RPC.AccountsPending calls return only confirmed blocks
	// so the RPC.Balance call done after RPC.AccountsPending should account for all pending receives that we'll
	// actually be able to receive
	allPendings, err := m.p.wallet.RPC.AccountsPending([]string{m.account.Address()}, -1,
		&rpc.RawAmount{Int: *m.p.dustThreshold.Int})
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

	m.mu.Lock()
	defer m.mu.Unlock()

	for hash, pending := range pendings {
		_, alreadySeen := m.seenPendings[hash]
		if alreadySeen {
			continue
		}
		m.seenPendings[hash] = struct{}{}
		m.receivableBalance.Add(m.receivableBalance.Int, &pending.Amount.Int)
		if !m.incrementedWaitingGroup {
			m.p.collectorAccountPendingBalanceWaitGroup.Add(1)
			m.incrementedWaitingGroup = true
		}
		m.onPaymentReceived.Notify(PaymentReceivedEventArgs{
			Amount:    Amount{&pending.Amount.Int},
			From:      pending.Source,
			Balance:   m.receivableBalance,
			BlockHash: hash,
		}, true)
	}

	return nil
}
