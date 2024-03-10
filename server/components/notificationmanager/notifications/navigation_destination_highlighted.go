package notifications

import (
	"time"

	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/server/auth"
	"github.com/tnyim/jungletv/server/components/notificationmanager"
)

func NavigationDestinationHighlightedForUserKey(destinationID string, user auth.User) notificationmanager.PersistencyKey {
	if user == nil || user.IsUnknown() {
		return ""
	}
	return notificationmanager.PersistencyKey(NavigationDestinationHighlightedPrefix(destinationID) + user.Address())
}

func NavigationDestinationHighlightedPrefix(destinationID string) string {
	return "nav_hi_" + destinationID + "_"
}

func NewNavigationDestinationHighlightedForUserNotification(user auth.User, expiry time.Time, destinationID string) notificationmanager.Notification {
	return notificationmanager.MakePersistentNotification(
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

func NewNavigationDestinationHighlightedForEveryoneNotification(expiry time.Time, destinationID string) notificationmanager.Notification {
	return notificationmanager.MakePersistentNotification(
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
