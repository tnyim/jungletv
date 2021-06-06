package server

import (
	"math/big"
	"time"
)

// BaseEnqueuePrice is the price to enqueue on an empty queue
var BaseEnqueuePrice *big.Int = big.NewInt(1).Exp(big.NewInt(10), big.NewInt(29), big.NewInt(0)) // 100000000000000000000000000000

// RewardRoundingFactor is the rounding factor for per-user rewards
var RewardRoundingFactor *big.Int = big.NewInt(1).Exp(big.NewInt(10), big.NewInt(27), big.NewInt(0)) // 1000000000000000000000000000

// EnqueuePricing contains the price for different enqueuing modes
type EnqueuePricing struct {
	EnqueuePrice  Amount
	PlayNextPrice Amount
	PlayNowPrice  Amount
}

// ComputeEnqueuePricing calculates the prices to charge for a new queue entry considering the current queue conditions
func ComputeEnqueuePricing(mediaQueue *MediaQueue, currentlyWatching int, videoDuration time.Duration) EnqueuePricing {
	// QueueLength = max(0, actual queue length - 1)
	// LengthPenalty is 0 for videos under 6 minutes, 1 for videos with [6, 10[ minutes, 5 for videos with [10, 14[ minutes, 12 for videos with [14, 20[ minutes, 20 for videos with [20, 25[ minutes, 40 for videos with [25, 30] minutes
	// EnqueuePrice = BaseEnqueuePrice * (1 + (QueueLength * 0.1) + (currentlyWatching * 0.01) + LengthPenalty)
	// or: EnqueuePrice = ( BaseEnqueuePrice * (1000 + QueueLength * 100 + currentlyWatching * 10 + LengthPenalty * 1000) ) / 1000
	// PlayNextPrice = EnqueuePrice * 3
	// PlayNowPrice = EnqueuePrice * 10
	queueLength := mediaQueue.Length() - 1
	if queueLength < 0 {
		queueLength = 0
	}

	lengthPenalty := 0
	switch {
	case videoDuration.Minutes() >= 25:
		lengthPenalty = 40
	case videoDuration.Minutes() >= 20:
		lengthPenalty = 20
	case videoDuration.Minutes() >= 14:
		lengthPenalty = 12
	case videoDuration.Minutes() >= 10:
		lengthPenalty = 5
	case videoDuration.Minutes() >= 6:
		lengthPenalty = 1
	}

	pricing := EnqueuePricing{}

	pricing.EnqueuePrice = Amount{new(big.Int)}
	pricing.EnqueuePrice.Set(BaseEnqueuePrice)
	m := big.NewInt(1000).Add(big.NewInt(1000), big.NewInt(int64(queueLength*100)))
	m = m.Add(m, big.NewInt(int64(currentlyWatching*10)))
	m = m.Add(m, big.NewInt(int64(lengthPenalty*1000)))
	pricing.EnqueuePrice.Mul(pricing.EnqueuePrice.Int, m)
	pricing.EnqueuePrice.Div(pricing.EnqueuePrice.Int, big.NewInt(1000))

	pricing.PlayNextPrice = Amount{new(big.Int)}
	pricing.PlayNextPrice.Set(pricing.EnqueuePrice.Int)
	pricing.PlayNextPrice.Mul(pricing.PlayNextPrice.Int, big.NewInt(3))

	pricing.PlayNowPrice = Amount{new(big.Int)}
	pricing.PlayNowPrice.Set(pricing.EnqueuePrice.Int)
	pricing.PlayNowPrice.Mul(pricing.PlayNowPrice.Int, big.NewInt(10))

	return pricing
}

// ComputeReward calculates how much each user should receive
func ComputeReward(totalAmount Amount, numUsers int) Amount {
	amountForEach := Amount{new(big.Int)}
	amountForEach.Div(totalAmount.Int, big.NewInt(int64(numUsers)))
	// "floor" (round down) reward to prevent dust amounts
	amountForEach.Div(amountForEach.Int, RewardRoundingFactor)
	amountForEach.Mul(amountForEach.Int, RewardRoundingFactor)
	return amountForEach
}
