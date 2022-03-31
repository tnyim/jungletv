package server

import (
	"context"

	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/proto"
	authinterceptor "github.com/tnyim/jungletv/server/interceptors/auth"
	"github.com/tnyim/jungletv/types"
	"github.com/tnyim/jungletv/utils/transaction"
	"google.golang.org/protobuf/types/known/timestamppb"
)

func (s *grpcServer) PointsInfo(ctxCtx context.Context, r *proto.PointsInfoRequest) (*proto.PointsInfoResponse, error) {
	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	defer ctx.Commit() // read-only tx

	userClaims := authinterceptor.UserClaimsFromContext(ctx)
	if userClaims == nil {
		return nil, stacktrace.NewError("user claims unexpectedly missing")
	}

	balance, err := types.GetPointsBalanceForAddress(ctx, userClaims.Address())
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	return &proto.PointsInfoResponse{
		Balance: int32(balance.Balance),
	}, nil
}

func (s *grpcServer) PointsTransactions(ctxCtx context.Context, r *proto.PointsTransactionsRequest) (*proto.PointsTransactionsResponse, error) {
	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	defer ctx.Commit() // read-only tx

	userClaims := authinterceptor.UserClaimsFromContext(ctx)
	if userClaims == nil {
		return nil, stacktrace.NewError("user claims unexpectedly missing")
	}

	transactions, total, err := types.GetPointsTxForAddress(ctx, userClaims.Address(), readPaginationParameters(r))
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	return &proto.PointsTransactionsResponse{
		Transactions: convertPointsTransactions(transactions),
		Offset:       readOffset(r),
		Total:        total,
	}, nil
}

func convertPointsTransactions(orig []*types.PointsTx) []*proto.PointsTransaction {
	protoEntries := make([]*proto.PointsTransaction, len(orig))
	for i, entry := range orig {
		protoEntries[i] = convertPointsTransaction(entry)
	}
	return protoEntries
}

func convertPointsTransaction(tx *types.PointsTx) *proto.PointsTransaction {
	return &proto.PointsTransaction{
		Id:             tx.ID,
		RewardsAddress: tx.RewardsAddress,
		CreatedAt:      timestamppb.New(tx.CreatedAt),
		UpdatedAt:      timestamppb.New(tx.UpdatedAt),
		Value:          int32(tx.Value),
		Type:           proto.PointsTransactionType(tx.Type),
	}
}
