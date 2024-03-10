package notificationmanager_test

import (
	"fmt"
	"sync"
	"testing"
	"time"

	"github.com/stretchr/testify/require"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/server/auth"
	"github.com/tnyim/jungletv/server/components/notificationmanager"
)

func TestNotifyWithoutConsumers(t *testing.T) {
	t.Parallel()

	manager := notificationmanager.NewManager()

	notification := notificationmanager.MakeNotification(
		notificationmanager.RecipientEveryone,
		&proto.Notification_AnnouncementsUpdated{
			AnnouncementsUpdated: &proto.AnnouncementsUpdatedNotification{
				NotificationCounter: 123,
			},
		},
	)

	manager.Notify(notification)
	require.Equal(t, 0, manager.CountRecipients())
}

func TestNotifySingleUser(t *testing.T) {
	t.Parallel()

	manager := notificationmanager.NewManager()

	user := auth.NewAddressOnlyUser("user1_address")

	notification := notificationmanager.MakeNotification(
		notificationmanager.MakeUserRecipient(user),
		&proto.Notification_AnnouncementsUpdated{
			AnnouncementsUpdated: &proto.AnnouncementsUpdatedNotification{
				NotificationCounter: 123,
			},
		},
	)
	doneCh := make(chan struct{})

	unsub1 := manager.SubscribeToNotificationsForUser(user, func(notification notificationmanager.Notification) {
		doneCh <- struct{}{}
	})

	unsub2 := manager.SubscribeToNotificationsForUser(user, func(notification notificationmanager.Notification) {
		doneCh <- struct{}{}
	})

	manager.Notify(notification)

	<-doneCh
	<-doneCh

	unsub1()
	unsub2()

	close(doneCh)

	// if unsubscribing failed, the following call will cause a panic as we attempt to send on doneCh, which is now closed
	manager.Notify(notification)
}

func TestNotifyEveryone(t *testing.T) {
	t.Parallel()

	manager := notificationmanager.NewManager()

	user1 := auth.NewAddressOnlyUser("user1_address")
	user2 := auth.NewAddressOnlyUser("user2_address")
	user3 := auth.NewAddressOnlyUser("user3_address")

	notification := notificationmanager.MakeNotification(
		notificationmanager.RecipientEveryone,
		&proto.Notification_AnnouncementsUpdated{
			AnnouncementsUpdated: &proto.AnnouncementsUpdatedNotification{
				NotificationCounter: 123,
			},
		},
	)
	doneCh := make(chan struct{})

	unsub1 := manager.SubscribeToNotificationsForUser(user1, func(notification notificationmanager.Notification) {
		doneCh <- struct{}{}
	})
	unsub2 := manager.SubscribeToNotificationsForUser(user2, func(notification notificationmanager.Notification) {
		doneCh <- struct{}{}
	})
	unsub3 := manager.SubscribeToNotificationsForUser(user3, func(notification notificationmanager.Notification) {
		doneCh <- struct{}{}
	})
	unsub4 := manager.SubscribeToNotificationsForUser(user3, func(notification notificationmanager.Notification) {
		doneCh <- struct{}{}
	})

	manager.Notify(notification)

	<-doneCh
	<-doneCh
	<-doneCh
	<-doneCh

	require.Equal(t, 1, manager.CountRecipients())
	unsub1()
	unsub2()
	unsub3()
	unsub4()

	close(doneCh)

	// if unsubscribing failed, the following call will cause a panic as we attempt to send on doneCh, which is now closed
	manager.Notify(notification)

	require.Equal(t, 0, manager.CountRecipients())
}

func TestNotifyEveryoneImmediateResubscription(t *testing.T) {
	t.Parallel()

	manager := notificationmanager.NewManager()

	user := auth.NewAddressOnlyUser("user1_address")

	notification := notificationmanager.MakeNotification(
		notificationmanager.RecipientEveryone,
		&proto.Notification_AnnouncementsUpdated{
			AnnouncementsUpdated: &proto.AnnouncementsUpdatedNotification{
				NotificationCounter: 123,
			},
		},
	)

	for i := 0; i < 3; i++ {
		doneCh := make(chan struct{})

		unsub := manager.SubscribeToNotificationsForUser(user, func(notification notificationmanager.Notification) {
			close(doneCh)
		})

		manager.Notify(notification)

		<-doneCh

		require.Equal(t, 1, manager.CountRecipients())
		unsub()
	}

	// if unsubscribing failed, the following call will cause a panic as we attempt to close doneCh, which is now closed
	manager.Notify(notification)

	require.Equal(t, 0, manager.CountRecipients())
}

func TestNotifyEveryoneExceptOne(t *testing.T) {
	t.Parallel()
	manager := notificationmanager.NewManager()

	user1 := auth.NewAddressOnlyUser("user1_address")
	user2 := auth.NewAddressOnlyUser("user2_address")

	notification := notificationmanager.MakeNotification(
		notificationmanager.MakeEveryoneExceptSpecifiedRecipient([]auth.User{user1}),
		&proto.Notification_AnnouncementsUpdated{
			AnnouncementsUpdated: &proto.AnnouncementsUpdatedNotification{
				NotificationCounter: 123,
			},
		},
	)
	doneCh := make(chan struct{})

	unsub := manager.SubscribeToNotificationsForUser(user1, func(notification notificationmanager.Notification) {
		t.Fail()
	})

	unsub2 := manager.SubscribeToNotificationsForUser(user2, func(notification notificationmanager.Notification) {
		close(doneCh)
	})

	manager.Notify(notification)

	<-doneCh

	require.Equal(t, 1, manager.CountRecipients())
	unsub()
	unsub2()

	// if unsubscribing failed, the following call will cause a panic as we attempt to send on doneCh, which is now closed
	manager.Notify(notification)

	require.Equal(t, 0, manager.CountRecipients())
}

func TestManyUsersManyRecipientsManySubsManyNotifications(t *testing.T) {
	t.Parallel()
	manager := notificationmanager.NewManager()

	users := []auth.User{}
	for i := 0; i < 200; i++ {
		users = append(users, auth.NewAddressOnlyUser(fmt.Sprintf("user%d_address", i)))
	}

	notifications := []notificationmanager.Notification{}

	for _, user := range users {
		n := notificationmanager.MakeNotification(
			notificationmanager.MakeEveryoneExceptSpecifiedRecipient([]auth.User{user}),
			&proto.Notification_AnnouncementsUpdated{
				AnnouncementsUpdated: &proto.AnnouncementsUpdatedNotification{
					NotificationCounter: 123,
				},
			},
		)
		notifications = append(notifications, n)
	}

	for _, n := range notifications {
		manager.Notify(n)
	}

	unsubFns := make([]func(), 0, len(users))

	wg := sync.WaitGroup{}
	for _, user := range users {
		wg.Add(len(users) - 1) // should be notified about every user except themselves
		unsubFns = append(unsubFns, manager.SubscribeToNotificationsForUser(user, func(notification notificationmanager.Notification) {
			wg.Done()
		}))
	}

	for _, n := range notifications {
		manager.Notify(n)
	}

	wg.Wait()

	wg.Add(len(users) * 100)
	for i := 0; i < 100; i++ {
		manager.Notify(notificationmanager.MakeNotification(
			notificationmanager.RecipientEveryone,
			&proto.Notification_AnnouncementsUpdated{
				AnnouncementsUpdated: &proto.AnnouncementsUpdatedNotification{
					NotificationCounter: 123,
				},
			},
		))
	}

	wg.Wait()

	wg.Add(len(users) - 1)

	manager.Notify(notificationmanager.MakeNotification(
		notificationmanager.MakeEveryoneExceptSpecifiedRecipient([]auth.User{users[0]}),
		&proto.Notification_AnnouncementsUpdated{
			AnnouncementsUpdated: &proto.AnnouncementsUpdatedNotification{
				NotificationCounter: 123,
			},
		},
	))

	require.Equal(t, 201, manager.CountRecipients())

	for _, unsubFn := range unsubFns {
		unsubFn()
	}

	require.Equal(t, 0, manager.CountRecipients())

	for _, n := range notifications {
		manager.Notify(n)
	}

	require.Equal(t, 0, manager.CountRecipients())
}

func TestPersistNotificationSingleUser(t *testing.T) {
	t.Parallel()

	manager := notificationmanager.NewManager()

	user := auth.NewAddressOnlyUser("user1_address")

	notification := notificationmanager.MakePersistentNotification(
		"test",
		notificationmanager.MakeUserRecipient(user),
		time.Now().Add(10*time.Second),
		&proto.Notification_AnnouncementsUpdated{
			AnnouncementsUpdated: &proto.AnnouncementsUpdatedNotification{
				NotificationCounter: 123,
			},
		},
	)

	manager.Notify(notification)

	doneCh := make(chan struct{})

	unsub1 := manager.SubscribeToNotificationsForUser(user, func(notification notificationmanager.Notification) {
		doneCh <- struct{}{}
	})

	unsub2 := manager.SubscribeToNotificationsForUser(user, func(notification notificationmanager.Notification) {
		doneCh <- struct{}{}
	})

	<-doneCh
	<-doneCh

	// now test live broadcast
	manager.Notify(notification)

	<-doneCh
	<-doneCh

	unsub1()
	unsub2()

	close(doneCh)

	// if unsubscribing failed, the following call will cause a panic as we attempt to send on doneCh, which is now closed
	manager.Notify(notification)

	require.Equal(t, 0, manager.CountRecipients())
}
