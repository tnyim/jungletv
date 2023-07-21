package chat

import (
	"context"
	"time"

	"github.com/bwmarrin/snowflake"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/server/auth"
	"google.golang.org/protobuf/types/known/timestamppb"
)

// Message represents a single chat message
type Message struct {
	ID              snowflake.ID
	CreatedAt       time.Time
	Author          auth.User
	Content         string
	Reference       *Message // may be nil
	Shadowbanned    bool
	Attachments     []MessageAttachmentStorage
	AttachmentsView []MessageAttachmentView
}

func (m *Message) SerializeForAPI(ctx context.Context, userSerializer auth.APIUserSerializer) *proto.ChatMessage {
	msg := &proto.ChatMessage{
		Id:        m.ID.Int64(),
		CreatedAt: timestamppb.New(m.CreatedAt),
	}
	if m.Author != nil {
		msg.Message = &proto.ChatMessage_UserMessage{
			UserMessage: &proto.UserChatMessage{
				Author:  userSerializer(ctx, m.Author),
				Content: m.Content,
			},
		}
	} else {
		msg.Message = &proto.ChatMessage_SystemMessage{
			SystemMessage: &proto.SystemChatMessage{
				Content: m.Content,
			},
		}
	}
	if m.Reference != nil {
		msg.Reference = m.Reference.SerializeForAPI(ctx, userSerializer)
	}
	for _, a := range m.AttachmentsView {
		msg.Attachments = append(msg.Attachments, a.SerializeForAPI(ctx))
	}
	return msg
}
