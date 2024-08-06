package httpserver

import (
	"context"
	"crypto/ecdsa"
	"log"
	"net/http"
	"net/http/pprof"
	"strings"

	"github.com/arl/statsviz"
	"github.com/gbl08ma/ssoclient"
	"github.com/gorilla/sessions"
	"github.com/klauspost/compress/gzhttp"
	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/buildconfig"
	"github.com/tnyim/jungletv/server/auth"
	"github.com/tnyim/jungletv/server/components/apprunner"
	"github.com/tnyim/jungletv/server/components/oauth"
	"github.com/tnyim/jungletv/server/components/raffle"
	"github.com/tnyim/jungletv/server/interceptors/version"
	"github.com/uptrace/bunrouter"
	"github.com/uptrace/bunrouter/extra/basicauth"
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
	pprofPassword      string                                   // optional and only needed for non-debug environments
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
	basicAuthChecker func(ip, username, password string) bool,
	pprofPassword string) (http.Handler, error) {
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
		pprofPassword:      pprofPassword,
	}

	router := bunrouter.New(
		bunrouter.Use(s.errorHandler),

		// Catch-all: Serve our JavaScript application's entry-point (rendered index.template)
		bunrouter.WithNotFoundHandler(bunrouter.HTTPHandler(s.templateCache)),
	)
	s.configureRoutes(router)

	handler := http.Handler(router)
	handler = func(h http.Handler) http.HandlerFunc {
		return func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Access-Control-Allow-Origin", s.websiteURL)
			w.Header().Set("X-Frame-Options", "deny")
			w.Header().Set("X-Content-Type-Options", "nosniff")
			// remember to edit the CSP in index.template too
			w.Header().Set("Content-Security-Policy", "default-src https:; script-src 'self' https://youtube.com https://www.youtube.com https://w.soundcloud.com https://challenges.cloudflare.com; frame-src 'self' https://youtube.com https://www.youtube.com https://w.soundcloud.com https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline'; img-src https: data:")
			w.Header().Set("Referrer-Policy", "strict-origin")
			w.Header().Set("Permissions-Policy", "accelerometer=*, autoplay=*, encrypted-media=*, fullscreen=*, gyroscope=*, picture-in-picture=*, clipboard-write=*")
			w.Header().Set("Cross-Origin-Opener-Policy", "same-origin")
			w.Header().Set("Strict-Transport-Security", "max-age=31536000")
			h.ServeHTTP(w, r)
		}
	}(handler)
	handler = gzhttp.GzipHandler(handler)
	return router, nil
}

func (s *HTTPServer) errorHandler(next bunrouter.HandlerFunc) bunrouter.HandlerFunc {
	return func(w http.ResponseWriter, req bunrouter.Request) error {
		err := next(w, req)
		if err != nil {
			s.log.Println("HTTP handler error:", err)
		}
		return err
	}
}

func (s *HTTPServer) configureRoutes(router *bunrouter.Router) {
	router.PUT("/verifysignature/:processID", s.VerifySignature)
	router.OPTIONS("/verifysignature/:processID", s.VerifySignature)
	router.GET("/raffles/weekly/:year/:week/tickets", s.RaffleTickets)
	router.GET("/raffles/weekly/:year/:week", s.RaffleInfo)
	router.GET("/oauth/callback", s.OAuthCallback)
	router.GET("/oauth/monkeyconnect/callback", s.OAuthCallback)
	router.GET("/assets/app/:app/:ignoredVersionForCacheBusting/:part", func(w http.ResponseWriter, r bunrouter.Request) error {
		part := r.Param("part")
		if part == "**appbridge.js" {
			return stacktrace.Propagate(s.AppbridgeJS(w, r), "")
		} else if strings.HasPrefix(part, "*") {
			return stacktrace.Propagate(s.ApplicationPage(w, r), "")
		} else {
			return stacktrace.Propagate(s.ApplicationFile(w, r), "")
		}
	})

	if buildconfig.DEBUG || s.pprofPassword != "" {
		r := router.NewGroup("/debug/pprof")
		var authMiddleware bunrouter.MiddlewareFunc
		if s.pprofPassword != "" {
			authMiddleware = basicauth.NewMiddleware(func(req bunrouter.Request) (bool, error) {
				_, pass, ok := req.BasicAuth()
				if !ok {
					return false, nil
				}
				return pass == s.pprofPassword, nil
			})
			r = r.Use(authMiddleware)
		}

		r.Compat().GET("/cmdline", pprof.Cmdline)
		r.Compat().GET("/profile", pprof.Profile)
		r.Compat().GET("/symbol", pprof.Symbol)
		r.Compat().GET("/trace", pprof.Trace)
		r.Compat().GET("/*anything", pprof.Index)

		r = router.NewGroup("/debug/statsviz")
		srv, err := statsviz.NewServer()
		if err != nil {
			panic(stacktrace.Propagate(err, ""))
		}
		if s.pprofPassword != "" {
			r = r.Use(authMiddleware)
		}
		r.Compat().GET("/ws", srv.Ws())
		r.Compat().GET("/*anything", srv.Index())
	}

	if buildconfig.DEBUG && s.daClient == nil && s.basicAuthChecker == nil {
		router.Compat().GET("/admin/signin", s.directUnsafeAuthHandler)
		s.authLog.Println("using direct unsafe auth")
	} else if s.daClient == nil && s.basicAuthChecker != nil {
		router.Compat().GET("/admin/signin", s.basicAuthHandler)
		s.authLog.Println("using basic auth")
	} else {
		router.Compat().GET("/admin/signin", s.authInitHandler)
		s.authLog.Println("using SSO auth")
	}
	if buildconfig.LAB {
		// avoid search engines indexing lab environments to avoid confusion among non-developers
		router.GET("/robots.txt", func(w http.ResponseWriter, r bunrouter.Request) error {
			_, err := w.Write([]byte(`User-agent: *
Disallow: /`))
			return stacktrace.Propagate(err, "")
		})
	}

	appPublicFS := http.FileServer(http.Dir("app/public/"))
	appPublicBuildFS := http.FileServer(http.Dir("app/public/build/"))

	router.Compat().GET("/admin/auth", s.authHandler)
	router.GET("/assets/*anything", bunrouter.HTTPHandler(http.StripPrefix("/assets", http.FileServer(http.Dir("app/public/assets/")))))
	router.GET("/emotes/*anything", bunrouter.HTTPHandler(http.StripPrefix("/emotes", http.FileServer(http.Dir("app/public/emotes/")))))
	router.GET("/build/swbundle.js", bunrouter.HTTPHandler(addServiceWorkerHeaders(http.StripPrefix("/build", appPublicBuildFS))))
	router.GET("/build/*anything", bunrouter.HTTPHandler(http.StripPrefix("/build", appPublicBuildFS)))
	router.GET("/favicon.ico", bunrouter.HTTPHandler(appPublicFS))
	router.GET("/favicon.png", bunrouter.HTTPHandler(appPublicFS))
	router.GET("/apple-icon.png", bunrouter.HTTPHandler(appPublicFS))
	router.GET("/banano.json", bunrouter.HTTPHandler(appPublicFS))
	router.GET("/jungletv.webmanifest", bunrouter.HTTPHandler(appPublicFS))
}

func addServiceWorkerHeaders(fn http.Handler) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Service-Worker-Allowed", "/")
		fn.ServeHTTP(w, r)
	}
}
