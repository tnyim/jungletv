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

	"github.com/DisgoOrg/disgohook"
	"github.com/DisgoOrg/disgohook/api"
	"github.com/hectorchu/gonano/rpc"
	"github.com/hectorchu/gonano/wallet"
	"github.com/palantir/stacktrace"
	"github.com/patrickmn/go-cache"
	"github.com/rickb777/date/period"
	"github.com/sethvargo/go-limiter"
	"github.com/sethvargo/go-limiter/memorystore"
	"github.com/tnyim/jungletv/captcha"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/server/auth"
	"github.com/tnyim/jungletv/types"
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
	collectorAccountQueue          chan func(*wallet.Account, rpc.Client, rpc.Client)
	skipAccount                    *wallet.Account
	rainAccount                    *wallet.Account
	paymentAccountPendingWaitGroup *sync.WaitGroup
	jwtManager                     *auth.JWTManager
	enqueueRequestRateLimiter      limiter.Store
	signInRateLimiter              limiter.Store
	ownEntryRemovalRateLimiter     limiter.Store
	segchaRateLimiter              limiter.Store
	ipReputationChecker            *IPAddressReputationChecker
	userSerializer                 APIUserSerializer
	captchaImageDB                 *captcha.ImageDatabase
	captchaFontPath                string
	captchaAnswers                 *cache.Cache
	captchaChallengesQueue         chan *captcha.Challenge
	captchaGenerationMutex         sync.Mutex

	allowVideoEnqueuing      proto.AllowedVideoEnqueuingType
	autoEnqueueVideos        bool
	autoEnqueueVideoListFile string
	ticketCheckPeriod        time.Duration

	verificationProcesses     *cache.Cache
	delegatorCountsPerRep     *cache.Cache
	addressesWithGoodRepCache *cache.Cache

	mediaQueue        *MediaQueue
	pricer            *Pricer
	enqueueManager    *EnqueueManager
	skipManager       *SkipManager
	rewardsHandler    *RewardsHandler
	withdrawalHandler *WithdrawalHandler
	statsHandler      *StatsHandler
	chat              *ChatManager
	moderationStore   ModerationStore
	nicknameCache     NicknameCache

	youtube       *youtube.Service
	modLogWebhook api.WebhookClient
}

// NewServer returns a new JungleTVServer
func NewServer(ctx context.Context, log *log.Logger, statsClient *statsd.Client, w *wallet.Wallet,
	youtubeAPIkey string, jwtManager *auth.JWTManager, authInterceptor *auth.Interceptor, queueFile, bansFile, autoEnqueueVideoListFile, repAddress string,
	ticketCheckPeriod time.Duration, ipCheckEndpoint, ipCheckToken string, hCaptchaSecret string, modLogWebhook string,
	captchaImageDB *captcha.ImageDatabase, captchaFontPath string) (*grpcServer, error) {

	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/RewardInfo", auth.UserPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/Withdraw", auth.UserPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/SendChatMessage", auth.UserPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/SetChatNickname", auth.UserPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/RewardHistory", auth.UserPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/WithdrawalHistory", auth.UserPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/RemoveOwnQueueEntry", auth.UserPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/ProduceSegchaChallenge", auth.UserPermissionLevel)

	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/ForciblyEnqueueTicket", auth.AdminPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/RemoveQueueEntry", auth.AdminPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/RemoveChatMessage", auth.AdminPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/SetChatSettings", auth.AdminPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/SetVideoEnqueuingEnabled", auth.AdminPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/BanUser", auth.AdminPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/RemoveBan", auth.AdminPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/UserChatMessages", auth.AdminPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/DisallowedVideos", auth.AdminPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/AddDisallowedVideo", auth.AdminPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/RemoveDisallowedVideo", auth.AdminPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/UpdateDocument", auth.AdminPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/SetUserChatNickname", auth.AdminPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/SetPricesMultiplier", auth.AdminPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/SetCrowdfundedSkippingEnabled", auth.AdminPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/SetSkipPriceMultiplier", auth.AdminPermissionLevel)

	mediaQueue, err := NewMediaQueue(ctx, log, statsClient, queueFile)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	s := &grpcServer{
		log:                            log,
		wallet:                         w,
		statsClient:                    statsClient,
		jwtManager:                     jwtManager,
		verificationProcesses:          cache.New(5*time.Minute, 1*time.Minute),
		delegatorCountsPerRep:          cache.New(1*time.Hour, 5*time.Minute),
		addressesWithGoodRepCache:      cache.New(6*time.Hour, 5*time.Minute),
		mediaQueue:                     mediaQueue,
		collectorAccountQueue:          make(chan func(*wallet.Account, rpc.Client, rpc.Client), 10000),
		paymentAccountPendingWaitGroup: new(sync.WaitGroup),
		autoEnqueueVideoListFile:       autoEnqueueVideoListFile,
		autoEnqueueVideos:              autoEnqueueVideoListFile != "",
		allowVideoEnqueuing:            proto.AllowedVideoEnqueuingType_ENABLED,
		ipReputationChecker:            NewIPAddressReputationChecker(log, ipCheckEndpoint, ipCheckToken),
		ticketCheckPeriod:              ticketCheckPeriod,
		moderationStore:                NewModerationStoreMemory(bansFile),
		nicknameCache:                  NewMemoryNicknameCache(),
		captchaAnswers:                 cache.New(1*time.Hour, 5*time.Minute),
		captchaImageDB:                 captchaImageDB,
		captchaFontPath:                captchaFontPath,
		captchaChallengesQueue:         make(chan *captcha.Challenge, segchaPremadeQueueSize),
	}
	s.userSerializer = s.serializeUserForAPI

	if modLogWebhook != "" {
		s.modLogWebhook, err = disgohook.NewWebhookClientByToken(nil, newSimpleLogger(log, false), modLogWebhook)
		if err != nil {
			return nil, stacktrace.Propagate(err, "")
		}
	}

	s.enqueueRequestRateLimiter, err = memorystore.New(&memorystore.Config{
		Tokens:   5,
		Interval: time.Minute,
	})
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	s.signInRateLimiter, err = memorystore.New(&memorystore.Config{
		Tokens:   10,
		Interval: 5 * time.Minute,
	})
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	s.ownEntryRemovalRateLimiter, err = memorystore.New(&memorystore.Config{
		Tokens:   4,
		Interval: 4 * time.Hour,
	})
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	s.segchaRateLimiter, err = memorystore.New(&memorystore.Config{
		Tokens:   4,
		Interval: 2 * time.Minute,
	})
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	err = s.setupSpecialAccounts(repAddress)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	s.statsHandler, err = NewStatsHandler(log, s.mediaQueue, s.statsClient)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	s.pricer = NewPricer(log, s.mediaQueue, s.rewardsHandler, s.statsHandler)

	s.skipManager = NewSkipManager(log, s.wallet.RPC, s.skipAccount, s.rainAccount, s.collectorAccount.Address(), s.mediaQueue, s.pricer)

	s.withdrawalHandler = NewWithdrawalHandler(log, s.statsClient, s.collectorAccountQueue)

	s.rewardsHandler, err = NewRewardsHandler(
		log, statsClient, s.mediaQueue, s.ipReputationChecker, s.withdrawalHandler, hCaptchaSecret, w,
		s.collectorAccountQueue, s.skipManager, s.paymentAccountPendingWaitGroup, s.moderationStore, s.segchaResponseValid)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	s.pricer.rewardsHandler = s.rewardsHandler

	s.enqueueManager, err = NewEnqueueManager(log, statsClient, s.mediaQueue, s.pricer, w, NewPaymentAccountPool(w, repAddress),
		s.paymentAccountPendingWaitGroup, s.rewardsHandler, s.collectorAccount.Address(),
		s.moderationStore, s.modLogWebhook)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	s.chat, err = NewChatManager(log, statsClient, NewChatStoreDatabase(s.nicknameCache), s.moderationStore)
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

func (s *grpcServer) setupSpecialAccounts(repAddress string) error {
	var err error
	collectorAccountIdx := uint32(0)
	s.collectorAccount, err = s.wallet.NewAccount(&collectorAccountIdx)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	err = s.collectorAccount.SetRep(repAddress)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	skipAccountIdx := uint32(11575)
	s.skipAccount, err = s.wallet.NewAccount(&skipAccountIdx)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	err = s.skipAccount.SetRep(repAddress)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	rainAccountIdx := uint32(397007)
	s.rainAccount, err = s.wallet.NewAccount(&rainAccountIdx)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	err = s.rainAccount.SetRep(repAddress)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	return nil
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
			err := s.skipManager.Worker(ctx, s.ticketCheckPeriod)
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
			select {
			case f := <-s.collectorAccountQueue:
				f(s.collectorAccount, s.wallet.RPC, s.wallet.RPCWork)
			case <-ctx.Done():
				s.log.Println("Collector account worker done")
				return
			}
		}
	}(ctx)

	// challenge creation is unfortunately slower than it should, so we have this as a temporary solution
	// we generate challenges and place them in a queue (100 entries) to be used later
	go func(ctx context.Context) {
		makeChallenge := func() *captcha.Challenge {
			for {
				challenge, err := captcha.NewChallenge(segchaChallengeSteps, s.captchaImageDB, s.captchaFontPath)
				if err != nil {
					errChan <- stacktrace.Propagate(err, "failed to create segcha challenge")
				} else {
					return challenge
				}
			}
		}

		t := time.NewTicker(5 * time.Second)

		for {
			select {
			case <-t.C:
				if len(s.captchaChallengesQueue) < segchaPremadeQueueSize {
					func() {
						s.captchaGenerationMutex.Lock()
						defer s.captchaGenerationMutex.Unlock()
						s.captchaChallengesQueue <- makeChallenge()
						s.log.Println("generated cached segcha challenge")
					}()
				}
			case <-ctx.Done():
				s.log.Println("segcha challenge creator worker done")
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

		ownEntryRemovedC := s.mediaQueue.ownEntryRemoved.Subscribe(event.AtLeastOnceGuarantee)
		defer s.mediaQueue.ownEntryRemoved.Unsubscribe(ownEntryRemovedC)

		rewardsDistributedC := s.rewardsHandler.rewardsDistributed.Subscribe(event.AtLeastOnceGuarantee)
		defer s.rewardsHandler.rewardsDistributed.Unsubscribe(rewardsDistributedC)

		crowdfundedSkippedC := s.skipManager.crowdfundedSkip.Subscribe(event.AtLeastOnceGuarantee)
		defer s.skipManager.crowdfundedSkip.Unsubscribe(crowdfundedSkippedC)

		crowdfundedTransactionReceivedC := s.skipManager.crowdfundedTransactionReceived.Subscribe(event.AtLeastOnceGuarantee)
		defer s.skipManager.crowdfundedTransactionReceived.Unsubscribe(crowdfundedTransactionReceivedC)

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
				t := v[0].(string)
				entry := v[1].(MediaQueueEntry)
				if !entry.RequestedBy().IsUnknown() {
					name, err := s.getChatFriendlyUserName(ctx, entry.RequestedBy().Address())
					if err != nil {
						errChan <- stacktrace.Propagate(err, "")
						break
					}
					switch t {
					case "enqueue":
						_, err = s.chat.CreateSystemMessage(ctx, fmt.Sprintf(
							"_%s just enqueued_ %s", name, entry.MediaInfo().Title()))
					case "play_after_next":
						_, err = s.chat.CreateSystemMessage(ctx, fmt.Sprintf(
							"_%s just set_ %s _to play after the current video_",
							name, entry.MediaInfo().Title()))
					case "play_now":
						_, err = s.chat.CreateSystemMessage(ctx, fmt.Sprintf(
							"_%s just skipped the previous video!_", name))
					}
					if err != nil {
						errChan <- stacktrace.Propagate(err, "")
					}
				}
			case v := <-ownEntryRemovedC:
				entry := v[0].(MediaQueueEntry)
				name, err := s.getChatFriendlyUserName(ctx, entry.RequestedBy().Address())
				if err != nil {
					errChan <- stacktrace.Propagate(err, "")
					break
				}
				_, err = s.chat.CreateSystemMessage(ctx, fmt.Sprintf(
					"_%s just removed their own queue entry_ %s", name, entry.MediaInfo().Title()))
				if err != nil {
					errChan <- stacktrace.Propagate(err, "")
				}
			case v := <-rewardsDistributedC:
				amount := v[0].(Amount)
				eligibleCount := v[1].(int)
				exp := new(big.Int).Exp(big.NewInt(10), big.NewInt(29), nil)
				banStr := new(big.Rat).SetFrac(amount.Int, exp).FloatString(2)

				_, err := s.chat.CreateSystemMessage(ctx, fmt.Sprintf(
					"_**%s BAN** distributed among %d spectators._", banStr, eligibleCount))
				if err != nil {
					errChan <- stacktrace.Propagate(err, "")
				}
			case v := <-crowdfundedSkippedC:
				amount := v[0].(Amount)
				exp := new(big.Int).Exp(big.NewInt(10), big.NewInt(29), nil)
				banStr := new(big.Rat).SetFrac(amount.Int, exp).FloatString(2)

				_, err := s.chat.CreateSystemMessage(ctx, fmt.Sprintf(
					"_Spectators paid **%s BAN** to skip the previous video!_", banStr))
				if err != nil {
					errChan <- stacktrace.Propagate(err, "")
				}
			case v := <-crowdfundedTransactionReceivedC:
				tx := v[0].(*types.CrowdfundedTransaction)

				name, err := s.getChatFriendlyUserName(ctx, tx.FromAddress)
				if err != nil {
					errChan <- stacktrace.Propagate(err, "")
					break
				}

				exp := new(big.Int).Exp(big.NewInt(10), big.NewInt(29), nil)
				banStr := new(big.Rat).SetFrac(tx.Amount.BigInt(), exp).FloatString(2)

				msg := ""
				switch tx.TransactionType {
				case types.CrowdfundedTransactionTypeSkip:
					msg = fmt.Sprintf("_%s just contributed **%s BAN** to skipping the current video!_", name, banStr)
				case types.CrowdfundedTransactionTypeRain:
					msg = fmt.Sprintf("_%s just increased the rewards for the current video by **%s BAN**!_", name, banStr)
				}
				if msg != "" {
					_, err = s.chat.CreateSystemMessage(ctx, msg)
					if err != nil {
						errChan <- stacktrace.Propagate(err, "")
					}
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
				if s.mediaQueue.Length() == 0 && s.autoEnqueueVideos &&
					s.allowVideoEnqueuing == proto.AllowedVideoEnqueuingType_ENABLED {
					for attempt := 0; attempt < 3; attempt++ {
						err := func() error {
							tx, err := BeginTransaction(ctx)
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

func (s *grpcServer) getChatFriendlyUserName(ctx context.Context, address string) (string, error) {
	name := address[:14]
	chatBanned, err := s.moderationStore.LoadUserBannedFromChat(ctx, address, "")
	if err != nil {
		return "", stacktrace.Propagate(err, "")
	}
	if !chatBanned {
		nickname, err := s.nicknameCache.GetOrFetchNickname(ctx, address)
		if err != nil {
			return "", stacktrace.Propagate(err, "")
		}
		if nickname != nil {
			name = *nickname
		}
	}
	return name, nil
}

func (s *grpcServer) autoEnqueueNewVideo(ctx *TransactionWrappingContext) error {
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
	youTubeVideoEnqueueRequestCreationVideoIsUpcomingLiveBroadcast
	youTubeVideoEnqueueRequestCreationVideoIsUnpopularLiveBroadcast
	youTubeVideoEnqueueRequestCreationVideoIsNotEmbeddable
	youTubeVideoEnqueueRequestCreationVideoIsTooLong
	youTubeVideoEnqueueRequestCreationVideoIsAlreadyInQueue
	youTubeVideoEnqueueRequestCreationVideoPlayedTooRecently
	youTubeVideoEnqueueRequestCreationVideoIsDisallowed
	youTubeVideoEnqueueRequestVideoEnqueuingDisabled
	youTubeVideoEnqueueRequestVideoEnqueuingStaffOnly
)

func (s *grpcServer) NewYouTubeVideoEnqueueRequest(ctx *TransactionWrappingContext, videoID string, unskippable bool) (EnqueueRequest, youTubeVideoEnqueueRequestCreationResult, error) {
	isAdmin := false
	user := auth.UserClaimsFromContext(ctx)
	if banned, err := s.moderationStore.LoadRemoteAddressBannedFromVideoEnqueuing(ctx, auth.RemoteAddressFromContext(ctx)); err == nil && banned {
		return nil, youTubeVideoEnqueueRequestVideoEnqueuingStaffOnly, nil
	}
	if user != nil {
		isAdmin = UserPermissionLevelIsAtLeast(user, auth.AdminPermissionLevel)
		if banned, err := s.moderationStore.LoadPaymentAddressBannedFromVideoEnqueuing(ctx, user.Address()); err == nil && banned {
			return nil, youTubeVideoEnqueueRequestVideoEnqueuingStaffOnly, nil
		}
	}
	if s.allowVideoEnqueuing == proto.AllowedVideoEnqueuingType_DISABLED {
		return nil, youTubeVideoEnqueueRequestVideoEnqueuingDisabled, nil
	}
	if !isAdmin && s.allowVideoEnqueuing == proto.AllowedVideoEnqueuingType_STAFF_ONLY {
		return nil, youTubeVideoEnqueueRequestVideoEnqueuingStaffOnly, nil
	}

	ctx, err := BeginTransaction(ctx)
	if err != nil {
		return nil, youTubeVideoEnqueueRequestCreationFailed, stacktrace.Propagate(err, "")
	}
	defer ctx.Commit() // read-only tx

	for _, entry := range s.mediaQueue.Entries() {
		if ytEntry, ok := entry.(*queueEntryYouTubeVideo); ok {
			if ytEntry.id == videoID {
				return nil, youTubeVideoEnqueueRequestCreationVideoIsAlreadyInQueue, nil
			}
		}
	}

	response, err := s.youtube.Videos.List([]string{"snippet", "contentDetails", "status", "liveStreamingDetails"}).Id(videoID).MaxResults(1).Do()
	if err != nil {
		return nil, youTubeVideoEnqueueRequestCreationFailed, stacktrace.Propagate(err, "")
	}

	if len(response.Items) == 0 {
		return nil, youTubeVideoEnqueueRequestCreationVideoNotFound, nil
	}

	videoItem := response.Items[0]

	allowed, err := types.IsMediaAllowed(ctx, types.MediaTypeYouTubeVideo, videoItem.Id)
	if err != nil {
		return nil, youTubeVideoEnqueueRequestCreationFailed, stacktrace.Propagate(err, "")
	}
	if !allowed {
		return nil, youTubeVideoEnqueueRequestCreationVideoIsDisallowed, nil
	}

	lastPlayed, err := types.LastPlayTimeOfMedia(ctx, types.MediaTypeYouTubeVideo, videoItem.Id)
	if err != nil {
		return nil, youTubeVideoEnqueueRequestCreationFailed, stacktrace.Propagate(err, "")
	}
	if time.Since(lastPlayed) < 2*time.Hour && s.allowVideoEnqueuing != proto.AllowedVideoEnqueuingType_STAFF_ONLY {
		return nil, youTubeVideoEnqueueRequestCreationVideoPlayedTooRecently, nil
	}

	if videoItem.ContentDetails.ContentRating.YtRating == "ytAgeRestricted" {
		return nil, youTubeVideoEnqueueRequestCreationVideoAgeRestricted, nil
	}

	if !videoItem.Status.Embeddable {
		return nil, youTubeVideoEnqueueRequestCreationVideoIsNotEmbeddable, nil
	}

	if videoItem.Snippet.LiveBroadcastContent == "upcoming" {
		return nil, youTubeVideoEnqueueRequestCreationVideoIsUpcomingLiveBroadcast, nil
	}

	var videoDuration = period.NewHMS(0, 10, 0)
	if s.allowVideoEnqueuing == proto.AllowedVideoEnqueuingType_STAFF_ONLY {
		// temporary solution to allow staff to enqueue livestreams for longer
		videoDuration = period.NewHMS(1, 0, 0)
	}
	if videoItem.Snippet.LiveBroadcastContent == "live" {
		if videoItem.LiveStreamingDetails.ConcurrentViewers < 50 && s.allowVideoEnqueuing != proto.AllowedVideoEnqueuingType_STAFF_ONLY {
			return nil, youTubeVideoEnqueueRequestCreationVideoIsUnpopularLiveBroadcast, nil
		}
	} else {
		videoDuration, err = period.Parse(videoItem.ContentDetails.Duration)
		if err != nil {
			return nil, youTubeVideoEnqueueRequestCreationFailed, stacktrace.Propagate(err, "error parsing video duration")
		}

		if videoDuration.DurationApprox() > 35*time.Minute {
			return nil, youTubeVideoEnqueueRequestCreationVideoIsTooLong, nil
		}
	}

	request := &queueEntryYouTubeVideo{
		id:            videoItem.Id,
		title:         videoItem.Snippet.Title,
		channelTitle:  videoItem.Snippet.ChannelTitle,
		thumbnailURL:  videoItem.Snippet.Thumbnails.Default.Url,
		duration:      videoDuration.DurationApprox(),
		donePlaying:   event.New(),
		requestedBy:   &unknownUser{},
		unskippable:   unskippable,
		liveBroadcast: videoItem.Snippet.LiveBroadcastContent == "live",
	}

	userClaims := auth.UserClaimsFromContext(ctx)
	if userClaims != nil {
		request.requestedBy = userClaims
	}

	return request, youTubeVideoEnqueueRequestCreationSucceeded, nil
}
