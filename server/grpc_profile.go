package server

import (
	"context"
	"time"

	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/types"
	"google.golang.org/protobuf/types/known/durationpb"
)

func (s *grpcServer) UserProfile(ctx context.Context, r *proto.UserProfileRequest) (*proto.UserProfileResponse, error) {
	user := s.userSerializer(ctx, NewAddressOnlyUser(r.Address))

	return &proto.UserProfileResponse{
		User: user,
	}, nil
}

var statsDataAvailableSince = time.Date(2021, time.July, 19, 0, 0, 0, 0, time.UTC)

func (s *grpcServer) UserStats(ctxCtx context.Context, r *proto.UserStatsRequest) (*proto.UserStatsResponse, error) {
	ctx, err := BeginTransaction(ctxCtx)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	defer ctx.Commit() // read-only tx

	fetchStatsSince := func(since time.Time) (*proto.UserStatsForPeriod, error) {
		totalSpent, err := types.SumRequestCostsOfAddressSince(ctx, r.Address, since)
		if err != nil {
			return nil, stacktrace.Propagate(err, "")
		}

		crowdfunded, err := types.SumCrowdfundedTransactionsFromAddressSince(ctx, r.Address, since)
		if err != nil {
			return nil, stacktrace.Propagate(err, "")
		}
		totalSpent = totalSpent.Add(crowdfunded)

		totalWithdrawn, err := types.SumWithdrawalsToAddressSince(ctx, r.Address, since)
		if err != nil {
			return nil, stacktrace.Propagate(err, "")
		}

		mediaCount, playTime, err := types.CountRequestsOfAddressSince(ctx, r.Address, since)
		if err != nil {
			return nil, stacktrace.Propagate(err, "")
		}

		return &proto.UserStatsForPeriod{
			TotalSpent:             NewAmountFromDecimal(totalSpent).SerializeForAPI(),
			TotalWithdrawn:         NewAmountFromDecimal(totalWithdrawn).SerializeForAPI(),
			RequestedMediaCount:    int32(mediaCount),
			RequestedMediaPlayTime: durationpb.New(time.Duration(playTime)),
		}, nil
	}

	allTimeStats, err := fetchStatsSince(statsDataAvailableSince)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	now := time.Now()

	thirtyDayStats, err := fetchStatsSince(now.Add(-30 * 24 * time.Hour))
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	sevenDayStats, err := fetchStatsSince(now.Add(-7 * 24 * time.Hour))
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	return &proto.UserStatsResponse{
		StatsAllTime: allTimeStats,
		Stats_30Days: thirtyDayStats,
		Stats_7Days:  sevenDayStats,
	}, nil
}
