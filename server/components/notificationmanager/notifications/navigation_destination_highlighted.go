package notifications

import (
	"time"

	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/server/auth"
	"github.com/tnyim/jungletv/server/components/notificationmanager"
)

func NavigationDestinationHighlightedForUserKey(destinationID string, user auth.User) notificationmanager.PersistencyKey {
	if user == nil || user.IsUnknown() {
		return notificationmanager.PersistencyKey(NavigationDestinationHighlightedPrefix(destinationID))
	}
	return notificationmanager.PersistencyKey(NavigationDestinationHighlightedPrefix(destinationID) + user.Address())
}

func NavigationDestinationHighlightedPrefix(destinationID string) string {
	return "nav_hi_" + destinationID + "_"
}

func NewNavigationDestinationHighlightedForUserNotification(applicationID string, user auth.User, expiry time.Time, destinationID string) notificationmanager.Notification {
	return notificationmanager.MakePersistentNotificationWithSenderApplication(
		applicationID,
		NavigationDestinationHighlightedForUserKey(destinationID, user),
		notificationmanager.MakeUserRecipient(user),
		expiry,
		&proto.Notification_NavigationDestinationHighlighted{
			NavigationDestinationHighlighted: &proto.NavigationDestinationHighlightedNotification{
				DestinationId: destinationID,
			},
		},
	)
}

func NewNavigationDestinationHighlightedForEveryoneNotification(applicationID string, expiry time.Time, destinationID string) notificationmanager.Notification {
	return notificationmanager.MakePersistentNotificationWithSenderApplication(
		applicationID,
		NavigationDestinationHighlightedForUserKey(destinationID, auth.UnknownUser),
		notificationmanager.RecipientEveryone,
		expiry,
		&proto.Notification_NavigationDestinationHighlighted{
			NavigationDestinationHighlighted: &proto.NavigationDestinationHighlightedNotification{
				DestinationId: destinationID,
			},
		},
	)
}
