package server

import (
	"context"
	"encoding/json"
	"io/ioutil"
	"math/rand"
	"net/url"
	"time"

	"github.com/palantir/stacktrace"
	uuid "github.com/satori/go.uuid"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/server/auth"
	"github.com/tnyim/jungletv/utils/event"
)

func (s *grpcServer) SubmitActivityChallenge(ctx context.Context, r *proto.SubmitActivityChallengeRequest) (*proto.SubmitActivityChallengeResponse, error) {
	return &proto.SubmitActivityChallengeResponse{}, s.rewardsHandler.SolveActivityChallenge(ctx, r.Challenge, r.CaptchaResponse, r.Trusted)
}

func spectatorActivityWatchdog(spectator *spectator, r *RewardsHandler) {
	// this function runs once per spectator
	// it keeps running until all connections of the spectator disconnect
	// (the spectator will keep existing in memory for a while, they just won't have an activity watchdog)
	disconnected := spectator.onDisconnected.Subscribe(event.AtLeastOnceGuarantee)
	defer spectator.onDisconnected.Unsubscribe(disconnected)
	reconnected := spectator.onReconnected.Subscribe(event.AtLeastOnceGuarantee)
	defer spectator.onReconnected.Unsubscribe(reconnected)
	for {
		select {
		case <-reconnected:
			// this lets us refresh the activityCheckTimer channel
			continue
		case <-spectator.activityCheckTimer.C:
			r.produceActivityChallenge(spectator)
		case <-disconnected:
			return
		}
	}
}

func durationUntilNextActivityChallenge(user User, first bool) time.Duration {
	if UserPermissionLevelIsAtLeast(user, auth.AdminPermissionLevel) {
		// exempt admins/moderators from activity challenges
		return 100 * 24 * time.Hour
	}
	if first {
		return 10*time.Second + time.Duration(rand.Intn(20))*time.Second
	}
	return 16*time.Minute + time.Duration(rand.Intn(360))*time.Second
}

func (r *RewardsHandler) produceActivityChallenge(spectator *spectator) {
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
	spectator.activityChallenge = &activityChallenge{
		ID:           uuid.NewV4().String(),
		ChallengedAt: time.Now(),
		Type:         "button",
		Tolerance:    1 * time.Minute,
	}
	if spectator.hardChallengesSolved == 0 || int(time.Since(spectator.startedWatching).Hours()) > spectator.hardChallengesSolved-1 {
		spectator.activityChallenge.Type = "segcha"
		spectator.activityChallenge.Tolerance = 2 * time.Minute
	}
	if hadChallenge || spectator.noToleranceOnNextChallenge {
		spectator.activityChallenge.Tolerance = 0
		spectator.noToleranceOnNextChallenge = false
	}

	r.spectatorByActivityChallenge[spectator.activityChallenge.ID] = spectator
	spectator.onActivityChallenge.Notify(spectator.activityChallenge)
}

func (r *RewardsHandler) SolveActivityChallenge(ctx context.Context, challenge, hCaptchaResponse string, trusted bool) (err error) {
	var spectator *spectator
	var timeUntilChallengeResponse time.Duration
	var captchaValid bool
	r.spectatorsMutex.Lock()
	defer r.spectatorsMutex.Unlock()

	remoteAddress := auth.RemoteAddressFromContext(ctx)

	var present bool
	spectator, present = r.spectatorByActivityChallenge[challenge]
	if !present {
		r.log.Println("Unidentified spectator with remote address ", remoteAddress, "submitted a solution to a missing challenge:", challenge)
		return stacktrace.NewError("invalid challenge")
	}
	if _, found := spectator.remoteAddresses[remoteAddress]; !found {
		r.log.Println("Spectator", spectator.user.Address(), remoteAddress, "submitted a challenge solution from a mismatched remote address:", spectator.remoteAddress)
		return stacktrace.NewError("mismatched remote address")
	}

	timeUntilChallengeResponse = time.Since(spectator.activityChallenge.ChallengedAt)

	newLegitimate := trusted
	var checkFn captchaResponseCheckFn
	switch spectator.activityChallenge.Type {
	case "hCaptcha":
		checkFn = r.hCaptchaResponseValid
	case "segcha":
		checkFn = r.segchaCheckFn
	}
	if checkFn != nil {
		captchaValid, err = checkFn(ctx, hCaptchaResponse)
		if err != nil {
			r.log.Println("Error verifying captcha:", err)
		}
		newLegitimate = err == nil && captchaValid && trusted
		if !captchaValid && err == nil {
			// if not valid, do everything except mark the spectator as legitimate.
			// this way, they'll stop receiving rewards until the next challenge
			r.log.Println("Activity challenge captcha verification for spectator", spectator.user.Address(), spectator.remoteAddress, "failed after", timeUntilChallengeResponse)
		} else if captchaValid {
			spectator.hardChallengesSolved++
		}
	}

	if newLegitimate {
		r.log.Println("Spectator", spectator.user.Address(), spectator.remoteAddress,
			"solved", spectator.activityChallenge.Type,
			"activity challenge after", timeUntilChallengeResponse)
		if !spectator.legitimate && time.Since(spectator.stoppedBeingLegitimate) > time.Duration(spectator.legitimacyFailures)*time.Hour {
			// give spectator another chance
			spectator.legitimate = true
			spectator.stoppedBeingLegitimate = time.Time{}
			r.log.Println("Spectator", spectator.user.Address(), spectator.remoteAddress, "given another legitimacy chance")
		}
	} else if spectator.legitimate && !newLegitimate {
		spectator.legitimate = false
		spectator.legitimacyFailures++
		spectator.stoppedBeingLegitimate = time.Now()
		r.log.Println("Spectator", spectator.user.Address(), spectator.remoteAddress, "considered not legitimate")
	}

	d := durationUntilNextActivityChallenge(spectator.user, false)
	spectator.nextActivityCheckTime = time.Now().Add(d)
	spectator.activityCheckTimer.Reset(d)
	spectator.activityChallenge = nil

	delete(r.spectatorByActivityChallenge, challenge)

	return nil
}

func (r *RewardsHandler) hCaptchaResponseValid(ctx context.Context, hCaptchaResponse string) (bool, error) {
	if hCaptchaResponse == "" {
		return false, nil
	}

	resp, err := r.hCaptchaHTTPClient.PostForm("https://hcaptcha.com/siteverify",
		url.Values{
			"secret":   {r.hCaptchaSecret},
			"response": {hCaptchaResponse},
		},
	)
	if err != nil {
		return false, stacktrace.Propagate(err, "")
	}

	body, err := ioutil.ReadAll(resp.Body)
	resp.Body.Close()
	if err != nil {
		return false, stacktrace.Propagate(err, "")
	}

	type Response struct {
		ChallengeTS string   `json:"challenge_ts"`
		Hostname    string   `json:"hostname"`
		ErrorCodes  []string `json:"error-codes,omitempty"`
		Success     bool     `json:"success"`
		Credit      bool     `json:"credit,omitempty"`
	}
	var response Response

	err = json.Unmarshal(body, &response)
	if err != nil {
		return false, stacktrace.Propagate(err, "")
	}
	return response.Success, nil
}

func (r *RewardsHandler) MarkAddressAsActiveIfNotChallenged(ctx context.Context, address string) {
	r.spectatorsMutex.Lock()
	defer r.spectatorsMutex.Unlock()

	spectator, ok := r.spectatorsByRewardAddress[address]
	if ok && spectator.activityChallenge == nil {
		spectator.activityCheckTimer.Stop()
		d := durationUntilNextActivityChallenge(spectator.user, false)
		spectator.nextActivityCheckTime = time.Now().Add(d)
		spectator.activityCheckTimer.Reset(d)
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
