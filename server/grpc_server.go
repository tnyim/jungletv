package server

import (
	"context"
	"log"
	"net/http"
	"sync"
	"time"

	"github.com/hectorchu/gonano/wallet"
	"github.com/palantir/stacktrace"
	"github.com/sethvargo/go-limiter"
	"github.com/sethvargo/go-limiter/memorystore"
	"github.com/tnyim/jungletv/proto"
	"google.golang.org/api/googleapi/transport"
	"google.golang.org/api/youtube/v3"
)

type grpcServer struct {
	//proto.UnimplementedJungleTVServer
	proto.UnsafeJungleTVServer // disabling forward compatibility is exactly what we want in order to get compilation errors when we forget to implement a server method

	log                            *log.Logger
	wallet                         *wallet.Wallet
	collectorAccount               *wallet.Account
	collectorAccountQueue          chan func(*wallet.Account)
	paymentAccountPendingWaitGroup *sync.WaitGroup
	jwtManager                     *JWTManager
	enqueueRequestRateLimiter      limiter.Store
	signInRateLimiter              limiter.Store

	mediaQueue     *MediaQueue
	enqueueManager *EnqueueManager
	rewardsHandler *RewardsHandler
	statsHandler   *StatsHandler
	chat           *ChatManager

	youtube *youtube.Service
}

// NewServer returns a new JungleTVServer
func NewServer(ctx context.Context, log *log.Logger, w *wallet.Wallet,
	youtubeAPIkey string, jwtManager *JWTManager, queueFile, repAddress string) (*grpcServer, error) {
	mediaQueue, err := NewMediaQueue(ctx, log, queueFile)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	s := &grpcServer{
		log:                            log,
		wallet:                         w,
		jwtManager:                     jwtManager,
		mediaQueue:                     mediaQueue,
		collectorAccountQueue:          make(chan func(*wallet.Account), 10000),
		paymentAccountPendingWaitGroup: new(sync.WaitGroup),
	}

	s.enqueueRequestRateLimiter, err = memorystore.New(&memorystore.Config{
		Tokens:   5,
		Interval: time.Minute,
	})
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	s.signInRateLimiter, err = memorystore.New(&memorystore.Config{
		Tokens:   3,
		Interval: 5 * time.Minute,
	})
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	collectorAccountIdx := uint32(0)
	s.collectorAccount, err = w.NewAccount(&collectorAccountIdx)
	s.collectorAccount.SetRep(repAddress)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	s.statsHandler, err = NewStatsHandler(log, s.mediaQueue)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	s.enqueueManager, err = NewEnqueueManager(log, s.mediaQueue, w, NewPaymentAccountPool(w, repAddress),
		s.paymentAccountPendingWaitGroup, s.statsHandler, s.collectorAccount.Address())
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	s.rewardsHandler, err = NewRewardsHandler(log, s.mediaQueue, w, s.collectorAccountQueue, s.paymentAccountPendingWaitGroup)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	s.chat, err = NewChatManager(log, &ChatStoreNoOp{})
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	client := &http.Client{
		Transport: &transport.APIKey{Key: youtubeAPIkey},
	}

	s.youtube, err = youtube.New(client)
	if err != nil {
		return nil, stacktrace.Propagate(err, "error creating YouTube client")
	}
	return s, nil
}

func (s *grpcServer) Worker(ctx context.Context, errorCb func(error)) {
	errChan := make(chan error)
	go func() {
		for {
			s.log.Println("Payments processor starting/restarting")
			err := s.enqueueManager.ProcessPaymentsWorker(ctx, 10*time.Second)
			if err == nil {
				return
			}
			errChan <- stacktrace.Propagate(err, "")
			select {
			case <-ctx.Done():
				s.log.Println("Payments processor done")
				return
			default:
			}
		}
	}()

	go func() {
		for {
			s.log.Println("Rewards handler starting/restarting")
			err := s.rewardsHandler.Worker(ctx)
			if err == nil {
				return
			}
			errChan <- stacktrace.Propagate(err, "")
			select {
			case <-ctx.Done():
				s.log.Println("Rewards handler done")
				return
			default:
			}
		}
	}()

	go func() {
		for {
			select {
			case f := <-s.collectorAccountQueue:
				f(s.collectorAccount)
			case <-ctx.Done():
				s.log.Println("Collector account worker done")
				return
			}
		}
	}()

	go s.mediaQueue.ProcessQueueWorker(ctx)

	for {
		select {
		case err := <-errChan:
			errorCb(err)
		case <-ctx.Done():
			return
		}
	}
}
