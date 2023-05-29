package server

import (
	"context"
	"fmt"

	"github.com/tnyim/jungletv/proto"
	authinterceptor "github.com/tnyim/jungletv/server/interceptors/auth"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (s *grpcServer) AddVipUser(ctx context.Context, r *proto.AddVipUserRequest) (*proto.AddVipUserResponse, error) {
	moderator := authinterceptor.UserClaimsFromContext(ctx)
	if moderator == nil {
		// this should never happen, as the auth interceptors should have taken care of this for us
		return nil, status.Error(codes.Unauthenticated, "missing user claims")
	}

	if r.RewardsAddress == "" {
		return nil, status.Error(codes.InvalidArgument, "missing reward address")
	}

	s.vipUsersMutex.Lock()
	defer s.vipUsersMutex.Unlock()

	switch r.Appearance {
	case proto.VipUserAppearance_VIP_USER_APPEARANCE_NORMAL:
		s.vipUsers[r.RewardsAddress] = vipUserAppearanceNormal
	case proto.VipUserAppearance_VIP_USER_APPEARANCE_MODERATOR:
		s.vipUsers[r.RewardsAddress] = vipUserAppearanceModerator
	case proto.VipUserAppearance_VIP_USER_APPEARANCE_VIP:
		s.vipUsers[r.RewardsAddress] = vipUserAppearanceVIP
	case proto.VipUserAppearance_VIP_USER_APPEARANCE_VIP_MODERATOR:
		s.vipUsers[r.RewardsAddress] = vipUserAppearanceVIPModerator
	default:
		return nil, status.Error(codes.InvalidArgument, "unknown VIP user appearance")
	}

	s.log.Printf("User %s made VIP with appearance %d by %s (remote address %s)", r.RewardsAddress, r.Appearance, moderator.ModeratorName(), authinterceptor.RemoteAddressFromContext(ctx))

	if s.modLogWebhook != nil {
		_, err := s.modLogWebhook.SendContent(
			fmt.Sprintf("**User `%s` made VIP by %s (%s)**",
				r.RewardsAddress,
				moderator.Address()[:14],
				moderator.ModeratorName()))
		if err != nil {
			s.log.Println("Failed to send mod log webhook:", err)
		}
	}

	return &proto.AddVipUserResponse{}, nil
}

func (s *grpcServer) RemoveVipUser(ctx context.Context, r *proto.RemoveVipUserRequest) (*proto.RemoveVipUserResponse, error) {
	moderator := authinterceptor.UserClaimsFromContext(ctx)
	if moderator == nil {
		// this should never happen, as the auth interceptors should have taken care of this for us
		return nil, status.Error(codes.Unauthenticated, "missing user claims")
	}

	if r.RewardsAddress == "" {
		return nil, status.Error(codes.InvalidArgument, "missing reward address")
	}

	s.vipUsersMutex.Lock()
	defer s.vipUsersMutex.Unlock()

	_, present := s.vipUsers[r.RewardsAddress]
	if !present {
		return nil, status.Error(codes.InvalidArgument, "user is not VIP")
	}
	delete(s.vipUsers, r.RewardsAddress)

	s.log.Printf("User %s made non-VIP by %s (remote address %s)", r.RewardsAddress, moderator.ModeratorName(), authinterceptor.RemoteAddressFromContext(ctx))

	if s.modLogWebhook != nil {
		_, err := s.modLogWebhook.SendContent(
			fmt.Sprintf("**User `%s` made non-VIP by %s (%s)**",
				r.RewardsAddress,
				moderator.Address()[:14],
				moderator.ModeratorName()))
		if err != nil {
			s.log.Println("Failed to send mod log webhook:", err)
		}
	}

	return &proto.RemoveVipUserResponse{}, nil
}
