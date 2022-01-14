package server

import (
	"time"

	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/proto"
)

func (s *grpcServer) MonitorModerationSettings(r *proto.MonitorModerationSettingsRequest, stream proto.JungleTV_MonitorModerationSettingsServer) error {
	heartbeat := time.NewTicker(5 * time.Second)
	defer heartbeat.Stop()

	send := func() error {
		overview := &proto.ModerationSettingsOverview{
			AllowedVideoEnqueuing:               s.allowVideoEnqueuing,
			EnqueuingPricesMultiplier:           int32(s.pricer.finalPricesMultiplier),
			CrowdfundedSkippingEnabled:          s.skipManager.CrowdfundedSkippingEnabled(),
			CrowdfundedSkippingPricesMultiplier: int32(s.pricer.crowdfundedSkipMultiplier),
			NewEntriesAlwaysUnskippable:         s.enqueueManager.NewEntriesAlwaysUnskippableForFree(),
			OwnEntryRemovalEnabled:              s.mediaQueue.RemovalOfOwnEntriesAllowed(),
			AllSkippingEnabled:                  s.mediaQueue.SkippingEnabled(),
			MinimumPricesMultiplier:             int32(s.pricer.minimumPricesMultiplier),
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
