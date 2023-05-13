package server

import (
	"context"
	"fmt"
	"regexp"
	"strings"
	"time"
	"unicode"
	"unicode/utf8"

	"github.com/JohannesKaufmann/html-to-markdown/escape"
	"github.com/bwmarrin/snowflake"
	"github.com/icza/gox/stringsx"
	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/server/auth"
	"github.com/tnyim/jungletv/server/components/stats"
	authinterceptor "github.com/tnyim/jungletv/server/interceptors/auth"
	"github.com/tnyim/jungletv/server/stores/chat"
	"github.com/tnyim/jungletv/utils/event"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"google.golang.org/protobuf/types/known/timestamppb"
)

func (s *grpcServer) ConsumeChat(r *proto.ConsumeChatRequest, stream proto.JungleTV_ConsumeChatServer) error {
	onChatDisabled, chatDisabledU := s.chat.OnChatDisabled().Subscribe(event.BufferFirst)
	defer chatDisabledU()

	onChatEnabled, chatEnabledU := s.chat.OnChatEnabled().Subscribe(event.BufferFirst)
	defer chatEnabledU()

	onMessageCreated, messageCreatedU := s.chat.OnMessageCreated().Subscribe(event.BufferFirst)
	defer messageCreatedU()

	onMessageDeleted, messageDeletedU := s.chat.OnMessageDeleted().Subscribe(event.BufferFirst)
	defer messageDeletedU()

	onVersionHashChanged, versionHashChangedU := s.versionHashChanged.Subscribe(event.BufferFirst)
	defer versionHashChangedU()

	ctx := stream.Context()
	user := authinterceptor.UserClaimsFromContext(ctx)

	onUserBlocked := make(<-chan string)
	onUserUnblocked := make(<-chan string)
	onChangedOwnNickname := make(<-chan string)
	if user != nil && !user.IsUnknown() {
		var userBlockedU func()
		onUserBlocked, userBlockedU = s.chat.OnUserBlockedBy().Subscribe(user.Address(), event.BufferFirst)
		defer userBlockedU()

		var userUnblockedU func()
		onUserUnblocked, userUnblockedU = s.chat.OnUserUnblockedBy().Subscribe(user.Address(), event.BufferFirst)
		defer userUnblockedU()

		var changedOwnNicknameU func()
		onChangedOwnNickname, changedOwnNicknameU = s.chat.OnUserChangedNickname().Subscribe(user.Address(), event.BufferFirst)
		defer changedOwnNicknameU()
	}

	heartbeat := time.NewTicker(5 * time.Second)
	defer heartbeat.Stop()
	var seq uint32

	unregister := s.statsRegistry.RegisterStreamSubscriber(stats.StatStreamConsumersChat, user != nil && !user.IsUnknown())
	defer unregister()

	blockedAddresses, err := s.chat.LoadUsersBlockedBy(ctx, user)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	initialEvents := []*proto.ChatUpdateEvent{}
	for i := range blockedAddresses {
		initialEvents = append(initialEvents, &proto.ChatUpdateEvent{
			Event: &proto.ChatUpdateEvent_BlockedUserCreated{
				BlockedUserCreated: &proto.ChatBlockedUserCreatedEvent{
					BlockedUserAddress: blockedAddresses[i],
				},
			},
		})
	}

	chatEmotes, err := s.chat.ChatEmotes(ctx)
	if err != nil {
		return stacktrace.Propagate(err, "failed to list chat emotes")
	}
	for _, emote := range chatEmotes {
		if emote.AvailableForNewMessages {
			initialEvents = append(initialEvents, &proto.ChatUpdateEvent{
				Event: &proto.ChatUpdateEvent_EmoteCreated{
					EmoteCreated: &proto.ChatEmoteCreatedEvent{
						Id:                   emote.ID,
						Shortcode:            emote.Shortcode,
						Animated:             emote.Animated,
						RequiresSubscription: emote.RequiresSubscription,
					},
				},
			})
		}
	}

	chatEnabled, disabledReason := s.chat.Enabled()
	if chatEnabled {
		initialHistorySize := r.InitialHistorySize
		if initialHistorySize > 1000 {
			initialHistorySize = 1000
		}
		var u auth.User = auth.UnknownUser
		if user != nil {
			u = user
		}
		_, protoMessages, err := s.chat.LoadNumLatestMessages(ctx, u, int(initialHistorySize))
		if err != nil {
			return stacktrace.Propagate(err, "failed to load chat messages")
		}
		for i := range protoMessages {
			initialEvents = append(initialEvents, &proto.ChatUpdateEvent{
				Event: &proto.ChatUpdateEvent_MessageCreated{
					MessageCreated: &proto.ChatMessageCreatedEvent{
						Message: protoMessages[i],
					},
				},
			})
		}
	} else {
		initialEvents = append(initialEvents, &proto.ChatUpdateEvent{
			Event: &proto.ChatUpdateEvent_Disabled{
				Disabled: &proto.ChatDisabledEvent{
					Reason: disabledReason.SerializeForAPI(),
				},
			},
		})
	}

	err = stream.Send(&proto.ChatUpdate{
		Events: initialEvents,
	})
	if err != nil {
		return stacktrace.Propagate(err, "failed to send initial events")
	}

	for {
		var err error
		select {
		case reason := <-onChatDisabled:
			err = stream.Send(&proto.ChatUpdate{
				Events: []*proto.ChatUpdateEvent{{
					Event: &proto.ChatUpdateEvent_Disabled{
						Disabled: &proto.ChatDisabledEvent{
							Reason: reason.SerializeForAPI(),
						},
					},
				}}})
		case <-onChatEnabled:
			err = stream.Send(&proto.ChatUpdate{
				Events: []*proto.ChatUpdateEvent{{
					Event: &proto.ChatUpdateEvent_Enabled{
						Enabled: &proto.ChatEnabledEvent{},
					},
				}}})
		case args := <-onMessageCreated:
			msg := args.Message
			if !msg.Shadowbanned || (msg.Author != nil && user != nil && msg.Author.Address() == user.Address()) {
				err = stream.Send(&proto.ChatUpdate{
					Events: []*proto.ChatUpdateEvent{{
						Event: &proto.ChatUpdateEvent_MessageCreated{
							MessageCreated: &proto.ChatMessageCreatedEvent{
								Message: args.ProtobufRepresentation,
							},
						},
					}}})
			}
		case v := <-onMessageDeleted:
			err = stream.Send(&proto.ChatUpdate{
				Events: []*proto.ChatUpdateEvent{{
					Event: &proto.ChatUpdateEvent_MessageDeleted{
						MessageDeleted: &proto.ChatMessageDeletedEvent{
							Id: v.Int64(),
						},
					},
				}}})
		case <-heartbeat.C:
			err = stream.Send(&proto.ChatUpdate{
				Events: []*proto.ChatUpdateEvent{{
					Event: &proto.ChatUpdateEvent_Heartbeat{
						Heartbeat: &proto.ChatHeartbeatEvent{
							Sequence: seq,
						},
					},
				}}})
			seq++
		case v := <-onUserBlocked:
			err = stream.Send(&proto.ChatUpdate{
				Events: []*proto.ChatUpdateEvent{{
					Event: &proto.ChatUpdateEvent_BlockedUserCreated{
						BlockedUserCreated: &proto.ChatBlockedUserCreatedEvent{
							BlockedUserAddress: v,
						},
					},
				}}})
		case v := <-onUserUnblocked:
			err = stream.Send(&proto.ChatUpdate{
				Events: []*proto.ChatUpdateEvent{{
					Event: &proto.ChatUpdateEvent_BlockedUserDeleted{
						BlockedUserDeleted: &proto.ChatBlockedUserDeletedEvent{
							BlockedUserAddress: v,
						},
					},
				}}})
		case newNickname := <-onChangedOwnNickname:
			newNickname = escape.MarkdownCharacters(newNickname)
			msgContent := fmt.Sprintf("_You changed your nickname to_ **%s**", newNickname)
			if newNickname == "" {
				msgContent = "_You cleared your nickname_"
			}
			err = stream.Send(&proto.ChatUpdate{
				Events: []*proto.ChatUpdateEvent{{
					Event: &proto.ChatUpdateEvent_MessageCreated{
						MessageCreated: &proto.ChatMessageCreatedEvent{
							Message: &proto.ChatMessage{
								Id:        s.snowflakeNode.Generate().Int64(),
								CreatedAt: timestamppb.Now(),
								Message: &proto.ChatMessage_SystemMessage{
									SystemMessage: &proto.SystemChatMessage{
										Content: msgContent,
									},
								},
							},
						},
					},
				}}})
		case <-onVersionHashChanged:
			return nil
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
	r.Content = strings.Map(func(r rune) rune {
		if unicode.IsGraphic(r) || r == '\n' || r == '\u200d' {
			return r
		}
		return -1
	}, r.Content)
	if len(strings.TrimSpace(r.Content)) == 0 && r.TenorGifAttachment == nil {
		return nil, status.Error(codes.InvalidArgument, "message empty")
	}
	if len(r.Content) > 512 {
		return nil, status.Error(codes.InvalidArgument, "message too long")
	}

	attachments := []chat.MessageAttachmentStorage{}
	if r.TenorGifAttachment != nil {
		pointsCost, err := s.chat.TenorGifAttachmentCostForUser(ctx, user)
		if err != nil {
			return nil, stacktrace.Propagate(err, "")
		}
		attachments = append(attachments, &chat.MessageAttachmentTenorGifStorage{
			ID:   *r.TenorGifAttachment,
			Cost: pointsCost,
		})
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

	m, err := s.chat.CreateMessage(ctx, user, r.Content, messageReference, attachments)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	if !r.Trusted {
		s.rewardsHandler.MarkAddressAsNotLegitimate(ctx, user.Address())
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

	s.chat.OnUserChangedNickname().Notify(user.Address(), r.Nickname, false)

	return &proto.SetChatNicknameResponse{}, nil
}

func validateNicknameReturningGRPCError(nickname string) (string, error) {
	if len(nickname) > 0 {
		// when making changes, consider updating also the validation rules in the application framework chat module
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
		if strings.HasPrefix(nickname, "ban_1") || strings.HasPrefix(nickname, "ban_3") {
			return "", status.Error(codes.InvalidArgument, "nickname must not look like a Banano address")
		}
	}
	return nickname, nil
}

func (s *grpcServer) ChatGifSearch(ctx context.Context, r *proto.ChatGifSearchRequest) (*proto.ChatGifSearchResponse, error) {
	user := authinterceptor.UserClaimsFromContext(ctx)
	if user == nil {
		return nil, stacktrace.NewError("user claims unexpectedly missing")
	}

	results, next, err := s.chat.GifSearch(ctx, user, r.Query, r.Cursor)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	protoResults := make([]*proto.ChatGifSearchResult, len(results))
	for i, result := range results {
		protoResults[i] = &proto.ChatGifSearchResult{
			Id:                 result.ID,
			Title:              result.Title,
			PreviewUrl:         result.PreviewURL,
			PreviewFallbackUrl: result.PreviewFallbackURL,
			Width:              int32(result.Width),
			Height:             int32(result.Height),
			PointsCost:         int32(result.PointsCost),
		}
	}

	return &proto.ChatGifSearchResponse{
		Results:    protoResults,
		NextCursor: next,
	}, nil
}
