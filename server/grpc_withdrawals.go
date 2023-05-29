package server

import (
	"context"

	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/buildconfig"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/server/components/payment"
	authinterceptor "github.com/tnyim/jungletv/server/interceptors/auth"
	"github.com/tnyim/jungletv/types"
	"github.com/tnyim/jungletv/utils/transaction"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"google.golang.org/protobuf/types/known/timestamppb"
)

func (s *grpcServer) Withdraw(ctxCtx context.Context, r *proto.WithdrawRequest) (*proto.WithdrawResponse, error) {
	if !buildconfig.AllowWithdrawalsAndRefunds {
		return nil, status.Error(codes.FailedPrecondition, "this environment does not allow withdrawals")
	}

	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	defer ctx.Rollback()

	userClaims := authinterceptor.UserClaimsFromContext(ctx)
	if userClaims == nil {
		return nil, stacktrace.NewError("user claims unexpectedly missing")
	}

	balance, err := types.GetRewardBalanceOfAddress(ctx, userClaims.Address())
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	if balance.Balance.IsZero() || balance.Balance.IsNegative() {
		return nil, status.Error(codes.FailedPrecondition, "insufficient balance")
	}

	pendingWithdraw, _, _, err := types.AddressHasPendingWithdrawal(ctx, userClaims.Address())
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

func (s *grpcServer) WithdrawalHistory(ctxCtx context.Context, r *proto.WithdrawalHistoryRequest) (*proto.WithdrawalHistoryResponse, error) {
	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	defer ctx.Commit() // read-only tx

	userClaims := authinterceptor.UserClaimsFromContext(ctx)
	if userClaims == nil {
		return nil, stacktrace.NewError("user claims unexpectedly missing")
	}

	var withdrawals []*types.Withdrawal
	var total uint64

	withdrawals, total, err = types.GetWithdrawalsForAddress(ctx, userClaims.Address(), readPaginationParameters(r))
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	return &proto.WithdrawalHistoryResponse{
		Withdrawals: convertWithdrawals(withdrawals),
		Offset:      readOffset(r),
		Total:       total,
	}, nil
}

func convertWithdrawals(orig []*types.Withdrawal) []*proto.Withdrawal {
	protoEntries := make([]*proto.Withdrawal, len(orig))
	for i, entry := range orig {
		protoEntries[i] = convertWithdrawal(entry)
	}
	return protoEntries
}

func convertWithdrawal(orig *types.Withdrawal) *proto.Withdrawal {
	return &proto.Withdrawal{
		TxHash:         orig.TxHash,
		RewardsAddress: orig.RewardsAddress,
		Amount:         payment.NewAmountFromDecimal(orig.Amount).SerializeForAPI(),
		StartedAt:      timestamppb.New(orig.StartedAt),
		CompletedAt:    timestamppb.New(orig.CompletedAt),
	}
}
