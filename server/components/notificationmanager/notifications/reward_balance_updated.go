package notifications

import (
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/server/auth"
	"github.com/tnyim/jungletv/server/components/notificationmanager"
	"github.com/tnyim/jungletv/server/components/payment"
)

func NewRewardBalanceUpdatedNotification(user auth.User, rewardBalance payment.Amount, diff payment.Amount) notificationmanager.Notification {
	return notificationmanager.MakeNotification(
		notificationmanager.MakeUserRecipient(user),
		&proto.Notification_RewardBalanceUpdated{
			RewardBalanceUpdated: &proto.RewardBalanceUpdatedNotification{
				RewardBalance: rewardBalance.SerializeForAPI(),
				Difference:    diff.SerializeForAPI(),
			},
		},
	)
}
