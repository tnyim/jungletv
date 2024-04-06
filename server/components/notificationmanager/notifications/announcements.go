package notifications

import (
	"time"

	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/server/components/notificationmanager"
)

const AnnouncementsKey notificationmanager.PersistencyKey = "announcements"

func NewAnnouncementsUpdatedNotification(counter int) notificationmanager.Notification {
	return notificationmanager.MakePersistentNotification(
		AnnouncementsKey,
		notificationmanager.RecipientEveryone,
		time.Now().Add(7*24*time.Hour),
		&proto.Notification_AnnouncementsUpdated{
			AnnouncementsUpdated: &proto.AnnouncementsUpdatedNotification{
				NotificationCounter: uint32(counter),
			},
		},
	)
}
