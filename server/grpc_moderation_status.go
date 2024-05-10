package server

import (
	"context"
	"sort"
	"time"

	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/server/auth"
	"github.com/tnyim/jungletv/server/components/configurationmanager"
	authinterceptor "github.com/tnyim/jungletv/server/interceptors/auth"
	"github.com/tnyim/jungletv/utils/event"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (s *grpcServer) MonitorModerationStatus(r *proto.MonitorModerationStatusRequest, stream proto.JungleTV_MonitorModerationStatusServer) error {
	heartbeat := time.NewTicker(5 * time.Second)
	defer heartbeat.Stop()

	onVersionHashChanged, versionHashChangedU := s.versionInterceptor.VersionHashUpdated().Subscribe(event.BufferFirst)
	defer versionHashChangedU()

	send := func() error {
		users := s.staffActivityManager.ActivelyModerating()
		protoUsers := make([]*proto.User, len(users))
		for i := range users {
			protoUsers[i] = s.userSerializer(stream.Context(), users[i])
		}

		vipUsers, err := configurationmanager.GetCollectionConfigurable[configurationmanager.VIPUser](s.configManager, configurationmanager.VIPUsers)
		if err != nil {
			return stacktrace.Propagate(err, "failed to get VIP users")
		}

		protoVipUsers := make([]*proto.User, len(vipUsers))
		for i, vip := range vipUsers {
			protoVipUsers[i] = s.userSerializer(stream.Context(), auth.NewAddressOnlyUser(vip.Address))
		}
		sort.Slice(protoVipUsers, func(i, j int) bool {
			return protoVipUsers[i].Address < protoVipUsers[j].Address
		})

		overview := &proto.ModerationStatusOverview{
			AllowedMediaEnqueuing:               s.getAllowMediaEnqueuing(),
			EnqueuingPricesMultiplier:           int32(s.pricer.FinalPricesMultiplier()),
			CrowdfundedSkippingEnabled:          s.skipManager.CrowdfundedSkippingEnabled(),
			CrowdfundedSkippingPricesMultiplier: int32(s.pricer.CrowdfundedSkipPriceMultiplier()),
			NewEntriesAlwaysUnskippable:         s.enqueueManager.NewEntriesAlwaysUnskippableForFree(),
			OwnEntryRemovalEnabled:              s.mediaQueue.RemovalOfOwnEntriesAllowed(),
			AllSkippingEnabled:                  s.mediaQueue.SkippingEnabled(),
			MinimumPricesMultiplier:             int32(s.pricer.MinimumPricesMultiplier()),
			ActivelyModerating:                  protoUsers,
			AllowEntryReordering:                s.mediaQueue.EntryReorderingAllowed(),
			VipUsers:                            protoVipUsers,
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
		case <-onVersionHashChanged:
			return nil
		case <-stream.Context().Done():
			return nil
		}
		if err != nil {
			return stacktrace.Propagate(err, "")
		}
	}
}

func (s *grpcServer) MarkAsActivelyModerating(ctx context.Context, r *proto.MarkAsActivelyModeratingRequest) (*proto.MarkAsActivelyModeratingResponse, error) {
	moderator := authinterceptor.UserFromContext(ctx)
	if moderator == nil {
		// this should never happen, as the auth interceptors should have taken care of this for us
		return nil, status.Error(codes.Unauthenticated, "missing user claims")
	}

	s.staffActivityManager.MarkAsActive(ctx, moderator)

	return &proto.MarkAsActivelyModeratingResponse{}, nil
}

func (s *grpcServer) StopActivelyModerating(ctx context.Context, r *proto.StopActivelyModeratingRequest) (*proto.StopActivelyModeratingResponse, error) {
	moderator := authinterceptor.UserFromContext(ctx)
	if moderator == nil {
		// this should never happen, as the auth interceptors should have taken care of this for us
		return nil, status.Error(codes.Unauthenticated, "missing user claims")
	}

	s.staffActivityManager.MarkAsInactive(ctx, moderator)

	return &proto.StopActivelyModeratingResponse{}, nil
}
