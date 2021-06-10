package server

import (
	"context"

	"github.com/bwmarrin/snowflake"
	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/utils/event"
)

func (s *grpcServer) ConsumeChat(r *proto.ConsumeChatRequest, stream proto.JungleTV_ConsumeChatServer) error {
	onChatDisabled := s.chat.chatDisabled.Subscribe(event.AtLeastOnceGuarantee)
	defer s.chat.chatDisabled.Unsubscribe(onChatDisabled)

	onChatEnabled := s.chat.chatEnabled.Subscribe(event.AtLeastOnceGuarantee)
	defer s.chat.chatEnabled.Unsubscribe(onChatEnabled)

	onMessageCreated := s.chat.messageCreated.Subscribe(event.AtLeastOnceGuarantee)
	defer s.chat.messageCreated.Unsubscribe(onMessageCreated)

	onMessageDeleted := s.chat.messageCreated.Subscribe(event.AtLeastOnceGuarantee)
	defer s.chat.messageCreated.Unsubscribe(onMessageDeleted)

	chatEnabled, disabledReason := s.chat.Enabled()
	if chatEnabled {
		messages, err := s.chat.store.LoadNumLatestMessages(stream.Context(), 50)
		if err != nil {
			return stacktrace.Propagate(err, "failed to load chat messages")
		}
		for i := range messages {
			err = stream.Send(&proto.ChatUpdate{
				Event: &proto.ChatUpdate_MessageCreated{
					MessageCreated: &proto.ChatMessageCreatedEvent{
						Message: messages[i].SerializeForAPI(),
					},
				},
			})
			if err != nil {
				return stacktrace.Propagate(err, "failed to send initial chat state")
			}
		}
	} else {
		err := stream.Send(&proto.ChatUpdate{
			Event: &proto.ChatUpdate_Disabled{
				Disabled: &proto.ChatDisabledEvent{
					Reason: disabledReason.SerializeForAPI(),
				},
			},
		})
		if err != nil {
			return stacktrace.Propagate(err, "failed to send initial chat state")
		}
	}

	for {
		var err error
		select {
		case v := <-onChatDisabled:
			err = stream.Send(&proto.ChatUpdate{
				Event: &proto.ChatUpdate_Disabled{
					Disabled: &proto.ChatDisabledEvent{
						Reason: v[0].(ChatDisabledReason).SerializeForAPI(),
					},
				},
			})
		case <-onChatEnabled:
			err = stream.Send(&proto.ChatUpdate{
				Event: &proto.ChatUpdate_Enabled{
					Enabled: &proto.ChatEnabledEvent{},
				},
			})
		case v := <-onMessageCreated:
			err = stream.Send(&proto.ChatUpdate{
				Event: &proto.ChatUpdate_MessageCreated{
					MessageCreated: &proto.ChatMessageCreatedEvent{
						Message: v[0].(*ChatMessage).SerializeForAPI(),
					},
				},
			})
		case v := <-onMessageDeleted:
			err = stream.Send(&proto.ChatUpdate{
				Event: &proto.ChatUpdate_MessageDeleted{
					MessageDeleted: &proto.ChatMessageDeletedEvent{
						Id: v[0].(snowflake.ID).Int64(),
					},
				},
			})
		case <-stream.Context().Done():
			return nil
		}
		if err != nil {
			return stacktrace.Propagate(err, "failed to send chat update")
		}
	}
}

func (s *grpcServer) SendChatMessage(ctx context.Context, r *proto.SendChatMessageRequest) (*proto.SendChatMessageResponse, error) {
	user := UserClaimsFromContext(ctx)
	m, err := s.chat.CreateMessage(ctx, user, r.Content)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	return &proto.SendChatMessageResponse{
		Id: m.ID.Int64(),
	}, nil
}
