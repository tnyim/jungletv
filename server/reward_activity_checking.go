package server

import (
	"context"
	"math/rand"
	"time"

	"github.com/palantir/stacktrace"
	uuid "github.com/satori/go.uuid"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/server/auth"
	authinterceptor "github.com/tnyim/jungletv/server/interceptors/auth"
	"github.com/tnyim/jungletv/types"
	"github.com/tnyim/jungletv/utils/event"
)

func (s *grpcServer) SubmitActivityChallenge(ctx context.Context, r *proto.SubmitActivityChallengeRequest) (*proto.SubmitActivityChallengeResponse, error) {
	skippedClientIntegrityChecks, err := s.rewardsHandler.SolveActivityChallenge(ctx, r.Challenge, r.CaptchaResponse, r.Trusted, r.ClientVersion)
	return &proto.SubmitActivityChallengeResponse{
		SkippedClientIntegrityChecks: skippedClientIntegrityChecks,
	}, stacktrace.Propagate(err, "")
}

func spectatorActivityWatchdog(ctx context.Context, spectator *spectator, r *RewardsHandler) {
	// this function runs once per spectator
	// it keeps running until all connections of the spectator disconnect
	// (the spectator will keep existing in memory for a while, they just won't have an activity watchdog)
	disconnected, onDisconnectedU := spectator.onDisconnected.Subscribe(event.AtLeastOnceGuarantee)
	defer onDisconnectedU()
	reconnected, onReconnectedU := spectator.onReconnected.Subscribe(event.AtLeastOnceGuarantee)
	defer onReconnectedU()
	for {
		select {
		case <-reconnected:
			// this lets us refresh the activityCheckTimer channel
			continue
		case <-spectator.activityCheckTimer.C:
			r.produceActivityChallenge(ctx, spectator)
		case <-disconnected:
			return
		}
	}
}

var serverStartedAt = time.Now()

func (r *RewardsHandler) durationUntilNextActivityChallenge(user auth.User, first bool) time.Duration {
	if auth.UserPermissionLevelIsAtLeast(user, auth.AdminPermissionLevel) && !r.staffActivityManager.IsActivelyModerating(user) {
		// exempt admins/moderators from activity challenges
		return 100 * 24 * time.Hour
	}
	if first {
		if time.Since(serverStartedAt) < 2*time.Minute {
			return 1*time.Minute + time.Duration(rand.Intn(180))*time.Second
		}
		return 10*time.Second + time.Duration(rand.Intn(20))*time.Second
	}
	return 16*time.Minute + time.Duration(rand.Intn(360))*time.Second
}

func (r *RewardsHandler) produceActivityChallenge(ctx context.Context, spectator *spectator) {
	hadChallengeStr := ""
	defer r.log.Println("Produced activity challenge for spectator", spectator.user.Address(), spectator.remoteAddress, hadChallengeStr)
	r.spectatorsMutex.Lock()
	defer r.spectatorsMutex.Unlock()
	hadChallenge := spectator.activityChallenge != nil
	if hadChallenge {
		hadChallengeStr = "(had previous challenge)"
		// avoid keeping around old challenges for the same spectator
		delete(r.spectatorByActivityChallenge, spectator.activityChallenge.ID)
	}
	if r.staffActivityManager.IsActivelyModerating(spectator.user) {
		spectator.activityChallenge = &activityChallenge{
			ID:           uuid.NewV4().String(),
			ChallengedAt: time.Now(),
			Type:         "moderating",
			Tolerance:    2 * time.Minute,
		}
		r.staffActivityManager.MarkAsActivityChallenged(spectator.user, spectator.activityChallenge.Tolerance)
	} else {
		spectator.activityChallenge = &activityChallenge{
			ID:           uuid.NewV4().String(),
			ChallengedAt: time.Now(),
			Type:         "button",
			Tolerance:    1 * time.Minute,
		}
		hardChallengeInterval := 1 * time.Hour
		hasReduced, err := r.moderationStore.LoadPaymentAddressHasReducedHardChallengeFrequency(ctx, spectator.user.Address())
		if err != nil {
			r.log.Println(stacktrace.Propagate(err, ""))
		} else if hasReduced {
			hardChallengeInterval = 3 * time.Hour
		}

		if time.Since(spectator.lastHardChallengeSolvedAt) > hardChallengeInterval {
			spectator.activityChallenge.Type = "segcha"
			spectator.activityChallenge.Tolerance = 2 * time.Minute
		}
	}
	if hadChallenge || spectator.noToleranceOnNextChallenge {
		spectator.activityChallenge.Tolerance = 0
		spectator.noToleranceOnNextChallenge = false
	}

	r.spectatorByActivityChallenge[spectator.activityChallenge.ID] = spectator
	spectator.onActivityChallenge.Notify(spectator.activityChallenge)
}

func (r *RewardsHandler) SolveActivityChallenge(ctx context.Context, challenge, captchaResponse string, trusted bool, clientVersion string) (skippedClientIntegrityChecks bool, err error) {
	var spectator *spectator
	var timeUntilChallengeResponse time.Duration
	var captchaValid bool
	r.spectatorsMutex.Lock()
	defer r.spectatorsMutex.Unlock()

	remoteAddress := authinterceptor.RemoteAddressFromContext(ctx)

	var present bool
	spectator, present = r.spectatorByActivityChallenge[challenge]
	if !present {
		r.log.Println("Unidentified spectator with remote address ", remoteAddress, "submitted a solution to a missing challenge:", challenge)
		return false, stacktrace.NewError("invalid challenge")
	}
	if _, found := spectator.remoteAddresses[remoteAddress]; !found {
		r.log.Println("Spectator", spectator.user.Address(), remoteAddress, "submitted a challenge solution from a mismatched remote address:", spectator.remoteAddress)
		return false, stacktrace.NewError("mismatched remote address")
	}

	now := time.Now()
	timeUntilChallengeResponse = now.Sub(spectator.activityChallenge.ChallengedAt)

	newLegitimate := trusted && clientVersion == r.versionHash
	skipsIntegrityChecks, err := r.moderationStore.LoadPaymentAddressSkipsClientIntegrityChecks(ctx, spectator.user.Address())
	if err != nil {
		r.log.Println(stacktrace.Propagate(err, ""))
	} else if skipsIntegrityChecks {
		newLegitimate = true
	}
	var checkFn captchaResponseCheckFn
	switch spectator.activityChallenge.Type {
	case "segcha":
		checkFn = r.segchaCheckFn
	}
	if checkFn != nil {
		captchaValid, err = checkFn(ctx, captchaResponse)
		if err != nil {
			r.log.Println("Error verifying captcha:", err)
		}
		newLegitimate = newLegitimate && err == nil && captchaValid
		if !captchaValid && err == nil {
			// if not valid, do everything except mark the spectator as legitimate.
			// this way, they'll stop receiving rewards until the next challenge
			r.log.Println("Activity challenge captcha verification for spectator", spectator.user.Address(), spectator.remoteAddress, "failed after", timeUntilChallengeResponse)
		} else if captchaValid {
			spectator.lastHardChallengeSolvedAt = now
		}
	}

	if newLegitimate {
		r.log.Println("Spectator", spectator.user.Address(), spectator.remoteAddress,
			"solved", spectator.activityChallenge.Type,
			"activity challenge after", timeUntilChallengeResponse)
		if !spectator.legitimate && now.Sub(spectator.stoppedBeingLegitimate) > time.Duration(spectator.legitimacyFailures)*time.Hour {
			// give spectator another chance
			spectator.legitimate = true
			spectator.stoppedBeingLegitimate = time.Time{}
			r.log.Println("Spectator", spectator.user.Address(), spectator.remoteAddress, "given another legitimacy chance")
		}
	} else if spectator.legitimate && !newLegitimate {
		spectator.legitimate = false
		spectator.legitimacyFailures++
		spectator.stoppedBeingLegitimate = now
		r.log.Println("Spectator", spectator.user.Address(), spectator.remoteAddress, "considered not legitimate")
	}

	d := r.durationUntilNextActivityChallenge(spectator.user, false)
	spectator.nextActivityCheckTime = now.Add(d)
	spectator.activityCheckTimer.Reset(d)
	spectator.activityChallenge = nil

	delete(r.spectatorByActivityChallenge, challenge)
	r.staffActivityManager.MarkAsStillActive(spectator.user)

	err = r.pointsManager.CreateTransaction(ctx, spectator.user, types.PointsTxTypeActivityChallengeReward, 10)
	if err != nil {
		return skipsIntegrityChecks, stacktrace.Propagate(err, "")
	}

	return skipsIntegrityChecks, nil
}

func (r *RewardsHandler) markAddressAsActiveIfNotChallenged(ctx context.Context, address string) {
	r.spectatorsMutex.Lock()
	defer r.spectatorsMutex.Unlock()

	spectator, ok := r.spectatorsByRewardAddress[address]
	if ok && spectator.activityChallenge == nil {
		d := r.durationUntilNextActivityChallenge(spectator.user, false)
		spectator.nextActivityCheckTime = time.Now().Add(d)
		spectator.activityCheckTimer.Reset(d)
	}
}

func (r *RewardsHandler) MarkAddressAsActiveEvenIfChallenged(address string) {
	r.spectatorsMutex.Lock()
	defer r.spectatorsMutex.Unlock()

	spectator, ok := r.spectatorsByRewardAddress[address]
	if ok {
		d := r.durationUntilNextActivityChallenge(spectator.user, false)
		spectator.nextActivityCheckTime = time.Now().Add(d)
		spectator.activityCheckTimer.Reset(d)

		if spectator.activityChallenge != nil {
			delete(r.spectatorByActivityChallenge, spectator.activityChallenge.ID)
		}
		spectator.activityChallenge = nil
	}
}

func (r *RewardsHandler) MarkAddressAsNotLegitimate(ctx context.Context, address string) {
	r.spectatorsMutex.RLock()
	defer r.spectatorsMutex.RUnlock()

	spectator, ok := r.spectatorsByRewardAddress[address]
	if !ok {
		return
	}
	spectator.legitimate = false
	r.log.Println("Spectator", spectator.user.Address(), spectator.remoteAddress, "marked as not legitimate")
}

func (r *RewardsHandler) SpectatorHasActivityChallenge(address string, challengeType string) bool {
	r.spectatorsMutex.RLock()
	defer r.spectatorsMutex.RUnlock()

	spectator, present := r.spectatorsByRewardAddress[address]
	if !present || spectator.activityChallenge == nil {
		return false
	}
	return spectator.activityChallenge.Type == challengeType
}

func (r *RewardsHandler) ResetAddressLegitimacyStatus(ctx context.Context, address string) error {
	r.spectatorsMutex.RLock()
	defer r.spectatorsMutex.RUnlock()

	spectator, ok := r.spectatorsByRewardAddress[address]
	if !ok {
		return stacktrace.NewError("spectator not found")
	}
	spectator.legitimate = true
	spectator.noToleranceOnNextChallenge = false
	r.log.Println("Spectator", spectator.user.Address(), spectator.remoteAddress, "legitimacy status reset")
	return nil
}

func (r *RewardsHandler) GetSpectatorActivityStatus(address string) proto.UserStatus {
	r.spectatorsMutex.RLock()
	defer r.spectatorsMutex.RUnlock()

	spectator, ok := r.spectatorsByRewardAddress[address]
	if !ok {
		return proto.UserStatus_USER_STATUS_OFFLINE
	}

	if spectator.activityChallenge != nil && time.Since(spectator.activityChallenge.ChallengedAt) > spectator.activityChallenge.Tolerance {
		return proto.UserStatus_USER_STATUS_AWAY
	}

	return proto.UserStatus_USER_STATUS_WATCHING
}
