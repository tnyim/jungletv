package server

import (
	"context"
	"time"

	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/server/auth"
	"github.com/tnyim/jungletv/server/components/payment"
	authinterceptor "github.com/tnyim/jungletv/server/interceptors/auth"
	"github.com/tnyim/jungletv/types"
	"github.com/tnyim/jungletv/utils/transaction"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"google.golang.org/protobuf/types/known/durationpb"
)

func (s *grpcServer) UserProfile(ctxCtx context.Context, r *proto.UserProfileRequest) (*proto.UserProfileResponse, error) {
	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	defer ctx.Commit() // read-only tx

	user := auth.NewAddressOnlyUser(r.Address)

	recentlyRequestedMedia, err := types.LastRequestsOfAddress(ctx, r.Address, 10, true)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	profile, err := types.GetUserProfileForAddress(ctx, r.Address)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	subscription, err := s.pointsManager.GetCurrentUserSubscription(ctx, user)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	protoPlayedMedias, err := s.convertPlayedMedias(ctx, s.userSerializer, recentlyRequestedMedia)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	response := &proto.UserProfileResponse{
		User:                   s.userSerializer(ctx, user),
		RecentlyPlayedRequests: protoPlayedMedias,
		Biography:              profile.Biography,
		CurrentSubscription:    convertSubscription(subscription),
	}

	if profile.FeaturedMedia != nil {
		id := *profile.FeaturedMedia
		playedMedia, err := types.GetPlayedMediaWithIDs(ctx, []string{id})
		if err != nil {
			return nil, stacktrace.Propagate(err, "")
		}
		if m, ok := playedMedia[id]; ok {
			response.FeaturedMedia, err = s.mediaProviders[m.MediaType].SerializeUserProfileResponseFeaturedMedia(m)
			if err != nil {
				return nil, stacktrace.Propagate(err, "")
			}
		}
	}

	return response, nil
}

var statsDataAvailableSince = time.Date(2021, time.July, 19, 0, 0, 0, 0, time.UTC)

func (s *grpcServer) UserStats(ctxCtx context.Context, r *proto.UserStatsRequest) (*proto.UserStatsResponse, error) {
	ctx, err := transaction.Begin(ctxCtx)
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
			TotalSpent:             payment.NewAmountFromDecimal(totalSpent).SerializeForAPI(),
			TotalWithdrawn:         payment.NewAmountFromDecimal(totalWithdrawn).SerializeForAPI(),
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
	user := authinterceptor.UserClaimsFromContext(ctxCtx)
	if user == nil {
		// this should never happen, as the auth interceptors should have taken care of this for us
		return nil, status.Error(codes.Unauthenticated, "missing user claims")
	}

	if len(r.Biography) > 512 { // if changing the limit, change also on JAF profile module. TODO extract into common constant
		return nil, status.Error(codes.InvalidArgument, "biography too long")
	}

	ctx, err := transaction.Begin(ctxCtx)
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

		allowed, err := types.IsMediaAllowed(ctx, playedMedia.MediaType, playedMedia.MediaID)
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
