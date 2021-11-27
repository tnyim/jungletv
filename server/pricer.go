package server

import (
	"log"
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

var dustThreshold *big.Int = new(big.Int).Div(BananoUnit, big.NewInt(1000))

// Pricer manages pricing
type Pricer struct {
	log                       *log.Logger
	mediaQueue                *MediaQueue
	rewardsHandler            *RewardsHandler
	statsHandler              *StatsHandler
	finalPricesMultiplier     int
	crowdfundedSkipMultiplier int
}

// NewPricer returns an initialized pricer
func NewPricer(log *log.Logger,
	mediaQueue *MediaQueue,
	rewardsHandler *RewardsHandler,
	statsHandler *StatsHandler) *Pricer {
	return &Pricer{
		log:                       log,
		mediaQueue:                mediaQueue,
		rewardsHandler:            rewardsHandler,
		statsHandler:              statsHandler,
		finalPricesMultiplier:     100,
		crowdfundedSkipMultiplier: 150, // this means crowdfunded skipping will be 1.5x as expensive as normal individual skipping
	}
}

func (p *Pricer) SetFinalPricesMultiplier(m int) {
	if m < 1 {
		return
	}
	p.finalPricesMultiplier = m
}

func (p *Pricer) SetSkipPriceMultiplier(m int) {
	if m < 1 {
		return
	}
	p.crowdfundedSkipMultiplier = m
}

// EnqueuePricing contains the price for different enqueuing modes
type EnqueuePricing struct {
	EnqueuePrice  Amount
	PlayNextPrice Amount
	PlayNowPrice  Amount
}

// ComputeEnqueuePricing calculates the prices to charge for a new queue entry considering the current queue conditions
func (p *Pricer) ComputeEnqueuePricing(videoDuration time.Duration, unskippable bool) EnqueuePricing {
	// QueueLength = max(0, actual queue length - 1)
	// QueueLengthFactor = floor(100 * (QueueLength to the power of 1.2))
	// LengthPenalty is ... see the switch below
	// UnskippableFactor is 19 if unskippable, else 0
	// EnqueuePrice = BaseEnqueuePrice * (1 + (QueueLengthFactor/10) + (currentlyWatching * 0.1) + LengthPenalty) * UnskippableFactor
	// or: EnqueuePrice = ( BaseEnqueuePrice * (1000 + QueueLengthFactor + currentlyWatching * 100 + LengthPenalty * 1000) ) / 1000 * UnskippableFactor
	// PlayNextPrice = EnqueuePrice * 3
	// PlayNowPrice = EnqueuePrice * 10
	currentlyWatching := p.currentlyWatchingEligible()
	queueLength := p.mediaQueue.LengthUpToCursor() - 1
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
	pricing.EnqueuePrice.Mul(pricing.EnqueuePrice.Int, big.NewInt(int64(p.finalPricesMultiplier)))

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

func (p *Pricer) ComputeCrowdfundedSkipPricing() Amount {
	pricing := p.ComputeEnqueuePricing(3*time.Minute, false)
	v := big.NewInt(0).Div(
		big.NewInt(0).Mul(
			pricing.PlayNowPrice.Int,
			big.NewInt(int64(p.crowdfundedSkipMultiplier)),
		),
		big.NewInt(100),
	)
	v.Div(v, PriceRoundingFactor)
	v.Mul(v, PriceRoundingFactor)
	return Amount{v}
}

func (p *Pricer) currentlyWatchingEligible() int {
	currentlyWatchingEligible := int(p.rewardsHandler.eligibleMovingAverage.Avg())
	if p.rewardsHandler.eligibleMovingAverage.Count() == 0 {
		// we didn't send rewards yet since restarting, take the total number of spectators and assume 50% are eligible
		// (50% figure chosen based on observed data)
		currentlyWatchingTotal := p.statsHandler.CurrentlyWatching()
		currentlyWatchingEligible = currentlyWatchingTotal / 2
	}
	return currentlyWatchingEligible
}
