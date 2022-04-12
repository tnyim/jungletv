package payment_test

import (
	"math/big"
	"testing"

	"github.com/tnyim/jungletv/server/components/payment"

	"github.com/stretchr/testify/require"
)

func TestAmountCreation(t *testing.T) {
	zero := payment.NewAmount()
	require.Zero(t, zero.Cmp(big.NewInt(0)))

	one := payment.NewAmount(big.NewInt(1))
	require.Zero(t, one.Cmp(big.NewInt(1)))

	three := payment.NewAmount(big.NewInt(1), big.NewInt(2))
	require.Zero(t, three.Cmp(big.NewInt(3)))

	nums := make([]*big.Int, 100)
	for i := 0; i < 100; i++ {
		nums[i] = big.NewInt(int64(i * 2))
	}
	sum := payment.NewAmount(nums...)
	require.Zero(t, sum.Cmp(big.NewInt(9900)))
}
