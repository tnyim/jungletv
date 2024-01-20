package httpserver

import (
	"context"
	"crypto/ecdsa"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/server/components/apprunner"
	"github.com/tnyim/jungletv/server/components/oauth"
	"github.com/tnyim/jungletv/server/components/raffle"
)

type HTTPServer struct {
	log                *log.Logger
	websiteURL         string
	raffleSecretKey    *ecdsa.PrivateKey
	oauthManager       *oauth.Manager
	appRunner          *apprunner.AppRunner
	versionHashBuilder func() string
	signatureVerifier  SignatureVerifier
}

type SignatureVerifier interface {
	VerifySignature(ctx context.Context, processID string, signature []byte, submissionMethod string) error
}

func New(router *mux.Router, log *log.Logger, oauthManager *oauth.Manager, appRunner *apprunner.AppRunner, websiteURL, raffleSecretKey string, versionHashBuilder func() string, signatureVerifier SignatureVerifier) error {
	key, err := raffle.DecodeSecretKey(raffleSecretKey)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	s := &HTTPServer{
		log:                log,
		websiteURL:         websiteURL,
		raffleSecretKey:    key,
		oauthManager:       oauthManager,
		appRunner:          appRunner,
		versionHashBuilder: versionHashBuilder,
		signatureVerifier:  signatureVerifier,
	}

	router.HandleFunc("/verifysignature/{processID}", s.wrapHTTPHandler(s.VerifySignature)).Methods(http.MethodPut, http.MethodOptions)
	router.HandleFunc("/raffles/weekly/{year:[0-9]{4}}/{week:[0-9]{1,2}}/tickets", s.wrapHTTPHandler(s.RaffleTickets))
	router.HandleFunc("/raffles/weekly/{year:[0-9]{4}}/{week:[0-9]{1,2}}/", s.wrapHTTPHandler(s.RaffleInfo))
	router.HandleFunc("/oauth/callback", s.wrapHTTPHandler(s.OAuthCallback))
	router.HandleFunc("/oauth/monkeyconnect/callback", s.wrapHTTPHandler(s.OAuthCallback))
	router.HandleFunc("/assets/app/{app}/{ignoredVersionForCacheBusting}/{file:[^*].*}", s.wrapHTTPHandler(s.ApplicationFile))
	router.HandleFunc("/assets/app/{app}/{ignoredVersionForCacheBusting}/{page:[*][A-Za-z0-9_-]*}", s.wrapHTTPHandler(s.ApplicationPage))
	router.HandleFunc("/assets/app/{app}/{ignoredVersionForCacheBusting}/**appbridge.js", s.wrapHTTPHandler(s.AppbridgeJS))
	return nil
}

func (s *HTTPServer) wrapHTTPHandler(h func(w http.ResponseWriter, r *http.Request) error) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		err := h(w, r)
		if err != nil {
			s.log.Println("HTTP handler error:", err)
		}
	}
}
