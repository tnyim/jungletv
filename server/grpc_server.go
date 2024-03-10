package server

import (
	"context"
	"crypto/ecdsa"
	"encoding/hex"
	"log"
	"math/rand"
	"os"
	"strings"
	"sync"
	"time"

	"github.com/DisgoOrg/disgohook"
	"github.com/DisgoOrg/disgohook/api"
	goaway "github.com/TwiN/go-away"
	"github.com/btcsuite/btcd/btcec"
	"github.com/bwmarrin/snowflake"
	"github.com/hectorchu/gonano/rpc"
	"github.com/hectorchu/gonano/wallet"
	"github.com/palantir/stacktrace"
	"github.com/patrickmn/go-cache"
	"github.com/sethvargo/go-limiter"
	"github.com/sethvargo/go-limiter/memorystore"
	"github.com/tnyim/jungletv/buildconfig"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/segcha"
	"github.com/tnyim/jungletv/segcha/segchaproto"
	"github.com/tnyim/jungletv/server/auth"
	"github.com/tnyim/jungletv/server/components/appeditor"
	"github.com/tnyim/jungletv/server/components/apprunner"
	"github.com/tnyim/jungletv/server/components/apprunner/modules"
	"github.com/tnyim/jungletv/server/components/chatmanager"
	"github.com/tnyim/jungletv/server/components/configurationmanager"
	"github.com/tnyim/jungletv/server/components/enqueuemanager"
	"github.com/tnyim/jungletv/server/components/ipreputation"
	"github.com/tnyim/jungletv/server/components/mediaqueue"
	"github.com/tnyim/jungletv/server/components/nanswapclient"
	"github.com/tnyim/jungletv/server/components/notificationmanager"
	"github.com/tnyim/jungletv/server/components/oauth"
	"github.com/tnyim/jungletv/server/components/payment"
	"github.com/tnyim/jungletv/server/components/pointsmanager"
	"github.com/tnyim/jungletv/server/components/pricer"
	"github.com/tnyim/jungletv/server/components/rewards"
	"github.com/tnyim/jungletv/server/components/skipmanager"
	"github.com/tnyim/jungletv/server/components/staffactivitymanager"
	"github.com/tnyim/jungletv/server/components/stats"
	"github.com/tnyim/jungletv/server/components/turnstileclient"
	"github.com/tnyim/jungletv/server/components/withdrawalhandler"
	authinterceptor "github.com/tnyim/jungletv/server/interceptors/auth"
	"github.com/tnyim/jungletv/server/interceptors/version"
	"github.com/tnyim/jungletv/server/media"
	"github.com/tnyim/jungletv/server/media/applicationpage"
	"github.com/tnyim/jungletv/server/media/document"
	"github.com/tnyim/jungletv/server/media/soundcloud"
	"github.com/tnyim/jungletv/server/media/youtube"
	"github.com/tnyim/jungletv/server/stores/blockeduser"
	"github.com/tnyim/jungletv/server/stores/chat"
	"github.com/tnyim/jungletv/server/stores/moderation"
	"github.com/tnyim/jungletv/server/usercache"
	"github.com/tnyim/jungletv/types"
	"github.com/tnyim/jungletv/utils/event"
	"github.com/tnyim/jungletv/utils/simplelogger"
	"github.com/tnyim/jungletv/utils/transaction"
	"github.com/vburenin/nsync"
	"google.golang.org/api/option"
	youtubeapi "google.golang.org/api/youtube/v3"
	"gopkg.in/alexcesaro/statsd.v2"
)

type grpcServer struct {
	//proto.UnimplementedJungleTVServer
	proto.UnsafeJungleTVServer // disabling forward compatibility is exactly what we want in order to get compilation errors when we forget to implement a server method

	log                               *log.Logger
	statsClient                       *statsd.Client
	wallet                            *wallet.Wallet
	collectorAccount                  *wallet.Account
	collectorAccountQueue             chan func(*wallet.Account, *rpc.Client, *rpc.Client)
	skipAccount                       *wallet.Account
	rainAccount                       *wallet.Account
	jwtManager                        *auth.JWTManager
	thirdPartyAuthorizer              *auth.ThirdPartyAuthorizer
	enqueueRequestRateLimiter         limiter.Store
	enqueueRequestLongTermRateLimiter limiter.Store
	signInRateLimiter                 limiter.Store
	segchaRateLimiter                 limiter.Store
	mediaPreviewLimiter               limiter.Store
	ipReputationChecker               *ipreputation.Checker
	userSerializer                    auth.APIUserSerializer
	websiteURL                        string
	snowflakeNode                     *snowflake.Node

	oauthManager *oauth.Manager

	captchaImageDB         *segcha.ImageDatabase
	captchaFontPath        string
	captchaAnswers         *cache.Cache[string, []int]
	captchaChallengesQueue chan *segcha.Challenge
	captchaGenerationMutex sync.Mutex
	segchaClient           segchaproto.SegchaClient
	turnstileClient        *turnstileclient.Turnstile

	allowMediaEnqueuingMutex            sync.RWMutex
	allowMediaEnqueuing                 proto.AllowedMediaEnqueuingType
	allowMediaEnqueuingChanged          event.Event[allowedMediaEnqueuingChangedEventArgs]
	enqueuingPassword                   string
	enqueuingPasswordEdition            string
	enqueuingPasswordAttemptRateLimiter limiter.Store
	autoEnqueueVideos                   bool
	autoEnqueueVideoListFile            string
	ticketCheckPeriod                   time.Duration

	signInProcesses           *cache.Cache[string, *signInProcess]
	delegatorCountsPerRep     *cache.Cache[string, uint64]
	addressesWithGoodRepCache *cache.Cache[string, struct{}]

	mediaQueue           *mediaqueue.MediaQueue
	pricer               *pricer.Pricer
	enqueueManager       *enqueuemanager.Manager
	skipManager          *skipmanager.Manager
	rewardsHandler       *rewards.Handler
	withdrawalHandler    *withdrawalhandler.Handler
	statsRegistry        *stats.Registry
	chat                 *chatmanager.Manager
	pointsManager        *pointsmanager.Manager
	staffActivityManager *staffactivitymanager.Manager
	notificationManager  *notificationmanager.Manager
	moderationStore      moderation.Store
	nicknameCache        usercache.UserCache
	paymentAccountPool   *payment.PaymentAccountPool

	appEditor     *appeditor.AppEditor
	appRunner     *apprunner.AppRunner
	configManager *configurationmanager.Manager

	soundCloudProvider *soundcloud.TrackProvider
	mediaProviders     map[types.MediaType]media.Provider
	modLogWebhook      api.WebhookClient

	raffleSecretKey *ecdsa.PrivateKey

	announcementsUpdated event.Event[int]

	versionInterceptor *version.VersionInterceptor

	rewardHistoryMutex *nsync.NamedMutex

	typeScriptTypeDefinitionsFile string

	privilegedLabUserSecretKey string
}

// Options contains the required options to start the server
type Options struct {
	Log         *log.Logger
	StatsClient *statsd.Client

	Wallet                *wallet.Wallet
	OAuthManager          *oauth.Manager
	RepresentativeAddress string

	JWTManager         *auth.JWTManager
	AuthInterceptor    *authinterceptor.Interceptor
	VersionInterceptor *version.VersionInterceptor

	TicketCheckPeriod time.Duration
	IPCheckEndpoint   string
	YoutubeAPIkey     string
	RaffleSecretKey   string

	ModLogWebhook string

	SegchaClient    segchaproto.SegchaClient
	CaptchaImageDB  *segcha.ImageDatabase
	CaptchaFontPath string

	AppRunner     *apprunner.AppRunner
	ConfigManager *configurationmanager.Manager

	AutoEnqueueVideoListFile string
	QueueFile                string

	TypeScriptTypeDefinitionsFile string

	TenorAPIKey string

	WebsiteURL string

	NanswapAPIKey string

	TurnstileSecretKey string

	PrivilegedLabUserSecretKey string
}

// NewServer returns a new JungleTVServer
func NewServer(ctx context.Context, options Options) (*grpcServer, error) {
	authInterceptor := options.AuthInterceptor
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/RewardInfo", auth.UserPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/Withdraw", auth.UserPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/SendChatMessage", auth.UserPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/SetChatNickname", auth.UserPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/RewardHistory", auth.UserPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/WithdrawalHistory", auth.UserPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/RemoveOwnQueueEntry", auth.UserPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/MoveQueueEntry", auth.UserPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/ProduceSegchaChallenge", auth.UserPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/Connections", auth.UserPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/CreateConnection", auth.UserPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/RemoveConnection", auth.UserPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/SetProfileBiography", auth.UserPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/SetProfileFeaturedMedia", auth.UserPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/BlockUser", auth.UserPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/UnblockUser", auth.UserPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/BlockedUsers", auth.UserPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/PointsInfo", auth.UserPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/PointsTransactions", auth.UserPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/ChatGifSearch", auth.UserPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/ConvertBananoToPoints", auth.UserPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/StartOrExtendSubscription", auth.UserPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/IncreaseOrReduceSkipThreshold", auth.UserPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/InvalidateAuthTokens", auth.UserPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/AuthorizationProcessData", auth.UserPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/ConsentOrDissentToAuthorization", auth.UserPermissionLevel)

	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/ForciblyEnqueueTicket", auth.AdminPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/RemoveQueueEntry", auth.AdminPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/RemoveChatMessage", auth.AdminPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/SetChatSettings", auth.AdminPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/SetVideoEnqueuingEnabled", auth.AdminPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/UserBans", auth.AdminPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/BanUser", auth.AdminPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/RemoveBan", auth.AdminPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/UserVerifications", auth.AdminPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/VerifyUser", auth.AdminPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/RemoveUserVerification", auth.AdminPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/UserChatMessages", auth.AdminPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/DisallowedVideos", auth.AdminPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/AddDisallowedVideo", auth.AdminPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/RemoveDisallowedVideo", auth.AdminPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/UpdateDocument", auth.AdminPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/SetUserChatNickname", auth.AdminPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/SetPricesMultiplier", auth.AdminPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/SetMinimumPricesMultiplier", auth.AdminPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/SetCrowdfundedSkippingEnabled", auth.AdminPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/SetSkipPriceMultiplier", auth.AdminPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/ConfirmRaffleWinner", auth.AdminPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/CompleteRaffle", auth.AdminPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/RedrawRaffle", auth.AdminPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/TriggerAnnouncementsNotification", auth.AdminPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/SpectatorInfo", auth.AdminPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/ResetSpectatorStatus", auth.AdminPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/MonitorModerationStatus", auth.AdminPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/SetOwnQueueEntryRemovalAllowed", auth.AdminPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/SetQueueEntryReorderingAllowed", auth.AdminPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/SetNewQueueEntriesAlwaysUnskippable", auth.AdminPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/SetSkippingEnabled", auth.AdminPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/SetQueueInsertCursor", auth.AdminPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/ClearQueueInsertCursor", auth.AdminPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/ClearUserProfile", auth.AdminPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/MarkAsActivelyModerating", auth.AdminPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/StopActivelyModerating", auth.AdminPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/AdjustPointsBalance", auth.AdminPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/AddVipUser", auth.AdminPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/RemoveVipUser", auth.AdminPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/TriggerClientReload", auth.AdminPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/SetMulticurrencyPaymentsEnabled", auth.AdminPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/Documents", auth.AdminPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/InvalidateUserAuthTokens", auth.AdminPermissionLevel)

	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/Applications", auth.AppEditorPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/GetApplication", auth.AppEditorPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/UpdateApplication", auth.AppEditorPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/CloneApplication", auth.AppEditorPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/DeleteApplication", auth.AppEditorPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/ApplicationFiles", auth.AppEditorPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/GetApplicationFile", auth.AppEditorPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/UpdateApplicationFile", auth.AppEditorPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/CloneApplicationFile", auth.AppEditorPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/DeleteApplicationFile", auth.AppEditorPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/LaunchApplication", auth.AppEditorPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/StopApplication", auth.AppEditorPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/ApplicationLog", auth.AppEditorPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/ConsumeApplicationLog", auth.AppEditorPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/MonitorRunningApplications", auth.AppEditorPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/EvaluateExpressionOnApplication", auth.AppEditorPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/ExportApplication", auth.AppEditorPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/ImportApplication", auth.AppEditorPermissionLevel)
	authInterceptor.SetMinimumPermissionLevelForMethod("/jungletv.JungleTV/TypeScriptTypeDefinitions", auth.AppEditorPermissionLevel)

	ytClient, err := youtubeapi.NewService(ctx, option.WithAPIKey(options.YoutubeAPIkey))
	if err != nil {
		return nil, stacktrace.Propagate(err, "error creating YouTube client")
	}

	soundCloudProvider := soundcloud.NewProvider("api-widget.soundcloud.com", "LBCcHmRB8XSStWL6wKH2HPACspQlXg2P", "1658737030") // TODO unhardcode

	ytProvider, err := youtube.NewProvider(ytClient)
	if err != nil {
		return nil, stacktrace.Propagate(err, "error creating YouTube provider")
	}

	mediaProviders := map[types.MediaType]media.Provider{
		types.MediaTypeYouTubeVideo:    ytProvider,
		types.MediaTypeSoundCloudTrack: soundCloudProvider,
		types.MediaTypeDocument:        document.NewProvider(ctx),
		types.MediaTypeApplicationPage: applicationpage.NewProvider(),
	}

	mediaQueue, err := mediaqueue.New(ctx, options.Log, options.StatsClient, options.QueueFile, mediaProviders)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	modStore, err := moderation.NewStoreDatabase(ctx)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	userCache, err := usercache.NewInMemory()
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	s := &grpcServer{
		log:                        options.Log,
		wallet:                     options.Wallet,
		statsClient:                options.StatsClient,
		jwtManager:                 options.JWTManager,
		signInProcesses:            cache.New[string, *signInProcess](5*time.Minute, 1*time.Minute),
		delegatorCountsPerRep:      cache.New[string, uint64](1*time.Hour, 5*time.Minute),
		addressesWithGoodRepCache:  cache.New[string, struct{}](6*time.Hour, 5*time.Minute),
		mediaQueue:                 mediaQueue,
		collectorAccountQueue:      make(chan func(*wallet.Account, *rpc.Client, *rpc.Client), 10000),
		autoEnqueueVideoListFile:   options.AutoEnqueueVideoListFile,
		autoEnqueueVideos:          options.AutoEnqueueVideoListFile != "",
		allowMediaEnqueuing:        proto.AllowedMediaEnqueuingType_ENABLED,
		allowMediaEnqueuingChanged: event.New[allowedMediaEnqueuingChangedEventArgs](),
		ticketCheckPeriod:          options.TicketCheckPeriod,
		staffActivityManager:       staffactivitymanager.New(options.StatsClient),
		moderationStore:            modStore,
		nicknameCache:              userCache,
		websiteURL:                 options.WebsiteURL,
		versionInterceptor:         options.VersionInterceptor,
		notificationManager:        notificationmanager.NewManager(),

		appRunner:     options.AppRunner,
		configManager: options.ConfigManager,

		oauthManager: options.OAuthManager,

		captchaAnswers:         cache.New[string, []int](1*time.Hour, 5*time.Minute),
		captchaImageDB:         options.CaptchaImageDB,
		captchaFontPath:        options.CaptchaFontPath,
		captchaChallengesQueue: make(chan *segcha.Challenge, segchaPremadeQueueSize),
		segchaClient:           options.SegchaClient,
		turnstileClient:        turnstileclient.New(options.TurnstileSecretKey, 10*time.Second),

		mediaProviders:     mediaProviders,
		soundCloudProvider: soundCloudProvider.(*soundcloud.TrackProvider),

		announcementsUpdated: event.New[int](),

		rewardHistoryMutex: nsync.NewNamedMutex(),

		typeScriptTypeDefinitionsFile: options.TypeScriptTypeDefinitionsFile,

		privilegedLabUserSecretKey: options.PrivilegedLabUserSecretKey,
	}
	s.ipReputationChecker, err = ipreputation.NewChecker(ctx, options.Log, options.IPCheckEndpoint)
	if err != nil {
		return nil, stacktrace.Propagate(err, "failed to create IP reputation checker")
	}

	s.thirdPartyAuthorizer = auth.NewThirdPartyAuthorizer(s.jwtManager)
	s.userSerializer = s.serializeUserForAPI

	s.snowflakeNode, err = snowflake.NewNode(1)
	if err != nil {
		return nil, stacktrace.Propagate(err, "failed to create snowflake node")
	}

	if options.ModLogWebhook != "" {
		s.modLogWebhook, err = disgohook.NewWebhookClientByToken(nil, simplelogger.New(s.log, false), options.ModLogWebhook)
		if err != nil {
			return nil, stacktrace.Propagate(err, "")
		}

		if !buildconfig.DEBUG {
			_, err := s.modLogWebhook.SendContent("Server started. If this is not a planned restart, the server may have crashed.")
			if err != nil {
				s.log.Println("Failed to send mod log webhook regarding server start:", err)
			}
		}
	}

	s.enqueueRequestRateLimiter, err = memorystore.New(&memorystore.Config{
		Tokens:   5,
		Interval: time.Minute,
	})
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	s.enqueueRequestLongTermRateLimiter, err = memorystore.New(&memorystore.Config{
		Tokens:   100,
		Interval: time.Hour,
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

	s.segchaRateLimiter, err = memorystore.New(&memorystore.Config{
		Tokens:   4,
		Interval: 2 * time.Minute,
	})
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	s.mediaPreviewLimiter, err = memorystore.New(&memorystore.Config{
		Tokens:   4,
		Interval: 1 * time.Minute,
	})
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	s.enqueuingPasswordAttemptRateLimiter, err = memorystore.New(&memorystore.Config{
		Tokens:   3,
		Interval: 2 * time.Minute,
	})
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	err = s.setupSpecialAccounts(options.RepresentativeAddress)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	s.statsRegistry, err = stats.NewRegistry(s.log, s.statsClient)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	s.pricer = pricer.New(s.log, s.mediaQueue, s.statsRegistry)

	s.skipManager = skipmanager.New(s.log, s.wallet.RPC, s.skipAccount, s.rainAccount, s.collectorAccount.Address(), s.mediaQueue, s.pricer)

	nanswapClient := nanswapclient.New("https://api.nanswap.com/v1", options.NanswapAPIKey)

	s.paymentAccountPool = payment.New(s.log, s.statsClient, options.Wallet, options.RepresentativeAddress, s.modLogWebhook,
		payment.NewAmount(pricer.DustThreshold), s.collectorAccount.Address(), nanswapClient)

	s.appEditor = appeditor.New(s.log, s.appRunner, s.paymentAccountPool)

	s.pointsManager, err = pointsmanager.New(ctx, s.log, s.snowflakeNode, s.paymentAccountPool)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	chatStore := chat.NewStoreDatabase(s.log, s.nicknameCache)
	s.chat, err = chatmanager.New(s.log, s.statsClient, chatStore, s.moderationStore,
		blockeduser.NewStoreDatabase(), s.userSerializer, s.pointsManager, s.snowflakeNode, options.TenorAPIKey)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	s.withdrawalHandler = withdrawalhandler.New(s.log, s.statsClient, s.collectorAccountQueue, &s.wallet.RPC, s.modLogWebhook)

	challengeCheckers := map[rewards.ActivityChallengeType]rewards.ChallengeCheckFunction{
		rewards.ActivityChallengeTypeSegcha:    s.segchaResponseValid,
		rewards.ActivityChallengeTypeTurnstile: s.turnstileResponseValid,
	}

	s.rewardsHandler, err = rewards.NewHandler(
		s.log, options.StatsClient, s.mediaQueue, s.ipReputationChecker, s.withdrawalHandler, options.Wallet,
		s.collectorAccountQueue, s.skipManager, s.chat, s.pointsManager, s.notificationManager, s.paymentAccountPool,
		s.moderationStore, s.staffActivityManager, challengeCheckers, options.VersionInterceptor.VersionHash)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	s.staffActivityManager.SetAddressActivityMarker(s.rewardsHandler)
	s.pricer.SetEligibleSpectatorsEstimator(s.rewardsHandler)

	s.enqueueManager, err = enqueuemanager.New(ctx, s.log, s.statsClient, s.mediaQueue, s.pricer,
		s.paymentAccountPool, s.rewardsHandler, s.pointsManager, s.moderationStore, s.modLogWebhook)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	skBytes, err := hex.DecodeString(options.RaffleSecretKey)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	sk, _ := btcec.PrivKeyFromBytes(btcec.S256(), skBytes)
	s.raffleSecretKey = sk.ToECDSA()

	s.appRunner.SetModuleDependencies(modules.Dependencies{
		ModLogWebhook:                s.modLogWebhook,
		ChatManager:                  s.chat,
		PointsManager:                s.pointsManager,
		MediaQueue:                   s.mediaQueue,
		MediaProviders:               s.mediaProviders,
		Pricer:                       s.pricer,
		SkipManager:                  s.skipManager,
		OtherMediaQueueMethods:       &appRuntimeMiscMethods{s: s},
		PaymentAccountPool:           s.paymentAccountPool,
		DefaultAccountRepresentative: options.RepresentativeAddress,
		UserCache:                    s.nicknameCache,
	})

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

func (s *grpcServer) getChatFriendlyUserName(ctx context.Context, address string) (string, error) {
	name := "Someone"
	if len(address) > 14 && !goaway.IsProfane(address[:14]) {
		name = address[:14]
	}

	chatBanned, err := s.moderationStore.LoadUserBannedFromChat(ctx, address, "")
	if err != nil {
		return "", stacktrace.Propagate(err, "")
	}
	if !chatBanned {
		user, err := s.nicknameCache.GetOrFetchUser(ctx, address)
		if err != nil {
			return "", stacktrace.Propagate(err, "")
		}
		if user != nil && !user.IsUnknown() && user.Nickname() != nil {
			name = *user.Nickname()
		}
	}
	return name, nil
}

func (s *grpcServer) autoEnqueueNewVideo(ctx *transaction.WrappingContext) error {
	videoID, err := s.getRandomVideoForAutoEnqueue()
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	preInfo, result, err := s.mediaProviders[types.MediaTypeYouTubeVideo].BeginEnqueueRequest(ctx, &proto.EnqueueMediaRequest_YoutubeVideoData{
		YoutubeVideoData: &proto.EnqueueYouTubeVideoData{
			Id: videoID,
		},
	})
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	if result != media.EnqueueRequestCreationSucceeded {
		return stacktrace.NewError("enqueue request for video %s creation failed due to video characteristics", videoID)
	}

	request, result, err := s.mediaProviders[types.MediaTypeYouTubeVideo].ContinueEnqueueRequest(ctx, preInfo, false, false, false, false, false, false)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	if result != media.EnqueueRequestCreationSucceeded {
		return stacktrace.NewError("enqueue request for video %s creation failed", videoID)
	}

	ticket, err := s.enqueueManager.RegisterRequest(ctx, request, true)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	ticket.ForceEnqueuing(proto.ForcedTicketEnqueueType_ENQUEUE)
	s.log.Printf("Auto-enqueued video with ID %s", videoID)
	return nil
}

func (s *grpcServer) getRandomVideoForAutoEnqueue() (string, error) {
	b, err := os.ReadFile(s.autoEnqueueVideoListFile)
	if err != nil {
		return "", stacktrace.Propagate(err, "error reading auto enqueue videos from file: %v", err)
	}
	lines := strings.Split(strings.TrimSpace(string(b)), "\n")
	line := lines[rand.Intn(len(lines))]
	id := strings.TrimSpace(strings.Split(line, " ")[0])
	return id, nil
}

type allowedMediaEnqueuingChangedEventArgs struct {
	allowedMediaEnqueuing proto.AllowedMediaEnqueuingType
	passwordEdition       string
	passwordIsNumeric     bool
}
