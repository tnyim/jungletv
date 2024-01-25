package server

import (
	"context"
	"time"

	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/server/auth"
	"github.com/tnyim/jungletv/server/components/payment"
	"github.com/tnyim/jungletv/types"
	"github.com/tnyim/jungletv/utils/transaction"
	"google.golang.org/protobuf/types/known/durationpb"
	"google.golang.org/protobuf/types/known/timestamppb"
)

func (s *grpcServer) PlayedMediaHistory(ctxCtx context.Context, r *proto.PlayedMediaHistoryRequest) (*proto.PlayedMediaHistoryResponse, error) {
	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	defer ctx.Commit() // read-only tx

	if len(r.SearchQuery) < 3 {
		r.SearchQuery = ""
	}
	since := time.Now().AddDate(0, -2, 0)
	playedMedia, total, err := types.GetPlayedMedia(ctx, types.GetPlayedMediaFilters{
		ExcludeDisallowed:       true,
		ExcludeCurrentlyPlaying: true,
		StartedSince:            since,
		TextFilter:              r.SearchQuery,
	}, readPaginationParameters(r))
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	protoPlayedMedias, err := s.convertPlayedMedias(ctx, s.userSerializer, playedMedia)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	return &proto.PlayedMediaHistoryResponse{
		PlayedMedia: protoPlayedMedias,
		Offset:      readOffset(r),
		Total:       total,
	}, nil
}

func (s *grpcServer) convertPlayedMedias(ctx context.Context, userSerializer auth.APIUserSerializer, orig []*types.PlayedMedia) ([]*proto.PlayedMedia, error) {
	protoEntries := make([]*proto.PlayedMedia, len(orig))
	for i, entry := range orig {
		var err error
		protoEntries[i], err = s.convertPlayedMedia(ctx, userSerializer, entry)
		if err != nil {
			return nil, stacktrace.Propagate(err, "")
		}
	}
	return protoEntries, nil
}

func (s *grpcServer) convertPlayedMedia(ctx context.Context, userSerializer auth.APIUserSerializer, orig *types.PlayedMedia) (*proto.PlayedMedia, error) {
	media := &proto.PlayedMedia{
		Id:          orig.ID,
		EnqueuedAt:  timestamppb.New(orig.EnqueuedAt),
		RequestCost: payment.NewAmountFromDecimal(orig.RequestCost).SerializeForAPI(),
		StartedAt:   timestamppb.New(orig.StartedAt),
		Length:      durationpb.New(time.Duration(orig.MediaLength)),
		Offset:      durationpb.New(time.Duration(orig.MediaOffset)),
		Unskippable: orig.Unskippable,
	}

	if orig.EndedAt.Valid {
		media.EndedAt = timestamppb.New(orig.EndedAt.Time)
	}
	if orig.RequestedBy != "" {
		media.RequestedBy = userSerializer(ctx, auth.NewAddressOnlyUser(orig.RequestedBy))
	}
	var err error
	media.MediaInfo, err = s.mediaProviders[orig.MediaType].SerializePlayedMediaMediaInfo(orig)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	return media, nil
}
