package server

import (
	"context"

	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/types"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (s *grpcServer) RewardInfo(ctxCtx context.Context, r *proto.RewardInfoRequest) (*proto.RewardInfoResponse, error) {
	ctx, err := BeginTransaction(ctxCtx)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	defer ctx.Commit() // read-only tx

	userClaims := UserClaimsFromContext(ctx)
	if userClaims == nil {
		return nil, stacktrace.NewError("user claims unexpectedly missing")
	}

	balance, err := types.GetRewardBalanceOfAddress(ctx, userClaims.RewardAddress)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	pendingWithdrawal, position, total, err := types.AddressHasPendingWithdrawal(ctx, userClaims.RewardAddress)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	response := &proto.RewardInfoResponse{
		RewardAddress:     userClaims.RewardAddress,
		RewardBalance:     NewAmountFromDecimal(balance.Balance).SerializeForAPI(),
		WithdrawalPending: pendingWithdrawal,
	}
	if pendingWithdrawal {
		p := int32(position)
		t := int32(total)
		response.WithdrawalPositionInQueue = &p
		response.WithdrawalsInQueue = &t
	}
	return response, nil
}

func (s *grpcServer) Withdraw(ctxCtx context.Context, r *proto.WithdrawRequest) (*proto.WithdrawResponse, error) {
	ctx, err := BeginTransaction(ctxCtx)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	defer ctx.Rollback()

	userClaims := UserClaimsFromContext(ctx)
	if userClaims == nil {
		return nil, stacktrace.NewError("user claims unexpectedly missing")
	}

	balance, err := types.GetRewardBalanceOfAddress(ctx, userClaims.RewardAddress)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	if balance.Balance.IsZero() || balance.Balance.IsNegative() {
		return nil, status.Error(codes.FailedPrecondition, "insufficient balance")
	}

	pendingWithdraw, _, _, err := types.AddressHasPendingWithdrawal(ctx, userClaims.RewardAddress)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	if pendingWithdraw {
		return nil, status.Error(codes.FailedPrecondition, "existing pending withdraw")
	}

	err = s.withdrawalHandler.WithdrawBalances(ctx, []*types.RewardBalance{balance})
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	err = ctx.Commit()
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	return &proto.WithdrawResponse{}, nil
}
