package server

import (
	"context"
	"math/rand"
	"time"

	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/segcha"
	"github.com/tnyim/jungletv/server/media"
	"github.com/tnyim/jungletv/utils/event"
	"github.com/tnyim/jungletv/utils/transaction"
)

func (s *grpcServer) Worker(ctx context.Context, errorCb func(error)) {
	errChan := make(chan error)

	go func() {
		err := s.appRunner.LaunchAutorunApplications()
		if err != nil {
			errChan <- stacktrace.Propagate(err, "failed to launch autorun applications")
		}
	}()

	go func(ctx context.Context) {
		for {
			s.log.Println("Payments processor starting/restarting")
			err := s.paymentAccountPool.Worker(ctx, s.ticketCheckPeriod)
			if err == nil {
				return
			}
			errChan <- stacktrace.Propagate(err, "payments processor error")
			select {
			case <-ctx.Done():
				s.log.Println("Payments processor done")
				return
			default:
			}
		}
	}(ctx)

	go func(ctx context.Context) {
		for {
			s.log.Println("Rewards handler starting/restarting")
			err := s.rewardsHandler.Worker(ctx)
			if err == nil {
				return
			}
			errChan <- stacktrace.Propagate(err, "rewards handler error")
			select {
			case <-ctx.Done():
				s.log.Println("Rewards handler done")
				return
			default:
			}
		}
	}(ctx)

	go func(ctx context.Context) {
		for {
			s.log.Println("Withdrawal handler starting/restarting")
			err := s.withdrawalHandler.Worker(ctx)
			if err == nil {
				return
			}
			errChan <- stacktrace.Propagate(err, "withdrawal handler error")
			select {
			case <-ctx.Done():
				s.log.Println("Withdrawal handler done")
				return
			default:
			}
		}
	}(ctx)

	go func(ctx context.Context) {
		for {
			s.log.Println("Skip manager starting/restarting")
			err := s.skipManager.Worker(ctx)
			if err == nil {
				return
			}
			errChan <- stacktrace.Propagate(err, "skip manager error")
			select {
			case <-ctx.Done():
				s.log.Println("Skip manager done")
				return
			default:
			}
		}
	}(ctx)

	go func(ctx context.Context) {
		for {
			s.log.Println("Skip manager balances checker starting/restarting")
			err := s.skipManager.BalancesWorker(ctx, s.ticketCheckPeriod)
			if err == nil {
				return
			}
			errChan <- stacktrace.Propagate(err, "skip manager balances worker error")
			select {
			case <-ctx.Done():
				s.log.Println("Skip manager balances worker done")
				return
			default:
			}
		}
	}(ctx)

	go func(ctx context.Context) {
		for {
			select {
			case f := <-s.collectorAccountQueue:
				f(s.collectorAccount, &s.wallet.RPC, &s.wallet.RPCWork)
			case <-ctx.Done():
				s.log.Println("Collector account worker done")
				return
			}
		}
	}(ctx)

	// challenge creation is unfortunately slower than it should, so we attempt to use a remote worker
	// to cache challenges in a queue so they can be used later
	go func(ctx context.Context) {
		makeChallenge := func() *segcha.Challenge {
			for {
				if s.segchaClient != nil {
					ctxT, cancelFn := context.WithDeadline(ctx, time.Now().Add(10*time.Second))
					challenge, err := segcha.NewChallengeUsingClient(ctxT, segchaChallengeSteps, s.segchaClient)
					cancelFn()
					if err != nil {
						s.log.Printf("remote segcha challenge creation failed: %v", err)
						// fall through to local generation
					} else {
						return challenge
					}
				}
				challenge, err := segcha.NewChallenge(segchaChallengeSteps, s.captchaImageDB, s.captchaFontPath)
				if err != nil {
					errChan <- stacktrace.Propagate(err, "failed to locally create segcha challenge")
				} else {
					return challenge
				}
			}
		}

		t := time.NewTicker(5 * time.Second)
		defer t.Stop()

		for {
			select {
			case <-t.C:
				inCache := len(s.captchaChallengesQueue)
				if inCache < segchaPremadeQueueSize {
					func() {
						s.captchaGenerationMutex.Lock()
						defer s.captchaGenerationMutex.Unlock()
						c := makeChallenge()
						s.captchaChallengesQueue <- c
						latestGeneratedChallenge = c
						inCache++
						s.log.Printf("generated cached segcha challenge (%d in cache)", inCache)
					}()
				}
				go s.statsClient.Gauge("segcha_cached", inCache)
			case <-ctx.Done():
				s.log.Println("segcha challenge creator worker done")
				return
			}
		}
	}(ctx)

	go s.mediaQueue.ProcessQueueWorker(ctx)
	go s.staffActivityManager.StatsWorker(ctx)
	go s.ipReputationChecker.Worker(ctx)

	go func() {
		for {
			s.log.Println("Chat system messages worker starting/restarting")
			err := s.ChatSystemMessagesWorker(ctx)
			if err == nil {
				return
			}
			errChan <- stacktrace.Propagate(err, "chat system message worker error")
			select {
			case <-ctx.Done():
				s.log.Println("Chat system message worker done")
				return
			default:
			}
		}
	}()

	go func() {
		mediaChangedC, mediaChangedU := s.mediaQueue.MediaChanged().Subscribe(event.BufferFirst)
		defer mediaChangedU()

		wait := time.Duration(90+rand.Intn(180)) * time.Second
		t := time.NewTimer(wait)
		defer t.Stop()
		for {
			select {
			case v := <-mediaChangedC:
				if v == nil || v == (media.QueueEntry)(nil) {
					wait = time.Duration(90+rand.Intn(180)) * time.Second
					t.Reset(wait)
				}
			case <-t.C:
				allowed := func() bool {
					s.allowMediaEnqueuingMutex.RLock()
					defer s.allowMediaEnqueuingMutex.RUnlock()
					return s.allowMediaEnqueuing == proto.AllowedMediaEnqueuingType_ENABLED
				}()
				if s.mediaQueue.Length() == 0 && s.autoEnqueueVideos &&
					allowed {
					for attempt := 0; attempt < 3; attempt++ {
						err := func() error {
							tx, err := transaction.Begin(ctx)
							if err != nil {
								return stacktrace.Propagate(err, "")
							}
							defer tx.Commit() // read-only tx
							return s.autoEnqueueNewVideo(tx)
						}()
						if err != nil {
							errChan <- stacktrace.Propagate(err, "")
						} else {
							wait = time.Duration(90+rand.Intn(180)) * time.Second
							t.Reset(wait)
							break
						}
					}
				}
			}
		}
	}()

	for {
		select {
		case err := <-errChan:
			errorCb(err)
		case <-ctx.Done():
			return
		}
	}
}
