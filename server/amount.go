package server

import (
	"math/big"

	"github.com/shopspring/decimal"
)

type Amount struct {
	*big.Int
}

func NewAmount() Amount {
	return Amount{big.NewInt(0)}
}

func NewAmountFromDecimal(d decimal.Decimal) Amount {
	return Amount{d.BigInt()}
}

func (a Amount) Decimal() decimal.Decimal {
	return decimal.NewFromBigInt(a.Int, 0)
}

func (a Amount) SerializeForAPI() string {
	if a.Int == nil {
		return "0"
	}
	return a.String()
}
