package server

import (
	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/utils/event"
)

func (s *grpcServer) MonitorQueue(r *proto.MonitorQueueRequest, stream proto.JungleTV_MonitorQueueServer) error {
	getEntries := func() []*proto.QueueEntry {
		entries := s.mediaQueue.Entries()
		protoEntries := make([]*proto.QueueEntry, len(entries))
		for i, entry := range entries {
			protoEntries[i] = entry.SerializeForAPI()
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

	for {
		select {
		case <-onQueueChanged:
			err := stream.Send(&proto.Queue{
				Entries: getEntries(),
			})
			if err != nil {
				return stacktrace.Propagate(err, "")
			}
		case <-stream.Context().Done():
			return nil
		}
	}
}
