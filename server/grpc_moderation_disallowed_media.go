package server

import (
	"context"
	"fmt"
	"time"

	"github.com/palantir/stacktrace"
	uuid "github.com/satori/go.uuid"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/server/auth"
	authinterceptor "github.com/tnyim/jungletv/server/interceptors/auth"
	"github.com/tnyim/jungletv/server/media"
	"github.com/tnyim/jungletv/types"
	"github.com/tnyim/jungletv/utils/transaction"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"google.golang.org/protobuf/types/known/timestamppb"
)

func (s *grpcServer) DisallowedMedia(ctxCtx context.Context, r *proto.DisallowedMediaRequest) (*proto.DisallowedMediaResponse, error) {
	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	defer ctx.Commit() // read-only tx

	var disallowedMedia []*types.DisallowedMedia
	var total uint64

	if len(r.SearchQuery) > 0 {
		disallowedMedia, total, err = types.GetDisallowedMediaWithFilter(ctx, r.SearchQuery, readPaginationParameters(r))
	} else {
		disallowedMedia, total, err = types.GetDisallowedMedia(ctx, readPaginationParameters(r))
	}
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	return &proto.DisallowedMediaResponse{
		DisallowedMedia: convertDisallowedMedia(ctx, disallowedMedia, s.userSerializer),
		Offset:          readOffset(r),
		Total:           total,
	}, nil
}

func convertDisallowedMedia(ctx context.Context, orig []*types.DisallowedMedia, userSerializer auth.APIUserSerializer) []*proto.DisallowedMedia {
	protoEntries := make([]*proto.DisallowedMedia, len(orig))
	for i, entry := range orig {
		protoEntries[i] = convertDisallowedMediaEntry(ctx, entry, userSerializer)
	}
	return protoEntries
}

func convertDisallowedMediaEntry(ctx context.Context, orig *types.DisallowedMedia, userSerializer auth.APIUserSerializer) *proto.DisallowedMedia {
	m := &proto.DisallowedMedia{
		Id:           orig.ID,
		DisallowedBy: userSerializer(ctx, auth.NewAddressOnlyUser(orig.DisallowedBy)),
		DisallowedAt: timestamppb.New(orig.DisallowedAt),
		MediaId:      orig.MediaID,
		MediaTitle:   orig.MediaTitle,
	}
	switch orig.MediaType {
	case types.MediaTypeYouTubeVideo:
		m.MediaType = proto.DisallowedMediaType_DISALLOWED_MEDIA_TYPE_YOUTUBE_VIDEO
	case types.MediaTypeSoundCloudTrack:
		m.MediaType = proto.DisallowedMediaType_DISALLOWED_MEDIA_TYPE_SOUNDCLOUD_TRACK
	}
	return m
}

func (s *grpcServer) AddDisallowedMedia(ctxCtx context.Context, r *proto.AddDisallowedMediaRequest) (*proto.AddDisallowedMediaResponse, error) {
	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	defer ctx.Rollback()

	moderator := authinterceptor.UserFromContext(ctx)
	if moderator == nil {
		// this should never happen, as the auth interceptors should have taken care of this for us
		return nil, status.Error(codes.Unauthenticated, "missing user claims")
	}

	var provider media.Provider

	for _, p := range s.mediaProviders {
		if p.CanHandleRequestType(r.GetDisallowedMediaRequest().GetMediaInfo()) {
			provider = p
		}
	}

	if provider == media.Provider(nil) {
		return nil, stacktrace.NewError("no provider found")
	}

	preInfo, result, err := provider.BeginEnqueueRequest(ctx, r.GetDisallowedMediaRequest().GetMediaInfo())
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	if result != media.EnqueueRequestCreationSucceeded {
		return nil, stacktrace.NewError("media not found or already not enqueuable")
	}

	mediaType, mediaID := preInfo.MediaID()

	disallowedMedia := &types.DisallowedMedia{
		ID:           uuid.NewV4().String(),
		DisallowedBy: moderator.Address(),
		DisallowedAt: time.Now(),
		MediaType:    mediaType,
		MediaID:      mediaID,
		MediaTitle:   preInfo.Title(),
	}

	err = disallowedMedia.Update(ctx)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	err = ctx.Commit()
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	s.log.Printf("Media of type %s with ID %s disallowed by %s (remote address %s)", mediaType, mediaID, moderator.ModeratorName(), authinterceptor.RemoteAddressFromContext(ctx))

	mediaTypeString := "[Unknown media type]"
	switch mediaType {
	case types.MediaTypeYouTubeVideo:
		mediaTypeString = "YouTube video"
	case types.MediaTypeSoundCloudTrack:
		mediaTypeString = "SoundCloud track"
	}

	if s.modLogWebhook != nil {
		_, err = s.modLogWebhook.SendContent(
			fmt.Sprintf("%s with ID `%s` (\"%s\") disallowed by moderator: %s (%s)",
				mediaTypeString,
				mediaID,
				disallowedMedia.MediaTitle,
				moderator.Address()[:14],
				moderator.ModeratorName()))
		if err != nil {
			s.log.Println("Failed to send mod log webhook:", err)
		}
	}

	return &proto.AddDisallowedMediaResponse{
		Id: disallowedMedia.ID,
	}, nil
}

func (s *grpcServer) RemoveDisallowedMedia(ctxCtx context.Context, r *proto.RemoveDisallowedMediaRequest) (*proto.RemoveDisallowedMediaResponse, error) {
	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	defer ctx.Rollback()

	moderator := authinterceptor.UserFromContext(ctx)
	if moderator == nil {
		// this should never happen, as the auth interceptors should have taken care of this for us
		return nil, status.Error(codes.Unauthenticated, "missing user claims")
	}

	disallowedMedias, err := types.GetDisallowedMediaWithIDs(ctx, []string{r.Id})
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
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

	s.log.Printf("Media of type %s with ID %s reallowed by %s (remote address %s)", disallowedMedia.MediaType, disallowedMedia.MediaID, moderator.ModeratorName(), authinterceptor.RemoteAddressFromContext(ctx))

	mediaTypeString := "[Unknown media type]"
	switch disallowedMedia.MediaType {
	case types.MediaTypeYouTubeVideo:
		mediaTypeString = "YouTube video"
	case types.MediaTypeSoundCloudTrack:
		mediaTypeString = "SoundCloud track"
	}

	if s.modLogWebhook != nil {
		_, err = s.modLogWebhook.SendContent(
			fmt.Sprintf("%s with ID `%s` (\"%s\") reallowed by moderator: %s (%s)",
				mediaTypeString,
				disallowedMedia.MediaID,
				disallowedMedia.MediaTitle,
				moderator.Address()[:14],
				moderator.ModeratorName()))
		if err != nil {
			s.log.Println("Failed to send mod log webhook:", err)
		}
	}

	return &proto.RemoveDisallowedMediaResponse{}, nil
}
