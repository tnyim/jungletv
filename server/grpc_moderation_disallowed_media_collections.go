package server

import (
	"context"
	"fmt"
	"time"

	"github.com/palantir/stacktrace"
	uuid "github.com/satori/go.uuid"
	"github.com/tnyim/jungletv/proto"
	authinterceptor "github.com/tnyim/jungletv/server/interceptors/auth"
	"github.com/tnyim/jungletv/server/media"
	"github.com/tnyim/jungletv/types"
	"github.com/tnyim/jungletv/utils/transaction"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"google.golang.org/protobuf/types/known/timestamppb"
)

func (s *grpcServer) DisallowedMediaCollections(ctxCtx context.Context, r *proto.DisallowedMediaCollectionsRequest) (*proto.DisallowedMediaCollectionsResponse, error) {
	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	defer ctx.Commit() // read-only tx

	var disallowedMediaCollections []*types.DisallowedMediaCollection
	var total uint64

	if len(r.SearchQuery) > 0 {
		disallowedMediaCollections, total, err = types.GetDisallowedMediaCollectionsWithFilter(ctx, r.SearchQuery, readPaginationParameters(r))
	} else {
		disallowedMediaCollections, total, err = types.GetDisallowedMediaCollections(ctx, readPaginationParameters(r))
	}
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	return &proto.DisallowedMediaCollectionsResponse{
		DisallowedMediaCollections: convertDisallowedMediaCollections(disallowedMediaCollections),
		Offset:                     readOffset(r),
		Total:                      total,
	}, nil
}

func convertDisallowedMediaCollections(orig []*types.DisallowedMediaCollection) []*proto.DisallowedMediaCollection {
	protoEntries := make([]*proto.DisallowedMediaCollection, len(orig))
	for i, entry := range orig {
		protoEntries[i] = convertDisallowedMediaCollection(entry)
	}
	return protoEntries
}

func convertDisallowedMediaCollection(orig *types.DisallowedMediaCollection) *proto.DisallowedMediaCollection {
	m := &proto.DisallowedMediaCollection{
		Id:              orig.ID,
		DisallowedBy:    orig.DisallowedBy,
		DisallowedAt:    timestamppb.New(orig.DisallowedAt),
		CollectionId:    orig.CollectionID,
		CollectionTitle: orig.CollectionTitle,
	}
	switch orig.CollectionType {
	case types.MediaCollectionTypeYouTubeChannel:
		m.CollectionType = proto.DisallowedMediaCollectionType_DISALLOWED_MEDIA_COLLECTION_TYPE_YOUTUBE_CHANNEL
	case types.MediaCollectionTypeSoundCloudUser:
		m.CollectionType = proto.DisallowedMediaCollectionType_DISALLOWED_MEDIA_COLLECTION_TYPE_SOUNDCLOUD_USER
	}
	return m
}

func (s *grpcServer) AddDisallowedMediaCollection(ctxCtx context.Context, r *proto.AddDisallowedMediaCollectionRequest) (*proto.AddDisallowedMediaCollectionResponse, error) {
	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	defer ctx.Rollback()

	moderator := authinterceptor.UserClaimsFromContext(ctx)
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

	ids := []string{}
	for _, collection := range preInfo.Collections() {
		collection := &types.DisallowedMediaCollection{
			ID:              uuid.NewV4().String(),
			DisallowedBy:    moderator.RewardAddress,
			DisallowedAt:    time.Now(),
			CollectionType:  collection.Type,
			CollectionID:    collection.ID,
			CollectionTitle: collection.Title,
		}

		err = collection.Update(ctx)
		if err != nil {
			return nil, stacktrace.Propagate(err, "")
		}

		err = ctx.Commit()
		if err != nil {
			return nil, stacktrace.Propagate(err, "")
		}

		s.log.Printf("Media collection of type %s with ID %s disallowed by %s (remote address %s)",
			collection.CollectionType, collection.CollectionID, moderator.Username, authinterceptor.RemoteAddressFromContext(ctx))

		mediaTypeString := "[Unknown media type]"
		switch collection.CollectionType {
		case types.MediaCollectionTypeYouTubeChannel:
			mediaTypeString = "YouTube channel"
		case types.MediaCollectionTypeSoundCloudUser:
			mediaTypeString = "SoundCloud user"
		}

		if s.modLogWebhook != nil {
			_, err = s.modLogWebhook.SendContent(
				fmt.Sprintf("%s with ID `%s` (\"%s\") disallowed by moderator: %s (%s)",
					mediaTypeString,
					collection.CollectionID,
					collection.CollectionTitle,
					moderator.Address()[:14],
					moderator.Username))
			if err != nil {
				s.log.Println("Failed to send mod log webhook:", err)
			}
		}
		ids = append(ids, collection.ID)
	}

	return &proto.AddDisallowedMediaCollectionResponse{
		Ids: ids,
	}, nil
}

func (s *grpcServer) RemoveDisallowedMediaCollection(ctxCtx context.Context, r *proto.RemoveDisallowedMediaCollectionRequest) (*proto.RemoveDisallowedMediaCollectionResponse, error) {
	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	defer ctx.Rollback()

	moderator := authinterceptor.UserClaimsFromContext(ctx)
	if moderator == nil {
		// this should never happen, as the auth interceptors should have taken care of this for us
		return nil, status.Error(codes.Unauthenticated, "missing user claims")
	}

	collections, err := types.GetDisallowedMediaCollectionsWithIDs(ctx, []string{r.Id})
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	if len(collections) == 0 {
		return nil, status.Error(codes.InvalidArgument, "entry not found")
	}
	collection := collections[r.Id]

	err = collection.Delete(ctx)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	err = ctx.Commit()
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	s.log.Printf("Media collection of type %s with ID %s reallowed by %s (remote address %s)", collection.CollectionType, collection.CollectionID, moderator.Username, authinterceptor.RemoteAddressFromContext(ctx))

	mediaTypeString := "[Unknown media type]"
	switch collection.CollectionType {
	case types.MediaCollectionTypeYouTubeChannel:
		mediaTypeString = "YouTube channel"
	case types.MediaCollectionTypeSoundCloudUser:
		mediaTypeString = "SoundCloud user"
	}

	if s.modLogWebhook != nil {
		_, err = s.modLogWebhook.SendContent(
			fmt.Sprintf("%s with ID `%s` (\"%s\") reallowed by moderator: %s (%s)",
				mediaTypeString,
				collection.CollectionID,
				collection.CollectionTitle,
				moderator.Address()[:14],
				moderator.Username))
		if err != nil {
			s.log.Println("Failed to send mod log webhook:", err)
		}
	}

	return &proto.RemoveDisallowedMediaCollectionResponse{}, nil
}
