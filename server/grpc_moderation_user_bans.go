package server

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/server/auth"
	authinterceptor "github.com/tnyim/jungletv/server/interceptors/auth"
	"github.com/tnyim/jungletv/types"
	"github.com/tnyim/jungletv/utils"
	"github.com/tnyim/jungletv/utils/transaction"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"google.golang.org/protobuf/types/known/timestamppb"
)

func (s *grpcServer) UserBans(ctxCtx context.Context, r *proto.UserBansRequest) (*proto.UserBansResponse, error) {
	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	defer ctx.Commit() // read-only tx

	var userBans []*types.BannedUser
	var total uint64

	searchQuery := ""
	if len(r.SearchQuery) >= 3 {
		searchQuery = r.SearchQuery
	}
	if r.ActiveOnly {
		userBans, total, err = types.GetBannedUsersAtInstant(ctx, time.Now(), searchQuery, readPaginationParameters(r))
	} else {
		userBans, total, err = types.GetBannedUsers(ctx, searchQuery, readPaginationParameters(r))
	}
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	return &proto.UserBansResponse{
		UserBans: convertUserBans(ctx, userBans, s.userSerializer),
		Offset:   readOffset(r),
		Total:    total,
	}, nil
}

func convertUserBans(ctx context.Context, orig []*types.BannedUser, userSerializer auth.APIUserSerializer) []*proto.UserBan {
	protoEntries := make([]*proto.UserBan, len(orig))
	for i, entry := range orig {
		protoEntries[i] = convertUserBan(ctx, entry, userSerializer)
	}
	return protoEntries
}

func convertUserBan(ctx context.Context, orig *types.BannedUser, userSerializer auth.APIUserSerializer) *proto.UserBan {
	b := &proto.UserBan{
		BanId:           orig.BanID,
		BannedAt:        timestamppb.New(orig.BannedAt),
		Address:         orig.Address,
		RemoteAddress:   orig.RemoteAddress,
		ChatBanned:      orig.FromChat,
		EnqueuingBanned: orig.FromEnqueuing,
		RewardsBanned:   orig.FromRewards,
		Reason:          orig.Reason,
		BannedBy:        userSerializer(ctx, auth.NewAddressOnlyUser(orig.ModeratorAddress)),
	}

	if orig.BannedUntil.Valid {
		b.BannedUntil = timestamppb.New(orig.BannedUntil.Time)
	}
	if orig.UnbanReason != "" {
		b.UnbanReason = &orig.UnbanReason
	}
	return b
}

func (s *grpcServer) BanUser(ctx context.Context, r *proto.BanUserRequest) (*proto.BanUserResponse, error) {
	moderator := authinterceptor.UserClaimsFromContext(ctx)
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

	remoteAddresses := map[string]struct{}{}
	if r.RemoteAddress != "" {
		remoteAddresses[utils.GetUniquifiedIP(r.RemoteAddress)] = struct{}{}
	}

	additionalRemoteAddresses := s.rewardsHandler.RemoteAddressesForRewardAddress(ctx, r.Address)
	for address := range additionalRemoteAddresses {
		remoteAddresses[utils.GetUniquifiedIP(address)] = struct{}{}
	}

	if len(remoteAddresses) == 0 {
		// this way we'll add a single ban entry that only bans by reward address, but better than nothing
		remoteAddresses[""] = struct{}{}
	}

	banIDs := []string{}
	for remoteAddress := range remoteAddresses {
		var banEnd *time.Time
		if r.Duration != nil {
			t := time.Now().Add(r.Duration.AsDuration())
			banEnd = &t
		}
		banID, err := s.moderationStore.BanUser(ctx, r.ChatBanned, r.EnqueuingBanned, r.RewardsBanned,
			banEnd, r.Address, remoteAddress, r.Reason, moderator, moderator.Username)
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
			banType := "Ban"
			if r.Duration != nil {
				banType = fmt.Sprintf("Temporary ban (%.2f hours)", r.Duration.AsDuration().Hours())
			}
			s.log.Printf("%s ID %s added by %s (remote address %s) with reason %s", banType, banID, moderator.Username, authinterceptor.RemoteAddressFromContext(ctx), r.Reason)
			_, err = s.modLogWebhook.SendContent(
				fmt.Sprintf("**Added %s with ID `%s`**\n\nUser: %s\nBanned from: %s\nReason: %s\nBy moderator: %s (%s)",
					strings.ToLower(banType),
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
	moderator := authinterceptor.UserClaimsFromContext(ctx)
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

	s.log.Printf("Ban ID %s removed by %s (remote address %s) with reason %s", r.BanId, moderator.Username, authinterceptor.RemoteAddressFromContext(ctx), r.Reason)

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
