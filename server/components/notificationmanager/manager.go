package notificationmanager

import (
	"context"
	"strings"
	"sync"
	"time"

	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/server/auth"
	"github.com/tnyim/jungletv/utils/event"
)

// Manager takes care of notification dispatch and clearing
type Manager struct {
	recipientsMu               sync.Mutex
	recipients                 map[RecipientID]*recipientContainer
	recipientAddedCallbacks    map[uint64]func(RecipientID, *recipientContainer)
	recipientAddedCallbacksIdx uint64

	persistedNotificationsMu sync.RWMutex
	persistedNotifications   map[PersistencyKey]persistedNotification
	readNotifications        map[PersistencyKey]map[string]struct{}

	onSingleUser event.Keyed[string, NotificationEvent] // fired for notifications that have a single user as recipient
}

type NotificationEvent struct {
	IsClear          bool
	NewNotifications []Notification
	ClearedKey       PersistencyKey
}

type recipientContainer struct {
	recipient Recipient
	event     event.Event[NotificationEvent]
	subs      int
}

type persistedNotification struct {
	notification     Notification
	monitorAbortChan chan<- struct{}
}

func NewManager() *Manager {
	m := &Manager{
		recipients:              map[RecipientID]*recipientContainer{},
		recipientAddedCallbacks: map[uint64]func(RecipientID, *recipientContainer){},
		persistedNotifications:  map[PersistencyKey]persistedNotification{},
		readNotifications:       map[PersistencyKey]map[string]struct{}{},
		onSingleUser:            event.NewKeyed[string, NotificationEvent](),
	}
	return m
}

// SubscribeToEventsForUser subscribes to notifications events (new notifications and reads)
// that are relevant to the specified user, returning a function that must be called to unsubscribe.
// The callback will be called for each event that is relevant and may be called concurrently.
// The callback may block without risk of losing events.
func (m *Manager) SubscribeToEventsForUser(user auth.User, callback func(NotificationEvent)) func() {
	// first subscribe so we don't miss anything
	cleanup := m.monitor(user, callback)

	// then send persisted notifications
	abortCh := make(chan struct{})
	if user != nil && !user.IsUnknown() {
		go func() {
			m.persistedNotificationsMu.RLock()
			defer m.persistedNotificationsMu.RUnlock()
			notifs := []Notification{}
			for key, p := range m.persistedNotifications {
				if !p.notification.Recipient().ContainsUser(user) {
					continue
				}
				if _, read := m.readNotifications[key][user.Address()]; !read {
					notifs = append(notifs, p.notification)
				}
			}
			select {
			case <-abortCh:
				// just in case the consumer has unsubscribed while we prepared the initial send of persisted notifications
				return
			default:
				go callback(NotificationEvent{
					NewNotifications: notifs,
				})
			}
		}()
	}

	return func() {
		close(abortCh)
		cleanup()
	}
}

func (m *Manager) monitor(user auth.User, callback func(NotificationEvent)) func() {
	m.recipientsMu.Lock()
	defer m.recipientsMu.Unlock()

	cleanupFns := make([]func(), 0, len(m.recipients)*2+1)

	addRecipient := func(recipientID RecipientID, r *recipientContainer) {
		// this function is always called inside recipientsMu
		if !r.recipient.ContainsUser(user) {
			return
		}
		r.subs++
		cleanupFns = append(cleanupFns, r.event.SubscribeUsingCallback(event.BufferAll, callback), func() {
			// this function will be called inside recipientsMu
			r.subs--
			if r.subs <= 0 {
				delete(m.recipients, recipientID)
			}
		})
	}

	for recipientID, r := range m.recipients {
		addRecipient(recipientID, r)
	}

	c := m.recipientAddedCallbacksIdx
	m.recipientAddedCallbacks[c] = addRecipient
	m.recipientAddedCallbacksIdx++

	cleanupFns = append(cleanupFns, m.onSingleUser.SubscribeUsingCallback(buildDirectKeyForUser(user), event.BufferAll, callback))

	return func() {
		m.recipientsMu.Lock()
		defer m.recipientsMu.Unlock()
		delete(m.recipientAddedCallbacks, c)

		for _, cleanupFn := range cleanupFns {
			cleanupFn()
		}
	}
}

func buildDirectKeyForUser(user auth.User) string {
	if user != nil && !user.IsUnknown() {
		return user.Address()
	}
	return ""
}

func (m *Manager) Notify(notification Notification) func() {
	clearFn := m.maybePersistNotification(notification)

	recipient := notification.Recipient()

	if userRecipient, ok := recipient.(UserRecipient); ok {
		m.onSingleUser.Notify(buildDirectKeyForUser(userRecipient.ForUser()), NotificationEvent{
			NewNotifications: []Notification{notification},
		}, false)
		return clearFn
	}

	m.recipientsMu.Lock()
	defer m.recipientsMu.Unlock()

	if r, ok := m.recipients[recipient.ID()]; ok && r.event != nil {
		r.event.Notify(NotificationEvent{
			NewNotifications: []Notification{notification},
		}, false)
	} else if !ok {
		r = &recipientContainer{
			recipient: recipient,
			event:     event.New[NotificationEvent](),
		}

		recipientID := recipient.ID()
		m.recipients[recipientID] = r
		// wait for every consumer to update their subscriptions, taking into account the new recipient
		for _, callback := range m.recipientAddedCallbacks {
			callback(recipientID, r) // we are inside recipientsMu, so we can call these functions
		}
		if r.subs != 0 {
			r.event.Notify(NotificationEvent{
				NewNotifications: []Notification{notification},
			}, false)
		} else {
			// no point in keeping the recipient in this map if it has no current subscribers
			delete(m.recipients, recipientID)
		}
	}
	return clearFn
}

func (m *Manager) maybePersistNotification(notification Notification) func() {
	key, persistent := notification.PersistencyKey()
	if !persistent {
		return func() {}
	}

	m.persistedNotificationsMu.Lock()
	defer m.persistedNotificationsMu.Unlock()

	if existing, ok := m.persistedNotifications[key]; ok {
		if existing.notification.Recipient().ID() != notification.Recipient().ID() {
			m.clearPersistedNotificationInsideMutex(key)
		}
		close(existing.monitorAbortChan)
	}
	abortChan := make(chan struct{})
	ctx, cancelFn := context.WithDeadline(context.Background(), notification.Expiration())
	m.persistedNotifications[key] = persistedNotification{
		notification:     notification,
		monitorAbortChan: abortChan,
	}
	m.readNotifications[key] = map[string]struct{}{}
	go m.notificationExpirationMonitor(ctx, abortChan, notification)
	return cancelFn
}

func (m *Manager) notificationExpirationMonitor(ctx context.Context, abort <-chan struct{}, notification Notification) {
	select {
	case <-abort:
		return
	case <-ctx.Done():
		key, _ := notification.PersistencyKey()
		m.ClearPersistedNotification(key)
	}
}

func (m *Manager) MarkAsRead(persistencyKey PersistencyKey, user auth.User) {
	if user == nil || user.IsUnknown() {
		return
	}

	m.persistedNotificationsMu.Lock()
	defer m.persistedNotificationsMu.Unlock()

	p, notificationRetrieved := m.persistedNotifications[persistencyKey]
	if !notificationRetrieved {
		return
	}
	if _, ok := m.readNotifications[persistencyKey]; ok {
		m.readNotifications[persistencyKey][user.Address()] = struct{}{}
		usersThatRead := make([]auth.User, 0, len(m.readNotifications[persistencyKey]))
		for userAddress := range m.readNotifications[persistencyKey] {
			usersThatRead = append(usersThatRead, auth.NewAddressOnlyUser(userAddress))
		}
		m.onSingleUser.Notify(buildDirectKeyForUser(user), NotificationEvent{
			IsClear:    true,
			ClearedKey: persistencyKey,
		}, false)
		if p.notification.Recipient().FullyContainedWithin(usersThatRead) {
			// notification was read by every recipient, clear it
			m.clearPersistedNotificationInsideMutex(persistencyKey)
		}
	}
	// if the persistency key is not present in the map, then this is not a persisted notification and doesn't need to be marked as read
}

func (m *Manager) ClearPersistedNotification(key PersistencyKey) {
	m.persistedNotificationsMu.Lock()
	defer m.persistedNotificationsMu.Unlock()
	m.clearPersistedNotificationInsideMutex(key)
}

func (m *Manager) ClearPersistedNotificationsSentByApplication(applicationID string) {
	m.persistedNotificationsMu.Lock()
	defer m.persistedNotificationsMu.Unlock()
	for key, n := range m.persistedNotifications {
		if n.notification.SenderApplicationID() == applicationID {
			m.clearPersistedNotificationInsideMutex(key)
		}
	}
}

func (m *Manager) ClearPersistedNotificationsWithKeyPrefix(prefix string) {
	m.persistedNotificationsMu.Lock()
	defer m.persistedNotificationsMu.Unlock()
	for key := range m.persistedNotifications {
		if strings.HasPrefix(string(key), prefix) {
			m.clearPersistedNotificationInsideMutex(key)
		}
	}
}

func (m *Manager) clearPersistedNotificationInsideMutex(key PersistencyKey) {
	if existing, ok := m.persistedNotifications[key]; ok {
		close(existing.monitorAbortChan)
		delete(m.persistedNotifications, key)
		m.onSingleUser.NotifyAll(NotificationEvent{
			IsClear:    true,
			ClearedKey: key,
		})
	}
	delete(m.readNotifications, key)
}

// CountRecipients is exposed for testing
func (m *Manager) CountRecipients() int {
	m.recipientsMu.Lock()
	defer m.recipientsMu.Unlock()

	return len(m.recipients)
}

type PersistencyKey string

type Notification interface {
	SenderApplicationID() string
	Recipient() Recipient
	PersistencyKey() (PersistencyKey, bool)
	Expiration() time.Time
	SerializeDataForAPI() proto.IsNotification_NotificationData
}
