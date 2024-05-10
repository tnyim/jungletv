package server

import (
	"context"

	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/server/auth"
	authinterceptor "github.com/tnyim/jungletv/server/interceptors/auth"
	"github.com/tnyim/jungletv/types"
	"github.com/tnyim/jungletv/utils/transaction"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"google.golang.org/protobuf/types/known/timestamppb"
)

func (s *grpcServer) BlockedUsers(ctxCtx context.Context, r *proto.BlockedUsersRequest) (*proto.BlockedUsersResponse, error) {
	user := authinterceptor.UserFromContext(ctxCtx)
	if user == nil {
		// this should never happen, as the auth interceptors should have taken care of this for us
		return nil, status.Error(codes.Unauthenticated, "missing user claims")
	}

	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	defer ctx.Commit() // read-only tx

	blockedUsers, total, err := types.GetUsersBlockedByAddress(ctx, user.Address(), readPaginationParameters(r))
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	return &proto.BlockedUsersResponse{
		BlockedUsers: convertBlockedUsers(ctx, blockedUsers, s.userSerializer),
		Offset:       readOffset(r),
		Total:        total,
	}, nil
}

func convertBlockedUsers(ctx context.Context, orig []*types.BlockedUser, userSerializer auth.APIUserSerializer) []*proto.BlockedUser {
	protoEntries := make([]*proto.BlockedUser, len(orig))
	for i, entry := range orig {
		protoEntries[i] = convertBlockedUser(ctx, entry, userSerializer)
	}
	return protoEntries
}

func convertBlockedUser(ctx context.Context, orig *types.BlockedUser, userSerializer auth.APIUserSerializer) *proto.BlockedUser {
	return &proto.BlockedUser{
		Id:          orig.ID,
		BlockedUser: userSerializer(ctx, auth.NewAddressOnlyUser(orig.Address)),
		BlockedBy:   userSerializer(ctx, auth.NewAddressOnlyUser(orig.BlockedBy)),
		CreatedAt:   timestamppb.New(orig.CreatedAt),
	}
}

func (s *grpcServer) BlockUser(ctx context.Context, r *proto.BlockUserRequest) (*proto.BlockUserResponse, error) {
	user := authinterceptor.UserFromContext(ctx)
	if user == nil {
		// this should never happen, as the auth interceptors should have taken care of this for us
		return nil, status.Error(codes.Unauthenticated, "missing user claims")
	}

	if user.Address() == r.Address {
		return nil, status.Error(codes.InvalidArgument, "you can't block yourself")
	}

	err := s.chat.BlockUser(ctx, auth.NewAddressOnlyUser(r.Address), user)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	return &proto.BlockUserResponse{}, nil
}

func (s *grpcServer) UnblockUser(ctx context.Context, r *proto.UnblockUserRequest) (*proto.UnblockUserResponse, error) {
	user := authinterceptor.UserFromContext(ctx)
	if user == nil {
		// this should never happen, as the auth interceptors should have taken care of this for us
		return nil, status.Error(codes.Unauthenticated, "missing user claims")
	}

	var err error
	switch r.GetBlockIdentification().(type) {
	case *proto.UnblockUserRequest_BlockId:
		err = s.chat.UnblockUser(ctx, r.GetBlockId(), user)
	case *proto.UnblockUserRequest_Address:
		err = s.chat.UnblockUserByAddress(ctx, r.GetAddress(), user)
	default:
		return nil, stacktrace.NewError("invalid user block identification type")
	}
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	return &proto.UnblockUserResponse{}, nil
}
