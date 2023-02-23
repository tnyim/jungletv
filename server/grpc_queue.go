package server

import (
	"context"
	"errors"
	"time"

	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/server/auth"
	"github.com/tnyim/jungletv/server/components/mediaqueue"
	"github.com/tnyim/jungletv/server/components/pointsmanager"
	"github.com/tnyim/jungletv/server/components/stats"
	authinterceptor "github.com/tnyim/jungletv/server/interceptors/auth"
	"github.com/tnyim/jungletv/types"
	"github.com/tnyim/jungletv/utils/event"
	"github.com/tnyim/jungletv/utils/transaction"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"google.golang.org/protobuf/types/known/durationpb"
	"google.golang.org/protobuf/types/known/timestamppb"
)

func (s *grpcServer) MonitorQueue(r *proto.MonitorQueueRequest, stream proto.JungleTV_MonitorQueueServer) error {
	ctx := stream.Context()
	user := authinterceptor.UserClaimsFromContext(ctx)

	isAdmin := user != nil && auth.UserPermissionLevelIsAtLeast(user, auth.AdminPermissionLevel)

	unregister := s.statsRegistry.RegisterStreamSubscriber(stats.StatStreamConsumersQueue, user != nil && !user.IsUnknown())
	defer unregister()

	send := func() error {
		canRemoveOwnEntries := false
		if user != nil && !user.IsUnknown() {
			var err error
			canRemoveOwnEntries, err = s.mediaQueue.UserCanRemoveOwnEntries(ctx, user)
			if err != nil {
				return stacktrace.Propagate(err, "")
			}
		}

		queue := &proto.Queue{
			IsHeartbeat:            false,
			OwnEntryRemovalEnabled: canRemoveOwnEntries && s.mediaQueue.RemovalOfOwnEntriesAllowed(),
		}
		entries := s.mediaQueue.Entries()
		queue.Entries = make([]*proto.QueueEntry, len(entries))
		for i, entry := range entries {
			queue.Entries[i] = &proto.QueueEntry{
				Id:          entry.QueueID(),
				Length:      durationpb.New(entry.MediaInfo().Length()),
				Offset:      durationpb.New(entry.MediaInfo().Offset()),
				Unskippable: entry.Unskippable(),
				Concealed:   entry.Concealed() && i > 0,
				RequestCost: entry.RequestCost().SerializeForAPI(),
				RequestedAt: timestamppb.New(entry.RequestedAt()),
				CanMoveUp:   s.mediaQueue.CanMoveEntryByIndex(i, user, true),
				CanMoveDown: s.mediaQueue.CanMoveEntryByIndex(i, user, false),
			}
			requestedBy := entry.RequestedBy()
			if i == 0 || !entry.Concealed() || isAdmin ||
				(!user.IsUnknown() && !entry.RequestedBy().IsUnknown() && requestedBy.Address() == user.Address()) {
				queue.Entries[i].MediaInfo = entry.MediaInfo().SerializeForAPIQueue(ctx)
			} else {
				queue.Entries[i].MediaInfo = &proto.QueueEntry_ConcealedData{}
			}
			if !entry.RequestedBy().IsUnknown() {
				queue.Entries[i].RequestedBy = s.userSerializer(ctx, entry.RequestedBy())
			}
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

	onQueueChanged, queueUpdatedU := s.mediaQueue.QueueUpdated().Subscribe(event.BufferFirst)
	defer queueUpdatedU()

	onVersionHashChanged, versionHashChangedU := s.versionHashChanged.Subscribe(event.BufferFirst)
	defer versionHashChangedU()

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
		case <-onVersionHashChanged:
			return nil
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

	err := s.mediaQueue.RemoveOwnEntry(ctx, r.Id, user)
	if err != nil {
		if errors.Is(err, mediaqueue.ErrInsufficientPermissionsToRemoveEntry) {
			return nil, status.Error(codes.PermissionDenied, "insufficient permissions")
		}
		return nil, stacktrace.Propagate(err, "failed to remove queue entry")
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
