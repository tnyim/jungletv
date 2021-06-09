package server

import (
	"context"
	"time"

	"github.com/palantir/stacktrace"
	uuid "github.com/satori/go.uuid"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/utils/event"
)

var spectatorInactivityTimeout = 10 * time.Minute

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

func (r *RewardsHandler) produceActivityChallenge(spectator *spectator) {
	r.spectatorsMutex.Lock()
	defer r.spectatorsMutex.Unlock()
	if spectator.activityChallenge != "" {
		// avoid keeping around old challenges for the same spectator
		delete(r.spectatorByActivityChallenge, spectator.activityChallenge)
	}
	spectator.activityChallenge = uuid.NewV4().String()

	r.spectatorByActivityChallenge[spectator.activityChallenge] = spectator
	spectator.onActivityChallenge.Notify(spectator.activityChallenge)
}

func (r *RewardsHandler) SolveActivityChallenge(ctx context.Context, challenge string) error {
	r.spectatorsMutex.Lock()
	defer r.spectatorsMutex.Unlock()

	spectator, present := r.spectatorByActivityChallenge[challenge]
	if !present {
		return stacktrace.NewError("invalid challenge")
	}
	if RemoteAddressFromContext(ctx) != spectator.remoteAddress {
		return stacktrace.NewError("mismatched remote address")
	}
	spectator.lastActive = time.Now()
	spectator.activityCheckTimer.Stop()
	spectator.activityCheckTimer.Reset(spectatorInactivityTimeout)
	spectator.activityChallenge = ""

	delete(r.spectatorByActivityChallenge, challenge)
	return nil
}
