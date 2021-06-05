package server

import (
	"context"
	"time"

	"github.com/palantir/stacktrace"
	"github.com/rickb777/date/period"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/utils/event"
)

func (s *grpcServer) EnqueueMedia(ctx context.Context, r *proto.EnqueueMediaRequest) (*proto.EnqueueMediaResponse, error) {
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
		return s.enqueueYouTubeVideo(ctx, x.YoutubeVideoData)
	default:
		return nil, stacktrace.NewError("invalid media info type")
	}
}

func (s *grpcServer) enqueueYouTubeVideo(ctx context.Context, r *proto.EnqueueYouTubeVideoData) (*proto.EnqueueMediaResponse, error) {
	response, err := s.youtube.Videos.List([]string{"snippet", "contentDetails"}).Id(r.Id).MaxResults(1).Do()
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	if len(response.Items) == 0 {
		return &proto.EnqueueMediaResponse{
			EnqueueResponse: &proto.EnqueueMediaResponse_Failure{
				Failure: &proto.EnqueueMediaFailure{
					FailureReason: "Video not found",
				},
			},
		}, nil
	}

	videoItem := response.Items[0]
	if videoItem.ContentDetails.ContentRating.YtRating == "ytAgeRestricted" {
		return &proto.EnqueueMediaResponse{
			EnqueueResponse: &proto.EnqueueMediaResponse_Failure{
				Failure: &proto.EnqueueMediaFailure{
					FailureReason: "Video is age restricted",
				},
			},
		}, nil
	}

	if videoItem.Snippet.LiveBroadcastContent != "none" {
		return &proto.EnqueueMediaResponse{
			EnqueueResponse: &proto.EnqueueMediaResponse_Failure{
				Failure: &proto.EnqueueMediaFailure{
					FailureReason: "Video is a live broadcast",
				},
			},
		}, nil
	}

	videoDuration, err := period.Parse(videoItem.ContentDetails.Duration)
	if err != nil {
		return nil, stacktrace.Propagate(err, "error parsing video duration")
	}

	if videoDuration.DurationApprox() > 30*time.Minute {
		return &proto.EnqueueMediaResponse{
			EnqueueResponse: &proto.EnqueueMediaResponse_Failure{
				Failure: &proto.EnqueueMediaFailure{
					FailureReason: "Video is longer than 30 minutes",
				},
			},
		}, nil
	}

	request := &queueEntryYouTubeVideo{
		id:           r.Id,
		title:        videoItem.Snippet.Title,
		channelTitle: videoItem.Snippet.ChannelTitle,
		thumbnailURL: videoItem.Snippet.Thumbnails.Default.Url,
		duration:     videoDuration.DurationApprox(),
		donePlaying:  event.New(),
		requestedBy:  &unknownUser{},
	}

	userClaims := UserClaimsFromContext(ctx)
	if userClaims != nil {
		request.requestedBy = userClaims
	}

	ticket, err := s.enqueueManager.RegisterRequest(ctx, request)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	return &proto.EnqueueMediaResponse{
		EnqueueResponse: &proto.EnqueueMediaResponse_Ticket{
			Ticket: ticket.SerializeForAPI(),
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

	c := ticket.StatusChanged().Subscribe(event.AtLeastOnceGuarantee)
	defer ticket.StatusChanged().Unsubscribe(c)
	for {
		select {
		case <-c:
			if err := stream.Send(ticket.SerializeForAPI()); err != nil {
				return stacktrace.Propagate(err, "")
			}
			if ticket.Status() == proto.EnqueueMediaTicketStatus_EXPIRED {
				return nil
			}
		case <-stream.Context().Done():
			return nil
		}
	}
}
