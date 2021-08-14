package server

import (
	"context"
	"fmt"
	"time"

	"github.com/palantir/stacktrace"
	uuid "github.com/satori/go.uuid"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/server/auth"
	"github.com/tnyim/jungletv/types"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"google.golang.org/protobuf/types/known/timestamppb"
)

func (s *grpcServer) DisallowedVideos(ctxCtx context.Context, r *proto.DisallowedVideosRequest) (*proto.DisallowedVideosResponse, error) {
	ctx, err := BeginTransaction(ctxCtx)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	defer ctx.Commit() // read-only tx

	var disallowedMedia []*types.DisallowedMedia
	var total uint64

	if len(r.SearchQuery) > 0 {
		disallowedMedia, total, err = types.GetDisallowedMediaWithTypeAndFilter(ctx, types.MediaTypeYouTubeVideo, r.SearchQuery, readPaginationParameters(r))
	} else {
		disallowedMedia, total, err = types.GetDisallowedMediaWithType(ctx, types.MediaTypeYouTubeVideo, readPaginationParameters(r))
	}
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	return &proto.DisallowedVideosResponse{
		DisallowedVideos: convertDisallowedVideos(disallowedMedia),
		Offset:           readOffset(r),
		Total:            total,
	}, nil
}

func convertDisallowedVideos(orig []*types.DisallowedMedia) []*proto.DisallowedVideo {
	protoEntries := make([]*proto.DisallowedVideo, len(orig))
	for i, entry := range orig {
		protoEntries[i] = convertDisallowedVideo(entry)
	}
	return protoEntries
}

func convertDisallowedVideo(orig *types.DisallowedMedia) *proto.DisallowedVideo {
	return &proto.DisallowedVideo{
		Id:           orig.ID,
		DisallowedBy: orig.DisallowedBy,
		DisallowedAt: timestamppb.New(orig.DisallowedAt),
		YtVideoId:    *orig.YouTubeVideoID,
		YtVideoTitle: *orig.YouTubeVideoTitle,
	}
}

func (s *grpcServer) AddDisallowedVideo(ctxCtx context.Context, r *proto.AddDisallowedVideoRequest) (*proto.AddDisallowedVideoResponse, error) {
	ctx, err := BeginTransaction(ctxCtx)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	defer ctx.Rollback()

	moderator := auth.UserClaimsFromContext(ctx)
	if moderator == nil {
		// this should never happen, as the auth interceptors should have taken care of this for us
		return nil, status.Error(codes.Unauthenticated, "missing user claims")
	}

	response, err := s.youtube.Videos.List([]string{"snippet"}).Id(r.YtVideoId).MaxResults(1).Do()
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	if len(response.Items) == 0 {
		return nil, status.Error(codes.InvalidArgument, "video not found")
	}
	videoItem := response.Items[0]

	disallowedMedia := &types.DisallowedMedia{
		ID:                uuid.NewV4().String(),
		DisallowedBy:      moderator.RewardAddress,
		DisallowedAt:      time.Now(),
		MediaType:         types.MediaTypeYouTubeVideo,
		YouTubeVideoID:    &r.YtVideoId,
		YouTubeVideoTitle: &videoItem.Snippet.Title,
	}

	err = disallowedMedia.Update(ctx)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	err = ctx.Commit()
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	s.log.Printf("Video with ID %s disallowed by %s (remote address %s)", r.YtVideoId, moderator.Username, auth.RemoteAddressFromContext(ctx))

	if s.modLogWebhook != nil {
		_, err = s.modLogWebhook.SendContent(
			fmt.Sprintf("YouTube video with ID `%s` (\"%s\") disallowed by moderator: %s (%s)",
				r.YtVideoId,
				videoItem.Snippet.Title,
				moderator.Address()[:14],
				moderator.Username))
		if err != nil {
			s.log.Println("Failed to send mod log webhook:", err)
		}
	}

	return &proto.AddDisallowedVideoResponse{
		Id: disallowedMedia.ID,
	}, nil
}

func (s *grpcServer) RemoveDisallowedVideo(ctxCtx context.Context, r *proto.RemoveDisallowedVideoRequest) (*proto.RemoveDisallowedVideoResponse, error) {
	ctx, err := BeginTransaction(ctxCtx)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	defer ctx.Rollback()

	moderator := auth.UserClaimsFromContext(ctx)
	if moderator == nil {
		// this should never happen, as the auth interceptors should have taken care of this for us
		return nil, status.Error(codes.Unauthenticated, "missing user claims")
	}

	disallowedMedias, err := types.GetDisallowedMediaWithIDs(ctx, []string{r.Id})
	if len(disallowedMedias) == 0 {
		return nil, status.Error(codes.InvalidArgument, "entry not found")
	}
	disallowedMedia := disallowedMedias[r.Id]

	err = disallowedMedia.Delete(ctx)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	err = ctx.Commit()
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	s.log.Printf("Video with ID %s reallowed by %s (remote address %s)", *disallowedMedia.YouTubeVideoID, moderator.Username, auth.RemoteAddressFromContext(ctx))

	if s.modLogWebhook != nil {
		_, err = s.modLogWebhook.SendContent(
			fmt.Sprintf("YouTube video with ID `%s` (\"%s\") reallowed by moderator: %s (%s)",
				*disallowedMedia.YouTubeVideoID,
				*disallowedMedia.YouTubeVideoTitle,
				moderator.Address()[:14],
				moderator.Username))
		if err != nil {
			s.log.Println("Failed to send mod log webhook:", err)
		}
	}

	return &proto.RemoveDisallowedVideoResponse{}, nil
}
