package rewards

import (
	"time"

	"github.com/tnyim/jungletv/server/components/payment"
	"github.com/tnyim/jungletv/server/media"
	"github.com/tnyim/jungletv/utils/event"
)

// RewardsDistributedEventArgs are the arguments to the event that is fired when rewards are distributed for a queue entry
type RewardsDistributedEventArgs struct {
	RewardBudget       payment.Amount
	EligibleSpectators []string
	RequesterReward    payment.Amount
	Media              media.QueueEntry
}

// RewardsDistributed is the event that is fired when rewards are distributed for a queue entry
func (r *Handler) RewardsDistributed() event.Event[RewardsDistributedEventArgs] {
	return r.rewardsDistributed
}

// SpectatorConnected is the event that is fired when a spectator establishes their first connection
func (r *Handler) SpectatorConnected() event.Event[Spectator] {
	return r.spectatorConnected
}

// SpectatorDisconnected is the event that is fired when a spectator disconnects their last remaining connection
func (r *Handler) SpectatorDisconnected() event.Event[Spectator] {
	return r.spectatorDisconnected
}

type SpectatorActivityChallengedEventArgs struct {
	Spectator                    Spectator
	HadPreviousUnsolvedChallenge bool
	HardChallenge                bool
}

func (r *Handler) SpectatorActivityChallenged() event.Event[SpectatorActivityChallengedEventArgs] {
	return r.spectatorActivityChallenged
}

// SpectatorSolvedActivityChallengeEventArgs are the arguments to the event that is fired when a spectator solves an activity challenge
type SpectatorSolvedActivityChallengeEventArgs struct {
	Spectator       Spectator
	ChallengedFor   time.Duration
	CorrectSolution bool
	HardChallenge   bool
}

// SpectatorSolvedActivityChallenge is the event that is fired when a spectator solves an activity challenge
func (r *Handler) SpectatorSolvedActivityChallenge() event.Event[SpectatorSolvedActivityChallengeEventArgs] {
	return r.spectatorSolvedActivityChallenge
}
