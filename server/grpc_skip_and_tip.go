package server

import (
	"time"

	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/utils/event"
)

func (s *grpcServer) MonitorSkipAndTip(r *proto.MonitorSkipAndTipRequest, stream proto.JungleTV_MonitorSkipAndTipServer) error {
	onStatusUpdated := s.skipManager.StatusUpdated().Subscribe(event.AtLeastOnceGuarantee)
	defer s.skipManager.StatusUpdated().Unsubscribe(onStatusUpdated)

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

	heartbeatC := time.NewTicker(5 * time.Second).C

	for {
		select {
		case v := <-onStatusUpdated:
			latestSkipStatus = v[0].(*SkipAccountStatus)
			latestRainStatus = v[1].(*RainAccountStatus)
			err = stream.Send(buildStatus())
			if err != nil {
				return stacktrace.Propagate(err, "")
			}
		case <-heartbeatC:
			err = stream.Send(buildStatus())
			if err != nil {
				return stacktrace.Propagate(err, "")
			}
		}
	}
}
