package server

import (
	"context"
	"time"

	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/utils/event"
)

func (s *grpcServer) ConsumeMedia(r *proto.ConsumeMediaRequest, stream proto.JungleTV_ConsumeMediaServer) error {
	user := UserClaimsFromContext(stream.Context())
	err := stream.Send(s.produceNowPlayingCheckpoint(stream.Context()))
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	onRewardedC := make(<-chan []interface{})
	if user != nil {
		spectator, err := s.rewardsHandler.RegisterSpectator(stream.Context(), user)
		if err != nil {
			return stacktrace.Propagate(err, "")
		}
		onRewarded := spectator.OnRewarded()
		onRewardedC = onRewarded.Subscribe(event.AtLeastOnceGuarantee)
		defer onRewarded.Unsubscribe(onRewardedC)
		defer s.rewardsHandler.UnregisterSpectator(stream.Context(), spectator)
	}
	statsCleanup, err := s.statsHandler.RegisterSpectator(stream.Context())
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	defer statsCleanup()

	t := time.NewTicker(3 * time.Second)
	// if we set this ticker to e.g. 10 seconds, it seems to be too long and CloudFlare or something drops connection :(

	onMediaChanged := s.mediaQueue.mediaChanged.Subscribe(event.AtLeastOnceGuarantee)
	defer s.mediaQueue.mediaChanged.Unsubscribe(onMediaChanged)
	for {
		var reward *string
		select {
		case <-t.C:
			break
		case <-onMediaChanged:
			break
		case v := <-onRewardedC:
			s := v[0].(Amount).String()
			reward = &s
		case <-stream.Context().Done():
			s.log.Println("ConsumeMedia done")
			return nil
		}
		cp := s.produceNowPlayingCheckpoint(stream.Context())
		cp.Reward = reward
		err := stream.Send(cp)
		if err != nil {
			return stacktrace.Propagate(err, "")
		}
	}
}

func (s *grpcServer) produceNowPlayingCheckpoint(ctx context.Context) *proto.NowPlayingCheckpoint {
	cp := s.mediaQueue.ProduceCheckpointForAPI()
	cp.CurrentlyWatching = uint32(s.statsHandler.CurrentlyWatching(ctx))
	return cp
}
