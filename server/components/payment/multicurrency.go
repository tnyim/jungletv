package payment

import (
	"context"
	"math/big"
	"time"

	"github.com/palantir/stacktrace"
	"github.com/shopspring/decimal"
	"github.com/tnyim/jungletv/server/components/nanswapclient"
)

type MulticurrencyPaymentData struct {
	Currency        nanswapclient.Ticker
	PaymentAddress  string
	ExpectedAmounts []Amount
	OrderID         string
}

var homeCurrency = nanswapclient.TickerBanano

func (p *PaymentAccountPool) ReceiveMulticurrencyPayment(ctx context.Context, expectedAmounts []Amount, extraCurrencies []nanswapclient.Ticker, swapTimeout time.Duration) (PaymentReceiver, error) {
	receiver, err := p.receivePaymentImpl(p.defaultCollectorAccountAddress)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	if len(expectedAmounts) == 0 {
		return nil, stacktrace.NewError("missing expected amount")
	}
	if len(extraCurrencies) == 0 {
		return nil, stacktrace.NewError("missing extra currency")
	}

	if p.enableMulticurrencyPayments {
		go receiver.setupMulticurrencySwap(context.Background(), expectedAmounts, extraCurrencies, swapTimeout)
	}

	return receiver, nil
}

func rawToBananoDecimal(amount Amount) decimal.Decimal {
	rawDecimal := amount.Decimal()
	unitDecimal := decimal.NewFromBigInt(units[nanswapclient.TickerBanano], 0)
	return rawDecimal.Div(unitDecimal)
}

func currencyDecimalToItsRawAmount(d decimal.Decimal, ticker nanswapclient.Ticker) Amount {
	return NewAmountFromDecimal(d.Mul(decimal.NewFromBigInt(units[ticker], 0)))
}

var units map[nanswapclient.Ticker]*big.Int = map[nanswapclient.Ticker]*big.Int{
	nanswapclient.TickerBanano: big.NewInt(1).Exp(big.NewInt(10), big.NewInt(29), big.NewInt(0)),
	nanswapclient.TickerNano:   big.NewInt(1).Exp(big.NewInt(10), big.NewInt(30), big.NewInt(0)),
}

var roundingFactor map[nanswapclient.Ticker]*big.Int = map[nanswapclient.Ticker]*big.Int{
	nanswapclient.TickerBanano: big.NewInt(1).Exp(big.NewInt(10), big.NewInt(27), big.NewInt(0)),
	nanswapclient.TickerNano:   big.NewInt(1).Exp(big.NewInt(10), big.NewInt(24), big.NewInt(0)),
}
