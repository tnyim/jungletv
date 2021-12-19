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
	minimumPricesMultiplier   int
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
		minimumPricesMultiplier:   25,
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

func (p *Pricer) SetMinimumPricesMultiplier(m int) {
	if m < 1 {
		return
	}
	p.minimumPricesMultiplier = m
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
	// QueueLengthFactor = floor(100 * (QueueLength to the power of 1.3))
	// UnskippableFactor is 19 if unskippable, else 0
	// LengthInSeconds gets wonky for videos under 75 seconds
	// EnqueuePrice = ( BaseEnqueuePrice * LengthInSeconds * (1000 + QueueLengthFactor + currentlyWatching * minimumPricesMultiplier) ) / 500000 * UnskippableFactor
	// PlayNextPrice = EnqueuePrice * 3
	// PlayNowPrice = EnqueuePrice * (10 + floor(queueLength / 10))
	currentlyWatching := p.currentlyWatchingEligible()
	if currentlyWatching <= 0 {
		currentlyWatching = 1
	}
	queueLength := p.mediaQueue.LengthUpToCursor() - 1
	if queueLength < 0 {
		queueLength = 0
	}
	queueLengthFactor := int64(100.0 * math.Pow(float64(queueLength), 1.3))

	lengthInSeconds := int64(videoDuration.Seconds())

	// penalize very short videos
	if lengthInSeconds < 75 {
		lengthInSeconds = int64(math.Pow(float64(lengthInSeconds+1), -0.6)*3600.0) - 192
	}

	pricing := EnqueuePricing{}

	pricing.EnqueuePrice = Amount{new(big.Int)}
	pricing.EnqueuePrice.Set(BaseEnqueuePrice)
	m := big.NewInt(1000).Add(big.NewInt(1000), big.NewInt(queueLengthFactor))
	m = m.Add(m, big.NewInt(int64(currentlyWatching*350)))
	pricing.EnqueuePrice.Mul(pricing.EnqueuePrice.Int, m)
	pricing.EnqueuePrice.Mul(pricing.EnqueuePrice.Int, big.NewInt(lengthInSeconds))
	pricing.EnqueuePrice.Div(pricing.EnqueuePrice.Int, big.NewInt(500000))
	if unskippable {
		pricing.EnqueuePrice.Div(pricing.EnqueuePrice.Int, big.NewInt(10))
		pricing.EnqueuePrice.Mul(pricing.EnqueuePrice.Int, big.NewInt(69))
	}

	pricing.EnqueuePrice.Div(pricing.EnqueuePrice.Int, big.NewInt(100))
	pricing.EnqueuePrice.Mul(pricing.EnqueuePrice.Int, big.NewInt(int64(p.finalPricesMultiplier)))

	// never allow prices to go below a certain amount per spectator as otherwise we risk having 0 to distribute per user
	// (e.g. if the number of eligible spectators increases until the entry plays)
	minimumUnit := big.NewInt(0).Div(BananoUnit, big.NewInt(1000))
	minimumUnit.Mul(minimumUnit, big.NewInt(int64(p.minimumPricesMultiplier)))
	currentlyWatchingBigInt := big.NewInt(int64(currentlyWatching))
	if big.NewInt(0).Div(pricing.EnqueuePrice.Int, currentlyWatchingBigInt).Cmp(minimumUnit) < 0 {
		pricing.EnqueuePrice.Mul(minimumUnit, currentlyWatchingBigInt)
	}

	pricing.EnqueuePrice.Div(pricing.EnqueuePrice.Int, PriceRoundingFactor)
	pricing.EnqueuePrice.Mul(pricing.EnqueuePrice.Int, PriceRoundingFactor)

	pricing.PlayNextPrice = Amount{new(big.Int)}
	pricing.PlayNextPrice.Set(pricing.EnqueuePrice.Int)
	pricing.PlayNextPrice.Mul(pricing.PlayNextPrice.Int, big.NewInt(3))

	pricing.PlayNowPrice = Amount{new(big.Int)}
	pricing.PlayNowPrice.Set(pricing.EnqueuePrice.Int)
	pricing.PlayNowPrice.Mul(pricing.PlayNowPrice.Int, big.NewInt(8+int64(queueLength/8)))

	return pricing
}

func (p *Pricer) ComputeCrowdfundedSkipPricing() Amount {
	pricing := p.ComputeEnqueuePricing(5*time.Minute, false)
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
