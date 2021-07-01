package server

import (
	"context"
	"math/rand"
	"time"

	"github.com/palantir/stacktrace"
	uuid "github.com/satori/go.uuid"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/utils/event"
)

var activityChallengeTolerance = 1 * time.Minute

func (s *grpcServer) SubmitActivityChallenge(ctx context.Context, r *proto.SubmitActivityChallengeRequest) (*proto.SubmitActivityChallengeResponse, error) {
	return &proto.SubmitActivityChallengeResponse{}, s.rewardsHandler.SolveActivityChallenge(ctx, r.Challenge)
}

func spectatorActivityWatchdog(spectator *spectator, r *RewardsHandler) {
	disconnected := spectator.onDisconnected.Subscribe(event.AtLeastOnceGuarantee)
	defer spectator.onDisconnected.Unsubscribe(disconnected)
	for {
		select {
		case <-spectator.activityCheckTimer.C:
			r.produceActivityChallenge(spectator)
		case <-disconnected:
			return
		}
	}
}

func durationUntilNextActivityChallenge() time.Duration {
	return 8*time.Minute + time.Duration(rand.Intn(360))*time.Second
}

func (r *RewardsHandler) produceActivityChallenge(spectator *spectator) {
	defer r.log.Println("Produced activity challenge for spectator", spectator.user.Address(), spectator.remoteAddress)
	r.spectatorsMutex.Lock()
	defer r.spectatorsMutex.Unlock()
	if spectator.activityChallenge != "" {
		// avoid keeping around old challenges for the same spectator
		delete(r.spectatorByActivityChallenge, spectator.activityChallenge)
	}
	spectator.activityChallengeAt = time.Now()
	spectator.activityChallenge = uuid.NewV4().String()

	r.spectatorByActivityChallenge[spectator.activityChallenge] = spectator
	spectator.onActivityChallenge.Notify(spectator.activityChallenge)
}

func (r *RewardsHandler) SolveActivityChallenge(ctx context.Context, challenge string) (err error) {
	var spectator *spectator
	var timeUntilChallengeSolved time.Duration
	defer func() {
		if err == nil && spectator != nil {
			r.log.Println("Spectator", spectator.user.Address(), spectator.remoteAddress, "solved activity challenge after", timeUntilChallengeSolved)
		}
	}()
	r.spectatorsMutex.Lock()
	defer r.spectatorsMutex.Unlock()

	var present bool
	spectator, present = r.spectatorByActivityChallenge[challenge]
	if !present {
		return stacktrace.NewError("invalid challenge")
	}
	if RemoteAddressFromContext(ctx) != spectator.remoteAddress {
		return stacktrace.NewError("mismatched remote address")
	}
	spectator.lastActive = time.Now()
	spectator.activityCheckTimer.Stop()
	spectator.activityCheckTimer.Reset(durationUntilNextActivityChallenge())
	timeUntilChallengeSolved = time.Since(spectator.activityChallengeAt)
	spectator.activityChallengeAt = time.Time{}
	spectator.activityChallenge = ""

	delete(r.spectatorByActivityChallenge, challenge)
	return nil
}
