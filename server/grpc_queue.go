package server

import (
	"context"
	"errors"
	"time"

	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/server/components/pointsmanager"
	authinterceptor "github.com/tnyim/jungletv/server/interceptors/auth"
	"github.com/tnyim/jungletv/types"
	"github.com/tnyim/jungletv/utils/event"
	"github.com/tnyim/jungletv/utils/transaction"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"google.golang.org/protobuf/types/known/timestamppb"
)

func (s *grpcServer) MonitorQueue(r *proto.MonitorQueueRequest, stream proto.JungleTV_MonitorQueueServer) error {
	ctx := stream.Context()
	user := authinterceptor.UserClaimsFromContext(ctx)

	unregister := s.statsHandler.RegisterStreamSubscriber(StreamStatsQueue, user != nil && !user.IsUnknown())
	defer unregister()

	send := func() error {
		tokensExhausted := false
		if user != nil && !user.IsUnknown() {
			used, remaining, err := s.ownEntryRemovalRateLimiter.Get(ctx, user.Address())
			if err != nil {
				return stacktrace.Propagate(err, "")
			}
			// rate limiter memory store returns 0, 0 when it doesn't find a key, instead of returning the maximum for remaining...
			tokensExhausted = remaining == 0 && used != 0
		}

		queue := &proto.Queue{
			IsHeartbeat:            false,
			OwnEntryRemovalEnabled: !tokensExhausted && s.mediaQueue.RemovalOfOwnEntriesAllowed(),
		}
		entries := s.mediaQueue.Entries()
		queue.Entries = make([]*proto.QueueEntry, len(entries))
		for i, entry := range entries {
			canMoveUp := s.mediaQueue.CanMoveEntryByIndex(i, user, true)
			canMoveDown := s.mediaQueue.CanMoveEntryByIndex(i, user, false)
			queue.Entries[i] = entry.SerializeForAPI(ctx, s.userSerializer, canMoveUp, canMoveDown)
		}

		insertCursor, hasInsertCursor := s.mediaQueue.InsertCursor()
		if hasInsertCursor {
			queue.InsertCursor = &insertCursor
		}

		playingSince := s.mediaQueue.PlayingSince()
		if !playingSince.IsZero() {
			queue.PlayingSince = timestamppb.New(playingSince)
		}

		return stacktrace.Propagate(stream.Send(queue), "")
	}

	onQueueChanged, queueUpdatedU := s.mediaQueue.queueUpdated.Subscribe(event.AtLeastOnceGuarantee)
	defer queueUpdatedU()

	err := send()
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	heartbeat := time.NewTicker(5 * time.Second)
	defer heartbeat.Stop()

	for {
		var err error
		select {
		case <-onQueueChanged:
			err = send()
			if err != nil {
				return stacktrace.Propagate(err, "")
			}
		case <-heartbeat.C:
			err = stream.Send(&proto.Queue{
				IsHeartbeat: true,
			})
		case <-ctx.Done():
			return nil
		}
		if err != nil {
			return stacktrace.Propagate(err, "")
		}
	}
}

func (s *grpcServer) RemoveOwnQueueEntry(ctx context.Context, r *proto.RemoveOwnQueueEntryRequest) (*proto.RemoveOwnQueueEntryResponse, error) {
	user := authinterceptor.UserClaimsFromContext(ctx)
	if user == nil {
		// this should never happen, as the auth interceptors should have taken care of this for us
		return nil, status.Error(codes.Unauthenticated, "missing user claims")
	}

	err := s.mediaQueue.RemoveOwnEntry(r.Id, user)
	if err != nil {
		if errors.Is(err, ErrInsufficientPermissionsToRemoveEntry) {
			return nil, status.Error(codes.PermissionDenied, "insufficient permissions")
		}
		return nil, stacktrace.Propagate(err, "failed to remove queue entry")
	}

	_, _, _, ok, err := s.ownEntryRemovalRateLimiter.Take(ctx, user.Address())
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	if !ok {
		return nil, status.Errorf(codes.ResourceExhausted, "rate limit reached")
	}

	s.log.Printf("Queue entry with ID %s removed by its requester", r.Id)

	return &proto.RemoveOwnQueueEntryResponse{}, nil
}

func (s *grpcServer) MoveQueueEntry(ctxCtx context.Context, r *proto.MoveQueueEntryRequest) (*proto.MoveQueueEntryResponse, error) {
	user := authinterceptor.UserClaimsFromContext(ctxCtx)
	if user == nil {
		// this should never happen, as the auth interceptors should have taken care of this for us
		return nil, status.Error(codes.Unauthenticated, "missing user claims")
	}

	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	defer ctx.Rollback()

	direction := ""
	if r.Direction == proto.QueueEntryMovementDirection_QUEUE_ENTRY_MOVEMENT_DIRECTION_DOWN {
		direction = "down"
	} else if r.Direction == proto.QueueEntryMovementDirection_QUEUE_ENTRY_MOVEMENT_DIRECTION_UP {
		direction = "up"
	} else {
		return nil, stacktrace.NewError("unknown direction")
	}

	cost := 119
	subscribed, err := s.pointsManager.IsUserCurrentlySubscribed(ctx, user)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	if subscribed {
		cost = 69
	}

	// begin by deducting the points as this is what we can rollback if the queue movement fails, unlike the queue changes
	_, err = s.pointsManager.CreateTransaction(ctx, user, types.PointsTxTypeQueueEntryReordering, -cost, pointsmanager.TxExtraField{
		Key:   "media",
		Value: r.Id,
	}, pointsmanager.TxExtraField{
		Key:   "direction",
		Value: direction,
	})
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	// now attempt the queue movement
	err = s.mediaQueue.MoveEntry(r.Id, user, r.Direction == proto.QueueEntryMovementDirection_QUEUE_ENTRY_MOVEMENT_DIRECTION_UP)
	if err != nil {
		// this rolls back the points deduction
		return nil, stacktrace.Propagate(err, "")
	}

	return &proto.MoveQueueEntryResponse{}, stacktrace.Propagate(ctx.Commit(), "")
}
