package notifications

import (
	"time"

	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/server/auth"
	"github.com/tnyim/jungletv/server/components/notificationmanager"
	"google.golang.org/protobuf/types/known/durationpb"
)

func NewToastNotification(applicationID, message, href string, duration time.Duration) notificationmanager.Notification {
	return notificationmanager.MakeNotificationWithSenderApplication(
		applicationID,
		notificationmanager.RecipientEveryone,
		&proto.Notification_Toast{
			Toast: &proto.ToastNotification{
				Message:  message,
				Href:     href,
				Duration: durationpb.New(duration),
			},
		},
	)
}

func NewToastForUserNotification(applicationID string, user auth.User, message, href string, duration time.Duration) notificationmanager.Notification {
	return notificationmanager.MakeNotificationWithSenderApplication(
		applicationID,
		notificationmanager.MakeUserRecipient(user),
		&proto.Notification_Toast{
			Toast: &proto.ToastNotification{
				Message:  message,
				Href:     href,
				Duration: durationpb.New(duration),
			},
		},
	)
}
