package server

import (
	"math"
	"math/big"
	"time"
)

// BananoUnit is 1 BAN
var BananoUnit *big.Int = big.NewInt(1).Exp(big.NewInt(10), big.NewInt(29), big.NewInt(0)) // 100000000000000000000000000000

// BaseEnqueuePrice is the price to enqueue on an empty queue
var BaseEnqueuePrice *big.Int = new(big.Int).Div(BananoUnit, big.NewInt(2))

// PriceRoundingFactor is the rounding factor for enqueue prices
var PriceRoundingFactor *big.Int = new(big.Int).Div(BananoUnit, big.NewInt(100))

// RewardRoundingFactor is the rounding factor for per-user rewards
var RewardRoundingFactor *big.Int = new(big.Int).Div(BananoUnit, big.NewInt(100))

// EnqueuePricing contains the price for different enqueuing modes
type EnqueuePricing struct {
	EnqueuePrice  Amount
	PlayNextPrice Amount
	PlayNowPrice  Amount
}

// ComputeEnqueuePricing calculates the prices to charge for a new queue entry considering the current queue conditions
func ComputeEnqueuePricing(mediaQueue *MediaQueue, currentlyWatching int, videoDuration time.Duration, unskippable bool, finalMultiplier int) EnqueuePricing {
	// QueueLength = max(0, actual queue length - 1)
	// QueueLengthFactor = floor(100 * (QueueLength to the power of 1.2))
	// LengthPenalty is ... see the switch below
	// UnskippableFactor is 19 if unskippable, else 0
	// EnqueuePrice = BaseEnqueuePrice * (1 + (QueueLengthFactor/10) + (currentlyWatching * 0.1) + LengthPenalty) * UnskippableFactor
	// or: EnqueuePrice = ( BaseEnqueuePrice * (1000 + QueueLengthFactor + currentlyWatching * 100 + LengthPenalty * 1000) ) / 1000 * UnskippableFactor
	// PlayNextPrice = EnqueuePrice * 3
	// PlayNowPrice = EnqueuePrice * 10
	queueLength := mediaQueue.Length() - 1
	if queueLength < 0 {
		queueLength = 0
	}
	queueLengthFactor := int64(100.0 * math.Pow(float64(queueLength), 1.3))

	lengthPenalty := 0
	switch {
	case videoDuration.Minutes() >= 30:
		lengthPenalty = 100
	case videoDuration.Minutes() >= 25:
		lengthPenalty = 70
	case videoDuration.Minutes() >= 20:
		lengthPenalty = 45
	case videoDuration.Minutes() >= 17:
		lengthPenalty = 35
	case videoDuration.Minutes() >= 14:
		lengthPenalty = 25
	case videoDuration.Minutes() >= 10:
		lengthPenalty = 15
	case videoDuration.Minutes() >= 6.5:
		lengthPenalty = 7
	case videoDuration.Minutes() >= 4.5:
		lengthPenalty = 4
	case videoDuration.Minutes() < 0.5:
		lengthPenalty = 15
	case videoDuration.Minutes() < 1:
		lengthPenalty = 8
	case videoDuration.Minutes() < 1.2:
		lengthPenalty = 6
	}

	pricing := EnqueuePricing{}

	pricing.EnqueuePrice = Amount{new(big.Int)}
	pricing.EnqueuePrice.Set(BaseEnqueuePrice)
	m := big.NewInt(1000).Add(big.NewInt(1000), big.NewInt(queueLengthFactor))
	m = m.Add(m, big.NewInt(int64(currentlyWatching*250)))
	m = m.Add(m, big.NewInt(int64(lengthPenalty*1000)))
	pricing.EnqueuePrice.Mul(pricing.EnqueuePrice.Int, m)
	pricing.EnqueuePrice.Div(pricing.EnqueuePrice.Int, big.NewInt(1000))
	if unskippable {
		pricing.EnqueuePrice.Mul(pricing.EnqueuePrice.Int, big.NewInt(19))
	}

	pricing.EnqueuePrice.Div(pricing.EnqueuePrice.Int, big.NewInt(100))
	pricing.EnqueuePrice.Mul(pricing.EnqueuePrice.Int, big.NewInt(int64(finalMultiplier)))

	pricing.EnqueuePrice.Div(pricing.EnqueuePrice.Int, PriceRoundingFactor)
	pricing.EnqueuePrice.Mul(pricing.EnqueuePrice.Int, PriceRoundingFactor)

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
