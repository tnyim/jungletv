package server

import (
	"context"
	"strings"
	"time"

	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/server/auth"
	authinterceptor "github.com/tnyim/jungletv/server/interceptors/auth"
	"github.com/tnyim/jungletv/server/media"
	"github.com/tnyim/jungletv/types"
	"github.com/tnyim/jungletv/utils/event"
	"github.com/tnyim/jungletv/utils/transaction"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"google.golang.org/protobuf/types/known/durationpb"
)

func (s *grpcServer) EnqueueMedia(ctxCtx context.Context, r *proto.EnqueueMediaRequest) (*proto.EnqueueMediaResponse, error) {
	isAdmin := false
	user := authinterceptor.UserClaimsFromContext(ctxCtx)
	if banned, err := s.moderationStore.LoadRemoteAddressBannedFromVideoEnqueuing(ctxCtx, authinterceptor.RemoteAddressFromContext(ctxCtx)); err == nil && banned {
		return produceEnqueueMediaFailureResponse("Media enqueuing is currently disabled due to upcoming maintenance")
	}
	if user != nil {
		isAdmin = auth.UserPermissionLevelIsAtLeast(user, auth.AdminPermissionLevel) || s.isVIPUser(user)
		if banned, err := s.moderationStore.LoadPaymentAddressBannedFromVideoEnqueuing(ctxCtx, user.Address()); err == nil && banned {
			return produceEnqueueMediaFailureResponse("Media enqueuing is currently disabled due to upcoming maintenance")
		}
	}
	if s.allowMediaEnqueuing == proto.AllowedMediaEnqueuingType_DISABLED {
		return produceEnqueueMediaFailureResponse("Media enqueuing is currently disabled due to upcoming maintenance")
	}
	if !isAdmin && s.allowMediaEnqueuing == proto.AllowedMediaEnqueuingType_STAFF_ONLY {
		return produceEnqueueMediaFailureResponse("At this moment, only JungleTV staff can enqueue media")
	}
	if !isAdmin && r.Anonymous {
		return produceEnqueueMediaFailureResponse("Only JungleTV staff members can enqueue media anonymously")
	}

	if s.allowMediaEnqueuing != proto.AllowedMediaEnqueuingType_STAFF_ONLY {
		_, _, _, ok, err := s.enqueueRequestLongTermRateLimiter.Take(ctxCtx, authinterceptor.RemoteAddressFromContext(ctxCtx))
		if err != nil {
			return nil, stacktrace.Propagate(err, "")
		}
		_, _, _, ok2, err := s.enqueueRequestRateLimiter.Take(ctxCtx, authinterceptor.RemoteAddressFromContext(ctxCtx))
		if err != nil {
			return nil, stacktrace.Propagate(err, "")
		}
		if !ok || !ok2 {
			return produceEnqueueMediaFailureResponse("Rate limit reached")
		}
	}

	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	defer ctx.Commit() // read-only tx (for now)

	if r.Concealed && !r.Anonymous {
		if user == nil || user.IsUnknown() {
			return produceEnqueueMediaFailureResponse("Anonymous users can not enqueue entries with hidden media information")
		}
		// preliminary check for sufficient points balance
		enoughPoints, err := s.enqueueManager.UserHasEnoughPointsToEnqueueConcealedEntry(ctx, user)
		if err != nil {
			return nil, stacktrace.Propagate(err, "")
		}
		if !enoughPoints {
			return produceEnqueueMediaFailureResponse("Insufficient points to enqueue with hidden media information")
		}
	}

	var provider media.Provider

	for _, p := range s.mediaProviders {
		if p.CanHandleRequestType(r.GetMediaInfo()) {
			provider = p
		}
	}

	if provider == media.Provider(nil) {
		return nil, stacktrace.NewError("no provider found")
	}

	preInfo, result, err := provider.BeginEnqueueRequest(ctx, r.GetMediaInfo())
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	if result != media.EnqueueRequestCreationSucceeded {
		return produceEnqueueRequestCreationFailedResponse(result)
	}

	mediaType, mediaID := preInfo.MediaID()
	allowed, err := types.IsMediaAllowed(ctx, mediaType, mediaID)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	if !allowed {
		return produceEnqueueRequestCreationFailedResponse(media.EnqueueRequestCreationFailedMediumIsDisallowed)
	}

	for _, collection := range preInfo.Collections() {
		allowed, err := types.IsMediaCollectionAllowed(ctx, collection.Type, collection.ID)
		if err != nil {
			return nil, stacktrace.Propagate(err, "")
		}
		if !allowed {
			return produceEnqueueRequestCreationFailedResponse(media.EnqueueRequestCreationFailedMediumIsDisallowed)
		}
	}

	request, result, err := provider.ContinueEnqueueRequest(ctx, preInfo, r.Unskippable, r.Concealed, r.Anonymous,
		s.allowMediaEnqueuing == proto.AllowedMediaEnqueuingType_STAFF_ONLY,
		s.allowMediaEnqueuing == proto.AllowedMediaEnqueuingType_STAFF_ONLY,
		s.allowMediaEnqueuing == proto.AllowedMediaEnqueuingType_STAFF_ONLY)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	if result != media.EnqueueRequestCreationSucceeded {
		return produceEnqueueRequestCreationFailedResponse(result)
	}

	ticket, err := s.enqueueManager.RegisterRequest(ctx, request, r.Anonymous)
	if err != nil {
		if strings.Contains(err.Error(), "failed to check balance for account") {
			return produceEnqueueMediaFailureResponse("The JungleTV payment subsystem is unavailable")
		}
		return nil, stacktrace.Propagate(err, "")
	}

	resp := ticket.SerializeForAPI()
	currentEntry, playing := s.mediaQueue.CurrentlyPlaying()
	resp.CurrentlyPlayingIsUnskippable = playing && (currentEntry.Unskippable() || !s.mediaQueue.SkippingEnabled())

	// it's not very elegant to put this check here, but this avoids having to expose the concept of tickets to the media providers
	// (and a media type that allows for doing this should very much be the exception, anyway)
	if r.GetDocumentData() != nil && r.GetDocumentData().EnqueueType != nil {
		ticket.ForceEnqueuing(r.GetDocumentData().GetEnqueueType())
	}

	return &proto.EnqueueMediaResponse{
		EnqueueResponse: &proto.EnqueueMediaResponse_Ticket{
			Ticket: resp,
		},
	}, nil
}

func produceEnqueueRequestCreationFailedResponse(result media.EnqueueRequestCreationResult) (*proto.EnqueueMediaResponse, error) {
	switch result {
	case media.EnqueueRequestCreationFailedMediumNotFound:
		return produceEnqueueMediaFailureResponse("Content not found")
	case media.EnqueueRequestCreationFailedMediumAgeRestricted:
		return produceEnqueueMediaFailureResponse("This content is age-restricted")
	case media.EnqueueRequestCreationFailedMediumIsUpcomingLiveBroadcast:
		return produceEnqueueMediaFailureResponse("This is an upcoming live broadcast")
	case media.EnqueueRequestCreationFailedMediumIsUnpopularLiveBroadcast:
		return produceEnqueueMediaFailureResponse("This live broadcast has insufficient viewers to be allowed on JungleTV")
	case media.EnqueueRequestCreationFailedMediumIsNotEmbeddable:
		return produceEnqueueMediaFailureResponse("This content can't be played outside of its original website")
	case media.EnqueueRequestCreationFailedMediumIsTooLong:
		return produceEnqueueMediaFailureResponse("This content is longer than 35 minutes")
	case media.EnqueueRequestCreationFailedMediumIsAlreadyInQueue:
		return produceEnqueueMediaFailureResponse("This content (or the selected time range) is already in the queue")
	case media.EnqueueRequestCreationFailedMediumPlayedTooRecently:
		return produceEnqueueMediaFailureResponse("This content (or the selected time range) was last played on JungleTV too recently")
	case media.EnqueueRequestCreationFailedMediumIsDisallowed:
		return produceEnqueueMediaFailureResponse("This content is disallowed on JungleTV")
	case media.EnqueueRequestCreationFailedMediumIsNotATrack:
		return produceEnqueueMediaFailureResponse("This is not a SoundCloud track")
	default:
		return produceEnqueueMediaFailureResponse("Enqueue request failed")
	}
}

func produceEnqueueMediaFailureResponse(reason string) (*proto.EnqueueMediaResponse, error) {
	return &proto.EnqueueMediaResponse{
		EnqueueResponse: &proto.EnqueueMediaResponse_Failure{
			Failure: &proto.EnqueueMediaFailure{
				FailureReason: reason,
			},
		},
	}, nil
}

func (s *grpcServer) MonitorTicket(r *proto.MonitorTicketRequest, stream proto.JungleTV_MonitorTicketServer) error {
	ticket := s.enqueueManager.GetTicket(r.TicketId)
	if ticket == nil {
		err := stream.Send(&proto.EnqueueMediaTicket{
			Id:     r.TicketId,
			Status: proto.EnqueueMediaTicketStatus_EXPIRED,
		})
		return stacktrace.Propagate(err, "")
	}

	onMediaChanged, mediaChangedU := s.mediaQueue.MediaChanged().Subscribe(event.AtLeastOnceGuarantee)
	defer mediaChangedU()

	onSkippingAllowedUpdated, skippingAllowedUpdatedU := s.mediaQueue.SkippingAllowedUpdated().Subscribe(event.AtLeastOnceGuarantee)
	defer skippingAllowedUpdatedU()

	c, unsub := ticket.StatusChanged().Subscribe(event.AtLeastOnceGuarantee)
	defer unsub()
	for {
		select {
		case <-onMediaChanged:
			// unblock loop
		case <-onSkippingAllowedUpdated:
			// unblock loop
		case <-c:
			// unblock loop
		case <-stream.Context().Done():
			return nil
		}

		response := ticket.SerializeForAPI()
		currentEntry, playing := s.mediaQueue.CurrentlyPlaying()
		response.CurrentlyPlayingIsUnskippable = playing && (currentEntry.Unskippable() || !s.mediaQueue.SkippingEnabled())

		if err := stream.Send(response); err != nil {
			return stacktrace.Propagate(err, "")
		}
	}
}

func (s *grpcServer) SoundCloudTrackDetails(ctx context.Context, r *proto.SoundCloudTrackDetailsRequest) (*proto.SoundCloudTrackDetailsResponse, error) {
	remoteAddress := authinterceptor.RemoteAddressFromContext(ctx)

	_, _, _, ok, err := s.mediaPreviewLimiter.Take(ctx, remoteAddress)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	if !ok {
		return nil, status.Errorf(codes.ResourceExhausted, "rate limit reached")
	}

	response, err := s.soundCloudProvider.TrackInfo(r.TrackUrl)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	if response.Kind != "track" {
		return nil, status.Error(codes.NotFound, "track not found")
	}
	if response.Duration == 0 {
		response.Duration = response.FullDuration
	}
	return &proto.SoundCloudTrackDetailsResponse{
		Length: durationpb.New(time.Duration(response.Duration) * time.Millisecond),
	}, nil
}
