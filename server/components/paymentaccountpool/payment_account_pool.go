package paymentaccountpool

import (
	"sync"

	"github.com/hectorchu/gonano/wallet"
	"github.com/palantir/stacktrace"
)

type PaymentAccountPool struct {
	availableAccounts map[*wallet.Account]struct{}
	wallet            *wallet.Wallet
	accountsMutex     sync.RWMutex
	repAddress        string
}

func New(w *wallet.Wallet, repAddress string) *PaymentAccountPool {
	return &PaymentAccountPool{
		availableAccounts: make(map[*wallet.Account]struct{}),
		wallet:            w,
		repAddress:        repAddress,
	}
}

func (p *PaymentAccountPool) RequestAccount() (*wallet.Account, error) {
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
