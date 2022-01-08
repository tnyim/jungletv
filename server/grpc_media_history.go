package server

import (
	"context"
	"time"

	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/proto"
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
	playedMedia, total, err := types.GetPlayedMedia(ctx, true, true, since, r.SearchQuery, readPaginationParameters(r))
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	return &proto.PlayedMediaHistoryResponse{
		PlayedMedia: convertPlayedMedias(ctx, s.userSerializer, playedMedia),
		Offset:      readOffset(r),
		Total:       total,
	}, nil
}

func convertPlayedMedias(ctx context.Context, userSerializer APIUserSerializer, orig []*types.PlayedMedia) []*proto.PlayedMedia {
	protoEntries := make([]*proto.PlayedMedia, len(orig))
	for i, entry := range orig {
		protoEntries[i] = convertPlayedMedia(ctx, userSerializer, entry)
	}
	return protoEntries
}

func convertPlayedMedia(ctx context.Context, userSerializer APIUserSerializer, orig *types.PlayedMedia) *proto.PlayedMedia {
	media := &proto.PlayedMedia{
		Id:          orig.ID,
		EnqueuedAt:  timestamppb.New(orig.EnqueuedAt),
		RequestCost: NewAmountFromDecimal(orig.RequestCost).SerializeForAPI(),
		StartedAt:   timestamppb.New(orig.StartedAt),
		Length:      durationpb.New(time.Duration(orig.MediaLength)),
		Offset:      durationpb.New(time.Duration(orig.MediaOffset)),
		Unskippable: orig.Unskippable,
	}

	if orig.EndedAt.Valid {
		media.EndedAt = timestamppb.New(orig.EndedAt.Time)
	}
	if orig.RequestedBy != "" {
		media.RequestedBy = userSerializer(ctx, NewAddressOnlyUser(orig.RequestedBy))
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
