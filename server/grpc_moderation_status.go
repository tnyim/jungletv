package server

import (
	"time"

	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/proto"
)

func (s *grpcServer) MonitorModerationSettings(r *proto.MonitorModerationSettingsRequest, stream proto.JungleTV_MonitorModerationSettingsServer) error {
	heartbeatC := time.NewTicker(5 * time.Second).C

	send := func() error {
		return stacktrace.Propagate(stream.Send(&proto.ModerationSettingsOverview{
			AllowedVideoEnqueuing:               s.allowVideoEnqueuing,
			EnqueuingPricesMultiplier:           int32(s.pricer.finalPricesMultiplier),
			CrowdfundedSkippingEnabled:          s.skipManager.CrowdfundedSkippingEnabled(),
			CrowdfundedSkippingPricesMultiplier: int32(s.pricer.crowdfundedSkipMultiplier),
			NewEntriesAlwaysUnskippable:         s.enqueueManager.NewEntriesAlwaysUnskippableForFree(),
			OwnEntryRemovalEnabled:              s.mediaQueue.RemovalOfOwnEntriesAllowed(),
			AllSkippingEnabled:                  s.mediaQueue.SkippingEnabled(),
		}), "")
	}
	err := send()
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	for {
		select {
		case <-heartbeatC:
			err = send()
		case <-stream.Context().Done():
			return nil
		}
		if err != nil {
			return stacktrace.Propagate(err, "")
		}
	}
}
