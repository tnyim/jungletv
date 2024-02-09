package rewards

import (
	"context"
	"errors"
	"math/rand"
	"strings"
	"time"

	"github.com/palantir/stacktrace"
	uuid "github.com/satori/go.uuid"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/server/auth"
	authinterceptor "github.com/tnyim/jungletv/server/interceptors/auth"
	"github.com/tnyim/jungletv/types"
	"github.com/tnyim/jungletv/utils"
	"github.com/tnyim/jungletv/utils/event"
	"github.com/tnyim/jungletv/utils/transaction"
	"golang.org/x/exp/slices"
)

func spectatorActivityWatchdog(ctx context.Context, spectator *spectator, r *Handler) {
	// this function runs once per spectator
	// it keeps running until all connections of the spectator disconnect
	// (the spectator will keep existing in memory for a while, they just won't have an activity watchdog)
	disconnected, onDisconnectedU := spectator.onDisconnected.Subscribe(event.BufferFirst)
	defer onDisconnectedU()
	reconnected, onReconnectedU := spectator.onReconnected.Subscribe(event.BufferFirst)
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

func (r *Handler) durationUntilNextActivityChallenge(ctx context.Context, user auth.User, first bool) (time.Duration, error) {
	activelyModerating := false
	if auth.UserPermissionLevelIsAtLeast(user, auth.AdminPermissionLevel) {
		activelyModerating = r.staffActivityManager.IsActivelyModerating(user)
		if !activelyModerating {
			// exempt admins/moderators from activity challenges
			return 100 * 24 * time.Hour, nil
		}
	}

	if first {
		if time.Since(serverStartedAt) < 2*time.Minute {
			return 1*time.Minute + time.Duration(rand.Intn(180))*time.Second, nil
		}
		return 10*time.Second + time.Duration(rand.Intn(20))*time.Second, nil
	}

	subscribed, err := r.pointsManager.IsUserCurrentlySubscribed(ctx, user)
	if err != nil {
		return 0, stacktrace.Propagate(err, "")
	}
	if subscribed && !activelyModerating {
		return 42*time.Minute + time.Duration(rand.Intn(480)*int(time.Second)), nil
	}
	return 16*time.Minute + time.Duration(rand.Intn(360))*time.Second, nil
}

func (r *Handler) minDurationBetweenActivityChallengePointsReward(ctx context.Context, user auth.User) (time.Duration, error) {
	subscribed, err := r.pointsManager.IsUserCurrentlySubscribed(ctx, user)
	if err != nil {
		return 0, stacktrace.Propagate(err, "")
	}
	min := 16 * time.Minute
	if subscribed {
		min = 42 * time.Minute
	}
	s := time.Since(serverStartedAt)
	if s < min {
		return s, nil
	}
	return min, nil
}

func (r *Handler) produceActivityChallenge(ctx context.Context, spectator *spectator) {
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
		spectator.activityChallenge = &ActivityChallenge{
			ID:           uuid.NewV4().String(),
			ChallengedAt: time.Now(),
			Types:        []ActivityChallengeType{ActivityChallengeTypeModerating},
			Tolerance:    2 * time.Minute,
		}
		r.staffActivityManager.MarkAsActivityChallenged(ctx, spectator.user, spectator.activityChallenge.Tolerance)
	} else {
		spectator.activityChallenge = &ActivityChallenge{
			ID:           uuid.NewV4().String(),
			ChallengedAt: time.Now(),
			Types:        []ActivityChallengeType{ActivityChallengeTypeButton},
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
			spectator.activityChallenge.Types = append(spectator.activityChallenge.Types, ActivityChallengeTypeSegcha)
			spectator.activityChallenge.Tolerance = 2 * time.Minute
		}
		/*
			Turnstile challenges temporarily disabled until pass rate issues for mobile users can be investigated

			if spectator.lastHardChallengeSolvedAt.IsZero() {
				spectator.activityChallenge.Types = append(spectator.activityChallenge.Types, ActivityChallengeTypeTurnstile)
			}
		*/
	}
	if hadChallenge || spectator.noToleranceOnNextChallenge {
		spectator.activityChallenge.Tolerance = 0
		spectator.noToleranceOnNextChallenge = false
	}

	r.spectatorByActivityChallenge[spectator.activityChallenge.ID] = spectator
	spectator.onActivityChallenge.Notify(spectator.activityChallenge, true)
}

func (r *Handler) SolveActivityChallenge(ctxCtx context.Context, challenge string, checkResponses []string, trusted bool, clientVersion string) (skippedClientIntegrityChecks bool, err error) {
	var spectator *spectator
	var timeUntilChallengeResponse time.Duration
	r.spectatorsMutex.Lock()
	defer r.spectatorsMutex.Unlock()

	remoteAddress := authinterceptor.RemoteAddressFromContext(ctxCtx)

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

	legitimateAsOfThisChallenge := trusted && clientVersion == r.versionHashGetter()
	skipsIntegrityChecks, err := r.moderationStore.LoadPaymentAddressSkipsClientIntegrityChecks(ctxCtx, spectator.user.Address())
	if err != nil {
		r.log.Println(stacktrace.Propagate(err, ""))
	} else if skipsIntegrityChecks {
		legitimateAsOfThisChallenge = true
	}
	type checkData struct {
		checkFn  ChallengeCheckFunction
		response string
	}
	var checks []checkData
	cursor := 0
	for _, challengeType := range spectator.activityChallenge.Types {
		checkFn, ok := r.challengeCheckers[challengeType]
		if !ok {
			// this challenge type does not need/cannot be checked
			continue
		}
		data := checkData{
			checkFn: checkFn,
		}
		if cursor < len(checkResponses) {
			data.response = checkResponses[cursor]
		}
		cursor++
		checks = append(checks, data)
	}

	captchaValid := true
	for _, checkData := range checks {
		thisValid, err := checkData.checkFn(ctxCtx, spectator.activityChallenge, checkData.response)
		if err != nil {
			r.log.Println("Error verifying activity challenge:", err)
		}
		captchaValid = captchaValid && thisValid && err == nil
	}
	legitimateAsOfThisChallenge = legitimateAsOfThisChallenge && captchaValid
	if !captchaValid && err == nil {
		// if not valid, do everything except mark the spectator as legitimate.
		// this way, they'll stop receiving rewards until the next challenge
		r.log.Println("Activity challenge verification for spectator", spectator.user.Address(), spectator.remoteAddress, "failed after", timeUntilChallengeResponse)
	} else if captchaValid && len(checks) > 0 {
		spectator.lastHardChallengeSolvedAt = now
	}

	if legitimateAsOfThisChallenge {
		r.log.Println("Spectator", spectator.user.Address(), spectator.remoteAddress,
			"solved", strings.Join(utils.CastStringLikeSlice[ActivityChallengeType, string](spectator.activityChallenge.Types), ", "),
			"activity challenge after", timeUntilChallengeResponse)
		if !spectator.legitimate && now.Sub(spectator.stoppedBeingLegitimate) > time.Duration(spectator.legitimacyFailures)*time.Hour {
			// give spectator another chance
			spectator.legitimate = true
			spectator.stoppedBeingLegitimate = time.Time{}
			r.log.Println("Spectator", spectator.user.Address(), spectator.remoteAddress, "given another legitimacy chance")
		}
	} else if spectator.legitimate && !legitimateAsOfThisChallenge {
		spectator.legitimate = false
		spectator.legitimacyFailures++
		spectator.stoppedBeingLegitimate = now
		r.log.Println("Spectator", spectator.user.Address(), spectator.remoteAddress, "considered not legitimate")
	}

	d, err := r.durationUntilNextActivityChallenge(ctxCtx, spectator.user, false)
	if err != nil {
		return skipsIntegrityChecks, stacktrace.Propagate(err, "")
	}

	spectator.nextActivityCheckTime = now.Add(d)
	spectator.activityCheckTimer.Reset(d)
	spectator.activityChallenge = nil

	delete(r.spectatorByActivityChallenge, challenge)
	r.staffActivityManager.MarkAsStillActive(spectator.user)

	err = r.awardPointsForCompletedChallenge(ctxCtx, spectator.user)
	return skipsIntegrityChecks, stacktrace.Propagate(err, "")
}

func (r *Handler) awardPointsForCompletedChallenge(ctxCtx context.Context, user auth.User) error {
	subscribed, err := r.pointsManager.IsUserCurrentlySubscribed(ctxCtx, user)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	reward := 10
	if subscribed {
		reward = 22
	}

	minSpanForReward, err := r.minDurationBetweenActivityChallengePointsReward(ctxCtx, user)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	defer ctx.Rollback()

	lastActivityChallengeReward, err := types.GetLatestPointsTxOfTypeForAddress(ctx, types.PointsTxTypeActivityChallengeReward, user.Address())
	if err != nil && !errors.Is(err, types.ErrPointsTxNotFound) {
		return stacktrace.Propagate(err, "")
	}

	if errors.Is(err, types.ErrPointsTxNotFound) || lastActivityChallengeReward == nil || time.Since(lastActivityChallengeReward.UpdatedAt) > minSpanForReward {
		_, err = r.pointsManager.CreateTransaction(ctx, user, types.PointsTxTypeActivityChallengeReward, reward)
		if err != nil {
			return stacktrace.Propagate(err, "")
		}
	}
	return stacktrace.Propagate(ctx.Commit(), "")
}

func (r *Handler) markAddressAsActiveIfNotChallenged(ctx context.Context, address string) error {
	r.spectatorsMutex.Lock()
	defer r.spectatorsMutex.Unlock()

	spectator, ok := r.spectatorsByRewardAddress[address]
	if ok && spectator.activityChallenge == nil {
		d, err := r.durationUntilNextActivityChallenge(ctx, spectator.user, false)
		if err != nil {
			return stacktrace.Propagate(err, "")
		}
		spectator.nextActivityCheckTime = time.Now().Add(d)
		spectator.activityCheckTimer.Reset(d)
	}
	return nil
}

func (r *Handler) MarkAddressAsActiveEvenIfChallenged(ctx context.Context, address string) error {
	r.spectatorsMutex.Lock()
	defer r.spectatorsMutex.Unlock()

	spectator, ok := r.spectatorsByRewardAddress[address]
	if ok {
		d, err := r.durationUntilNextActivityChallenge(ctx, spectator.user, false)
		if err != nil {
			return stacktrace.Propagate(err, "")
		}

		spectator.nextActivityCheckTime = time.Now().Add(d)
		spectator.activityCheckTimer.Reset(d)

		if spectator.activityChallenge != nil {
			delete(r.spectatorByActivityChallenge, spectator.activityChallenge.ID)
		}
		spectator.activityChallenge = nil
	}
	return nil
}

func (r *Handler) MarkAddressAsNotLegitimate(ctx context.Context, address string) {
	r.spectatorsMutex.RLock()
	defer r.spectatorsMutex.RUnlock()

	spectator, ok := r.spectatorsByRewardAddress[address]
	if !ok {
		return
	}
	spectator.legitimate = false
	r.log.Println("Spectator", spectator.user.Address(), spectator.remoteAddress, "marked as not legitimate")
}

func (r *Handler) SpectatorHasActivityChallenge(address string, challengeType ActivityChallengeType) bool {
	r.spectatorsMutex.RLock()
	defer r.spectatorsMutex.RUnlock()

	spectator, present := r.spectatorsByRewardAddress[address]
	if !present || spectator.activityChallenge == nil {
		return false
	}
	return slices.Contains(spectator.activityChallenge.Types, challengeType)
}

func (r *Handler) ResetAddressLegitimacyStatus(ctx context.Context, address string) error {
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

func (r *Handler) GetSpectatorActivityStatus(address string) proto.UserStatus {
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
