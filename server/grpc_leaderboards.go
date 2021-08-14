package server

import (
	"context"
	"time"

	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/server/auth"
	"github.com/tnyim/jungletv/types"
)

func (s *grpcServer) Leaderboards(ctxCtx context.Context, r *proto.LeaderboardsRequest) (*proto.LeaderboardsResponse, error) {
	ctx, err := BeginTransaction(ctxCtx)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	defer ctx.Commit() // read-only tx

	user := auth.UserClaimsFromContext(ctx)

	mustInclude := []string{}
	if user != nil && !user.IsUnknown() {
		mustInclude = append(mustInclude, user.RewardAddress)
	}

	now := time.Now()
	oneDayAgo := now.Add(-24 * time.Hour)
	sevenDaysAgo := now.Add(-7 * 24 * time.Hour)

	enqueueLeaderboardDay, err := types.EnqueueLeaderboardBetween(ctx, oneDayAgo, now, 15, 1, mustInclude...)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	enqueueLeaderboardWeek, err := types.EnqueueLeaderboardBetween(ctx, sevenDaysAgo, now, 15, 1, mustInclude...)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	buildEnqueueRows := func(entries []types.EnqueueLeaderboardEntry) []*proto.LeaderboardRow {
		protoRows := make([]*proto.LeaderboardRow, len(entries))
		for i, row := range entries {
			protoRows[i] = &proto.LeaderboardRow{
				RowNum:   uint32(row.RowNum),
				Position: uint32(row.Position),
				Address:  row.Address,
				Values: []*proto.LeaderboardValue{
					{
						Value: &proto.LeaderboardValue_Amount{
							Amount: NewAmountFromDecimal(row.TotalSpent).SerializeForAPI(),
						},
					},
				},
			}
			if row.Nickname != "" {
				n := row.Nickname
				protoRows[i].Nickname = &n
			}
		}
		return protoRows
	}

	leaderboardDay := &proto.Leaderboard{
		Title:       "Top spenders (last 24 hours)",
		ValueTitles: []string{"Spent"},
		Rows:        buildEnqueueRows(enqueueLeaderboardDay),
	}

	leaderboardWeek := &proto.Leaderboard{
		Title:       "Top spenders (last 7 days)",
		ValueTitles: []string{"Spent"},
		Rows:        buildEnqueueRows(enqueueLeaderboardWeek),
	}

	return &proto.LeaderboardsResponse{
		Leaderboards: []*proto.Leaderboard{leaderboardDay, leaderboardWeek},
	}, nil
}
