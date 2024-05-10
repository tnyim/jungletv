package server

import (
	"context"
	"fmt"

	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/server/components/configurationmanager"
	authinterceptor "github.com/tnyim/jungletv/server/interceptors/auth"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (s *grpcServer) AddVipUser(ctx context.Context, r *proto.AddVipUserRequest) (*proto.AddVipUserResponse, error) {
	moderator := authinterceptor.UserFromContext(ctx)
	if moderator == nil {
		// this should never happen, as the auth interceptors should have taken care of this for us
		return nil, status.Error(codes.Unauthenticated, "missing user claims")
	}

	if r.RewardsAddress == "" {
		return nil, status.Error(codes.InvalidArgument, "missing reward address")
	}

	var appearance configurationmanager.VIPUserAppearance
	switch r.Appearance {
	case proto.VipUserAppearance_VIP_USER_APPEARANCE_NORMAL:
		appearance = configurationmanager.VIPUserAppearanceNormal
	case proto.VipUserAppearance_VIP_USER_APPEARANCE_MODERATOR:
		appearance = configurationmanager.VIPUserAppearanceModerator
	case proto.VipUserAppearance_VIP_USER_APPEARANCE_VIP:
		appearance = configurationmanager.VIPUserAppearanceVIP
	case proto.VipUserAppearance_VIP_USER_APPEARANCE_VIP_MODERATOR:
		appearance = configurationmanager.VIPUserAppearanceVIPModerator
	default:
		return nil, status.Error(codes.InvalidArgument, "unknown VIP user appearance")
	}

	_, err := configurationmanager.SetConfigurable[configurationmanager.VIPUser](s.configManager, configurationmanager.VIPUsers, "", configurationmanager.VIPUser{
		Address:    r.RewardsAddress,
		Appearance: appearance,
	})
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
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
	moderator := authinterceptor.UserFromContext(ctx)
	if moderator == nil {
		// this should never happen, as the auth interceptors should have taken care of this for us
		return nil, status.Error(codes.Unauthenticated, "missing user claims")
	}

	if r.RewardsAddress == "" {
		return nil, status.Error(codes.InvalidArgument, "missing reward address")
	}

	_, err := configurationmanager.UnsetConfigurable[configurationmanager.VIPUser](s.configManager, configurationmanager.VIPUsers, "", configurationmanager.VIPUser{
		Address: r.RewardsAddress,
	})
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

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
