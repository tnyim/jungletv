package server

import (
	"context"
	"math/big"
	"time"

	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/server/components/payment"
	"github.com/tnyim/jungletv/server/components/pricer"
	"github.com/tnyim/jungletv/server/components/stats"
	authinterceptor "github.com/tnyim/jungletv/server/interceptors/auth"
	"github.com/tnyim/jungletv/types"
	"github.com/tnyim/jungletv/utils/event"
	"github.com/tnyim/jungletv/utils/transaction"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (s *grpcServer) MonitorSkipAndTip(r *proto.MonitorSkipAndTipRequest, stream proto.JungleTV_MonitorSkipAndTipServer) error {
	ctx := stream.Context()
	user := authinterceptor.UserClaimsFromContext(ctx)

	onStatusUpdated, statusUpdatedU := s.skipManager.StatusUpdated().Subscribe(event.BufferFirst)
	defer statusUpdatedU()

	onVersionHashChanged, versionHashChangedU := s.versionHashChanged.Subscribe(event.BufferFirst)
	defer versionHashChangedU()

	unregister := s.statsRegistry.RegisterStreamSubscriber(stats.StatStreamConsumersCommunitySkipping, user != nil && !user.IsUnknown())
	defer unregister()

	latestSkipStatus := s.skipManager.SkipAccountStatus()
	latestRainStatus := s.skipManager.RainAccountStatus()

	buildStatus := func() *proto.SkipAndTipStatus {
		return &proto.SkipAndTipStatus{
			SkipStatus:             latestSkipStatus.SkipStatus,
			SkipAddress:            latestSkipStatus.Address,
			SkipBalance:            latestSkipStatus.Balance.SerializeForAPI(),
			SkipThreshold:          latestSkipStatus.Threshold.SerializeForAPI(),
			SkipThresholdLowerable: latestSkipStatus.ThresholdLowerable,
			RainAddress:            latestRainStatus.Address,
			RainBalance:            latestRainStatus.Balance.SerializeForAPI(),
		}
	}

	err := stream.Send(buildStatus())
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	heartbeat := time.NewTicker(5 * time.Second)
	defer heartbeat.Stop()

	for {
		select {
		case args := <-onStatusUpdated:
			latestSkipStatus = args.SkipAccountStatus
			latestRainStatus = args.RainAccountStatus
			err = stream.Send(buildStatus())
			if err != nil {
				return stacktrace.Propagate(err, "")
			}
		case <-heartbeat.C:
			err = stream.Send(buildStatus())
			if err != nil {
				return stacktrace.Propagate(err, "")
			}
		case <-onVersionHashChanged:
			return nil
		case <-ctx.Done():
			return nil
		}
	}
}

var skipThresholdIncrease = payment.NewAmount(big.NewInt(0).Mul(pricer.BananoUnit, big.NewInt(2)))
var skipThresholdReduction = payment.NewAmount(big.NewInt(0).Mul(pricer.BananoUnit, big.NewInt(-2)))

func (s *grpcServer) IncreaseOrReduceSkipThreshold(ctxCtx context.Context, r *proto.IncreaseOrReduceSkipThresholdRequest) (*proto.IncreaseOrReduceSkipThresholdResponse, error) {
	user := authinterceptor.UserClaimsFromContext(ctxCtx)
	if user == nil {
		// this should never happen, as the auth interceptors should have taken care of this for us
		return nil, status.Error(codes.Unauthenticated, "missing user claims")
	}

	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	defer ctx.Rollback()

	cost := 100
	subscribed, err := s.pointsManager.IsUserCurrentlySubscribed(ctx, user)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	if subscribed {
		cost = 91
	}

	// begin by deducting the points as this is what we can rollback if the threshold reduction fails, unlike the threshold reduction
	txType := types.PointsTxTypeSkipThresholdReduction
	desiredChange := skipThresholdReduction
	if r.Increase {
		txType = types.PointsTxTypeSkipThresholdIncrease
		desiredChange = skipThresholdIncrease
	}
	_, err = s.pointsManager.CreateTransaction(ctx, user, txType, -cost)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	actualChange := s.skipManager.ChangeSkipThreshold(desiredChange)
	if actualChange.Cmp(big.NewInt(0)) == 0 {
		// this rolls back the points deduction
		return nil, status.Error(codes.FailedPrecondition, "skip threshold can not be changed at this moment")
	}

	return &proto.IncreaseOrReduceSkipThresholdResponse{}, stacktrace.Propagate(ctx.Commit(), "")
}
