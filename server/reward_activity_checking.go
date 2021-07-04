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
	"github.com/tnyim/jungletv/utils/event"
)

var activityChallengeTolerance = 1 * time.Minute

func (s *grpcServer) SubmitActivityChallenge(ctx context.Context, r *proto.SubmitActivityChallengeRequest) (*proto.SubmitActivityChallengeResponse, error) {
	return &proto.SubmitActivityChallengeResponse{}, s.rewardsHandler.SolveActivityChallenge(ctx, r.Challenge, r.CaptchaResponse)
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

func (r *RewardsHandler) SolveActivityChallenge(ctx context.Context, challenge, hCaptchaResponse string) (err error) {
	var spectator *spectator
	var timeUntilChallengeSolved time.Duration
	var captchaValid bool
	defer func() {
		if err == nil && spectator != nil && captchaValid {
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

	captchaValid, err = r.captchaResponseValid(ctx, hCaptchaResponse)
	if err != nil {
		r.log.Println("Error verifying captcha:", err)
	}
	if captchaValid && err == nil {
		spectator.lastActive = time.Now()
	} else if err == nil {
		// if not valid, do everything except mark the spectator as active.
		r.log.Println("Activity challenge captcha verification for spectator", spectator.user.Address(), spectator.remoteAddress, "failed after", timeUntilChallengeSolved)
	}
	// this way, they'll stop receiving rewards until the next challenge
	spectator.activityCheckTimer.Stop()
	spectator.activityCheckTimer.Reset(durationUntilNextActivityChallenge())
	timeUntilChallengeSolved = time.Since(spectator.activityChallengeAt)
	spectator.activityChallengeAt = time.Time{}
	spectator.activityChallenge = ""

	delete(r.spectatorByActivityChallenge, challenge)
	return nil
}

func (r *RewardsHandler) captchaResponseValid(ctx context.Context, hCaptchaResponse string) (bool, error) {
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

	spectators := r.spectatorsByRewardAddress[address]
	for i := range spectators {
		spectator := spectators[i]
		if spectator.activityChallenge == "" {
			spectator.lastActive = time.Now()
			spectator.activityCheckTimer.Stop()
			spectator.activityCheckTimer.Reset(durationUntilNextActivityChallenge())
		}
	}
}
