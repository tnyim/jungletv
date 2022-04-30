package server

import (
	"context"
	"time"

	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/proto"
	authinterceptor "github.com/tnyim/jungletv/server/interceptors/auth"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (s *grpcServer) MonitorModerationStatus(r *proto.MonitorModerationStatusRequest, stream proto.JungleTV_MonitorModerationStatusServer) error {
	heartbeat := time.NewTicker(5 * time.Second)
	defer heartbeat.Stop()

	send := func() error {
		users := s.staffActivityManager.ActivelyModerating()
		protoUsers := make([]*proto.User, len(users))
		for i := range users {
			protoUsers[i] = s.userSerializer(stream.Context(), users[i])
		}

		overview := &proto.ModerationStatusOverview{
			AllowedVideoEnqueuing:               s.allowVideoEnqueuing,
			EnqueuingPricesMultiplier:           int32(s.pricer.finalPricesMultiplier),
			CrowdfundedSkippingEnabled:          s.skipManager.CrowdfundedSkippingEnabled(),
			CrowdfundedSkippingPricesMultiplier: int32(s.pricer.crowdfundedSkipMultiplier),
			NewEntriesAlwaysUnskippable:         s.enqueueManager.NewEntriesAlwaysUnskippableForFree(),
			OwnEntryRemovalEnabled:              s.mediaQueue.RemovalOfOwnEntriesAllowed(),
			AllSkippingEnabled:                  s.mediaQueue.SkippingEnabled(),
			MinimumPricesMultiplier:             int32(s.pricer.minimumPricesMultiplier),
			ActivelyModerating:                  protoUsers,
			AllowEntryReordering:                s.mediaQueue.EntryReorderingAllowed(),
		}
		queueInsertCursor, hasQueueInsertCursor := s.mediaQueue.InsertCursor()
		if hasQueueInsertCursor {
			overview.QueueInsertCursor = &queueInsertCursor
		}

		return stacktrace.Propagate(stream.Send(overview), "")
	}
	err := send()
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	for {
		select {
		case <-heartbeat.C:
			err = send()
		case <-stream.Context().Done():
			return nil
		}
		if err != nil {
			return stacktrace.Propagate(err, "")
		}
	}
}

func (s *grpcServer) MarkAsActivelyModerating(ctx context.Context, r *proto.MarkAsActivelyModeratingRequest) (*proto.MarkAsActivelyModeratingResponse, error) {
	moderator := authinterceptor.UserClaimsFromContext(ctx)
	if moderator == nil {
		// this should never happen, as the auth interceptors should have taken care of this for us
		return nil, status.Error(codes.Unauthenticated, "missing user claims")
	}

	s.staffActivityManager.MarkAsActive(ctx, moderator)

	return &proto.MarkAsActivelyModeratingResponse{}, nil
}

func (s *grpcServer) StopActivelyModerating(ctx context.Context, r *proto.StopActivelyModeratingRequest) (*proto.StopActivelyModeratingResponse, error) {
	moderator := authinterceptor.UserClaimsFromContext(ctx)
	if moderator == nil {
		// this should never happen, as the auth interceptors should have taken care of this for us
		return nil, status.Error(codes.Unauthenticated, "missing user claims")
	}

	s.staffActivityManager.MarkAsInactive(ctx, moderator)

	return &proto.StopActivelyModeratingResponse{}, nil
}
