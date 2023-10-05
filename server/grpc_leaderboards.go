package server

import (
	"context"
	"time"

	"github.com/palantir/stacktrace"
	"github.com/samber/lo"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/server/components/payment"
	authinterceptor "github.com/tnyim/jungletv/server/interceptors/auth"
	"github.com/tnyim/jungletv/types"
	"github.com/tnyim/jungletv/utils/transaction"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (s *grpcServer) Leaderboards(ctxCtx context.Context, r *proto.LeaderboardsRequest) (*proto.LeaderboardsResponse, error) {
	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	defer ctx.Commit() // read-only tx

	user := authinterceptor.UserClaimsFromContext(ctx)

	mustInclude := []string{}
	userAddress := ""
	if user != nil && !user.IsUnknown() {
		mustInclude = append(mustInclude, user.Address())
		userAddress = user.Address()
	}

	periodEnd := time.Now()
	var periodStart time.Time
	switch r.Period {
	case proto.LeaderboardPeriod_LAST_24_HOURS:
		periodStart = periodEnd.Add(-24 * time.Hour)
	case proto.LeaderboardPeriod_LAST_7_DAYS:
		periodStart = periodEnd.Add(-7 * 24 * time.Hour)
	case proto.LeaderboardPeriod_LAST_30_DAYS:
		periodStart = periodEnd.Add(-30 * 24 * time.Hour)
	default:
		return nil, status.Error(codes.InvalidArgument, "invalid leaderboard period")
	}

	globalSpendingLeaderboard, err := types.GlobalSpendingLeaderboardBetween(ctx, periodStart, periodEnd, 15, 1, mustInclude...)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	enqueueLeaderboard, err := types.EnqueueLeaderboardBetween(ctx, periodStart, periodEnd, 15, 1, mustInclude...)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	communitySkippingLeaderboard, err := types.CrowdfundedTransactionLeaderboardBetween(ctx, periodStart, periodEnd, types.CrowdfundedTransactionTypeSkip, 15, 1, mustInclude...)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	communityTippingLeaderboard, err := types.CrowdfundedTransactionLeaderboardBetween(ctx, periodStart, periodEnd, types.CrowdfundedTransactionTypeRain, 15, 1, mustInclude...)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	buildSpendingRows := func(entries []types.SpendingLeaderboardEntry) []*proto.LeaderboardRow {
		protoRows := make([]*proto.LeaderboardRow, len(entries))
		for i, row := range entries {
			protoRows[i] = &proto.LeaderboardRow{
				RowNum:   uint32(row.RowNum),
				Position: uint32(row.Position),
				Values: []*proto.LeaderboardValue{
					{
						Value: &proto.LeaderboardValue_Amount{
							Amount: payment.NewAmountFromDecimal(row.TotalSpent).SerializeForAPI(),
						},
					},
				},
			}

			// we don't use userSerializer here so it's not as heavy
			// (we don't need all the roles, nor online status here)
			bannedFromChat, err := s.moderationStore.LoadUserBannedFromChat(ctx, row.Address, "")
			if err != nil {
				continue
			}
			user := &proto.User{
				Address: row.Address,
			}
			if row.Nickname != "" && (!bannedFromChat || row.Address == userAddress) {
				user.Nickname = lo.ToPtr(row.Nickname)
			} else if row.ApplicationID != "" {
				user.Nickname = lo.ToPtr(row.ApplicationID)
				user.Roles = append(user.Roles, proto.UserRole_APPLICATION)
			}
			protoRows[i].User = user
		}
		return protoRows
	}

	leaderboardSpenders := &proto.Leaderboard{
		Title:       "Top spenders (enqueuing, community skipping and tipping)",
		ValueTitles: []string{"Spent"},
		Rows:        buildSpendingRows(globalSpendingLeaderboard),
	}

	leaderboardEnqueuers := &proto.Leaderboard{
		Title:       "Top enqueuers",
		ValueTitles: []string{"Spent"},
		Rows:        buildSpendingRows(enqueueLeaderboard),
	}

	leaderboardSkippers := &proto.Leaderboard{
		Title:       "Top community skippers",
		ValueTitles: []string{"Spent"},
		Rows:        buildSpendingRows(communitySkippingLeaderboard),
	}

	leaderboardTippers := &proto.Leaderboard{
		Title:       "Top community tippers",
		ValueTitles: []string{"Tipped"},
		Rows:        buildSpendingRows(communityTippingLeaderboard),
	}

	return &proto.LeaderboardsResponse{
		Leaderboards: []*proto.Leaderboard{
			leaderboardSpenders,
			leaderboardEnqueuers,
			leaderboardSkippers,
			leaderboardTippers,
		},
	}, nil
}
