package server

import (
	"context"
	"regexp"
	"strings"
	"time"
	"unicode"
	"unicode/utf8"

	"github.com/bwmarrin/snowflake"
	"github.com/icza/gox/stringsx"
	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/server/auth"
	authinterceptor "github.com/tnyim/jungletv/server/interceptors/auth"
	"github.com/tnyim/jungletv/server/stores/chat"
	"github.com/tnyim/jungletv/utils/event"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (s *grpcServer) ConsumeChat(r *proto.ConsumeChatRequest, stream proto.JungleTV_ConsumeChatServer) error {
	onChatDisabled, chatDisabledU := s.chat.chatDisabled.Subscribe(event.AtLeastOnceGuarantee)
	defer chatDisabledU()

	onChatEnabled, chatEnabledU := s.chat.chatEnabled.Subscribe(event.AtLeastOnceGuarantee)
	defer chatEnabledU()

	onMessageCreated, messageCreatedU := s.chat.messageCreated.Subscribe(event.AtLeastOnceGuarantee)
	defer messageCreatedU()

	onMessageDeleted, messageDeletedU := s.chat.messageDeleted.Subscribe(event.AtLeastOnceGuarantee)
	defer messageDeletedU()

	ctx := stream.Context()
	user := authinterceptor.UserClaimsFromContext(ctx)

	onUserBlocked, userBlockedU := s.chat.OnUserBlockedBy(user).Subscribe(event.AtLeastOnceGuarantee)
	defer userBlockedU()

	onUserUnblocked, userUnblockedU := s.chat.OnUserUnblockedBy(user).Subscribe(event.AtLeastOnceGuarantee)
	defer userUnblockedU()

	heartbeat := time.NewTicker(5 * time.Second)
	defer heartbeat.Stop()
	var seq uint32

	unregister := s.statsHandler.RegisterStreamSubscriber(StreamStatsChat, user != nil && !user.IsUnknown())
	defer unregister()

	blockedAddresses, err := s.chat.blockedUserStore.LoadUsersBlockedBy(ctx, user)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	for i := range blockedAddresses {
		err := stream.Send(&proto.ChatUpdate{
			Event: &proto.ChatUpdate_BlockedUserCreated{
				BlockedUserCreated: &proto.ChatBlockedUserCreatedEvent{
					BlockedUserAddress: blockedAddresses[i],
				},
			},
		})
		if err != nil {
			return stacktrace.Propagate(err, "failed to send initial blocked users list")
		}

	}

	chatEnabled, disabledReason := s.chat.Enabled()
	if chatEnabled {
		initialHistorySize := r.InitialHistorySize
		if initialHistorySize > 1000 {
			initialHistorySize = 1000
		}
		var u auth.User = &unknownUser{}
		if user != nil {
			u = user
		}
		messages, err := s.chat.store.LoadNumLatestMessages(ctx, u, int(initialHistorySize))
		if err != nil {
			return stacktrace.Propagate(err, "failed to load chat messages")
		}
		for i := range messages {
			err = stream.Send(&proto.ChatUpdate{
				Event: &proto.ChatUpdate_MessageCreated{
					MessageCreated: &proto.ChatMessageCreatedEvent{
						Message: messages[i].SerializeForAPI(ctx, s.userSerializer),
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
		case reason := <-onChatDisabled:
			err = stream.Send(&proto.ChatUpdate{
				Event: &proto.ChatUpdate_Disabled{
					Disabled: &proto.ChatDisabledEvent{
						Reason: reason.SerializeForAPI(),
					},
				},
			})
		case <-onChatEnabled:
			err = stream.Send(&proto.ChatUpdate{
				Event: &proto.ChatUpdate_Enabled{
					Enabled: &proto.ChatEnabledEvent{},
				},
			})
		case msg := <-onMessageCreated:
			if !msg.Shadowbanned || (msg.Author != nil && user != nil && msg.Author.Address() == user.Address()) {
				err = stream.Send(&proto.ChatUpdate{
					Event: &proto.ChatUpdate_MessageCreated{
						MessageCreated: &proto.ChatMessageCreatedEvent{
							Message: msg.SerializeForAPI(ctx, s.userSerializer),
						},
					},
				})
			}
		case v := <-onMessageDeleted:
			err = stream.Send(&proto.ChatUpdate{
				Event: &proto.ChatUpdate_MessageDeleted{
					MessageDeleted: &proto.ChatMessageDeletedEvent{
						Id: v.Int64(),
					},
				},
			})
		case <-heartbeat.C:
			err = stream.Send(&proto.ChatUpdate{
				Event: &proto.ChatUpdate_Heartbeat{
					Heartbeat: &proto.ChatHeartbeatEvent{
						Sequence: seq,
					},
				},
			})
			seq++
		case v := <-onUserBlocked:
			err = stream.Send(&proto.ChatUpdate{
				Event: &proto.ChatUpdate_BlockedUserCreated{
					BlockedUserCreated: &proto.ChatBlockedUserCreatedEvent{
						BlockedUserAddress: v,
					},
				},
			})
		case v := <-onUserUnblocked:
			err = stream.Send(&proto.ChatUpdate{
				Event: &proto.ChatUpdate_BlockedUserDeleted{
					BlockedUserDeleted: &proto.ChatBlockedUserDeletedEvent{
						BlockedUserAddress: v,
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
	user := authinterceptor.UserClaimsFromContext(ctx)
	if user == nil {
		return nil, stacktrace.NewError("user claims unexpectedly missing")
	}
	// remove emoji that can be confused for chat moderator icons
	r.Content = disallowedEmojiRegex.ReplaceAllString(r.Content, "")
	r.Content = strings.Map(func(r rune) rune {
		if unicode.IsGraphic(r) || r == '\n' {
			return r
		}
		return -1
	}, r.Content)
	if len(strings.TrimSpace(r.Content)) == 0 {
		return nil, status.Error(codes.InvalidArgument, "message empty")
	}
	if len(r.Content) > 512 {
		return nil, status.Error(codes.InvalidArgument, "message too long")
	}

	var messageReference *chat.Message
	if r.ReplyReferenceId != nil {
		message, err := s.chat.LoadMessage(ctx, snowflake.ParseInt64(*r.ReplyReferenceId))
		if err == nil {
			// use a copy of the referenced message without its reference in order to avoid long chains
			messageReference = &chat.Message{
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
	if !m.Shadowbanned {
		go func() {
			if r.Trusted {
				if len(m.Content) >= 10 || m.Reference != nil {
					s.rewardsHandler.MarkAddressAsActiveIfNotChallenged(ctx, user.Address())
				}
			} else {
				s.rewardsHandler.MarkAddressAsNotLegitimate(ctx, user.Address())
			}
		}()

		if m.Reference != nil && m.Reference.Author != nil && !m.Reference.Author.IsUnknown() {
			s.rewardsHandler.MarkAddressAsMentionedInChat(ctx, m.Reference.Author.Address())
		}
	}

	return &proto.SendChatMessageResponse{
		Id: m.ID.Int64(),
	}, nil
}

var disallowedEmojiRegex = regexp.MustCompile("[🛡️🔰🛡⚔️⚔🗡️🗡🗡️]")

func (s *grpcServer) SetChatNickname(ctx context.Context, r *proto.SetChatNicknameRequest) (*proto.SetChatNicknameResponse, error) {
	user := authinterceptor.UserClaimsFromContext(ctx)
	if user == nil {
		return nil, stacktrace.NewError("user claims unexpectedly missing")
	}

	var err error
	r.Nickname, err = validateNicknameReturningGRPCError(r.Nickname)
	if err != nil {
		return nil, err
	}
	if r.Nickname == "" {
		err = s.chat.SetNickname(ctx, user, nil, false)
	} else {
		err = s.chat.SetNickname(ctx, user, &r.Nickname, false)
	}

	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	return &proto.SetChatNicknameResponse{}, nil
}

func validateNicknameReturningGRPCError(nickname string) (string, error) {
	if len(nickname) > 0 {
		nickname = strings.TrimSpace(nickname)
		// remove emoji that can be confused for chat moderator icons
		nickname = disallowedEmojiRegex.ReplaceAllString(nickname, "")
		nickname = stringsx.Clean(nickname)
		if utf8.RuneCountInString(nickname) < 3 {
			return "", status.Error(codes.InvalidArgument, "nickname must be at least 3 characters long")
		}
		if utf8.RuneCountInString(nickname) > 16 {
			return "", status.Error(codes.InvalidArgument, "nickname must be at most 16 characters long")
		}
	}
	return nickname, nil
}
