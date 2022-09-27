package pricer

import (
	"log"
	"math"
	"math/big"
	"time"

	"github.com/tnyim/jungletv/server/components/mediaqueue"
	"github.com/tnyim/jungletv/server/components/payment"
	"github.com/tnyim/jungletv/server/components/stats"
)

// Pricer manages pricing
type Pricer struct {
	log                       *log.Logger
	mediaQueue                *mediaqueue.MediaQueue
	eligibleEstimator         EligibleSpectatorsEstimator
	statsRegistry             *stats.Registry
	minimumPricesMultiplier   int
	finalPricesMultiplier     int
	crowdfundedSkipMultiplier int
}

type EligibleSpectatorsEstimator interface {
	EstimateEligibleSpectators() (int, bool)
}

// New returns an initialized pricer
func New(log *log.Logger,
	mediaQueue *mediaqueue.MediaQueue,
	statsRegistry *stats.Registry) *Pricer {
	return &Pricer{
		log:                       log,
		mediaQueue:                mediaQueue,
		statsRegistry:             statsRegistry,
		minimumPricesMultiplier:   25,
		finalPricesMultiplier:     100,
		crowdfundedSkipMultiplier: 150, // this means crowdfunded skipping will be 1.5x as expensive as normal individual skipping
	}
}

func (p *Pricer) SetEligibleSpectatorsEstimator(eligibleEstimator EligibleSpectatorsEstimator) {
	p.eligibleEstimator = eligibleEstimator
}

func (p *Pricer) FinalPricesMultiplier() int {
	return p.finalPricesMultiplier
}

func (p *Pricer) SetFinalPricesMultiplier(m int) {
	if m < 1 {
		return
	}
	p.finalPricesMultiplier = m
}

func (p *Pricer) SkipPriceMultiplier() int {
	return p.crowdfundedSkipMultiplier
}

func (p *Pricer) SetSkipPriceMultiplier(m int) {
	if m < 1 {
		return
	}
	p.crowdfundedSkipMultiplier = m
}

func (p *Pricer) MinimumPricesMultiplier() int {
	return p.minimumPricesMultiplier
}

func (p *Pricer) SetMinimumPricesMultiplier(m int) {
	if m < 1 {
		return
	}
	p.minimumPricesMultiplier = m
}

// EnqueuePricing contains the price for different enqueuing modes
type EnqueuePricing struct {
	EnqueuePrice  payment.Amount
	PlayNextPrice payment.Amount
	PlayNowPrice  payment.Amount
}

// ComputeEnqueuePricing calculates the prices to charge for a new queue entry considering the current queue conditions
func (p *Pricer) ComputeEnqueuePricing(mediaDuration time.Duration, unskippable, concealed bool) EnqueuePricing {
	// QueueLength = max(0, actual queue length - 1)
	// QueueLengthFactor = floor(100 * (QueueLength to the power of 1.3))
	// UnskippableFactor is 19 if unskippable, else 0
	// LengthInSeconds gets wonky for media under 75 seconds
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

	lengthInSeconds := int64(mediaDuration.Seconds())

	// penalize very short media
	if lengthInSeconds < 75 {
		lengthInSeconds = int64(math.Pow(float64(lengthInSeconds+1), -0.6)*3600.0) - 192
	}

	pricing := EnqueuePricing{}

	pricing.EnqueuePrice = payment.NewAmount(BaseEnqueuePrice)
	m := big.NewInt(1000).Add(big.NewInt(1000), big.NewInt(queueLengthFactor))
	m = m.Add(m, big.NewInt(int64(currentlyWatching*350)))
	pricing.EnqueuePrice.Mul(pricing.EnqueuePrice.Int, m)
	pricing.EnqueuePrice.Mul(pricing.EnqueuePrice.Int, big.NewInt(lengthInSeconds))
	pricing.EnqueuePrice.Div(pricing.EnqueuePrice.Int, big.NewInt(500000))
	if unskippable {
		pricing.EnqueuePrice.Div(pricing.EnqueuePrice.Int, big.NewInt(10))
		pricing.EnqueuePrice.Mul(pricing.EnqueuePrice.Int, big.NewInt(69))
	}

	if concealed {
		pricing.EnqueuePrice.Div(pricing.EnqueuePrice.Int, big.NewInt(10))
		pricing.EnqueuePrice.Mul(pricing.EnqueuePrice.Int, big.NewInt(15))
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

	pricing.PlayNextPrice = payment.NewAmount(pricing.EnqueuePrice.Int)
	pricing.PlayNextPrice.Mul(pricing.PlayNextPrice.Int, big.NewInt(3))

	pricing.PlayNowPrice = payment.NewAmount(pricing.EnqueuePrice.Int)
	pricing.PlayNowPrice.Mul(pricing.PlayNowPrice.Int, big.NewInt(8+int64(queueLength/8)))

	return pricing
}

func (p *Pricer) ComputeCrowdfundedSkipPricing(recentCrowdfundedSkips int) payment.Amount {
	pricing := p.ComputeEnqueuePricing(5*time.Minute, false, false)
	v := big.NewInt(0).Mul(
		pricing.PlayNowPrice.Int,
		big.NewInt(int64(p.crowdfundedSkipMultiplier)),
	)
	if recentCrowdfundedSkips > 0 {
		recentSkipMul := math.Pow(1.1, float64(recentCrowdfundedSkips)) * 10000
		v.Mul(v, big.NewInt(int64(recentSkipMul)))
		v.Div(v, big.NewInt(10000))
	}
	v.Div(v, big.NewInt(100))
	v.Div(v, PriceRoundingFactor)
	v.Mul(v, PriceRoundingFactor)
	return payment.NewAmount(v)
}

func (p *Pricer) currentlyWatchingEligible() int {
	if p.eligibleEstimator == nil {
		return 0
	}
	currentlyWatchingEligible, ok := p.eligibleEstimator.EstimateEligibleSpectators()
	if !ok {
		// we didn't send rewards yet since restarting, take the total number of spectators and assume 50% are eligible
		// (50% figure chosen based on observed data)
		currentlyWatchingTotal := p.statsRegistry.CurrentlyWatching()
		currentlyWatchingEligible = currentlyWatchingTotal / 2
	}
	return currentlyWatchingEligible
}
