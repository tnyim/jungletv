package server

import (
	"context"
	"strings"
	"time"

	"github.com/bwmarrin/snowflake"
	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/utils/event"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (s *grpcServer) ConsumeChat(r *proto.ConsumeChatRequest, stream proto.JungleTV_ConsumeChatServer) error {
	onChatDisabled := s.chat.chatDisabled.Subscribe(event.AtLeastOnceGuarantee)
	defer s.chat.chatDisabled.Unsubscribe(onChatDisabled)

	onChatEnabled := s.chat.chatEnabled.Subscribe(event.AtLeastOnceGuarantee)
	defer s.chat.chatEnabled.Unsubscribe(onChatEnabled)

	onMessageCreated := s.chat.messageCreated.Subscribe(event.AtLeastOnceGuarantee)
	defer s.chat.messageCreated.Unsubscribe(onMessageCreated)

	onMessageDeleted := s.chat.messageDeleted.Subscribe(event.AtLeastOnceGuarantee)
	defer s.chat.messageCreated.Unsubscribe(onMessageDeleted)

	heartbeatC := time.NewTicker(5 * time.Second).C
	var seq uint32

	chatEnabled, disabledReason := s.chat.Enabled()
	if chatEnabled {
		initialHistorySize := r.InitialHistorySize
		if initialHistorySize > 1000 {
			initialHistorySize = 1000
		}
		messages, err := s.chat.store.LoadNumLatestMessages(stream.Context(), int(initialHistorySize))
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
		case <-heartbeatC:
			err = stream.Send(&proto.ChatUpdate{
				Event: &proto.ChatUpdate_Heartbeat{
					Heartbeat: &proto.ChatHeartbeatEvent{
						Sequence: seq,
					},
				},
			})
			seq++
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
	if user == nil {
		return nil, stacktrace.NewError("user claims unexpectedly missing")
	}
	if len(strings.TrimSpace(r.Content)) == 0 {
		return nil, status.Error(codes.InvalidArgument, "message empty")
	}
	if len(r.Content) > 512 {
		return nil, status.Error(codes.InvalidArgument, "message too long")
	}

	var messageReference *ChatMessage
	if r.ReplyReferenceId != nil {
		message, err := s.chat.LoadMessage(ctx, snowflake.ParseInt64(*r.ReplyReferenceId))
		if err == nil {
			// use a copy of the referenced message without its reference in order to avoid long chains
			messageReference = &ChatMessage{
				ID:        message.ID,
				CreatedAt: message.CreatedAt,
				Author:    message.Author,
				Content:   message.Content,
			}
		}
	}

	m, err := s.chat.CreateMessage(ctx, user, r.Content, messageReference)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	s.log.Printf("Chat message from %s %s: %s", m.Author.Address(), RemoteAddressFromContext(ctx), m.Content)
	return &proto.SendChatMessageResponse{
		Id: m.ID.Int64(),
	}, nil
}
