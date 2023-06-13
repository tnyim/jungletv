package server

import (
	"context"
	"time"

	"github.com/bytedance/sonic"
	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/proto"
	authinterceptor "github.com/tnyim/jungletv/server/interceptors/auth"
	"github.com/tnyim/jungletv/types"
	"github.com/tnyim/jungletv/utils/event"
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

	subscription, err := s.pointsManager.GetCurrentUserSubscription(ctx, userClaims)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	return &proto.PointsInfoResponse{
		Balance:             int32(balance.Balance),
		CurrentSubscription: convertSubscription(subscription),
	}, nil
}

func convertSubscription(orig *types.Subscription) *proto.SubscriptionDetails {
	if orig != nil {
		return &proto.SubscriptionDetails{
			SubscribedAt:    timestamppb.New(orig.StartsAt),
			SubscribedUntil: timestamppb.New(orig.EndsAt),
		}
	}
	return nil
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
	protoTx := &proto.PointsTransaction{
		Id:             tx.ID,
		RewardsAddress: tx.RewardsAddress,
		CreatedAt:      timestamppb.New(tx.CreatedAt),
		UpdatedAt:      timestamppb.New(tx.UpdatedAt),
		Value:          int32(tx.Value),
		Type:           proto.PointsTransactionType(tx.Type),
	}
	_ = sonic.Unmarshal(tx.Extra, &protoTx.Extra)
	return protoTx
}

func (s *grpcServer) ConvertBananoToPoints(r *proto.ConvertBananoToPointsRequest, stream proto.JungleTV_ConvertBananoToPointsServer) error {
	ctx := stream.Context()
	user := authinterceptor.UserClaimsFromContext(ctx)
	if user == nil {
		return stacktrace.NewError("user claims unexpectedly missing")
	}

	flow, err := s.pointsManager.CreateOrRecoverBananoConversionFlow(user)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	expired := time.Now().After(flow.Expiration())
	send := func() error {
		return stacktrace.Propagate(stream.Send(&proto.ConvertBananoToPointsStatus{
			PaymentAddress:  flow.PaymentAddress(),
			BananoConverted: flow.SessionBananoTotal().SerializeForAPI(),
			PointsConverted: int32(flow.SessionPointsTotal()),
			Expiration:      timestamppb.New(flow.Expiration()),
			Expired:         expired,
		}), "")
	}

	onConverted, onConvertedU := flow.Converted().Subscribe(event.BufferFirst)
	defer onConvertedU()

	onExpired, onExpiredU := flow.Expired().Subscribe(event.BufferFirst)
	defer onExpiredU()

	onDestroyed, onDestroyedU := flow.Destroyed().Subscribe(event.BufferFirst)
	defer onDestroyedU()

	err = send()
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	heartbeat := time.NewTicker(5 * time.Second)
	defer heartbeat.Stop()

	for {
		var err error
		select {
		case <-onExpired:
			expired = true
			err = send()
		case <-onConverted:
			err = send()
		case <-heartbeat.C:
			err = send()
		case <-onDestroyed:
			return nil
		case <-ctx.Done():
			return nil
		}
		if err != nil {
			return stacktrace.Propagate(err, "")
		}
	}
}

func (s *grpcServer) StartOrExtendSubscription(ctx context.Context, r *proto.StartOrExtendSubscriptionRequest) (*proto.StartOrExtendSubscriptionResponse, error) {
	user := authinterceptor.UserClaimsFromContext(ctx)
	if user == nil {
		return nil, stacktrace.NewError("user claims unexpectedly missing")
	}

	subscription, err := s.pointsManager.SubscribeOrExtendSubscription(ctx, user)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	return &proto.StartOrExtendSubscriptionResponse{
		Subscription: &proto.SubscriptionDetails{
			SubscribedAt:    timestamppb.New(subscription.StartsAt),
			SubscribedUntil: timestamppb.New(subscription.EndsAt),
		},
	}, nil
}
