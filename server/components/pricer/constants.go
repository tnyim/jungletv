package pricer

import "math/big"

// BananoUnit is 1 BAN
var BananoUnit *big.Int = big.NewInt(1).Exp(big.NewInt(10), big.NewInt(29), big.NewInt(0)) // 100000000000000000000000000000

// BaseEnqueuePrice is the price to enqueue on an empty queue
var BaseEnqueuePrice *big.Int = new(big.Int).Div(BananoUnit, big.NewInt(2))

// PriceRoundingFactor is the rounding factor for enqueue prices
var PriceRoundingFactor *big.Int = new(big.Int).Div(BananoUnit, big.NewInt(100))

// RewardRoundingFactor is the rounding factor for per-user rewards
var RewardRoundingFactor *big.Int = new(big.Int).Div(BananoUnit, big.NewInt(100))

// DustThreshold is the minimum admissible amount for a transaction to be processed
var DustThreshold *big.Int = new(big.Int).Div(BananoUnit, big.NewInt(1000))
