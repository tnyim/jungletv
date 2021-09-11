package server

import (
	"context"
	"errors"
	"time"

	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/server/auth"
	"github.com/tnyim/jungletv/utils/event"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (s *grpcServer) MonitorQueue(r *proto.MonitorQueueRequest, stream proto.JungleTV_MonitorQueueServer) error {
	getEntries := func() []*proto.QueueEntry {
		ctx := stream.Context()
		entries := s.mediaQueue.Entries()
		protoEntries := make([]*proto.QueueEntry, len(entries))
		for i, entry := range entries {
			protoEntries[i] = entry.SerializeForAPI(ctx, s.userSerializer)
		}
		return protoEntries
	}

	onQueueChanged := s.mediaQueue.queueUpdated.Subscribe(event.AtLeastOnceGuarantee)
	defer s.mediaQueue.queueUpdated.Unsubscribe(onQueueChanged)

	err := stream.Send(&proto.Queue{
		Entries: getEntries(),
	})
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	heartbeatC := time.NewTicker(5 * time.Second).C

	for {
		var err error
		select {
		case <-onQueueChanged:
			err = stream.Send(&proto.Queue{
				IsHeartbeat: false,
				Entries:     getEntries(),
			})
		case <-heartbeatC:
			err = stream.Send(&proto.Queue{
				IsHeartbeat: true,
			})
		case <-stream.Context().Done():
			return nil
		}
		if err != nil {
			return stacktrace.Propagate(err, "")
		}
	}
}

func (s *grpcServer) RemoveOwnQueueEntry(ctx context.Context, r *proto.RemoveOwnQueueEntryRequest) (*proto.RemoveOwnQueueEntryResponse, error) {
	user := auth.UserClaimsFromContext(ctx)
	if user == nil {
		// this should never happen, as the auth interceptors should have taken care of this for us
		return nil, status.Error(codes.Unauthenticated, "missing user claims")
	}

	_, _, _, ok, err := s.ownEntryRemovalRateLimiter.Take(ctx, user.Address())
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	if !ok {
		return nil, status.Errorf(codes.ResourceExhausted, "rate limit reached")
	}

	err = s.mediaQueue.RemoveOwnEntry(r.Id, user)
	if err != nil {
		if errors.Is(err, ErrInsufficientPermissionsToRemoveEntry) {

		}
		return nil, stacktrace.Propagate(err, "failed to remove queue entry")
	}

	s.log.Printf("Queue entry with ID %s removed by its requester", r.Id)

	return &proto.RemoveOwnQueueEntryResponse{}, nil
}
