package notificationmanager

import (
	"time"

	"github.com/tnyim/jungletv/proto"
)

type defaultNotificationImpl struct {
	recipient Recipient
	data      proto.IsNotification_NotificationData
}

func (d defaultNotificationImpl) Recipient() Recipient {
	return d.recipient
}

func (d defaultNotificationImpl) Expiration() time.Time {
	return time.Time{}
}

func (d defaultNotificationImpl) PersistencyKey() (PersistencyKey, bool) {
	return "", false
}

func (d defaultNotificationImpl) SerializeDataForAPI() proto.IsNotification_NotificationData {
	return d.data
}

func MakeNotification(recipient Recipient, data proto.IsNotification_NotificationData) Notification {
	return defaultNotificationImpl{
		recipient: recipient,
		data:      data,
	}
}

type defaultPersistentNotificationImpl struct {
	defaultNotificationImpl
	persistencyKey PersistencyKey
	expiration     time.Time
}

func (d defaultPersistentNotificationImpl) Expiration() time.Time {
	return d.expiration
}

func (d defaultPersistentNotificationImpl) PersistencyKey() (PersistencyKey, bool) {
	return d.persistencyKey, true
}

func MakePersistentNotification(persistencyKey PersistencyKey, recipient Recipient, expiration time.Time, data proto.IsNotification_NotificationData) Notification {
	return defaultPersistentNotificationImpl{
		defaultNotificationImpl: defaultNotificationImpl{
			recipient: recipient,
			data:      data,
		},
		persistencyKey: persistencyKey,
		expiration:     expiration,
	}
}
