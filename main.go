package main

import (
	"context"
	"crypto/sha256"
	"encoding/base64"
	"encoding/hex"
	"html/template"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	sq "github.com/Masterminds/squirrel"
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
	_ "github.com/lib/pq"
	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/server"
	"github.com/tnyim/jungletv/types"
	"google.golang.org/grpc"
	"google.golang.org/grpc/grpclog"
)

var (
	rdb           *sqlx.DB
	sdb           sq.StatementBuilderType
	rootSqalxNode sqalx.Node
	secrets       *keybox.Keybox

	mainLog = log.New(os.Stdout, "", log.Ldate|log.Ltime)
	dbLog   = log.New(os.Stdout, "db ", log.Ldate|log.Ltime)
	apiLog  = log.New(os.Stdout, "api ", log.Ldate|log.Ltime)
	webLog  = log.New(os.Stdout, "web ", log.Ldate|log.Ltime)
	authLog = log.New(os.Stdout, "auth ", log.Ldate|log.Ltime)

	jwtManager *server.JWTManager

	// GitCommit is provided by govvv at compile-time
	GitCommit = "???"
	// BuildDate is provided by govvv at compile-time
	BuildDate = "???"

	versionHash = ""
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
	sdb = sq.StatementBuilder.PlaceholderFormat(sq.Dollar).RunWith(rdb)

	rootSqalxNode, err = sqalx.New(rdb)
	if err != nil {
		mainLog.Fatalln(err)
	}
	ctx = context.WithValue(ctx, "SqalxNode", rootSqalxNode)

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

	bansFile, present := secrets.Get("bansFile")
	if !present {
		mainLog.Println("Bans file path not present in keybox, will not persist moderation decisions")
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
			mainLog.Println("SSO keybox not present in web keybox. Anyone will be signed in as admin as soon as they ask. This is UNSAFE.")
		} else {
			mainLog.Fatalln("SSO keybox not present in web keybox")
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

	ipCheckToken, present := secrets.Get("ipCheckToken")
	if !present {
		mainLog.Fatalln("IP check token not present in keybox")
	}

	hCaptchaSecret, present := secrets.Get("hCaptchaSecret")
	if !present {
		mainLog.Fatalln("hCaptcha secret not present in keybox")
	}

	modLogWebhook, present := secrets.Get("modLogWebhook")
	if !present {
		mainLog.Println("ModLog webhook not present in keybox, will not send moderation log to Discord")
	}

	jwtManager = server.NewJWTManager(jwtKey)
	apiServer, err := server.NewServer(ctx, apiLog, statsClient, wallet, youtubeAPIkey, jwtManager,
		queueFile, bansFile, autoEnqueueVideoListFile, repAddress, ticketCheckPeriod,
		ipCheckEndpoint, ipCheckToken, hCaptchaSecret, modLogWebhook)
	if err != nil {
		mainLog.Fatalln(err)
	}

	listenAddr, present := secrets.Get("listenAddress")
	if !present {
		listenAddr = ServerListenAddr
	}

	httpServer, err := buildHTTPserver(apiServer, jwtManager, listenAddr)
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
	h := sha256.New()
	h.Write([]byte(BuildDate + GitCommit))
	versionHash = base64.StdEncoding.EncodeToString(h.Sum(nil))[:10]
	grpclog.SetLogger(apiLog)
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

func buildHTTPserver(apiServer proto.JungleTVServer, jwtManager *server.JWTManager, listenAddr string) (*http.Server, error) {
	sqalxInterceptor := &sqalxInterceptor{rootNode: rootSqalxNode}
	versionInterceptor := server.NewVersionInterceptor(versionHash)
	authInterceptor := server.NewAuthInterceptor(jwtManager, &authorizer{})

	unaryInterceptor := grpc_middleware.ChainUnaryServer(sqalxInterceptor.Unary(), versionInterceptor.Unary(), authInterceptor.Unary())
	streamInterceptor := grpc_middleware.ChainStreamServer(sqalxInterceptor.Stream(), versionInterceptor.Stream(), authInterceptor.Stream())
	grpcServer := grpc.NewServer(
		grpc.UnaryInterceptor(unaryInterceptor),
		grpc.StreamInterceptor(streamInterceptor))
	proto.RegisterJungleTVServer(grpcServer, apiServer)

	router := mux.NewRouter().StrictSlash(true)
	configureRouter(router)

	wrappedServer := grpcweb.WrapServer(grpcServer)
	handler := func(resp http.ResponseWriter, req *http.Request) {
		/*if req.ProtoMajor != 2 {
			router.ServeHTTP(resp, req)
			return
		}*/
		if strings.Contains(req.Header.Get("Content-Type"), "application/grpc") ||
			strings.Contains(req.Header.Get("Access-Control-Request-Headers"), "x-grpc-web") {
			resp.Header().Set("Access-Control-Allow-Origin", "*")
			resp.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
			resp.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, X-User-Agent, X-Grpc-Web")
			/*resp.Header().Set("grpc-status", "")
			resp.Header().Set("grpc-message", "")*/
			wrappedServer.ServeHTTP(resp, req)
			return
		}
		router.ServeHTTP(resp, req)
	}

	return &http.Server{
		Addr:    listenAddr,
		Handler: http.HandlerFunc(handler),
	}, nil
}

func serve(httpServer *http.Server, certFile string, keyFile string) {
	if err := httpServer.ListenAndServeTLS(certFile, keyFile); err != nil {
		apiLog.Fatalf("failed starting http2 server: %v", err)
	}
}

func configureRouter(router *mux.Router) {
	webtemplate := template.Must(template.New("index.html").ParseGlob("app/public/*.template"))

	if DEBUG && daClient == nil {
		router.HandleFunc("/admin/signin", directUnsafeAuthHandler)
	} else {
		router.HandleFunc("/admin/signin", authInitHandler)
	}
	router.HandleFunc("/admin/auth", authHandler)
	router.PathPrefix("/assets").Handler(http.StripPrefix("/assets", http.FileServer(http.Dir("app/public/assets/"))))
	router.PathPrefix("/build").Handler(http.StripPrefix("/build", http.FileServer(http.Dir("app/public/build/"))))
	router.PathPrefix("/favicon.ico").Handler(http.FileServer(http.Dir("app/public/")))
	router.PathPrefix("/favicon.png").Handler(http.FileServer(http.Dir("app/public/")))
	router.PathPrefix("/apple-icon.png").Handler(http.FileServer(http.Dir("app/public/")))
	// Catch-all: Serve our JavaScript application's entry-point (index.html).
	router.PathPrefix("/").Handler(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		err := webtemplate.ExecuteTemplate(w, "index.template", struct {
			VersionHash string
		}{
			VersionHash: versionHash,
		})
		if err != nil {
			webLog.Println(err)
			w.WriteHeader(http.StatusInternalServerError)
		}
	}))
}
