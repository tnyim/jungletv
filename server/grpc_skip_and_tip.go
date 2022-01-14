package server

import (
	"time"

	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/utils/event"
)

func (s *grpcServer) MonitorSkipAndTip(r *proto.MonitorSkipAndTipRequest, stream proto.JungleTV_MonitorSkipAndTipServer) error {
	onStatusUpdated, statusUpdatedU := s.skipManager.StatusUpdated().Subscribe(event.AtLeastOnceGuarantee)
	defer statusUpdatedU()

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
		case v := <-onStatusUpdated:
			latestSkipStatus = v[0].(*SkipAccountStatus)
			latestRainStatus = v[1].(*RainAccountStatus)
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
