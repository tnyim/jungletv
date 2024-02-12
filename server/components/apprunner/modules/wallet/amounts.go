package wallet

import (
	"math/big"

	"github.com/dop251/goja"
	"github.com/shopspring/decimal"
	"github.com/tnyim/jungletv/server/components/payment"
	"github.com/tnyim/jungletv/server/components/pricer"
)

func (m *walletModule) compareAmounts(call goja.FunctionCall) goja.Value {
	if len(call.Arguments) < 2 {
		panic(m.runtime.NewTypeError("Missing argument"))
	}

	amountA, err := payment.NewAmountFromAPIString(call.Argument(0).String())
	if err != nil {
		panic(m.runtime.NewTypeError("Invalid amount"))
	}

	amountB, err := payment.NewAmountFromAPIString(call.Argument(1).String())
	if err != nil {
		panic(m.runtime.NewTypeError("Invalid amount"))
	}

	return m.runtime.ToValue(amountA.Cmp(amountB.Int))
}

var bananoUnit = payment.NewAmount(pricer.BananoUnit).Decimal()

func (m *walletModule) formatAmount(call goja.FunctionCall) goja.Value {
	if len(call.Arguments) < 1 {
		panic(m.runtime.NewTypeError("Missing argument"))
	}

	amount, err := payment.NewAmountFromAPIString(call.Argument(0).String())
	if err != nil {
		panic(m.runtime.NewTypeError("Invalid amount"))
	}

	// decimal Div is not exact (this makes sense since decimal.Decimal is not e.g. a Computer Algebra System, so it isn't designed to exactly represent irrational numbers)
	// Banano max supply is 39 digits long in raw format, so 50 digits of precision should be fine here
	divided := amount.Decimal().DivRound(bananoUnit, 50)

	return m.runtime.ToValue(divided.String())
}

func (m *walletModule) parseAmount(call goja.FunctionCall) goja.Value {
	if len(call.Arguments) < 1 {
		panic(m.runtime.NewTypeError("Missing argument"))
	}

	decimalToMultiply, err := decimal.NewFromString(call.Argument(0).String())
	if err != nil {
		panic(m.runtime.NewTypeError("Invalid argument"))
	}

	multipliedDecimal := decimalToMultiply.Mul(bananoUnit)

	return m.runtime.ToValue(payment.NewAmountFromDecimal(multipliedDecimal).SerializeForAPI())
}

func (m *walletModule) addAmounts(call goja.FunctionCall) goja.Value {
	sum := big.NewInt(0)
	for _, arg := range call.Arguments {
		amount, err := payment.NewAmountFromAPIString(arg.String())
		if err != nil {
			panic(m.runtime.NewTypeError("Invalid amount"))
		}
		sum.Add(sum, amount.Int)
	}
	return m.runtime.ToValue(payment.NewAmount(sum).SerializeForAPI())
}

func (m *walletModule) negateAmount(call goja.FunctionCall) goja.Value {
	if len(call.Arguments) < 1 {
		panic(m.runtime.NewTypeError("Missing argument"))
	}

	amount, err := payment.NewAmountFromAPIString(call.Argument(0).String())
	if err != nil {
		panic(m.runtime.NewTypeError("Invalid amount"))
	}

	amount.Neg(amount.Int)

	return m.runtime.ToValue(amount.SerializeForAPI())
}
