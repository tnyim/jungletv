package skipmanager

import (
	"github.com/tnyim/jungletv/server/components/payment"
	"github.com/tnyim/jungletv/types"
	"github.com/tnyim/jungletv/utils/event"
)

// SkipStatusUpdatedEventArgs are the arguments to the event that is fired when the skip status is updated
type SkipStatusUpdatedEventArgs struct {
	SkipAccountStatus *SkipAccountStatus
	RainAccountStatus *RainAccountStatus
}

// StatusUpdated is the event that is fired when the skip status is updated
func (s *Manager) StatusUpdated() event.Event[SkipStatusUpdatedEventArgs] {
	return s.statusUpdated
}

// SkipThresholdReductionMilestoneReached is the event that is fired when a milestone in skip threshold reduction is reached
func (s *Manager) SkipThresholdReductionMilestoneReached() event.Event[float64] {
	return s.skipThresholdReductionMilestoneReached
}

// CrowdfundedSkip is the event that is fired when the community skips a track.
// The total amount used to skip is sent as the argument
func (s *Manager) CrowdfundedSkip() event.Event[payment.Amount] {
	return s.crowdfundedSkip
}

// CrowdfundedTransactionReceived is the event that is fired when a community skipping or community tipping transaction is received
func (s *Manager) CrowdfundedTransactionReceived() event.Event[*types.CrowdfundedTransaction] {
	return s.crowdfundedTransactionReceived
}
