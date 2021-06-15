package main

import (
	"context"
	"encoding/hex"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/gbl08ma/keybox"
	"github.com/gbl08ma/ssoclient"
	"github.com/gorilla/mux"
	"github.com/gorilla/sessions"
	"github.com/hectorchu/gonano/rpc"
	"github.com/hectorchu/gonano/wallet"
	"github.com/improbable-eng/grpc-web/go/grpcweb"
	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/server"
	"google.golang.org/grpc"
	"google.golang.org/grpc/grpclog"
)

var (
	secrets *keybox.Keybox

	mainLog = log.New(os.Stdout, "", log.Ldate|log.Ltime)
	apiLog  = log.New(os.Stdout, "api ", log.Ldate|log.Ltime)
	authLog = log.New(os.Stdout, "auth ", log.Ldate|log.Ltime)

	jwtManager *server.JWTManager

	// GitCommit is provided by govvv at compile-time
	GitCommit = "???"
	// BuildDate is provided by govvv at compile-time
	BuildDate = "???"
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
		mainLog.Fatalln("SSO keybox not present in web keybox")
	}

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

	repAddress, present := secrets.Get("representative")
	if !present {
		mainLog.Fatalln("Representative address not present in keybox")
	}

	jwtManager = server.NewJWTManager(jwtKey)
	apiServer, err := server.NewServer(ctx, apiLog, statsClient, wallet, youtubeAPIkey, jwtManager,
		queueFile, autoEnqueueVideoListFile, repAddress)
	if err != nil {
		mainLog.Fatalln(err)
	}

	httpServer, err := buildHTTPserver(apiServer, jwtManager)
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

func buildHTTPserver(apiServer proto.JungleTVServer, jwtManager *server.JWTManager) (*http.Server, error) {
	authInterceptor := server.NewAuthInterceptor(jwtManager, &authorizer{})

	grpcServer := grpc.NewServer(
		grpc.UnaryInterceptor(authInterceptor.Unary()),
		grpc.StreamInterceptor(authInterceptor.Stream()))
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
		Addr:    ServerListenAddr,
		Handler: http.HandlerFunc(handler),
	}, nil
}

func serve(httpServer *http.Server, certFile string, keyFile string) {
	if err := httpServer.ListenAndServeTLS(certFile, keyFile); err != nil {
		apiLog.Fatalf("failed starting http2 server: %v", err)
	}
}

func configureRouter(router *mux.Router) {
	router.HandleFunc("/admin/signin", authInitHandler)
	router.HandleFunc("/admin/auth", authHandler)
	router.PathPrefix("/assets").Handler(http.StripPrefix("/assets", http.FileServer(http.Dir("app/public/assets/"))))
	router.PathPrefix("/build").Handler(http.StripPrefix("/build", http.FileServer(http.Dir("app/public/build/"))))
	router.PathPrefix("/favicon.ico").Handler(http.FileServer(http.Dir("app/public/")))
	router.PathPrefix("/favicon.png").Handler(http.FileServer(http.Dir("app/public/")))
	router.PathPrefix("/apple-icon.png").Handler(http.FileServer(http.Dir("app/public/")))
	// Catch-all: Serve our JavaScript application's entry-point (index.html).
	router.PathPrefix("/").Handler(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "app/public/index.html")
	}))
}
