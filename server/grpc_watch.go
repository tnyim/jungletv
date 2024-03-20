package server

import (
	"context"
	"time"

	"github.com/palantir/stacktrace"
	"github.com/samber/lo"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/server/components/notificationmanager"
	"github.com/tnyim/jungletv/server/components/rewards"
	authinterceptor "github.com/tnyim/jungletv/server/interceptors/auth"
	"github.com/tnyim/jungletv/server/media"
	"github.com/tnyim/jungletv/utils/event"
	"google.golang.org/protobuf/types/known/timestamppb"
)

func (s *grpcServer) ConsumeMedia(r *proto.ConsumeMediaRequest, stream proto.JungleTV_ConsumeMediaServer) error {
	cpChan := make(chan *proto.MediaConsumptionCheckpoint, 3)

	user := authinterceptor.UserClaimsFromContext(stream.Context())

	var initialActivityChallenge *rewards.ActivityChallenge
	if user != nil && !user.IsUnknown() {
		spectator, err := s.rewardsHandler.RegisterSpectator(stream.Context(), user)
		if err != nil {
			return stacktrace.Propagate(err, "")
		}

		initialActivityChallenge = spectator.CurrentActivityChallenge()
		defer spectator.OnActivityChallenge().SubscribeUsingCallback(event.BufferFirst, func(challenge *rewards.ActivityChallenge) {
			cp := s.produceMediaConsumptionCheckpoint(stream.Context(), false)
			cp.ActivityChallenge = challenge.SerializeForAPI()
			cpChan <- cp
		})()

		defer s.rewardsHandler.UnregisterSpectator(stream.Context(), spectator)
	}

	defer s.configManager.ClientConfigurationChanged().SubscribeUsingCallback(event.BufferAll, func(arg *proto.ConfigurationChange) {
		cp := s.produceMediaConsumptionCheckpoint(stream.Context(), false)
		cp.ConfigurationChanges = []*proto.ConfigurationChange{arg}
		cpChan <- cp
	})()

	// debounce notification sends because all persisted ones will come one after the next
	notificationsPendingSend := []*proto.Notification{}
	notificationsPendingSendSynchronizer := lo.Synchronize()
	notificationDebounce, cancel := lo.NewDebounce(100*time.Millisecond, func() {
		notificationsPendingSendSynchronizer.Do(func() {
			cp := s.produceMediaConsumptionCheckpoint(stream.Context(), false)
			cp.Notifications = notificationsPendingSend
			cpChan <- cp
			notificationsPendingSend = []*proto.Notification{}
		})
	})
	defer cancel()

	defer s.notificationManager.SubscribeToNotificationsForUser(user, func(n notificationmanager.Notification) {
		notificationsPendingSendSynchronizer.Do(func() {
			protoNotification := serializeNotification(n)
			notificationsPendingSend = append(notificationsPendingSend, protoNotification)
			notificationDebounce()
		})
	})()

	defer s.notificationManager.SubscribeToReadsForUser(user, func(key notificationmanager.PersistencyKey) {
		cp := s.produceMediaConsumptionCheckpoint(stream.Context(), false)
		cp.ClearedNotifications = append(cp.ClearedNotifications, string(key))
		cpChan <- cp
	})()

	onVersionHashChanged, versionHashChangedU := s.versionInterceptor.VersionHashUpdated().Subscribe(event.BufferFirst)
	defer versionHashChangedU()

	defer s.mediaQueue.MediaChanged().SubscribeUsingCallback(event.BufferFirst, func(_ media.QueueEntry) {
		cpChan <- s.produceMediaConsumptionCheckpoint(stream.Context(), true)
	})()

	statsCleanup, err := s.statsRegistry.RegisterSpectator(stream.Context())
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	defer statsCleanup()

	initialCp := s.produceMediaConsumptionCheckpoint(stream.Context(), true)
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

func serializeNotification(n notificationmanager.Notification) *proto.Notification {
	protoNotification := &proto.Notification{
		NotificationData: n.SerializeDataForAPI(),
	}
	if key, persistent := n.PersistencyKey(); persistent {
		protoNotification.Key = string(key)
		protoNotification.Expiration = timestamppb.New(n.Expiration())
	}
	return protoNotification
}
