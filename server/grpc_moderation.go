package server

import (
	"context"
	"fmt"
	"strings"

	"github.com/bwmarrin/snowflake"
	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/server/auth"
	"github.com/tnyim/jungletv/server/components/chatmanager"
	"github.com/tnyim/jungletv/server/components/pointsmanager"
	authinterceptor "github.com/tnyim/jungletv/server/interceptors/auth"
	"github.com/tnyim/jungletv/types"
	"github.com/tnyim/jungletv/utils/transaction"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"google.golang.org/protobuf/types/known/timestamppb"
)

func (s *grpcServer) ForciblyEnqueueTicket(ctx context.Context, r *proto.ForciblyEnqueueTicketRequest) (*proto.ForciblyEnqueueTicketResponse, error) {
	user := authinterceptor.UserClaimsFromContext(ctx)
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

	s.log.Printf("Ticket %s forcibly enqueued by %s (remote address %s)", r.Id, user.Username, authinterceptor.RemoteAddressFromContext(ctx))
	return &proto.ForciblyEnqueueTicketResponse{}, nil
}

func (s *grpcServer) RemoveQueueEntry(ctx context.Context, r *proto.RemoveQueueEntryRequest) (*proto.RemoveQueueEntryResponse, error) {
	user := authinterceptor.UserClaimsFromContext(ctx)
	if user == nil {
		// this should never happen, as the auth interceptors should have taken care of this for us
		return nil, status.Error(codes.Unauthenticated, "missing user claims")
	}

	entry, err := s.mediaQueue.RemoveEntry(r.Id)
	if err != nil {
		return nil, stacktrace.Propagate(err, "failed to remove queue entry")
	}

	s.log.Printf("Queue entry with ID %s removed by %s (remote address %s)", r.Id, user.Username, authinterceptor.RemoteAddressFromContext(ctx))

	requestedBy := "(unknown)"
	if entry.RequestedBy() != nil && !entry.RequestedBy().IsUnknown() {
		requestedBy = entry.RequestedBy().Address()[:14]
	}

	if s.modLogWebhook != nil {
		_, err = s.modLogWebhook.SendContent(
			fmt.Sprintf("Moderator %s (%s) removed queue entry requested by %s with title \"%s\"",
				user.Address()[:14], user.Username, requestedBy, entry.MediaInfo().Title()))
		if err != nil {
			s.log.Println("Failed to send mod log webhook:", err)
		}
	}

	return &proto.RemoveQueueEntryResponse{}, nil
}

func (s *grpcServer) RemoveChatMessage(ctx context.Context, r *proto.RemoveChatMessageRequest) (*proto.RemoveChatMessageResponse, error) {
	user := authinterceptor.UserClaimsFromContext(ctx)
	if user == nil {
		// this should never happen, as the auth interceptors should have taken care of this for us
		return nil, status.Error(codes.Unauthenticated, "missing user claims")
	}

	deletedMsg, err := s.chat.DeleteMessage(ctx, snowflake.ParseInt64(r.Id))
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	attachments := ""
	if len(deletedMsg.AttachmentsView) > 0 {
		attachments = "\n\nAttachments:\n"
		for _, a := range deletedMsg.AttachmentsView {
			attachments += "- " + a.SerializeForModLog(ctx) + "\n"
		}
	}

	content := "> " + strings.Join(strings.Split(deletedMsg.Content, "\n"), "\n> ")

	if s.modLogWebhook != nil {
		_, err = s.modLogWebhook.SendContent(
			fmt.Sprintf("Moderator %s (%s) deleted chat message from %s:\n\n%s%s",
				user.Address()[:14], user.Username, deletedMsg.Author.Address()[:14], content, attachments))
		if err != nil {
			s.log.Println("Failed to send mod log webhook:", err)
		}
	}
	return &proto.RemoveChatMessageResponse{}, nil
}

func (s *grpcServer) SetChatSettings(ctx context.Context, r *proto.SetChatSettingsRequest) (*proto.SetChatSettingsResponse, error) {
	user := authinterceptor.UserClaimsFromContext(ctx)
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
		s.chat.DisableChat(chatmanager.DisabledReasonUnspecified)
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
	user := authinterceptor.UserClaimsFromContext(ctx)
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

func (s *grpcServer) UserChatMessages(ctx context.Context, r *proto.UserChatMessagesRequest) (*proto.UserChatMessagesResponse, error) {
	moderator := authinterceptor.UserClaimsFromContext(ctx)
	if moderator == nil {
		// this should never happen, as the auth interceptors should have taken care of this for us
		return nil, status.Error(codes.Unauthenticated, "missing user claims")
	}

	user := auth.NewAddressOnlyUser(r.Address)
	_, protoMsgs, err := s.chat.LoadNumLatestMessagesFromUser(ctx, user, int(r.NumMessages))
	if err != nil {
		return nil, stacktrace.Propagate(err, "failed to load chat messages")
	}
	return &proto.UserChatMessagesResponse{
		Messages: protoMsgs,
	}, nil
}

func (s *grpcServer) SetUserChatNickname(ctx context.Context, r *proto.SetUserChatNicknameRequest) (*proto.SetUserChatNicknameResponse, error) {
	moderator := authinterceptor.UserClaimsFromContext(ctx)
	if moderator == nil {
		// this should never happen, as the auth interceptors should have taken care of this for us
		return nil, status.Error(codes.Unauthenticated, "missing user claims")
	}

	var err error
	r.Nickname, err = validateNicknameReturningGRPCError(r.Nickname)
	if err != nil {
		return nil, err
	}

	user := auth.NewAddressOnlyUser(r.Address)

	if r.Nickname == "" {
		err = s.chat.SetNickname(ctx, user, nil, true)
	} else {
		err = s.chat.SetNickname(ctx, user, &r.Nickname, true)
	}
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	s.log.Printf("Nickname for user %s set to \"%s\" by %s (remote address %s)", r.Address, r.Nickname, moderator.Username, authinterceptor.RemoteAddressFromContext(ctx))

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
	moderator := authinterceptor.UserClaimsFromContext(ctx)
	if moderator == nil {
		// this should never happen, as the auth interceptors should have taken care of this for us
		return nil, status.Error(codes.Unauthenticated, "missing user claims")
	}

	if r.Multiplier < 1 {
		return nil, status.Error(codes.InvalidArgument, "the multiplier can't be lower than 1")
	}

	s.pricer.SetFinalPricesMultiplier(int(r.Multiplier))

	s.log.Printf("Prices multiplier set to %d by %s (remote address %s)", r.Multiplier, moderator.Username, authinterceptor.RemoteAddressFromContext(ctx))

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

func (s *grpcServer) SetMinimumPricesMultiplier(ctx context.Context, r *proto.SetMinimumPricesMultiplierRequest) (*proto.SetMinimumPricesMultiplierResponse, error) {
	moderator := authinterceptor.UserClaimsFromContext(ctx)
	if moderator == nil {
		// this should never happen, as the auth interceptors should have taken care of this for us
		return nil, status.Error(codes.Unauthenticated, "missing user claims")
	}

	if r.Multiplier < 20 {
		return nil, status.Error(codes.InvalidArgument, "the multiplier can't be lower than 20")
	}

	s.pricer.SetMinimumPricesMultiplier(int(r.Multiplier))

	s.log.Printf("Minimum prices multiplier set to %d by %s (remote address %s)", r.Multiplier, moderator.Username, authinterceptor.RemoteAddressFromContext(ctx))

	if s.modLogWebhook != nil {
		_, err := s.modLogWebhook.SendContent(
			fmt.Sprintf("Minimum prices multiplier set to %d by moderator: %s (%s)",
				r.Multiplier,
				moderator.Address()[:14],
				moderator.Username))
		if err != nil {
			s.log.Println("Failed to send mod log webhook:", err)
		}
	}

	return &proto.SetMinimumPricesMultiplierResponse{}, nil
}

func (s *grpcServer) SetCrowdfundedSkippingEnabled(ctx context.Context, r *proto.SetCrowdfundedSkippingEnabledRequest) (*proto.SetCrowdfundedSkippingEnabledResponse, error) {
	user := authinterceptor.UserClaimsFromContext(ctx)
	if user == nil {
		// this should never happen, as the auth interceptors should have taken care of this for us
		return nil, status.Error(codes.Unauthenticated, "missing user claims")
	}

	s.skipManager.SetCrowdfundedSkippingEnabled(r.Enabled)

	if s.modLogWebhook != nil {
		action := "disabled"
		if r.Enabled {
			action = "enabled"
		}
		_, err := s.modLogWebhook.SendContent(
			fmt.Sprintf("Moderator %s (%s) %s crowdfunded skipping",
				user.Address()[:14], user.Username, action))
		if err != nil {
			s.log.Println("Failed to send mod log webhook:", err)
		}
	}

	return &proto.SetCrowdfundedSkippingEnabledResponse{}, nil
}

func (s *grpcServer) SetSkipPriceMultiplier(ctx context.Context, r *proto.SetSkipPriceMultiplierRequest) (*proto.SetSkipPriceMultiplierResponse, error) {
	moderator := authinterceptor.UserClaimsFromContext(ctx)
	if moderator == nil {
		// this should never happen, as the auth interceptors should have taken care of this for us
		return nil, status.Error(codes.Unauthenticated, "missing user claims")
	}

	if r.Multiplier < 1 {
		return nil, status.Error(codes.InvalidArgument, "the multiplier can't be lower than 1")
	}

	s.pricer.SetSkipPriceMultiplier(int(r.Multiplier))

	s.log.Printf("Skip price multiplier set to %d by %s (remote address %s)", r.Multiplier, moderator.Username, authinterceptor.RemoteAddressFromContext(ctx))

	if s.modLogWebhook != nil {
		_, err := s.modLogWebhook.SendContent(
			fmt.Sprintf("Skip price multiplier set to %d by moderator: %s (%s)",
				r.Multiplier,
				moderator.Address()[:14],
				moderator.Username))
		if err != nil {
			s.log.Println("Failed to send mod log webhook:", err)
		}
	}

	return &proto.SetSkipPriceMultiplierResponse{}, nil
}

func (s *grpcServer) SetSkippingEnabled(ctx context.Context, r *proto.SetSkippingEnabledRequest) (*proto.SetSkippingEnabledResponse, error) {
	user := authinterceptor.UserClaimsFromContext(ctx)
	if user == nil {
		// this should never happen, as the auth interceptors should have taken care of this for us
		return nil, status.Error(codes.Unauthenticated, "missing user claims")
	}

	s.mediaQueue.SetSkippingEnabled(r.Enabled)

	if s.modLogWebhook != nil {
		action := "disabled"
		if r.Enabled {
			action = "enabled"
		}
		_, err := s.modLogWebhook.SendContent(
			fmt.Sprintf("Moderator %s (%s) %s skipping in general",
				user.Address()[:14], user.Username, action))
		if err != nil {
			s.log.Println("Failed to send mod log webhook:", err)
		}
	}

	return &proto.SetSkippingEnabledResponse{}, nil
}

func (s *grpcServer) SetNewQueueEntriesAlwaysUnskippable(ctx context.Context, r *proto.SetNewQueueEntriesAlwaysUnskippableRequest) (*proto.SetNewQueueEntriesAlwaysUnskippableResponse, error) {
	user := authinterceptor.UserClaimsFromContext(ctx)
	if user == nil {
		// this should never happen, as the auth interceptors should have taken care of this for us
		return nil, status.Error(codes.Unauthenticated, "missing user claims")
	}

	s.enqueueManager.SetNewQueueEntriesAlwaysUnskippableForFree(r.Enabled)

	if s.modLogWebhook != nil {
		action := "disabled"
		if r.Enabled {
			action = "enabled"
		}
		_, err := s.modLogWebhook.SendContent(
			fmt.Sprintf("Moderator %s (%s) %s forced unskippability of new queue entries",
				user.Address()[:14], user.Username, action))
		if err != nil {
			s.log.Println("Failed to send mod log webhook:", err)
		}
	}

	return &proto.SetNewQueueEntriesAlwaysUnskippableResponse{}, nil
}

func (s *grpcServer) SetOwnQueueEntryRemovalAllowed(ctx context.Context, r *proto.SetOwnQueueEntryRemovalAllowedRequest) (*proto.SetOwnQueueEntryRemovalAllowedResponse, error) {
	user := authinterceptor.UserClaimsFromContext(ctx)
	if user == nil {
		// this should never happen, as the auth interceptors should have taken care of this for us
		return nil, status.Error(codes.Unauthenticated, "missing user claims")
	}

	s.mediaQueue.SetRemovalOfOwnEntriesAllowed(r.Allowed)

	if s.modLogWebhook != nil {
		action := "disabled"
		if r.Allowed {
			action = "enabled"
		}
		_, err := s.modLogWebhook.SendContent(
			fmt.Sprintf("Moderator %s (%s) %s removal of own queue entries",
				user.Address()[:14], user.Username, action))
		if err != nil {
			s.log.Println("Failed to send mod log webhook:", err)
		}
	}

	return &proto.SetOwnQueueEntryRemovalAllowedResponse{}, nil
}

func (s *grpcServer) SpectatorInfo(ctx context.Context, r *proto.SpectatorInfoRequest) (*proto.Spectator, error) {
	spectator, ok := s.rewardsHandler.GetSpectator(r.RewardsAddress)
	if !ok {
		return nil, status.Error(codes.NotFound, "spectator not found")
	}

	legitimate, notLegitimateSince := spectator.Legitimate()
	stoppedWatching, stoppedWatchingAt := spectator.StoppedWatching()
	activityChallenge := spectator.CurrentActivityChallenge()
	clientIntegrityChecksSkipped, err := s.moderationStore.LoadPaymentAddressSkipsClientIntegrityChecks(ctx, r.RewardsAddress)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	ipRepChecksSkipped, err := s.moderationStore.LoadPaymentAddressSkipsIPReputationChecks(ctx, r.RewardsAddress)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	hardChallengesReduced, err := s.moderationStore.LoadPaymentAddressHasReducedHardChallengeFrequency(ctx, r.RewardsAddress)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	ps := &proto.Spectator{
		RewardsAddress:                     r.RewardsAddress,
		NumConnections:                     uint32(spectator.ConnectionCount()),
		NumSpectatorsWithSameRemoteAddress: uint32(spectator.CountOtherConnectedSpectatorsOnSameRemoteAddress(s.rewardsHandler)),
		WatchingSince:                      timestamppb.New(spectator.WatchingSince()),
		RemoteAddressCanReceiveRewards:     spectator.RemoteAddressCanReceiveRewards(s.ipReputationChecker),
		Legitimate:                         legitimate,
		ClientIntegrityChecksSkipped:       clientIntegrityChecksSkipped,
		IpAddressReputationChecksSkipped:   ipRepChecksSkipped,
		HardChallengeFrequencyReduced:      hardChallengesReduced,
	}
	if !legitimate {
		ps.NotLegitimateSince = timestamppb.New(notLegitimateSince)
	}
	if stoppedWatching {
		ps.StoppedWatchingAt = timestamppb.New(stoppedWatchingAt)
	}
	if activityChallenge != nil {
		ps.ActivityChallenge = activityChallenge.SerializeForAPI()
	}
	return ps, nil
}

func (s *grpcServer) ResetSpectatorStatus(ctx context.Context, r *proto.ResetSpectatorStatusRequest) (*proto.ResetSpectatorStatusResponse, error) {
	moderator := authinterceptor.UserClaimsFromContext(ctx)
	if moderator == nil {
		// this should never happen, as the auth interceptors should have taken care of this for us
		return nil, status.Error(codes.Unauthenticated, "missing user claims")
	}

	err := s.rewardsHandler.ResetAddressLegitimacyStatus(ctx, r.RewardsAddress)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	s.log.Printf("Spectator state of address %s reset by %s (remote address %s)", r.RewardsAddress, moderator.Username, authinterceptor.RemoteAddressFromContext(ctx))

	if s.modLogWebhook != nil {
		_, err = s.modLogWebhook.SendContent(
			fmt.Sprintf("Spectator state of address %s reset by moderator: %s (%s)",
				r.RewardsAddress,
				moderator.Address()[:14],
				moderator.Username))
		if err != nil {
			s.log.Println("Failed to send mod log webhook:", err)
		}
	}
	return &proto.ResetSpectatorStatusResponse{}, nil
}

func (s *grpcServer) SetQueueInsertCursor(ctx context.Context, r *proto.SetQueueInsertCursorRequest) (*proto.SetQueueInsertCursorResponse, error) {
	moderator := authinterceptor.UserClaimsFromContext(ctx)
	if moderator == nil {
		// this should never happen, as the auth interceptors should have taken care of this for us
		return nil, status.Error(codes.Unauthenticated, "missing user claims")
	}

	err := s.mediaQueue.SetInsertCursor(r.Id)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	s.log.Printf("Queue insert cursor set to %s by %s (remote address %s)", r.Id, moderator.Username, authinterceptor.RemoteAddressFromContext(ctx))

	if s.modLogWebhook != nil {
		_, err := s.modLogWebhook.SendContent(
			fmt.Sprintf("Queue insert cursor set to %s by moderator: %s (%s)",
				r.Id,
				moderator.Address()[:14],
				moderator.Username))
		if err != nil {
			s.log.Println("Failed to send mod log webhook:", err)
		}
	}

	return &proto.SetQueueInsertCursorResponse{}, nil
}

func (s *grpcServer) ClearQueueInsertCursor(ctx context.Context, r *proto.ClearQueueInsertCursorRequest) (*proto.ClearQueueInsertCursorResponse, error) {
	moderator := authinterceptor.UserClaimsFromContext(ctx)
	if moderator == nil {
		// this should never happen, as the auth interceptors should have taken care of this for us
		return nil, status.Error(codes.Unauthenticated, "missing user claims")
	}

	s.mediaQueue.ClearInsertCursor()

	s.log.Printf("Queue insert cursor cleared by %s (remote address %s)", moderator.Username, authinterceptor.RemoteAddressFromContext(ctx))

	if s.modLogWebhook != nil {
		_, err := s.modLogWebhook.SendContent(
			fmt.Sprintf("Queue insert cursor cleared by moderator: %s (%s)",
				moderator.Address()[:14],
				moderator.Username))
		if err != nil {
			s.log.Println("Failed to send mod log webhook:", err)
		}
	}

	return &proto.ClearQueueInsertCursorResponse{}, nil
}

func (s *grpcServer) ClearUserProfile(ctxCtx context.Context, r *proto.ClearUserProfileRequest) (*proto.ClearUserProfileResponse, error) {
	moderator := authinterceptor.UserClaimsFromContext(ctxCtx)
	if moderator == nil {
		// this should never happen, as the auth interceptors should have taken care of this for us
		return nil, status.Error(codes.Unauthenticated, "missing user claims")
	}

	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	defer ctx.Rollback()

	profile, err := types.GetUserProfileForAddress(ctx, r.Address)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	err = profile.Delete(ctx)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	err = ctx.Commit()
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	s.log.Printf("Profile for user %s cleared by %s (remote address %s)", r.Address, moderator.Username, authinterceptor.RemoteAddressFromContext(ctx))

	if s.modLogWebhook != nil {
		_, err = s.modLogWebhook.SendContent(
			fmt.Sprintf("Profile for user %s cleared by moderator: %s (%s)",
				r.Address,
				moderator.Address()[:14],
				moderator.Username))
		if err != nil {
			s.log.Println("Failed to send mod log webhook:", err)
		}
	}

	return &proto.ClearUserProfileResponse{}, nil
}

func (s *grpcServer) AdjustPointsBalance(ctxCtx context.Context, r *proto.AdjustPointsBalanceRequest) (*proto.AdjustPointsBalanceResponse, error) {
	moderator := authinterceptor.UserClaimsFromContext(ctxCtx)
	if moderator == nil {
		// this should never happen, as the auth interceptors should have taken care of this for us
		return nil, status.Error(codes.Unauthenticated, "missing user claims")
	}

	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	defer ctx.Rollback()

	err = s.pointsManager.CreateTransaction(ctx,
		auth.NewAddressOnlyUser(r.RewardsAddress),
		types.PointsTxTypeManualAdjustment,
		int(r.Value),
		pointsmanager.TxExtraField{
			Key:   "adjusted_by",
			Value: moderator.Address(),
		},
		pointsmanager.TxExtraField{
			Key:   "reason",
			Value: r.Reason,
		})
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	err = ctx.Commit()
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	s.log.Printf("Points balance of user %s adjusted by %d by %s (remote address %s) with reason: %s",
		r.RewardsAddress, r.Value, moderator.Username, authinterceptor.RemoteAddressFromContext(ctx), r.Reason)

	if s.modLogWebhook != nil {
		_, err = s.modLogWebhook.SendContent(
			fmt.Sprintf("Moderator %s (%s) adjusted points balance of user %s by %d with reason: %s",
				moderator.Address()[:14],
				moderator.Username,
				r.RewardsAddress,
				r.Value,
				r.Reason))
		if err != nil {
			s.log.Println("Failed to send mod log webhook:", err)
		}
	}

	return &proto.AdjustPointsBalanceResponse{}, nil
}
