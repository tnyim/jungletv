package server

import (
	"context"

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

	err := s.mediaQueue.RemoveEntry(r.Id)
	if err != nil {
		return nil, stacktrace.Propagate(err, "failed to remove queue entry")
	}
	s.log.Printf("Queue entry with ID %s removed by %s (remote address %s)", r.Id, user.Username, RemoteAddressFromContext(ctx))
	return &proto.RemoveQueueEntryResponse{}, nil
}

func (s *grpcServer) RemoveChatMessage(ctx context.Context, r *proto.RemoveChatMessageRequest) (*proto.RemoveChatMessageResponse, error) {
	user := UserClaimsFromContext(ctx)
	if user == nil {
		// this should never happen, as the auth interceptors should have taken care of this for us
		return nil, status.Error(codes.Unauthenticated, "missing user claims")
	}

	err := s.chat.DeleteMessage(ctx, snowflake.ParseInt64(r.Id))
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	return &proto.RemoveChatMessageResponse{}, nil
}

func (s *grpcServer) SetChatSettings(ctx context.Context, r *proto.SetChatSettingsRequest) (*proto.SetChatSettingsResponse, error) {
	user := UserClaimsFromContext(ctx)
	if user == nil {
		// this should never happen, as the auth interceptors should have taken care of this for us
		return nil, status.Error(codes.Unauthenticated, "missing user claims")
	}

	if r.Enabled {
		s.chat.EnableChat()
	} else {
		s.chat.DisableChat(ChatDisabledReasonUnspecified)
	}

	s.chat.SetSlowModeEnabled(r.Slowmode)

	return &proto.SetChatSettingsResponse{}, nil
}

func (s *grpcServer) SetVideoEnqueuingEnabled(ctx context.Context, r *proto.SetVideoEnqueuingEnabledRequest) (*proto.SetVideoEnqueuingEnabledResponse, error) {
	user := UserClaimsFromContext(ctx)
	if user == nil {
		// this should never happen, as the auth interceptors should have taken care of this for us
		return nil, status.Error(codes.Unauthenticated, "missing user claims")
	}

	s.allowVideoEnqueuing = r.Allowed

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

		s.log.Printf("Ban ID %s added by %s (remote address %s) with reason %s", banID, moderator.Username, RemoteAddressFromContext(ctx), r.Reason)
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
