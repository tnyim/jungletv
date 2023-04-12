package server

import (
	"context"
	"time"

	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/server/components/rewards"
	authinterceptor "github.com/tnyim/jungletv/server/interceptors/auth"
	"github.com/tnyim/jungletv/server/media"
	"github.com/tnyim/jungletv/utils/event"
)

func (s *grpcServer) ConsumeMedia(r *proto.ConsumeMediaRequest, stream proto.JungleTV_ConsumeMediaServer) error {
	cpChan := make(chan *proto.MediaConsumptionCheckpoint, 3)

	user := authinterceptor.UserClaimsFromContext(stream.Context())

	var initialActivityChallenge *rewards.ActivityChallenge
	if user != nil {
		spectator, err := s.rewardsHandler.RegisterSpectator(stream.Context(), user)
		if err != nil {
			return stacktrace.Propagate(err, "")
		}

		// SubscribeUsingCallback returns a function that unsubscribes when called. That's the reason for the defers

		defer spectator.OnRewarded().SubscribeUsingCallback(event.BufferFirst, func(args rewards.SpectatorRewardedEventArgs) {
			cp := s.produceMediaConsumptionCheckpoint(stream.Context(), false)
			s := args.Reward.String()
			cp.Reward = &s
			s2 := args.RewardBalance.String()
			cp.RewardBalance = &s2
			cpChan <- cp
		})()

		defer spectator.OnWithdrew().SubscribeUsingCallback(event.BufferFirst, func() {
			cp := s.produceMediaConsumptionCheckpoint(stream.Context(), false)
			s2 := "0"
			cp.RewardBalance = &s2
			cpChan <- cp
		})()

		initialActivityChallenge = spectator.CurrentActivityChallenge()
		defer spectator.OnActivityChallenge().SubscribeUsingCallback(event.BufferFirst, func(challenge *rewards.ActivityChallenge) {
			cp := s.produceMediaConsumptionCheckpoint(stream.Context(), false)
			cp.ActivityChallenge = challenge.SerializeForAPI()
			cpChan <- cp
		})()

		defer spectator.OnChatMentioned().SubscribeUsingCallback(event.BufferFirst, func() {
			cp := s.produceMediaConsumptionCheckpoint(stream.Context(), false)
			t := true
			cp.HasChatMention = &t
			cpChan <- cp
		})()

		defer s.rewardsHandler.UnregisterSpectator(stream.Context(), spectator)
	}

	defer s.announcementsUpdated.SubscribeUsingCallback(event.BufferFirst, func(counterValue int) {
		cp := s.produceMediaConsumptionCheckpoint(stream.Context(), false)
		v := uint32(counterValue)
		cp.LatestAnnouncement = &v
		cpChan <- cp
	})()

	defer s.configManager.ClientConfigurationChanged().SubscribeUsingCallback(event.BufferAll, func(arg *proto.ConfigurationChange) {
		cp := s.produceMediaConsumptionCheckpoint(stream.Context(), false)
		cp.ConfigurationChanges = []*proto.ConfigurationChange{arg}
		cpChan <- cp
	})()

	onVersionHashChanged, versionHashChangedU := s.versionHashChanged.Subscribe(event.BufferFirst)
	defer versionHashChangedU()

	defer s.mediaQueue.MediaChanged().SubscribeUsingCallback(event.BufferFirst, func(_ media.QueueEntry) {
		cpChan <- s.produceMediaConsumptionCheckpoint(stream.Context(), true)
	})()

	statsCleanup, err := s.statsRegistry.RegisterSpectator(stream.Context())
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	defer statsCleanup()

	counter, err := s.getAnnouncementsCounter(stream.Context())
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	initialCp := s.produceMediaConsumptionCheckpoint(stream.Context(), true)
	v := uint32(counter.CounterValue)
	initialCp.LatestAnnouncement = &v
	initialCp.ConfigurationChanges = s.configManager.AllClientConfigurationChanges()
	if initialActivityChallenge != nil {
		initialCp.ActivityChallenge = initialActivityChallenge.SerializeForAPI()
	}
	err = stream.Send(initialCp)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	t := time.NewTicker(3 * time.Second)
	defer t.Stop()
	// if we set this ticker to e.g. 10 seconds, it seems to be too long and CloudFlare or something drops connection :(

	for {
		select {
		case <-t.C:
			err := stream.Send(s.produceMediaConsumptionCheckpoint(stream.Context(), false))
			if err != nil {
				return stacktrace.Propagate(err, "")
			}
		case cp := <-cpChan:
			err := stream.Send(cp)
			if err != nil {
				return stacktrace.Propagate(err, "")
			}
		case <-stream.Context().Done():
			return nil
		case <-onVersionHashChanged:
			return nil
		}
	}
}

func (s *grpcServer) produceMediaConsumptionCheckpoint(ctx context.Context, needsTitle bool) *proto.MediaConsumptionCheckpoint {
	cp := s.mediaQueue.ProduceCheckpointForAPI(ctx, s.userSerializer, needsTitle)
	cp.CurrentlyWatching = uint32(s.statsRegistry.CurrentlyWatching())
	return cp
}

func (s *grpcServer) SubmitActivityChallenge(ctx context.Context, r *proto.SubmitActivityChallengeRequest) (*proto.SubmitActivityChallengeResponse, error) {
	skippedClientIntegrityChecks, err := s.rewardsHandler.SolveActivityChallenge(ctx, r.Challenge, r.Responses, r.Trusted, r.ClientVersion)
	return &proto.SubmitActivityChallengeResponse{
		SkippedClientIntegrityChecks: skippedClientIntegrityChecks,
	}, stacktrace.Propagate(err, "")
}
