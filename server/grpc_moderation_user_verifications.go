package server

import (
	"context"
	"fmt"
	"strings"

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

func (s *grpcServer) UserVerifications(ctxCtx context.Context, r *proto.UserVerificationsRequest) (*proto.UserVerificationsResponse, error) {
	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	defer ctx.Commit() // read-only tx

	searchQuery := ""
	if len(r.SearchQuery) >= 3 {
		searchQuery = r.SearchQuery
	}

	userVerifications, total, err := types.GetVerifiedUsers(ctx, searchQuery, readPaginationParameters(r))
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	return &proto.UserVerificationsResponse{
		UserVerifications: convertUserVerifications(ctx, userVerifications, s.userSerializer),
		Offset:            readOffset(r),
		Total:             total,
	}, nil
}

func convertUserVerifications(ctx context.Context, orig []*types.VerifiedUser, userSerializer auth.APIUserSerializer) []*proto.UserVerification {
	protoEntries := make([]*proto.UserVerification, len(orig))
	for i, entry := range orig {
		protoEntries[i] = convertUserVerification(ctx, entry, userSerializer)
	}
	return protoEntries
}

func convertUserVerification(ctx context.Context, orig *types.VerifiedUser, userSerializer auth.APIUserSerializer) *proto.UserVerification {
	return &proto.UserVerification{
		Id:                            orig.ID,
		CreatedAt:                     timestamppb.New(orig.CreatedAt),
		User:                          userSerializer(ctx, auth.NewAddressOnlyUser(orig.Address)),
		SkipClientIntegrityChecks:     orig.SkipClientIntegrityChecks,
		SkipIpAddressReputationChecks: orig.SkipIPAddressReputationChecks,
		ReduceHardChallengeFrequency:  orig.ReduceHardChallengeFrequency,
		Reason:                        orig.Reason,
		VerifiedBy:                    userSerializer(ctx, auth.NewAddressOnlyUser(orig.ModeratorAddress)),
	}
}

func (s *grpcServer) VerifyUser(ctx context.Context, r *proto.VerifyUserRequest) (*proto.VerifyUserResponse, error) {
	moderator := authinterceptor.UserFromContext(ctx)
	if moderator == nil {
		// this should never happen, as the auth interceptors should have taken care of this for us
		return nil, status.Error(codes.Unauthenticated, "missing user claims")
	}

	if r.Address == "" {
		return nil, status.Error(codes.InvalidArgument, "missing reward address")
	}

	id, err := s.moderationStore.VerifyUser(ctx, r.SkipClientIntegrityChecks, r.SkipIpAddressReputationChecks, r.ReduceHardChallengeFrequency,
		r.Address, r.Reason, moderator, moderator.ModeratorName())
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	perks := []string{}
	if r.SkipClientIntegrityChecks {
		perks = append(perks, "corrupted clients allowed")
	}
	if r.SkipIpAddressReputationChecks {
		perks = append(perks, "bad IP address reputation allowed")
	}
	if r.ReduceHardChallengeFrequency {
		perks = append(perks, "reduced hard challenge frequency")
	}
	perksStr := "Without perks"
	if len(perks) > 0 {
		perksStr = "With perks: " + strings.Join(perks, ", ")
	}

	s.log.Printf("User verification with ID %s added by %s (remote address %s) with reason %s", id, moderator.ModeratorName(), authinterceptor.RemoteAddressFromContext(ctx), r.Reason)

	if s.modLogWebhook != nil {
		_, err = s.modLogWebhook.SendContent(
			fmt.Sprintf("**Added user verification with ID `%s`**\n\nUser: %s\n%s\nReason: %s\nBy moderator: %s (%s)",
				id,
				r.Address,
				perksStr,
				r.Reason,
				moderator.Address()[:14],
				moderator.ModeratorName()))
		if err != nil {
			s.log.Println("Failed to send mod log webhook:", err)
		}
	}

	return &proto.VerifyUserResponse{
		VerificationId: id,
	}, nil
}

func (s *grpcServer) RemoveUserVerification(ctx context.Context, r *proto.RemoveUserVerificationRequest) (*proto.RemoveUserVerificationResponse, error) {
	moderator := authinterceptor.UserFromContext(ctx)
	if moderator == nil {
		// this should never happen, as the auth interceptors should have taken care of this for us
		return nil, status.Error(codes.Unauthenticated, "missing user claims")
	}

	if r.VerificationId == "" {
		return nil, status.Error(codes.InvalidArgument, "missing verification ID")
	}

	err := s.moderationStore.RemoveVerification(ctx, r.VerificationId, r.Reason, moderator)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	s.log.Printf("Verification ID %s removed by %s (remote address %s) with reason %s", r.VerificationId, moderator.ModeratorName(), authinterceptor.RemoteAddressFromContext(ctx), r.Reason)

	if s.modLogWebhook != nil {
		_, err = s.modLogWebhook.SendContent(
			fmt.Sprintf("**Removed user verification with ID `%s`**\n\nReason: %s\nBy moderator: %s (%s)",
				r.VerificationId,
				r.Reason,
				moderator.Address()[:14],
				moderator.ModeratorName()))
		if err != nil {
			s.log.Println("Failed to send mod log webhook:", err)
		}
	}

	return &proto.RemoveUserVerificationResponse{}, nil
}
