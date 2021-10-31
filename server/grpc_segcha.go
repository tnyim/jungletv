package server

import (
	"context"
	"strconv"
	"strings"

	"github.com/palantir/stacktrace"
	uuid "github.com/satori/go.uuid"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/segcha"
	"github.com/tnyim/jungletv/server/auth"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

var segchaChallengeSteps = 4
var segchaWrongAnswersTolerance = 1
var segchaPremadeQueueSize = 150
var latestGeneratedChallenge *segcha.Challenge

func (s *grpcServer) ProduceSegchaChallenge(ctx context.Context, r *proto.ProduceSegchaChallengeRequest) (*proto.ProduceSegchaChallengeResponse, error) {
	user := auth.UserClaimsFromContext(ctx)

	s.segchaRateLimiter.Take(ctx, user.Address())
	_, _, _, ok, err := s.enqueueRequestRateLimiter.Take(ctx, auth.RemoteAddressFromContext(ctx))
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	if !ok {
		return nil, status.Errorf(codes.ResourceExhausted, "rate limit reached")
	}

	if !s.rewardsHandler.SpectatorHasActivityChallenge(user.Address(), "segcha") {
		return nil, status.Error(codes.FailedPrecondition, "no challenge active")
	}

	challenge := latestGeneratedChallenge
	challengeID := uuid.NewV4().String()
	select {
	case challenge = <-s.captchaChallengesQueue:
		challengeID = challenge.ID()
		break
	default:
		if challenge == nil {
			func() {
				s.captchaGenerationMutex.Lock()
				defer s.captchaGenerationMutex.Unlock()
				challenge, err = segcha.NewChallenge(segchaChallengeSteps, s.captchaImageDB, s.captchaFontPath)
				latestGeneratedChallenge = challenge
				challengeID = challenge.ID()
			}()
			if err != nil {
				return nil, stacktrace.Propagate(err, "")
			}
			s.log.Println("generated on-demand segcha challenge")
		} else {
			s.log.Println("re-using previously generated segcha challenge")
		}
	}

	pictures := challenge.Pictures()

	s.captchaAnswers.SetDefault(challengeID, challenge.Answers())

	steps := make([]*proto.SegchaChallengeStep, len(pictures))
	for i := range pictures {
		steps[i] = &proto.SegchaChallengeStep{
			Image: pictures[i],
		}
	}

	return &proto.ProduceSegchaChallengeResponse{
		ChallengeId: challengeID,
		Steps:       steps,
	}, nil
}

func (s *grpcServer) segchaResponseValid(ctx context.Context, segchaResponse string) (bool, error) {
	parts := strings.Split(segchaResponse, ",")

	correctAnswersIface, present := s.captchaAnswers.Get(parts[0])
	if !present {
		return false, nil
	}
	s.captchaAnswers.Delete(parts[0])
	correctAnswers := correctAnswersIface.([]int)

	if len(parts)-1 != len(correctAnswers) {
		return false, nil
	}

	gotRight := 0
	for i := range correctAnswers {
		userAnswer, err := strconv.Atoi(parts[i+1])
		if err != nil {
			return false, nil
		}
		if userAnswer == correctAnswers[i] {
			gotRight++
		}
	}

	return gotRight >= len(correctAnswers)-segchaWrongAnswersTolerance, nil
}
