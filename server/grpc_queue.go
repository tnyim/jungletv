package server

import (
	"time"

	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/utils/event"
)

func (s *grpcServer) MonitorQueue(r *proto.MonitorQueueRequest, stream proto.JungleTV_MonitorQueueServer) error {
	getEntries := func() []*proto.QueueEntry {
		entries := s.mediaQueue.Entries()
		protoEntries := make([]*proto.QueueEntry, len(entries))
		for i, entry := range entries {
			protoEntries[i] = entry.SerializeForAPI(s.userSerializer)
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
