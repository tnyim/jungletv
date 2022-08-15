package server

import (
	"context"
	"sync"
	"time"

	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/proto"
	authinterceptor "github.com/tnyim/jungletv/server/interceptors/auth"
	"github.com/tnyim/jungletv/utils/event"
)

func (s *grpcServer) ConsumeMedia(r *proto.ConsumeMediaRequest, stream proto.JungleTV_ConsumeMediaServer) error {
	// stream.Send is not safe to be called on concurrent goroutines
	streamSendLock := sync.Mutex{}
	var initialActivityChallenge *activityChallenge
	send := func(cp *proto.MediaConsumptionCheckpoint) error {
		streamSendLock.Lock()
		defer streamSendLock.Unlock()
		if initialActivityChallenge != nil {
			cp.ActivityChallenge = initialActivityChallenge.SerializeForAPI()
			initialActivityChallenge = nil
		}
		return stream.Send(cp)
	}

	counter, err := s.getAnnouncementsCounter(stream.Context())
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	user := authinterceptor.UserClaimsFromContext(stream.Context())
	initialCp := s.produceMediaConsumptionCheckpoint(stream.Context(), true)
	v := uint32(counter.CounterValue)
	initialCp.LatestAnnouncement = &v
	err = stream.Send(initialCp)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	errChan := make(chan error)

	if user != nil {
		spectator, err := s.rewardsHandler.RegisterSpectator(stream.Context(), user)
		if err != nil {
			return stacktrace.Propagate(err, "")
		}

		// SubscribeUsingCallback returns a function that unsubscribes when called. That's the reason for the defers

		defer spectator.OnRewarded().SubscribeUsingCallback(event.AtLeastOnceGuarantee, func(args spectatorRewardedEventArgs) {
			cp := s.produceMediaConsumptionCheckpoint(stream.Context(), false)
			s := args.reward.String()
			cp.Reward = &s
			s2 := args.rewardBalance.String()
			cp.RewardBalance = &s2
			err := send(cp)
			if err != nil {
				errChan <- stacktrace.Propagate(err, "")
			}
		})()

		defer spectator.OnWithdrew().SubscribeUsingCallback(event.AtLeastOnceGuarantee, func() {
			cp := s.produceMediaConsumptionCheckpoint(stream.Context(), false)
			s2 := "0"
			cp.RewardBalance = &s2
			err := send(cp)
			if err != nil {
				errChan <- stacktrace.Propagate(err, "")
			}
		})()

		initialActivityChallenge = spectator.CurrentActivityChallenge()
		defer spectator.OnActivityChallenge().SubscribeUsingCallback(event.AtLeastOnceGuarantee, func(challenge *activityChallenge) {
			cp := s.produceMediaConsumptionCheckpoint(stream.Context(), false)
			cp.ActivityChallenge = challenge.SerializeForAPI()
			err := send(cp)
			if err != nil {
				errChan <- stacktrace.Propagate(err, "")
			}
		})()

		defer spectator.OnChatMentioned().SubscribeUsingCallback(event.AtLeastOnceGuarantee, func() {
			cp := s.produceMediaConsumptionCheckpoint(stream.Context(), false)
			t := true
			cp.HasChatMention = &t
			err := send(cp)
			if err != nil {
				errChan <- stacktrace.Propagate(err, "")
			}
		})()

		defer s.rewardsHandler.UnregisterSpectator(stream.Context(), spectator)
	}

	defer s.announcementsUpdated.SubscribeUsingCallback(event.AtLeastOnceGuarantee, func(counterValue int) {
		cp := s.produceMediaConsumptionCheckpoint(stream.Context(), false)
		v := uint32(counterValue)
		cp.LatestAnnouncement = &v
		err := send(cp)
		if err != nil {
			errChan <- stacktrace.Propagate(err, "")
		}
	})()

	statsCleanup, err := s.statsRegistry.RegisterSpectator(stream.Context())
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	defer statsCleanup()

	t := time.NewTicker(3 * time.Second)
	defer t.Stop()
	// if we set this ticker to e.g. 10 seconds, it seems to be too long and CloudFlare or something drops connection :(

	onMediaChanged, mediaChangedU := s.mediaQueue.MediaChanged().Subscribe(event.AtLeastOnceGuarantee)
	defer mediaChangedU()
	sendTitle := false
	lastTitleSend := time.Now()
	for {
		select {
		case <-t.C:
			// unblock loop
		case <-onMediaChanged:
			sendTitle = true
			// unblock loop
		case <-stream.Context().Done():
			return nil
		case err := <-errChan:
			return err
		}
		now := time.Now()
		if now.Sub(lastTitleSend) > 30*time.Second {
			sendTitle = true
		}
		if sendTitle {
			lastTitleSend = now
		}
		err := send(s.produceMediaConsumptionCheckpoint(stream.Context(), sendTitle))
		if err != nil {
			return stacktrace.Propagate(err, "")
		}
		sendTitle = false
	}
}

func (s *grpcServer) produceMediaConsumptionCheckpoint(ctx context.Context, needsTitle bool) *proto.MediaConsumptionCheckpoint {
	cp := s.mediaQueue.ProduceCheckpointForAPI(ctx, s.userSerializer, needsTitle)
	cp.CurrentlyWatching = uint32(s.statsRegistry.CurrentlyWatching())
	return cp
}
