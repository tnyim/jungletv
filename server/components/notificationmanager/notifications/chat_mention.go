package notifications

import (
	"time"

	"github.com/bwmarrin/snowflake"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/server/auth"
	"github.com/tnyim/jungletv/server/components/notificationmanager"
)

func ChatMentionKey(user auth.User) notificationmanager.PersistencyKey {
	if user == nil || user.IsUnknown() {
		return ""
	}
	return notificationmanager.PersistencyKey("chat_mention_" + user.Address())
}

func NewChatMentionNotification(mentionedUser auth.User, messageID snowflake.ID) notificationmanager.Notification {
	return notificationmanager.MakePersistentNotification(
		ChatMentionKey(mentionedUser),
		notificationmanager.MakeUserRecipient(mentionedUser),
		time.Now().Add(1*time.Hour),
		&proto.Notification_ChatMention{
			ChatMention: &proto.ChatMentionNotification{
				MessageId: messageID.Int64(),
			},
		},
	)
}
