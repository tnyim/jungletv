package server

import (
	"context"
	"fmt"
	"strings"

	"github.com/bwmarrin/snowflake"
	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/proto"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (s *grpcServer) ForciblyEnqueueTicket(ctx context.Context, r *proto.ForciblyEnqueueTicketRequest) (*proto.ForciblyEnqueueTicketResponse, error) {
	user := UserClaimsFromContext(ctx)
	if user == nil {
		// this should never happen, as the auth interceptors should have taken care of this for us
		return nil, status.Error(codes.Unauthenticated, "missing user claims")
	}

	ticket := s.enqueueManager.GetTicket(r.Id)
	if ticket == nil {
		return nil, stacktrace.NewError("unknown ticket ID")
	}
	if ticket.Status() != proto.EnqueueMediaTicketStatus_ACTIVE {
		return nil, stacktrace.NewError("ticket no longer active")
	}
	ticket.ForceEnqueuing(r.EnqueueType)

	s.log.Printf("Ticket %s forcibly enqueued by %s (remote address %s)", r.Id, user.Username, RemoteAddressFromContext(ctx))
	return &proto.ForciblyEnqueueTicketResponse{}, nil
}

func (s *grpcServer) RemoveQueueEntry(ctx context.Context, r *proto.RemoveQueueEntryRequest) (*proto.RemoveQueueEntryResponse, error) {
	user := UserClaimsFromContext(ctx)
	if user == nil {
		// this should never happen, as the auth interceptors should have taken care of this for us
		return nil, status.Error(codes.Unauthenticated, "missing user claims")
	}

	entry, err := s.mediaQueue.RemoveEntry(r.Id)
	if err != nil {
		return nil, stacktrace.Propagate(err, "failed to remove queue entry")
	}

	s.log.Printf("Queue entry with ID %s removed by %s (remote address %s)", r.Id, user.Username, RemoteAddressFromContext(ctx))

	requestedBy := "(unknown)"
	if entry.RequestedBy() != nil && !entry.RequestedBy().IsUnknown() {
		requestedBy = entry.RequestedBy().Address()[:14]
	}

	_, err = s.modLogWebhook.SendContent(
		fmt.Sprintf("Moderator %s (%s) removed queue entry requested by %s with title \"%s\"",
			user.Address()[:14], user.Username, requestedBy, entry.MediaInfo().Title()))
	if err != nil {
		s.log.Println("Failed to send mod log webhook:", err)
	}

	return &proto.RemoveQueueEntryResponse{}, nil
}

func (s *grpcServer) RemoveChatMessage(ctx context.Context, r *proto.RemoveChatMessageRequest) (*proto.RemoveChatMessageResponse, error) {
	user := UserClaimsFromContext(ctx)
	if user == nil {
		// this should never happen, as the auth interceptors should have taken care of this for us
		return nil, status.Error(codes.Unauthenticated, "missing user claims")
	}

	deletedMsg, err := s.chat.DeleteMessage(ctx, snowflake.ParseInt64(r.Id))
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	if s.modLogWebhook != nil {
		_, err = s.modLogWebhook.SendContent(
			fmt.Sprintf("Moderator %s (%s) deleted chat message from %s:\n\n>>> %s",
				user.Address()[:14], user.Username, deletedMsg.Author.Address()[:14], deletedMsg.Content))
		if err != nil {
			s.log.Println("Failed to send mod log webhook:", err)
		}
	}
	return &proto.RemoveChatMessageResponse{}, nil
}

func (s *grpcServer) SetChatSettings(ctx context.Context, r *proto.SetChatSettingsRequest) (*proto.SetChatSettingsResponse, error) {
	user := UserClaimsFromContext(ctx)
	if user == nil {
		// this should never happen, as the auth interceptors should have taken care of this for us
		return nil, status.Error(codes.Unauthenticated, "missing user claims")
	}

	enabledString := ""
	if r.Enabled {
		enabledString = "enabled"
		s.chat.EnableChat()
	} else {
		enabledString = "disabled"
		s.chat.DisableChat(ChatDisabledReasonUnspecified)
	}

	s.chat.SetSlowModeEnabled(r.Slowmode)

	slowmodeString := "disabled"
	if r.Slowmode {
		slowmodeString = "enabled"
	}

	if s.modLogWebhook != nil {
		_, err := s.modLogWebhook.SendContent(
			fmt.Sprintf("Moderator %s (%s) changed chat settings: chat %s, slowmode %s",
				user.Address()[:14], user.Username, enabledString, slowmodeString))
		if err != nil {
			s.log.Println("Failed to send mod log webhook:", err)
		}
	}

	return &proto.SetChatSettingsResponse{}, nil
}

func (s *grpcServer) SetVideoEnqueuingEnabled(ctx context.Context, r *proto.SetVideoEnqueuingEnabledRequest) (*proto.SetVideoEnqueuingEnabledResponse, error) {
	user := UserClaimsFromContext(ctx)
	if user == nil {
		// this should never happen, as the auth interceptors should have taken care of this for us
		return nil, status.Error(codes.Unauthenticated, "missing user claims")
	}

	s.allowVideoEnqueuing = r.Allowed

	if s.modLogWebhook != nil {
		_, err := s.modLogWebhook.SendContent(
			fmt.Sprintf("Moderator %s (%s) changed video enqueuing to %s",
				user.Address()[:14], user.Username, r.Allowed.String()))
		if err != nil {
			s.log.Println("Failed to send mod log webhook:", err)
		}
	}

	return &proto.SetVideoEnqueuingEnabledResponse{}, nil
}

func (s *grpcServer) BanUser(ctx context.Context, r *proto.BanUserRequest) (*proto.BanUserResponse, error) {
	moderator := UserClaimsFromContext(ctx)
	if moderator == nil {
		// this should never happen, as the auth interceptors should have taken care of this for us
		return nil, status.Error(codes.Unauthenticated, "missing user claims")
	}

	if r.Address == "" {
		return nil, status.Error(codes.InvalidArgument, "missing reward address")
	}
	if !r.ChatBanned && !r.EnqueuingBanned && !r.RewardsBanned {
		return nil, status.Error(codes.InvalidArgument, "must ban from something")
	}

	remoteAddresses := []string{}
	if r.RemoteAddress != "" {
		remoteAddresses = []string{r.RemoteAddress}
	}

	additionalRemoteAddresses := s.rewardsHandler.RemoteAddressesForRewardAddress(ctx, r.Address)
	remoteAddresses = append(remoteAddresses, additionalRemoteAddresses...)

	if len(remoteAddresses) == 0 {
		// this way we'll add a single ban entry that only bans by reward address, but better than nothing
		remoteAddresses = []string{""}
	}

	banIDs := []string{}
	for _, remoteAddress := range remoteAddresses {
		banID, err := s.moderationStore.BanUser(ctx, r.ChatBanned, r.EnqueuingBanned, r.RewardsBanned, r.Address, remoteAddress, r.Reason, moderator)
		if err != nil {
			return nil, stacktrace.Propagate(err, "")
		}

		places := []string{}
		if r.ChatBanned {
			places = append(places, "chat")
		}
		if r.EnqueuingBanned {
			places = append(places, "enqueuing")
		}
		if r.RewardsBanned {
			places = append(places, "rewards")
		}

		if s.modLogWebhook != nil {
			s.log.Printf("Ban ID %s added by %s (remote address %s) with reason %s", banID, moderator.Username, RemoteAddressFromContext(ctx), r.Reason)
			_, err = s.modLogWebhook.SendContent(
				fmt.Sprintf("**Added ban with ID `%s`**\n\nUser: %s\nBanned from: %s\nReason: %s\nBy moderator: %s (%s)",
					banID,
					r.Address,
					strings.Join(places, ", "),
					r.Reason,
					moderator.Address()[:14],
					moderator.Username))
			if err != nil {
				s.log.Println("Failed to send mod log webhook:", err)
			}
		}
		banIDs = append(banIDs, banID)
	}

	return &proto.BanUserResponse{
		BanIds: banIDs,
	}, nil
}

func (s *grpcServer) RemoveBan(ctx context.Context, r *proto.RemoveBanRequest) (*proto.RemoveBanResponse, error) {
	moderator := UserClaimsFromContext(ctx)
	if moderator == nil {
		// this should never happen, as the auth interceptors should have taken care of this for us
		return nil, status.Error(codes.Unauthenticated, "missing user claims")
	}

	if r.BanId == "" {
		return nil, status.Error(codes.InvalidArgument, "missing ban ID")
	}

	err := s.moderationStore.RemoveBan(ctx, r.BanId, r.Reason, moderator)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	s.log.Printf("Ban ID %s removed by %s (remote address %s) with reason %s", r.BanId, moderator.Username, RemoteAddressFromContext(ctx), r.Reason)

	if s.modLogWebhook != nil {
		_, err = s.modLogWebhook.SendContent(
			fmt.Sprintf("**Removed ban with ID `%s`**\n\nReason: %s\nBy moderator: %s (%s)",
				r.BanId,
				r.Reason,
				moderator.Address()[:14],
				moderator.Username))
		if err != nil {
			s.log.Println("Failed to send mod log webhook:", err)
		}
	}

	return &proto.RemoveBanResponse{}, nil
}

func (s *grpcServer) UserChatMessages(ctx context.Context, r *proto.UserChatMessagesRequest) (*proto.UserChatMessagesResponse, error) {
	moderator := UserClaimsFromContext(ctx)
	if moderator == nil {
		// this should never happen, as the auth interceptors should have taken care of this for us
		return nil, status.Error(codes.Unauthenticated, "missing user claims")
	}

	user := &addressOnlyUser{
		address: r.Address,
	}
	messages, err := s.chat.store.LoadNumLatestMessagesFromUser(ctx, user, int(r.NumMessages))
	if err != nil {
		return nil, stacktrace.Propagate(err, "failed to load chat messages")
	}
	protoMsgs := make([]*proto.ChatMessage, len(messages))
	for i := range messages {
		protoMsgs[i] = messages[i].SerializeForAPI()
	}
	return &proto.UserChatMessagesResponse{
		Messages: protoMsgs,
	}, nil
}

func (s *grpcServer) SetUserChatNickname(ctx context.Context, r *proto.SetUserChatNicknameRequest) (*proto.SetUserChatNicknameResponse, error) {
	moderator := UserClaimsFromContext(ctx)
	if moderator == nil {
		// this should never happen, as the auth interceptors should have taken care of this for us
		return nil, status.Error(codes.Unauthenticated, "missing user claims")
	}

	var err error
	r.Nickname, err = validateNicknameReturningGRPCError(r.Nickname)
	if err != nil {
		return nil, err
	}

	user := NewAddressOnlyUser(r.Address)

	if r.Nickname == "" {
		err = s.chat.SetNickname(ctx, user, nil, true)
	} else {
		err = s.chat.SetNickname(ctx, user, &r.Nickname, true)
	}
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	s.log.Printf("Nickname for user %s set to \"%s\" by %s (remote address %s)", r.Address, r.Nickname, moderator.Username, RemoteAddressFromContext(ctx))

	if s.modLogWebhook != nil {
		_, err = s.modLogWebhook.SendContent(
			fmt.Sprintf("Nickname for user %s set to \"%s\" by moderator: %s (%s)",
				r.Address,
				r.Nickname,
				moderator.Address()[:14],
				moderator.Username))
		if err != nil {
			s.log.Println("Failed to send mod log webhook:", err)
		}
	}

	return &proto.SetUserChatNicknameResponse{}, nil
}

func (s *grpcServer) SetPricesMultiplier(ctx context.Context, r *proto.SetPricesMultiplierRequest) (*proto.SetPricesMultiplierResponse, error) {
	moderator := UserClaimsFromContext(ctx)
	if moderator == nil {
		// this should never happen, as the auth interceptors should have taken care of this for us
		return nil, status.Error(codes.Unauthenticated, "missing user claims")
	}

	if r.Multiplier < 10 {
		return nil, status.Error(codes.InvalidArgument, "the multiplier can't be lower than 10")
	}

	s.enqueueManager.SetFinalPricesMultiplier(int(r.Multiplier))

	s.log.Printf("Prices multiplier set to %d by %s (remote address %s)", r.Multiplier, moderator.Username, RemoteAddressFromContext(ctx))

	if s.modLogWebhook != nil {
		_, err := s.modLogWebhook.SendContent(
			fmt.Sprintf("Prices multiplier set to %d by moderator: %s (%s)",
				r.Multiplier,
				moderator.Address()[:14],
				moderator.Username))
		if err != nil {
			s.log.Println("Failed to send mod log webhook:", err)
		}
	}

	return &proto.SetPricesMultiplierResponse{}, nil
}
