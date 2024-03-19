import { formatBANPrice } from "./currency_utils";
import { setNavigationDestinationHighlighted, showNavbarToast } from "./navigationStores";
import { Notification } from "./proto/jungletv_pb";
import { mostRecentAnnouncement, rewardBalance, unreadAnnouncement, unreadChatMention } from "./stores";
import { setSidebarTabHighlighted } from "./tabStores";

const persistedNotifications = new Map<string, Notification>();
const persistedNotificationsTimeouts = new Map<string, number>();

export const processNotifications = function (notifications: Notification[]) {
    for (let notification of notifications) {
        processNotificationData(notification);
        const until = notification.getExpiration().toDate().getTime() - new Date().getTime();
        const k = notification.getKey();
        if (until > 0) {
            persistedNotifications.set(k, notification);
            if (persistedNotificationsTimeouts.has(k)) {
                clearTimeout(persistedNotificationsTimeouts.get(k));
            }
            persistedNotificationsTimeouts.set(k, setTimeout(() => {
                persistedNotifications.delete(k);
                persistedNotificationsTimeouts.delete(k);
                processNotificationExpiryOrRemoval(notification);
            }, until));
        } else if (k != "") {
            processClearedNotifications([k]);
        }
    }
}

export const processClearedNotifications = function (clearedKeys: string[]) {
    for (let k of clearedKeys) {
        if (!persistedNotifications.has(k)) {
            continue;
        }
        const notification = persistedNotifications.get(k);
        persistedNotifications.delete(k);
        if (persistedNotificationsTimeouts.has(k)) {
            clearTimeout(persistedNotificationsTimeouts.get(k));
            persistedNotificationsTimeouts.delete(k);
        }
        processNotificationExpiryOrRemoval(notification);
    }
}

function processNotificationData(notification: Notification) {
    switch (notification.getNotificationDataCase()) {
        case Notification.NotificationDataCase.CHAT_MENTION:
            unreadChatMention.set(notification.getChatMention().getMessageId());
            break;
        case Notification.NotificationDataCase.ANNOUNCEMENTS_UPDATED:
            {
                const latest = notification.getAnnouncementsUpdated().getNotificationCounter();
                unreadAnnouncement.set(
                    parseInt(localStorage.getItem("lastSeenAnnouncement") ?? "-1") != latest
                );
                mostRecentAnnouncement.set(latest);
            }
            break;
        case Notification.NotificationDataCase.REWARD_BALANCE_UPDATED:
            const difference = notification.getRewardBalanceUpdated().getDifference();
            if (difference != "" && !/^0+$/.test(difference) && !difference.startsWith("-")) {
                showNavbarToast(`Received **${formatBANPrice(difference)} BAN**!`, 7000);
            }
            rewardBalance.update((_) => notification.getRewardBalanceUpdated().getRewardBalance());
            break;
        case Notification.NotificationDataCase.SIDEBAR_TAB_HIGHLIGHTED:
            setSidebarTabHighlighted(notification.getSidebarTabHighlighted().getTabId(), true);
            break;
        case Notification.NotificationDataCase.NAVIGATION_DESTINATION_HIGHLIGHTED:
            setNavigationDestinationHighlighted(notification.getNavigationDestinationHighlighted().getDestinationId(), true);
            break;
        case Notification.NotificationDataCase.TOAST:
            const toast = notification.getToast();
            showNavbarToast(toast.getMessage(),
                toast.getDuration().getSeconds() * 1000 + toast.getDuration().getNanos() / 1000000,
                toast.getHref());
            break;
    }
}

function processNotificationExpiryOrRemoval(notification: Notification) {
    switch (notification.getNotificationDataCase()) {
        case Notification.NotificationDataCase.CHAT_MENTION:
            unreadChatMention.update((unread) => {
                if (unread == notification.getChatMention().getMessageId()) {
                    return null;
                }
                return unread;
            });
            break;
        case Notification.NotificationDataCase.ANNOUNCEMENTS_UPDATED:
            unreadAnnouncement.set(false);
            break;
        case Notification.NotificationDataCase.SIDEBAR_TAB_HIGHLIGHTED:
            setSidebarTabHighlighted(notification.getSidebarTabHighlighted().getTabId(), false);
            break;
        case Notification.NotificationDataCase.NAVIGATION_DESTINATION_HIGHLIGHTED:
            setNavigationDestinationHighlighted(notification.getNavigationDestinationHighlighted().getDestinationId(), false);
            break;
    }
}