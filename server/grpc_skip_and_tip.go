package server

import (
	"time"

	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/proto"
	authinterceptor "github.com/tnyim/jungletv/server/interceptors/auth"
	"github.com/tnyim/jungletv/utils/event"
)

func (s *grpcServer) MonitorSkipAndTip(r *proto.MonitorSkipAndTipRequest, stream proto.JungleTV_MonitorSkipAndTipServer) error {
	ctx := stream.Context()
	user := authinterceptor.UserClaimsFromContext(ctx)

	onStatusUpdated, statusUpdatedU := s.skipManager.StatusUpdated().Subscribe(event.AtLeastOnceGuarantee)
	defer statusUpdatedU()

	unregister := s.statsHandler.RegisterStreamSubscriber(StreamStatsCommunitySkipping, user != nil && !user.IsUnknown())
	defer unregister()

	latestSkipStatus := s.skipManager.SkipAccountStatus()
	latestRainStatus := s.skipManager.RainAccountStatus()

	buildStatus := func() *proto.SkipAndTipStatus {
		return &proto.SkipAndTipStatus{
			SkipStatus:    latestSkipStatus.SkipStatus,
			SkipAddress:   latestSkipStatus.Address,
			SkipBalance:   latestSkipStatus.Balance.SerializeForAPI(),
			SkipThreshold: latestSkipStatus.Threshold.SerializeForAPI(),
			RainAddress:   latestRainStatus.Address,
			RainBalance:   latestRainStatus.Balance.SerializeForAPI(),
		}
	}

	err := stream.Send(buildStatus())
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	heartbeat := time.NewTicker(5 * time.Second)
	defer heartbeat.Stop()

	for {
		select {
		case args := <-onStatusUpdated:
			latestSkipStatus = args.skipAccountStatus
			latestRainStatus = args.rainAccountStatus
			err = stream.Send(buildStatus())
			if err != nil {
				return stacktrace.Propagate(err, "")
			}
		case <-heartbeat.C:
			err = stream.Send(buildStatus())
			if err != nil {
				return stacktrace.Propagate(err, "")
			}
		}
	}
}
