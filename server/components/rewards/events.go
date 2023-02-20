package rewards

import (
	"github.com/tnyim/jungletv/server/components/payment"
	"github.com/tnyim/jungletv/server/media"
	"github.com/tnyim/jungletv/utils/event"
)

// RewardsDistributedEventArgs are the arguments to the event that is fired when rewards are distributed for a queue entry
type RewardsDistributedEventArgs struct {
	RewardBudget       payment.Amount
	EligibleSpectators int
	RequesterReward    payment.Amount
	Media              media.QueueEntry
}

// SpectatorRewardedEventArgs are the arguments to the event that is fired when a spectator is rewarded
type SpectatorRewardedEventArgs struct {
	Reward        payment.Amount
	RewardBalance payment.Amount
}

// RewardsDistributed is the event that is fired when rewards are distributed for a queue entry
func (r *Handler) RewardsDistributed() event.Event[RewardsDistributedEventArgs] {
	return r.rewardsDistributed
}
