package httpserver

import (
	"context"
	"crypto/ecdsa"
	"log"
	"net/http"
	"net/http/pprof"

	"github.com/gbl08ma/ssoclient"
	"github.com/gorilla/mux"
	"github.com/gorilla/sessions"
	"github.com/klauspost/compress/gzhttp"
	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/buildconfig"
	"github.com/tnyim/jungletv/server/auth"
	"github.com/tnyim/jungletv/server/components/apprunner"
	"github.com/tnyim/jungletv/server/components/oauth"
	"github.com/tnyim/jungletv/server/components/raffle"
	"github.com/tnyim/jungletv/server/interceptors/version"
)

type HTTPServer struct {
	log                *log.Logger
	authLog            *log.Logger
	websiteURL         string
	raffleSecretKey    *ecdsa.PrivateKey
	jwtManager         *auth.JWTManager
	oauthManager       *oauth.Manager
	appRunner          *apprunner.AppRunner
	versionInterceptor *version.VersionInterceptor
	signatureVerifier  SignatureVerifier
	templateCache      *templateCache
	ssoCookieStore     *sessions.CookieStore                    // optional, needed if daClient is not nil
	daClient           *ssoclient.SSOClient                     // optional
	basicAuthChecker   func(ip, username, password string) bool // optional
}

type SignatureVerifier interface {
	VerifySignature(ctx context.Context, processID string, signature []byte, submissionMethod string) error
}

func New(
	log *log.Logger,
	authLog *log.Logger,
	jwtManager *auth.JWTManager,
	oauthManager *oauth.Manager,
	appRunner *apprunner.AppRunner,
	websiteURL string,
	raffleSecretKey string,
	versionInterceptor *version.VersionInterceptor,
	signatureVerifier SignatureVerifier,
	daClient *ssoclient.SSOClient,
	ssoCookieStore *sessions.CookieStore,
	basicAuthChecker func(ip, username, password string) bool) (http.Handler, error) {
	key, err := raffle.DecodeSecretKey(raffleSecretKey)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	templateCache, err := newTemplateCache(log, versionInterceptor, websiteURL)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	s := &HTTPServer{
		log:                log,
		authLog:            authLog,
		websiteURL:         websiteURL,
		raffleSecretKey:    key,
		jwtManager:         jwtManager,
		oauthManager:       oauthManager,
		appRunner:          appRunner,
		versionInterceptor: versionInterceptor,
		signatureVerifier:  signatureVerifier,
		templateCache:      templateCache,
		ssoCookieStore:     ssoCookieStore,
		daClient:           daClient,
		basicAuthChecker:   basicAuthChecker,
	}

	gzipWrapper, err := gzhttp.NewWrapper()
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	router := mux.NewRouter().StrictSlash(true)
	router.Use(func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Access-Control-Allow-Origin", s.websiteURL)
			w.Header().Set("X-Frame-Options", "deny")
			w.Header().Set("X-Content-Type-Options", "nosniff")
			// remember to edit the CSP in index.template too
			w.Header().Set("Content-Security-Policy", "default-src https:; script-src 'self' https://youtube.com https://www.youtube.com https://w.soundcloud.com https://challenges.cloudflare.com; frame-src 'self' https://youtube.com https://www.youtube.com https://w.soundcloud.com https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline'; img-src https: data:")
			w.Header().Set("Referrer-Policy", "strict-origin")
			w.Header().Set("Permissions-Policy", "accelerometer=*, autoplay=*, encrypted-media=*, fullscreen=*, gyroscope=*, picture-in-picture=*, clipboard-write=*")
			w.Header().Set("Cross-Origin-Opener-Policy", "same-origin")
			w.Header().Set("Strict-Transport-Security", "max-age=31536000")
			next.ServeHTTP(w, r)
		})
	})
	router.Use(func(next http.Handler) http.Handler {
		return gzipWrapper(next)
	})

	s.configureRouter(router)
	return router, nil
}

func (s *HTTPServer) wrapHTTPHandler(h func(w http.ResponseWriter, r *http.Request) error) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		err := h(w, r)
		if err != nil {
			s.log.Println("HTTP handler error:", err)
		}
	}
}

func (s *HTTPServer) configureRouter(router *mux.Router) {
	router.HandleFunc("/verifysignature/{processID}", s.wrapHTTPHandler(s.VerifySignature)).Methods(http.MethodPut, http.MethodOptions)
	router.HandleFunc("/raffles/weekly/{year:[0-9]{4}}/{week:[0-9]{1,2}}/tickets", s.wrapHTTPHandler(s.RaffleTickets))
	router.HandleFunc("/raffles/weekly/{year:[0-9]{4}}/{week:[0-9]{1,2}}/", s.wrapHTTPHandler(s.RaffleInfo))
	router.HandleFunc("/oauth/callback", s.wrapHTTPHandler(s.OAuthCallback))
	router.HandleFunc("/oauth/monkeyconnect/callback", s.wrapHTTPHandler(s.OAuthCallback))
	router.HandleFunc("/assets/app/{app}/{ignoredVersionForCacheBusting}/{file:[^*].*}", s.wrapHTTPHandler(s.ApplicationFile))
	router.HandleFunc("/assets/app/{app}/{ignoredVersionForCacheBusting}/{page:[*][A-Za-z0-9_-]*}", s.wrapHTTPHandler(s.ApplicationPage))
	router.HandleFunc("/assets/app/{app}/{ignoredVersionForCacheBusting}/**appbridge.js", s.wrapHTTPHandler(s.AppbridgeJS))

	if buildconfig.DEBUG {
		router.HandleFunc("/debug/pprof/", pprof.Index)
		router.HandleFunc("/debug/pprof/cmdline", pprof.Cmdline)
		router.HandleFunc("/debug/pprof/profile", pprof.Profile)
		router.HandleFunc("/debug/pprof/symbol", pprof.Symbol)
		router.HandleFunc("/debug/pprof/trace", pprof.Trace)
		router.PathPrefix("/debug/pprof/").HandlerFunc(pprof.Index)
	}

	if buildconfig.DEBUG && s.daClient == nil && s.basicAuthChecker == nil {
		router.HandleFunc("/admin/signin", s.directUnsafeAuthHandler)
		s.authLog.Println("using direct unsafe auth")
	} else if s.daClient == nil && s.basicAuthChecker != nil {
		router.HandleFunc("/admin/signin", s.basicAuthHandler)
		s.authLog.Println("using basic auth")
	} else {
		router.HandleFunc("/admin/signin", s.authInitHandler)
		s.authLog.Println("using SSO auth")
	}
	if buildconfig.LAB {
		// avoid search engines indexing lab environments to avoid confusion among non-developers
		router.HandleFunc("/robots.txt", func(w http.ResponseWriter, r *http.Request) {
			w.Write([]byte(`User-agent: *
Disallow: /`))
		})
	}

	appPublicFS := http.FileServer(http.Dir("app/public/"))
	appPublicBuildFS := http.FileServer(http.Dir("app/public/build/"))

	router.HandleFunc("/admin/auth", s.authHandler)
	router.PathPrefix("/assets").Handler(http.StripPrefix("/assets", http.FileServer(http.Dir("app/public/assets/"))))
	router.PathPrefix("/emotes").Handler(http.StripPrefix("/emotes", http.FileServer(http.Dir("app/public/emotes/"))))
	router.PathPrefix("/build/swbundle.js").Handler(addServiceWorkerHeaders(http.StripPrefix("/build", appPublicBuildFS)))
	router.PathPrefix("/build").Handler(http.StripPrefix("/build", appPublicBuildFS))
	router.PathPrefix("/favicon.ico").Handler(appPublicFS)
	router.PathPrefix("/favicon.png").Handler(appPublicFS)
	router.PathPrefix("/apple-icon.png").Handler(appPublicFS)
	router.PathPrefix("/banano.json").Handler(appPublicFS)
	router.PathPrefix("/jungletv.webmanifest").Handler(appPublicFS)
	// Catch-all: Serve our JavaScript application's entry-point (index.html).
	router.PathPrefix("/").Handler(s.templateCache)
}

func addServiceWorkerHeaders(fn http.Handler) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Service-Worker-Allowed", "/")
		fn.ServeHTTP(w, r)
	}
}
