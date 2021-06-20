package server

import (
	"context"
	"fmt"
	"io/ioutil"
	"log"
	"math/big"
	"math/rand"
	"net/http"
	"strings"
	"sync"
	"time"

	"github.com/hectorchu/gonano/wallet"
	"github.com/palantir/stacktrace"
	"github.com/rickb777/date/period"
	"github.com/sethvargo/go-limiter"
	"github.com/sethvargo/go-limiter/memorystore"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/utils/event"
	"google.golang.org/api/googleapi/transport"
	"google.golang.org/api/youtube/v3"
	"gopkg.in/alexcesaro/statsd.v2"
)

type grpcServer struct {
	//proto.UnimplementedJungleTVServer
	proto.UnsafeJungleTVServer // disabling forward compatibility is exactly what we want in order to get compilation errors when we forget to implement a server method

	log                            *log.Logger
	statsClient                    *statsd.Client
	wallet                         *wallet.Wallet
	collectorAccount               *wallet.Account
	collectorAccountQueue          chan func(*wallet.Account)
	paymentAccountPendingWaitGroup *sync.WaitGroup
	jwtManager                     *JWTManager
	enqueueRequestRateLimiter      limiter.Store
	signInRateLimiter              limiter.Store
	ipReputationChecker            *IPAddressReputationChecker

	autoEnqueueVideos        bool
	autoEnqueueVideoListFile string
	ticketCheckPeriod        time.Duration

	mediaQueue     *MediaQueue
	enqueueManager *EnqueueManager
	rewardsHandler *RewardsHandler
	statsHandler   *StatsHandler
	chat           *ChatManager

	youtube *youtube.Service
}

// NewServer returns a new JungleTVServer
func NewServer(ctx context.Context, log *log.Logger, statsClient *statsd.Client, w *wallet.Wallet,
	youtubeAPIkey string, jwtManager *JWTManager, queueFile, autoEnqueueVideoListFile, repAddress string,
	ticketCheckPeriod time.Duration) (*grpcServer, error) {
	mediaQueue, err := NewMediaQueue(ctx, log, statsClient, queueFile)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	s := &grpcServer{
		log:                            log,
		wallet:                         w,
		statsClient:                    statsClient,
		jwtManager:                     jwtManager,
		mediaQueue:                     mediaQueue,
		collectorAccountQueue:          make(chan func(*wallet.Account), 10000),
		paymentAccountPendingWaitGroup: new(sync.WaitGroup),
		autoEnqueueVideoListFile:       autoEnqueueVideoListFile,
		autoEnqueueVideos:              autoEnqueueVideoListFile != "",
		ipReputationChecker:            NewIPAddressReputationChecker(log),
		ticketCheckPeriod:              ticketCheckPeriod,
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

	s.statsHandler, err = NewStatsHandler(log, s.mediaQueue, s.statsClient)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	s.enqueueManager, err = NewEnqueueManager(log, statsClient, s.mediaQueue, w, NewPaymentAccountPool(w, repAddress),
		s.paymentAccountPendingWaitGroup, s.statsHandler, s.collectorAccount.Address())
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	s.rewardsHandler, err = NewRewardsHandler(
		log, statsClient, s.mediaQueue, s.ipReputationChecker, w, s.collectorAccountQueue, s.paymentAccountPendingWaitGroup)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	s.chat, err = NewChatManager(log, statsClient, NewChatStoreMemory(1000))
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
	go func(ctx context.Context) {
		for {
			s.log.Println("Payments processor starting/restarting")
			err := s.enqueueManager.ProcessPaymentsWorker(ctx, s.ticketCheckPeriod)
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
	}(ctx)

	go func(ctx context.Context) {
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
	}(ctx)

	go func(ctx context.Context) {
		for {
			select {
			case f := <-s.collectorAccountQueue:
				f(s.collectorAccount)
			case <-ctx.Done():
				s.log.Println("Collector account worker done")
				return
			}
		}
	}(ctx)

	go s.mediaQueue.ProcessQueueWorker(ctx)
	go s.ipReputationChecker.Worker(ctx)

	go func() {
		mediaChangedC := s.mediaQueue.mediaChanged.Subscribe(event.AtLeastOnceGuarantee)
		defer s.mediaQueue.mediaChanged.Unsubscribe(mediaChangedC)

		entryAddedC := s.mediaQueue.entryAdded.Subscribe(event.AtLeastOnceGuarantee)
		defer s.mediaQueue.entryAdded.Unsubscribe(entryAddedC)

		rewardsDistributedC := s.rewardsHandler.rewardsDistributed.Subscribe(event.AtLeastOnceGuarantee)
		defer s.rewardsHandler.rewardsDistributed.Unsubscribe(rewardsDistributedC)

		for {
			select {
			case v := <-mediaChangedC:
				var err error
				if v[0] == nil {
					_, err = s.chat.CreateSystemMessage(ctx, "_The queue is now empty._")
				} else {
					title := v[0].(MediaQueueEntry).MediaInfo().Title()
					_, err = s.chat.CreateSystemMessage(ctx, fmt.Sprintf("_Now playing:_ %s", title))
				}
				if err != nil {
					errChan <- stacktrace.Propagate(err, "")
				}
			case v := <-entryAddedC:
				var err error
				t := v[0].(string)
				entry := v[1].(MediaQueueEntry)
				if !entry.RequestedBy().IsUnknown() {
					switch t {
					case "enqueue":
						_, err = s.chat.CreateSystemMessage(ctx, fmt.Sprintf("_%s just enqueued_ %s", entry.RequestedBy().Address()[:14], entry.MediaInfo().Title()))
					case "play_after_next":
						_, err = s.chat.CreateSystemMessage(ctx, fmt.Sprintf("_%s just set_ %s _to play after the current video_", entry.RequestedBy().Address()[:14], entry.MediaInfo().Title()))
					case "play_now":
						_, err = s.chat.CreateSystemMessage(ctx, fmt.Sprintf("_%s just skipped the previous video!_", entry.RequestedBy().Address()[:14]))
					}
					if err != nil {
						errChan <- stacktrace.Propagate(err, "")
					}
				}
			case v := <-rewardsDistributedC:
				amount := v[0].(Amount)
				exp := new(big.Int).Exp(big.NewInt(10), big.NewInt(29), nil)
				banStr := new(big.Rat).SetFrac(amount.Int, exp).FloatString(2)

				_, err := s.chat.CreateSystemMessage(ctx, fmt.Sprintf("_**%s BAN** distributed among spectators._", banStr))
				if err != nil {
					errChan <- stacktrace.Propagate(err, "")
				}
			case <-ctx.Done():
				s.log.Println("Chat system message sender done")
				return
			}
		}
	}()

	go func() {
		mediaChangedC := s.mediaQueue.mediaChanged.Subscribe(event.AtLeastOnceGuarantee)
		defer s.mediaQueue.mediaChanged.Unsubscribe(mediaChangedC)

		wait := time.Duration(90+rand.Intn(180)) * time.Second
		t := time.NewTimer(wait)
		for {
			select {
			case v := <-mediaChangedC:
				if v[0] == nil {
					wait = time.Duration(90+rand.Intn(180)) * time.Second
					t.Reset(wait)
				}
			case <-t.C:
				if s.mediaQueue.Length() == 0 && s.autoEnqueueVideos {
					for attempt := 0; attempt < 3; attempt++ {
						err := s.autoEnqueueNewVideo(ctx)
						if err != nil {
							errChan <- stacktrace.Propagate(err, "")
						} else {
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

func (s *grpcServer) autoEnqueueNewVideo(ctx context.Context) error {
	videoID, err := s.getRandomVideoForAutoEnqueue()
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	request, result, err := s.NewYouTubeVideoEnqueueRequest(ctx, videoID, false)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	if result != youTubeVideoEnqueueRequestCreationSucceeded {
		return stacktrace.NewError("enqueue request for video %s creation failed due to video characteristics", videoID)
	}

	ticket, err := s.enqueueManager.RegisterRequest(ctx, request)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	ticket.ForceEnqueuing(proto.ForcedTicketEnqueueType_ENQUEUE)
	s.log.Printf("Auto-enqueued video with ID %s", videoID)
	return nil
}

func (s *grpcServer) getRandomVideoForAutoEnqueue() (string, error) {
	b, err := ioutil.ReadFile(s.autoEnqueueVideoListFile)
	if err != nil {
		return "", stacktrace.Propagate(err, "error reading auto enqueue videos from file: %v", err)
	}
	lines := strings.Split(strings.TrimSpace(string(b)), "\n")
	line := lines[rand.Intn(len(lines))]
	id := strings.TrimSpace(strings.Split(line, " ")[0])
	return id, nil
}

type youTubeVideoEnqueueRequestCreationResult int

const (
	youTubeVideoEnqueueRequestCreationSucceeded youTubeVideoEnqueueRequestCreationResult = iota
	youTubeVideoEnqueueRequestCreationFailed
	youTubeVideoEnqueueRequestCreationVideoNotFound
	youTubeVideoEnqueueRequestCreationVideoAgeRestricted
	youTubeVideoEnqueueRequestCreationVideoIsLiveBroadcast
	youTubeVideoEnqueueRequestCreationVideoIsNotEmbeddable
	youTubeVideoEnqueueRequestCreationVideoIsTooLong
)

func (s *grpcServer) NewYouTubeVideoEnqueueRequest(ctx context.Context, videoID string, unskippable bool) (EnqueueRequest, youTubeVideoEnqueueRequestCreationResult, error) {
	response, err := s.youtube.Videos.List([]string{"snippet", "contentDetails", "status"}).Id(videoID).MaxResults(1).Do()
	if err != nil {
		return nil, youTubeVideoEnqueueRequestCreationFailed, stacktrace.Propagate(err, "")
	}

	if len(response.Items) == 0 {
		return nil, youTubeVideoEnqueueRequestCreationVideoNotFound, nil
	}

	videoItem := response.Items[0]
	if videoItem.ContentDetails.ContentRating.YtRating == "ytAgeRestricted" {
		return nil, youTubeVideoEnqueueRequestCreationVideoAgeRestricted, nil
	}

	if !videoItem.Status.Embeddable {
		return nil, youTubeVideoEnqueueRequestCreationVideoIsNotEmbeddable, nil
	}

	if videoItem.Snippet.LiveBroadcastContent != "none" {
		return nil, youTubeVideoEnqueueRequestCreationVideoIsLiveBroadcast, nil
	}

	videoDuration, err := period.Parse(videoItem.ContentDetails.Duration)
	if err != nil {
		return nil, youTubeVideoEnqueueRequestCreationFailed, stacktrace.Propagate(err, "error parsing video duration")
	}

	if videoDuration.DurationApprox() > 30*time.Minute {
		return nil, youTubeVideoEnqueueRequestCreationVideoIsTooLong, nil
	}

	request := &queueEntryYouTubeVideo{
		id:           videoID,
		title:        videoItem.Snippet.Title,
		channelTitle: videoItem.Snippet.ChannelTitle,
		thumbnailURL: videoItem.Snippet.Thumbnails.Default.Url,
		duration:     videoDuration.DurationApprox(),
		donePlaying:  event.New(),
		requestedBy:  &unknownUser{},
		unskippable:  unskippable,
	}

	userClaims := UserClaimsFromContext(ctx)
	if userClaims != nil {
		request.requestedBy = userClaims
	}

	return request, youTubeVideoEnqueueRequestCreationSucceeded, nil
}
