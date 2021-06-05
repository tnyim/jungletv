package server

import (
	"context"

	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/proto"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (s *grpcServer) ForciblyEnqueueTicket(ctx context.Context, r *proto.ForciblyEnqueueTicketRequest) (*proto.ForciblyEnqueueTicketResponse, error) {
	user := UserClaimsFromContext(ctx)
	if user == nil {
		// this should never happen, as the auth interceptors should have taken care of this for us
		return nil, status.Error(codes.Unauthenticated, "missing user claims")
	}

	ticket := s.enqueueManager.GetTicket(r.Id)
	if ticket == nil {
		return nil, stacktrace.NewError("unknown ticket ID")
	}
	ticket.ForceEnqueuing(r.EnqueueType)

	s.log.Printf("Ticket %s forcibly enqueued by %s (remote address %s)", r.Id, user.Username, RemoteAddressFromContext(ctx))
	return &proto.ForciblyEnqueueTicketResponse{}, nil
}

func (s *grpcServer) RemoveQueueEntry(ctx context.Context, r *proto.RemoveQueueEntryRequest) (*proto.RemoveQueueEntryResponse, error) {
	user := UserClaimsFromContext(ctx)
	if user == nil {
		// this should never happen, as the auth interceptors should have taken care of this for us
		return nil, status.Error(codes.Unauthenticated, "missing user claims")
	}

	err := s.mediaQueue.RemoveEntry(r.Id)
	if err != nil {
		return nil, stacktrace.Propagate(err, "failed to remove queue entry")
	}
	s.log.Printf("Queue entry with ID %s removed by %s (remote address %s)", r.Id, user.Username, RemoteAddressFromContext(ctx))
	return &proto.RemoveQueueEntryResponse{}, nil
}
