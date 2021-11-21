package server

import (
	"context"
	"strings"

	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/server/auth"
	"github.com/tnyim/jungletv/utils/event"
)

func (s *grpcServer) EnqueueMedia(ctx context.Context, r *proto.EnqueueMediaRequest) (*proto.EnqueueMediaResponse, error) {
	_, _, _, ok, err := s.enqueueRequestRateLimiter.Take(ctx, auth.RemoteAddressFromContext(ctx))
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
	ctx, err := BeginTransaction(ctxCtx)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	defer ctx.Commit() // read-only tx (for now)
	request, result, err := s.NewYouTubeVideoEnqueueRequest(ctx, r.Id, r.StartOffset, r.EndOffset, origReq.Unskippable)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	var failureReason string

	switch result {
	case youTubeVideoEnqueueRequestCreationSucceeded:
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
	case youTubeVideoEnqueueRequestCreationVideoNotFound:
		failureReason = "Video not found"
	case youTubeVideoEnqueueRequestCreationVideoAgeRestricted:
		failureReason = "This content is age-restricted"
	case youTubeVideoEnqueueRequestCreationVideoIsUpcomingLiveBroadcast:
		failureReason = "This is an upcoming live broadcast"
	case youTubeVideoEnqueueRequestCreationVideoIsUnpopularLiveBroadcast:
		failureReason = "This live broadcast has insufficient viewers to be allowed on JungleTV"
	case youTubeVideoEnqueueRequestCreationVideoIsNotEmbeddable:
		failureReason = "This content can't be played outside of YouTube"
	case youTubeVideoEnqueueRequestCreationVideoIsTooLong:
		failureReason = "This video is longer than 35 minutes"
	case youTubeVideoEnqueueRequestCreationVideoIsAlreadyInQueue:
		failureReason = "This content (or the selected time range) is already in the queue"
	case youTubeVideoEnqueueRequestCreationVideoPlayedTooRecently:
		failureReason = "This content (or the selected time range) was last played on JungleTV too recently"
	case youTubeVideoEnqueueRequestCreationVideoIsDisallowed:
		failureReason = "This video is disallowed on JungleTV"
	case youTubeVideoEnqueueRequestVideoEnqueuingDisabled:
		failureReason = "Video enqueuing is currently disabled due to upcoming maintenance"
	case youTubeVideoEnqueueRequestVideoEnqueuingStaffOnly:
		failureReason = "At this moment, only JungleTV staff can enqueue videos"
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

	onMediaChanged := s.mediaQueue.mediaChanged.Subscribe(event.AtLeastOnceGuarantee)
	defer s.mediaQueue.mediaChanged.Unsubscribe(onMediaChanged)

	onSkippingAllowedUpdated := s.mediaQueue.skippingAllowedUpdated.Subscribe(event.AtLeastOnceGuarantee)
	defer s.mediaQueue.skippingAllowedUpdated.Unsubscribe(onSkippingAllowedUpdated)

	c := ticket.StatusChanged().Subscribe(event.AtLeastOnceGuarantee)
	defer ticket.StatusChanged().Unsubscribe(c)
	for {
		select {
		case <-onMediaChanged:
			break
		case <-onSkippingAllowedUpdated:
			break
		case <-c:
			break
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
