package payment

import (
	"context"
	"math/big"
	"sync"
	"time"

	"github.com/hectorchu/gonano/rpc"
	"github.com/hectorchu/gonano/wallet"
	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/server/components/nanswapclient"
	"github.com/tnyim/jungletv/utils/event"
)

// monitoredAccount implements PaymentReceiver
type monitoredAccount struct {
	mu                                  sync.RWMutex // mainly protects receivableBalance, as it is changed on both Revert and processPaymentsToAccount
	p                                   *PaymentAccountPool
	account                             *wallet.Account
	onPaymentReceived                   *event.Event[PaymentReceivedEventArgs]
	onMulticurrencyPaymentDataAvailable *event.Event[[]MulticurrencyPaymentData]
	onUnsubscribedUnsubFn               func()
	seenPendings                        map[string]struct{}
	receivableBalance                   Amount // this is the balance excluding dust. it is updated as we detect new receivables
	incrementedWaitingGroup             bool
	multicurrencyPaymentData            []MulticurrencyPaymentData
}

func (m *monitoredAccount) Address() string {
	return m.account.Address()
}

func (m *monitoredAccount) MulticurrencyPaymentData() []MulticurrencyPaymentData {
	m.mu.RLock()
	defer m.mu.RUnlock()
	d := make([]MulticurrencyPaymentData, len(m.multicurrencyPaymentData))
	copy(d, m.multicurrencyPaymentData)
	return d
}

func (m *monitoredAccount) MulticurrencyPaymentDataAvailable() *event.Event[[]MulticurrencyPaymentData] {
	return m.onMulticurrencyPaymentDataAvailable
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

		senderAmount := Amount{&pending.Amount.Int}
		senderCurrency := nanswapclient.TickerBanano
		from := pending.Source
		if pending.Source == "ban_3zz761jb16zowd148jb6xpxszgpnk3fw35wnhfatuzah89uruginfdrw8sk7" {
			// source is Nanswap, attempt to fill alien chain info accurately
			foundOrder := false
			for _, extraCurrencyData := range m.multicurrencyPaymentData {
				order, err := m.p.nanswapClient.GetOrder(ctx, extraCurrencyData.OrderID)
				if err != nil {
					m.p.log.Printf("failed to get order after receiving payment from Nanswap in account %s, order ID %s: %v",
						m.Address(),
						extraCurrencyData.OrderID,
						stacktrace.Propagate(err, ""),
					)
					continue
				}
				if order.Status == nanswapclient.OrderStatusCompleted {
					senderCurrency = extraCurrencyData.Currency
					senderAmount = currencyDecimalToItsRawAmount(order.AmountFrom, senderCurrency)
					from = order.SenderAddress
					foundOrder = true

					m.p.log.Printf("received payment from Nanswap in account %s, order ID %s, %v %s -> %v %s",
						m.Address(),
						extraCurrencyData.OrderID,
						order.AmountFrom, order.From,
						order.AmountTo, order.To,
					)
					break
				}
			}
			if !foundOrder {
				m.p.log.Printf("received payment from Nanswap in account %s but could not find a matching completed order", m.Address())
			}
		}

		m.onPaymentReceived.Notify(PaymentReceivedEventArgs{
			Amount:         Amount{&pending.Amount.Int},
			SenderAmount:   senderAmount,
			SenderCurrency: senderCurrency,
			From:           from,
			Balance:        m.receivableBalance,
			BlockHash:      hash,
		}, true)
	}

	return nil
}

func (m *monitoredAccount) setupMulticurrencySwap(ctx context.Context, expectedAmounts []Amount, extraCurrencies []nanswapclient.Ticker, swapTimeout time.Duration) {
	resultMap := make(map[nanswapclient.Ticker][]Amount)
	currencyOrders := make(map[nanswapclient.Ticker]nanswapclient.CreateOrderResponse)

	paymentData := []MulticurrencyPaymentData{}

	for _, expectedAmount := range expectedAmounts {
		bananoDecimalAmount := rawToBananoDecimal(expectedAmount)
		for _, currency := range extraCurrencies {

			estimation, err := m.p.nanswapClient.GetEstimateReverse(ctx, currency, homeCurrency, bananoDecimalAmount)
			if err != nil {
				resultMap[currency] = append(resultMap[currency], NewAmount(big.NewInt(-1)))
				continue
			}

			amount := currencyDecimalToItsRawAmount(estimation.AmountFrom, currency)
			amount.Div(amount.Int, roundingFactor[currency])
			amount.Add(amount.Int, big.NewInt(1)) // increase price slightly / dumb round up (helps adding tolerance for slippage)
			amount.Mul(amount.Int, roundingFactor[currency])

			resultMap[currency] = append(resultMap[currency], amount)

			// create only one order per currency. NanSwap will attempt to fulfill orders regardless of sent amount
			if _, hasOrder := currencyOrders[currency]; hasOrder {
				continue
			}
			currencyOrders[currency], err = m.p.nanswapClient.CreateOrder(ctx, currency, homeCurrency, estimation.AmountFrom, m.Address(), swapTimeout)
			if err != nil {
				delete(currencyOrders, currency)
				continue
			}
		}
	}

	for currency, order := range currencyOrders {
		paymentData = append(paymentData, MulticurrencyPaymentData{
			Currency:        currency,
			PaymentAddress:  order.PayinAddress,
			ExpectedAmounts: resultMap[currency],
			OrderID:         order.ID,
		})
	}

	if len(paymentData) == 0 {
		return
	}

	m.mu.Lock()
	defer m.mu.Unlock()
	m.multicurrencyPaymentData = paymentData

	m.onMulticurrencyPaymentDataAvailable.Notify(paymentData, true)
}
