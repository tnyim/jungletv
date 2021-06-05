package server

import (
	"context"

	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/proto"
)

func (s *grpcServer) RewardInfo(ctx context.Context, r *proto.RewardInfoRequest) (*proto.RewardInfoResponse, error) {
	userClaims := UserClaimsFromContext(ctx)
	if userClaims == nil {
		return nil, stacktrace.NewError("user claims unexpectedly missing")
	}

	return &proto.RewardInfoResponse{
		RewardAddress: userClaims.RewardAddress,
	}, nil
}
