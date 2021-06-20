package server

import (
	"context"
	"time"

	"github.com/hectorchu/gonano/util"
	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/proto"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"google.golang.org/protobuf/types/known/timestamppb"
)

func (s *grpcServer) SignIn(ctx context.Context, r *proto.SignInRequest) (*proto.SignInResponse, error) {
	_, _, _, ok, err := s.signInRateLimiter.Take(ctx, RemoteAddressFromContext(ctx))
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	if !ok {
		return nil, status.Errorf(codes.ResourceExhausted, "rate limit reached")
	}

	// validate reward address
	_, err = util.AddressToPubkey(r.RewardAddress)
	if err != nil || r.RewardAddress[:4] != "ban_" { // we must check for ban since AddressToPubkey accepts nano too
		return nil, status.Errorf(codes.InvalidArgument, "invalid reward address")
	}

	user := UserClaimsFromContext(ctx)
	var jwtToken string
	expiry := time.Now().Add(30 * 24 * time.Hour)
	if user != nil && permissionLevelOrder[user.PermissionLevel] >= permissionLevelOrder[UserPermissionLevel] {
		// keep permissions of authenticated user
		jwtToken, err = s.jwtManager.Generate(&userInfo{
			RewardAddress:   r.RewardAddress,
			PermissionLevel: user.PermissionLevel,
			Username:        user.Username,
		}, expiry)
	} else {
		jwtToken, err = s.jwtManager.Generate(&userInfo{
			RewardAddress:   r.RewardAddress,
			PermissionLevel: UserPermissionLevel,
		}, expiry)
	}
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	return &proto.SignInResponse{
		AuthToken:       jwtToken,
		TokenExpiration: timestamppb.New(expiry),
	}, nil
}
