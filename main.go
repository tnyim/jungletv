package main

import (
	"context"
	"crypto/sha256"
	"crypto/tls"
	"encoding/base64"
	"encoding/hex"
	"fmt"
	"html/template"
	"io"
	"log"
	"mime"
	"net/http"
	"net/http/pprof"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/dyson/certman"
	"github.com/gbl08ma/keybox"
	"github.com/gbl08ma/sqalx"
	"github.com/gbl08ma/ssoclient"
	"github.com/gorilla/mux"
	"github.com/gorilla/sessions"
	grpc_middleware "github.com/grpc-ecosystem/go-grpc-middleware"
	"github.com/hectorchu/gonano/rpc"
	"github.com/hectorchu/gonano/wallet"
	"github.com/improbable-eng/grpc-web/go/grpcweb"
	"github.com/jmoiron/sqlx"
	"github.com/klauspost/compress/gzhttp"
	_ "github.com/lib/pq"
	"github.com/palantir/stacktrace"
	uuid "github.com/satori/go.uuid"
	"github.com/tnyim/jungletv/httpserver"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/segcha"
	"github.com/tnyim/jungletv/segcha/segchaproto"
	"github.com/tnyim/jungletv/server"
	"github.com/tnyim/jungletv/server/auth"
	"github.com/tnyim/jungletv/server/components/apprunner"
	"github.com/tnyim/jungletv/server/components/configurationmanager"
	"github.com/tnyim/jungletv/server/components/oauth"
	authinterceptor "github.com/tnyim/jungletv/server/interceptors/auth"
	"github.com/tnyim/jungletv/server/interceptors/version"
	"github.com/tnyim/jungletv/types"
	"github.com/tnyim/jungletv/utils/event"
	"github.com/tnyim/jungletv/utils/transaction"
	"golang.org/x/oauth2"
	"google.golang.org/grpc"
	"google.golang.org/grpc/grpclog"
)

var (
	rdb           *sqlx.DB
	rootSqalxNode sqalx.Node
	secrets       *keybox.Keybox

	mainLog = log.New(os.Stdout, "", log.Ldate|log.Ltime)
	dbLog   = log.New(os.Stdout, "db ", log.Ldate|log.Ltime)
	apiLog  = log.New(os.Stdout, "api ", log.Ldate|log.Ltime)
	grpcLog = log.New(os.Stdout, "grpc ", log.Ldate|log.Ltime)
	webLog  = log.New(os.Stdout, "web ", log.Ldate|log.Ltime)
	authLog = log.New(os.Stdout, "auth ", log.Ldate|log.Ltime)

	jwtManager *auth.JWTManager

	// GitCommit is provided by govvv at compile-time
	GitCommit = "???"
	// BuildDate is provided by govvv at compile-time
	BuildDate = "???"

	forcedClientReloads = 0
	baseVersionHash     = ""
	versionHash         = ""
)

func main() {
	ctx := context.Background()
	var err error
	mainLog.Println("Server starting, opening keybox...")
	secrets, err = keybox.Open(SecretsPath)
	if err != nil {
		mainLog.Fatalln(err)
	}
	mainLog.Println("Keybox opened")

	mainLog.Println("Opening database...")
	databaseURI, present := secrets.Get("databaseURI")
	if !present {
		mainLog.Fatalln("Database connection string not present in keybox")
	}
	rdb, err = sqlx.Open("postgres", databaseURI)
	if err != nil {
		mainLog.Fatalln(err)
	}
	defer rdb.Close()

	err = rdb.Ping()
	if err != nil {
		mainLog.Fatalln(err)
	}
	rdb.SetMaxOpenConns(MaxDBconnectionPoolSize)

	rootSqalxNode, err = sqalx.New(rdb)
	if err != nil {
		mainLog.Fatalln(err)
	}
	ctx = transaction.ContextWithBaseSqalxNode(ctx, rootSqalxNode)

	if LogDBQueries {
		types.SetLogger(dbLog)
	}
	mainLog.Println("Database opened")

	statsClient, err := buildStatsClient()
	if err != nil {
		mainLog.Fatalln(err)
	}
	defer statsClient.Close()

	wallet, err := buildWallet(secrets)
	if err != nil {
		mainLog.Fatalln(err)
	}

	youtubeAPIkey, present := secrets.Get("youtubeAPIkey")
	if !present {
		mainLog.Fatalln("YouTube API key not present in keybox")
	}

	jwtKeyStr, present := secrets.Get("jwtKey")
	if !present {
		mainLog.Fatalln("JWT key not present in keybox")
	}
	jwtKey, err := hex.DecodeString(jwtKeyStr)
	if err != nil {
		mainLog.Fatalln("Invalid JWT key specified")
	}

	certFile, present := secrets.Get("certFile")
	if !present {
		mainLog.Fatalln("Cert file path not present in keybox")
	}

	keyFile, present := secrets.Get("keyFile")
	if !present {
		mainLog.Fatalln("Key file path not present in keybox")
	}

	queueFile, present := secrets.Get("queueFile")
	if !present {
		mainLog.Println("Queue file path not present in keybox, will not persist queue")
	}

	autoEnqueueVideoListFile, present := secrets.Get("autoEnqueueVideosFile")
	if !present {
		mainLog.Println("Auto enqueue videos file path not present in keybox, will not auto enqueue videos")
	}

	websiteURL, present = secrets.Get("websiteURL")
	if !present {
		mainLog.Fatalln("Website URL not present in keybox")
	}

	ssoKeybox, present := secrets.GetBox("sso")
	if !present {
		if DEBUG {
			mainLog.Println("SSO keybox not present in keybox. Anyone will be signed in as admin as soon as they ask. This is UNSAFE.")
		} else {
			mainLog.Fatalln("SSO keybox not present in keybox")
		}
	} else {
		ssoCookieAuthKey, present := ssoKeybox.Get("cookieAuthKey")
		if !present {
			mainLog.Fatalln("SSO cookie auth key not present in keybox")
		}

		ssoCookieCipherKey, present := ssoKeybox.Get("cookieCipherKey")
		if !present {
			mainLog.Fatalln("SSO cookie cipher key not present in keybox")
		}

		sessionStore = sessions.NewCookieStore(
			[]byte(ssoCookieAuthKey),
			[]byte(ssoCookieCipherKey))

		ssoEndpointURL, present := ssoKeybox.Get("endpoint")
		if !present {
			mainLog.Fatalln("SSO Endpoint URL not present in keybox")
		}
		ssoAPIkey, present := ssoKeybox.Get("key")
		if !present {
			mainLog.Fatalln("SSO API key not present in keybox")
		}

		ssoAPIsecret, present := ssoKeybox.Get("secret")
		if !present {
			mainLog.Fatalln("SSO API secret not present in keybox")
		}

		daClient, err = ssoclient.NewSSOClient(ssoEndpointURL, ssoAPIkey, ssoAPIsecret)
		if err != nil {
			mainLog.Fatalln("Failed to create SSO client: ", err)
		}
	}

	repAddress, present := secrets.Get("representative")
	if !present {
		mainLog.Fatalln("Representative address not present in keybox")
	}

	ticketCheckPeriodMillis, present := secrets.Get("ticketCheckPeriod")
	ticketCheckPeriod := 10 * time.Second
	if present {
		period, err := strconv.Atoi(ticketCheckPeriodMillis)
		if err != nil {
			mainLog.Fatalln("invalid ticketCheckPeriod:", err)
		}
		ticketCheckPeriod = time.Duration(period) * time.Millisecond
	}

	ipCheckEndpoint, present := secrets.Get("ipCheckEndpoint")
	if !present {
		mainLog.Fatalln("IP check endpoint not present in keybox")
	}

	modLogWebhook, present := secrets.Get("modLogWebhook")
	if !present {
		mainLog.Println("ModLog webhook not present in keybox, will not send moderation log to Discord")
	}

	segchaKeybox, present := secrets.GetBox("segcha")
	if !present {
		mainLog.Fatalln("segcha keybox not present in keybox")
	}

	segchaImageDBPath, present := segchaKeybox.Get("imageDBPath")
	if !present {
		mainLog.Fatalln("Image DB path not present in segcha keybox")
	}

	segchaFontPath, present := segchaKeybox.Get("fontPath")
	if !present {
		mainLog.Fatalln("Font path not present in segcha keybox")
	}

	var segchaClient segchaproto.SegchaClient
	segchaServerAddress, present := segchaKeybox.Get("serverAddress")
	if !present {
		mainLog.Println("segcha server address not present in keybox, will use local challenge generation")
	} else {
		var segchaClientClose func() error
		segchaClient, segchaClientClose, err = segcha.NewClient(ctx, segchaServerAddress)
		if err != nil {
			segchaClient = nil
			mainLog.Println("Failed to create segcha client, will use local challenge generation: ", err)
		} else {
			defer func() {
				_ = segchaClientClose()
			}()
		}
	}

	imageDB, err := segcha.NewImageDatabase(segchaImageDBPath)
	if err != nil {
		mainLog.Fatalln("error building segcha image DB:", err)
	}

	raffleSecretKey, present := secrets.Get("raffleSecretKey")
	if !present {
		mainLog.Fatalln("Raffle secret key not present in segcha keybox")
	}

	oauthKeybox, present := secrets.GetBox("oauth")
	if !present {
		mainLog.Fatalln("OAuth keybox not present in keybox")
	}

	cmKeybox, present := oauthKeybox.GetBox("cryptomonkeys")
	if !present {
		mainLog.Fatalln("cryptomonKeys keybox not present in OAuth keybox")
	}

	cmClientID, present := cmKeybox.Get("clientID")
	if !present {
		mainLog.Fatalln("client ID not present in cryptomonKeys keybox")
	}

	cmClientSecret, present := cmKeybox.Get("clientSecret")
	if !present {
		mainLog.Fatalln("client secret not present in cryptomonKeys keybox")
	}

	tenorAPIKey, present := secrets.Get("tenorAPIkey")
	if !present {
		mainLog.Fatalln("Tenor API key not present in keybox")
	}

	nanswapAPIKey, present := secrets.Get("nanswapAPIkey")
	if !present {
		mainLog.Println("Nanswap API key not present in keybox, multicurrency functions will not work properly")
	}

	turnstileSecretKey, present := secrets.Get("turnstileSecretKey")
	if !present {
		mainLog.Fatalln("Cloudflare Turnstile Secret key not present in keybox")
	}

	jwtManager = auth.NewJWTManager(jwtKey, map[auth.PermissionLevel]time.Duration{
		auth.UserPermissionLevel:  180 * 24 * time.Hour,
		auth.AdminPermissionLevel: 7 * 24 * time.Hour,
	})
	authInterceptor := authinterceptor.New(jwtManager, &authorizer{})

	oauthManager := oauth.NewManager()

	oauthManager.RegisterConnectionService(types.ConnectionServiceCryptomonKeys, &oauth2.Config{
		RedirectURL:  websiteURL + "/oauth/monkeyconnect/callback",
		Scopes:       []string{"name"},
		ClientID:     cmClientID,
		ClientSecret: cmClientSecret,
		Endpoint: oauth2.Endpoint{
			AuthURL:  "https://connect.cryptomonkeys.cc/o/authorize",
			TokenURL: "https://connect.cryptomonkeys.cc/o/token/", // the trailing slash is needed
		},
	})

	configManager := configurationmanager.New(ctx)
	options := server.Options{
		DebugBuild:               DEBUG,
		Log:                      apiLog,
		StatsClient:              statsClient,
		Wallet:                   wallet,
		RepresentativeAddress:    repAddress,
		JWTManager:               jwtManager,
		AuthInterceptor:          authInterceptor,
		TicketCheckPeriod:        ticketCheckPeriod,
		IPCheckEndpoint:          ipCheckEndpoint,
		YoutubeAPIkey:            youtubeAPIkey,
		RaffleSecretKey:          raffleSecretKey,
		ModLogWebhook:            modLogWebhook,
		SegchaClient:             segchaClient,
		CaptchaImageDB:           imageDB,
		CaptchaFontPath:          segchaFontPath,
		AutoEnqueueVideoListFile: autoEnqueueVideoListFile,
		QueueFile:                queueFile,
		TenorAPIKey:              tenorAPIKey,
		WebsiteURL:               websiteURL,
		VersionHash:              &versionHash,
		OAuthManager:             oauthManager,
		NanswapAPIKey:            nanswapAPIKey,
		TurnstileSecretKey:       turnstileSecretKey,
		ConfigManager:            configManager,
		AppRunner:                apprunner.New(ctx, apiLog, configManager),
	}

	apiServer, err := server.NewServer(ctx, options)
	if err != nil {
		mainLog.Fatalln(err)
	}

	defer apiServer.ClientReloadTriggered().SubscribeUsingCallback(event.BufferFirst, func() {
		forcedClientReloads++
		versionHash = fmt.Sprintf("%s-%d", baseVersionHash, forcedClientReloads)
		apiServer.NotifyVersionHashChanged()
	})()

	listenAddr, present := secrets.Get("listenAddress")
	if !present {
		listenAddr = ServerListenAddr
	}

	httpServer, err := buildHTTPserver(apiServer, jwtManager, authInterceptor, listenAddr, certFile, keyFile, options)
	if err != nil {
		mainLog.Fatalln(err)
	}

	go apiServer.Worker(ctx, func(e error) {
		mainLog.Println(e)
	})
	go serve(httpServer, certFile, keyFile)

	mainLog.Println("Ready")

	// wait forever
	select {}
}

func init() {
	if !DEBUG {
		grpcLog = log.New(io.Discard, "grpc ", log.Ldate|log.Ltime)
	}
	h := sha256.New()
	h.Write([]byte(BuildDate + GitCommit))
	baseVersionHash = base64.StdEncoding.EncodeToString(h.Sum(nil))[:10]
	versionHash = fmt.Sprintf("%s-%d", baseVersionHash, forcedClientReloads)
	grpclog.SetLogger(grpcLog)
}

func buildWallet(secrets *keybox.Keybox) (*wallet.Wallet, error) {
	seedHex, present := secrets.Get("walletSeed")
	if !present {
		return nil, stacktrace.NewError("wallet seed not present in keybox")
	}
	seed, err := hex.DecodeString(seedHex)
	if err != nil {
		return nil, stacktrace.Propagate(err, "failed to decode seed")
	}

	wallet, err := wallet.NewBananoWallet(seed)
	if err != nil {
		return nil, stacktrace.Propagate(err, "failed to create wallet")
	}
	wallet.WorkDifficulty = "fffffe0000000000"
	wallet.ReceiveWorkDifficulty = "fffffe0000000000"

	walletRPCAddress, present := secrets.Get("walletRPCAddress")
	if present {
		wallet.RPC = rpc.Client{URL: walletRPCAddress}
	}

	walletWorkRPCAddress, present := secrets.Get("walletWorkRPCAddress")
	if present {
		wallet.RPCWork = rpc.Client{URL: walletWorkRPCAddress}
	}
	return wallet, nil
}

func buildHTTPserver(apiServer proto.JungleTVServer, jwtManager *auth.JWTManager, authInterceptor *authinterceptor.Interceptor, listenAddr, certFile, keyFile string, options server.Options) (*http.Server, error) {
	sqalxInterceptor := transaction.NewInterceptor(rootSqalxNode)
	versionInterceptor := version.New(&versionHash)

	unaryInterceptor := grpc_middleware.ChainUnaryServer(sqalxInterceptor.Unary(), versionInterceptor.Unary(), authInterceptor.Unary())
	streamInterceptor := grpc_middleware.ChainStreamServer(sqalxInterceptor.Stream(), versionInterceptor.Stream(), authInterceptor.Stream())
	grpcServer := grpc.NewServer(
		grpc.UnaryInterceptor(unaryInterceptor),
		grpc.StreamInterceptor(streamInterceptor))
	proto.RegisterJungleTVServer(grpcServer, apiServer)

	gzipWrapper, err := gzhttp.NewWrapper()
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	router := mux.NewRouter().StrictSlash(true)
	router.Use(func(next http.Handler) http.Handler {
		return gzipWrapper(next)
	})
	httpServerSubrouter := router.NewRoute().Subrouter()

	httpServerSubrouter.Use(func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(rw http.ResponseWriter, r *http.Request) {
			newCtx := transaction.ContextWithBaseSqalxNode(r.Context(), rootSqalxNode)
			next.ServeHTTP(rw, r.WithContext(newCtx))
		})
	})
	err = httpserver.New(httpServerSubrouter, webLog, options.OAuthManager, options.AppRunner, options.WebsiteURL, options.RaffleSecretKey)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	configureRouter(router)

	mime.AddExtensionType(".js", "text/javascript") // https://github.com/golang/go/issues/32350
	wrappedServer := grpcweb.WrapServer(grpcServer)
	handler := func(resp http.ResponseWriter, req *http.Request) {
		/*if req.ProtoMajor != 2 {
			router.ServeHTTP(resp, req)
			return
		}*/
		if strings.Contains(req.Header.Get("Content-Type"), "application/grpc") ||
			strings.Contains(req.Header.Get("Access-Control-Request-Headers"), "x-grpc-web") {
			resp.Header().Set("Access-Control-Allow-Origin", websiteURL)
			resp.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
			resp.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, X-User-Agent, X-Grpc-Web")
			/*resp.Header().Set("grpc-status", "")
			resp.Header().Set("grpc-message", "")*/
			gzipWrapper(wrappedServer).ServeHTTP(resp, req)
			return
		}

		resp.Header().Set("Access-Control-Allow-Origin", websiteURL)
		resp.Header().Set("X-Frame-Options", "deny")
		resp.Header().Set("X-Content-Type-Options", "nosniff")
		// remember to edit the CSP in index.template too
		resp.Header().Set("Content-Security-Policy", "default-src https:; script-src 'self' https://youtube.com https://www.youtube.com https://w.soundcloud.com https://challenges.cloudflare.com; frame-src 'self' https://youtube.com https://www.youtube.com https://w.soundcloud.com https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline'; img-src https: data:")
		resp.Header().Set("Referrer-Policy", "strict-origin")
		resp.Header().Set("Permissions-Policy", "accelerometer=*, autoplay=*, encrypted-media=*, fullscreen=*, gyroscope=*, picture-in-picture=*, clipboard-write=*")
		resp.Header().Set("Cross-Origin-Opener-Policy", "same-origin")
		resp.Header().Set("Strict-Transport-Security", "max-age=31536000")
		router.ServeHTTP(resp, req)
	}

	cm, err := certman.New(certFile, keyFile)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	cm.Logger(webLog)
	err = cm.Watch()
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	return &http.Server{
		Addr:    listenAddr,
		Handler: http.HandlerFunc(handler),
		TLSConfig: &tls.Config{
			GetCertificate: cm.GetCertificate,
		},
	}, nil
}

func serve(httpServer *http.Server, certFile string, keyFile string) {
	if err := httpServer.ListenAndServeTLS(certFile, keyFile); err != nil {
		apiLog.Fatalf("failed starting http2 server: %v", err)
	}
}

func configureRouter(router *mux.Router) {
	webtemplate := template.Must(template.New("index.html").ParseGlob("app/public/*.template"))

	if DEBUG {
		router.HandleFunc("/debug/pprof/", pprof.Index)
		router.HandleFunc("/debug/pprof/cmdline", pprof.Cmdline)
		router.HandleFunc("/debug/pprof/profile", pprof.Profile)
		router.HandleFunc("/debug/pprof/symbol", pprof.Symbol)
		router.HandleFunc("/debug/pprof/trace", pprof.Trace)
		router.PathPrefix("/debug/pprof/").HandlerFunc(pprof.Index)
	}

	if DEBUG && daClient == nil {
		router.HandleFunc("/admin/signin", directUnsafeAuthHandler)
	} else {
		router.HandleFunc("/admin/signin", authInitHandler)
	}
	router.HandleFunc("/admin/auth", authHandler)
	router.PathPrefix("/assets").Handler(http.StripPrefix("/assets", http.FileServer(http.Dir("app/public/assets/"))))
	router.PathPrefix("/emotes").Handler(http.StripPrefix("/emotes", http.FileServer(http.Dir("app/public/emotes/"))))
	router.PathPrefix("/build/swbundle.js").Handler(addServiceWorkerHeaders(http.StripPrefix("/build", http.FileServer(http.Dir("app/public/build/")))))
	router.PathPrefix("/build").Handler(http.StripPrefix("/build", http.FileServer(http.Dir("app/public/build/"))))
	router.PathPrefix("/favicon.ico").Handler(http.FileServer(http.Dir("app/public/")))
	router.PathPrefix("/favicon.png").Handler(http.FileServer(http.Dir("app/public/")))
	router.PathPrefix("/apple-icon.png").Handler(http.FileServer(http.Dir("app/public/")))
	router.PathPrefix("/banano.json").Handler(http.FileServer(http.Dir("app/public/")))
	router.PathPrefix("/jungletv.webmanifest").Handler(http.FileServer(http.Dir("app/public/")))
	// Catch-all: Serve our JavaScript application's entry-point (index.html).
	router.PathPrefix("/").Handler(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		templateData := struct {
			VersionHash string
			FullURL     string
		}{
			FullURL:     websiteURL + r.URL.Path,
			VersionHash: versionHash,
		}
		if DEBUG {
			templateData.VersionHash += "###" + uuid.NewV4().String()
		}
		err := webtemplate.ExecuteTemplate(w, "index.template", templateData)
		if err != nil {
			webLog.Println(err)
			w.WriteHeader(http.StatusInternalServerError)
		}
	}))
}

func addServiceWorkerHeaders(fn http.Handler) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Service-Worker-Allowed", "/")
		fn.ServeHTTP(w, r)
	}
}
