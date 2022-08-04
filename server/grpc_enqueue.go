package server

import (
	"context"
	"strings"

	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/server/auth"
	authinterceptor "github.com/tnyim/jungletv/server/interceptors/auth"
	"github.com/tnyim/jungletv/server/media"
	"github.com/tnyim/jungletv/utils/event"
	"github.com/tnyim/jungletv/utils/transaction"
)

func (s *grpcServer) EnqueueMedia(ctx context.Context, r *proto.EnqueueMediaRequest) (*proto.EnqueueMediaResponse, error) {
	_, _, _, ok, err := s.enqueueRequestRateLimiter.Take(ctx, authinterceptor.RemoteAddressFromContext(ctx))
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	if !ok {
		return &proto.EnqueueMediaResponse{
			EnqueueResponse: &proto.EnqueueMediaResponse_Failure{
				Failure: &proto.EnqueueMediaFailure{
					FailureReason: "Rate limit reached",
				},
			},
		}, nil
	}

	isAdmin := false
	user := authinterceptor.UserClaimsFromContext(ctx)
	if banned, err := s.moderationStore.LoadRemoteAddressBannedFromVideoEnqueuing(ctx, authinterceptor.RemoteAddressFromContext(ctx)); err == nil && banned {
		return &proto.EnqueueMediaResponse{
			EnqueueResponse: &proto.EnqueueMediaResponse_Failure{
				Failure: &proto.EnqueueMediaFailure{
					FailureReason: "Video enqueuing is currently disabled due to upcoming maintenance",
				},
			},
		}, nil
	}
	if user != nil {
		isAdmin = auth.UserPermissionLevelIsAtLeast(user, auth.AdminPermissionLevel)
		if banned, err := s.moderationStore.LoadPaymentAddressBannedFromVideoEnqueuing(ctx, user.Address()); err == nil && banned {
			return &proto.EnqueueMediaResponse{
				EnqueueResponse: &proto.EnqueueMediaResponse_Failure{
					Failure: &proto.EnqueueMediaFailure{
						FailureReason: "Video enqueuing is currently disabled due to upcoming maintenance",
					},
				},
			}, nil
		}
	}
	if s.allowVideoEnqueuing == proto.AllowedVideoEnqueuingType_DISABLED {
		return &proto.EnqueueMediaResponse{
			EnqueueResponse: &proto.EnqueueMediaResponse_Failure{
				Failure: &proto.EnqueueMediaFailure{
					FailureReason: "Video enqueuing is currently disabled due to upcoming maintenance",
				},
			},
		}, nil
	}
	if !isAdmin && s.allowVideoEnqueuing == proto.AllowedVideoEnqueuingType_STAFF_ONLY {
		return &proto.EnqueueMediaResponse{
			EnqueueResponse: &proto.EnqueueMediaResponse_Failure{
				Failure: &proto.EnqueueMediaFailure{
					FailureReason: "At this moment, only JungleTV staff can enqueue videos",
				},
			},
		}, nil
	}

	switch x := r.GetMediaInfo().(type) {
	case *proto.EnqueueMediaRequest_StubData:
		return &proto.EnqueueMediaResponse{
			EnqueueResponse: &proto.EnqueueMediaResponse_Failure{
				Failure: &proto.EnqueueMediaFailure{
					FailureReason: "Enqueuing of stub media always fails",
				},
			},
		}, nil
	case *proto.EnqueueMediaRequest_YoutubeVideoData:
		return s.enqueueYouTubeVideo(ctx, r, x.YoutubeVideoData)
	default:
		return nil, stacktrace.NewError("invalid media info type")
	}
}

func (s *grpcServer) enqueueYouTubeVideo(ctxCtx context.Context, origReq *proto.EnqueueMediaRequest, r *proto.EnqueueYouTubeVideoData) (*proto.EnqueueMediaResponse, error) {
	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	defer ctx.Commit() // read-only tx (for now)

	request, result, err := s.youtubeRequestCreator.NewEnqueueRequest(ctx, r.Id, r.StartOffset, r.EndOffset, origReq.Unskippable,
		s.allowVideoEnqueuing == proto.AllowedVideoEnqueuingType_STAFF_ONLY,
		s.allowVideoEnqueuing == proto.AllowedVideoEnqueuingType_STAFF_ONLY,
		s.allowVideoEnqueuing == proto.AllowedVideoEnqueuingType_STAFF_ONLY)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	var failureReason string

	switch result {
	case media.EnqueueRequestCreationSucceeded:
		ticket, err := s.enqueueManager.RegisterRequest(ctx, request)
		if err != nil {
			if strings.Contains(err.Error(), "failed to check balance for account") {
				return &proto.EnqueueMediaResponse{
					EnqueueResponse: &proto.EnqueueMediaResponse_Failure{
						Failure: &proto.EnqueueMediaFailure{
							FailureReason: "The JungleTV payment subsystem is unavailable",
						},
					},
				}, nil
			}
			return nil, stacktrace.Propagate(err, "")
		}

		resp := ticket.SerializeForAPI()
		currentEntry, playing := s.mediaQueue.CurrentlyPlaying()
		resp.CurrentlyPlayingIsUnskippable = playing && (currentEntry.Unskippable() || !s.mediaQueue.SkippingEnabled())
		return &proto.EnqueueMediaResponse{
			EnqueueResponse: &proto.EnqueueMediaResponse_Ticket{
				Ticket: resp,
			},
		}, nil
	case media.EnqueueRequestCreationFailedMediumNotFound:
		failureReason = "Content not found"
	case media.EnqueueRequestCreationFailedMediumAgeRestricted:
		failureReason = "This content is age-restricted"
	case media.EnqueueRequestCreationFailedMediumIsUpcomingLiveBroadcast:
		failureReason = "This is an upcoming live broadcast"
	case media.EnqueueRequestCreationFailedMediumIsUnpopularLiveBroadcast:
		failureReason = "This live broadcast has insufficient viewers to be allowed on JungleTV"
	case media.EnqueueRequestCreationFailedMediumIsNotEmbeddable:
		failureReason = "This content can't be played outside of its original website"
	case media.EnqueueRequestCreationFailedMediumIsTooLong:
		failureReason = "This content is longer than 35 minutes"
	case media.EnqueueRequestCreationFailedMediumIsAlreadyInQueue:
		failureReason = "This content (or the selected time range) is already in the queue"
	case media.EnqueueRequestCreationFailedMediumPlayedTooRecently:
		failureReason = "This content (or the selected time range) was last played on JungleTV too recently"
	case media.EnqueueRequestCreationFailedMediumIsDisallowed:
		failureReason = "This content is disallowed on JungleTV"
	}

	return &proto.EnqueueMediaResponse{
		EnqueueResponse: &proto.EnqueueMediaResponse_Failure{
			Failure: &proto.EnqueueMediaFailure{
				FailureReason: failureReason,
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

	onMediaChanged, mediaChangedU := s.mediaQueue.mediaChanged.Subscribe(event.AtLeastOnceGuarantee)
	defer mediaChangedU()

	onSkippingAllowedUpdated, skippingAllowedUpdatedU := s.mediaQueue.skippingAllowedUpdated.Subscribe(event.AtLeastOnceGuarantee)
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
		if ticket.Status() == proto.EnqueueMediaTicketStatus_EXPIRED {
			return nil
		}
	}
}
