package server

import (
	"context"
	"time"

	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/server/auth"
	"github.com/tnyim/jungletv/types"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"google.golang.org/protobuf/types/known/durationpb"
	"google.golang.org/protobuf/types/known/timestamppb"
)

func (s *grpcServer) UserProfile(ctxCtx context.Context, r *proto.UserProfileRequest) (*proto.UserProfileResponse, error) {
	ctx, err := BeginTransaction(ctxCtx)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	defer ctx.Commit() // read-only tx

	user := s.userSerializer(ctx, NewAddressOnlyUser(r.Address))

	recentlyRequestedMedia, err := types.LastRequestsOfAddress(ctx, r.Address, 10, true)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	profile, err := types.GetUserProfileForAddress(ctx, r.Address)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	var featuredMedia *proto.UserProfileResponse_YoutubeVideoData
	if profile.FeaturedMedia != nil {
		id := *profile.FeaturedMedia
		playedMedia, err := types.GetPlayedMediaWithIDs(ctx, []string{id})
		if err != nil {
			return nil, stacktrace.Propagate(err, "")
		}
		if m, ok := playedMedia[id]; ok {
			switch m.MediaType {
			case types.MediaTypeYouTubeVideo:
				featuredMedia = &proto.UserProfileResponse_YoutubeVideoData{
					YoutubeVideoData: &proto.QueueYouTubeVideoData{
						Id:    *m.YouTubeVideoID,
						Title: *m.YouTubeVideoTitle,
					},
				}
			}
		}
	}

	return &proto.UserProfileResponse{
		User:                   user,
		RecentlyPlayedRequests: convertPlayedMedias(recentlyRequestedMedia),
		Biography:              profile.Biography,
		FeaturedMedia:          featuredMedia,
	}, nil
}

func convertPlayedMedias(orig []*types.PlayedMedia) []*proto.PlayedMedia {
	protoEntries := make([]*proto.PlayedMedia, len(orig))
	for i, entry := range orig {
		protoEntries[i] = convertPlayedMedia(entry)
	}
	return protoEntries
}

func convertPlayedMedia(orig *types.PlayedMedia) *proto.PlayedMedia {
	media := &proto.PlayedMedia{
		Id:          orig.ID,
		RequestCost: NewAmountFromDecimal(orig.RequestCost).SerializeForAPI(),
		StartedAt:   timestamppb.New(orig.StartedAt),
	}

	if orig.RequestedBy != "" {
		media.RequestedBy = &orig.RequestedBy
	}
	switch orig.MediaType {
	case types.MediaTypeYouTubeVideo:
		media.MediaInfo = &proto.PlayedMedia_YoutubeVideoData{
			YoutubeVideoData: &proto.QueueYouTubeVideoData{
				Id:    *orig.YouTubeVideoID,
				Title: *orig.YouTubeVideoTitle,
			},
		}
	}

	return media
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

func (s *grpcServer) SetProfileBiography(ctxCtx context.Context, r *proto.SetProfileBiographyRequest) (*proto.SetProfileBiographyResponse, error) {
	user := auth.UserClaimsFromContext(ctxCtx)
	if user == nil {
		// this should never happen, as the auth interceptors should have taken care of this for us
		return nil, status.Error(codes.Unauthenticated, "missing user claims")
	}

	if len(r.Biography) > 512 {
		return nil, status.Error(codes.InvalidArgument, "biography too long")
	}

	ctx, err := BeginTransaction(ctxCtx)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	defer ctx.Rollback()

	profile, err := types.GetUserProfileForAddress(ctx, user.Address())
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	profile.Biography = r.Biography

	err = profile.Update(ctx)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	err = ctx.Commit()
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	return &proto.SetProfileBiographyResponse{}, nil
}

func (s *grpcServer) SetProfileFeaturedMedia(ctxCtx context.Context, r *proto.SetProfileFeaturedMediaRequest) (*proto.SetProfileFeaturedMediaResponse, error) {
	user := auth.UserClaimsFromContext(ctxCtx)
	if user == nil {
		// this should never happen, as the auth interceptors should have taken care of this for us
		return nil, status.Error(codes.Unauthenticated, "missing user claims")
	}

	ctx, err := BeginTransaction(ctxCtx)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	defer ctx.Rollback()

	profile, err := types.GetUserProfileForAddress(ctx, user.Address())
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	if r.MediaId != nil {
		// confirm that the media ID exists
		playedMedias, err := types.GetPlayedMediaWithIDs(ctx, []string{*r.MediaId})
		if err != nil {
			return nil, stacktrace.Propagate(err, "")
		}
		playedMedia, ok := playedMedias[*r.MediaId]
		if !ok {
			return nil, status.Error(codes.NotFound, "media not found")
		}

		allowed, err := types.IsMediaAllowed(ctx, playedMedia.MediaType, playedMedia.ID)
		if err != nil {
			return nil, stacktrace.Propagate(err, "")
		}
		if !allowed {
			return nil, status.Error(codes.InvalidArgument, "media not allowed")
		}
	}
	profile.FeaturedMedia = r.MediaId

	err = profile.Update(ctx)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	err = ctx.Commit()
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	return &proto.SetProfileFeaturedMediaResponse{}, nil
}
