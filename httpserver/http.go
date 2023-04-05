package httpserver

import (
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
	log             *log.Logger
	websiteURL      string
	raffleSecretKey *ecdsa.PrivateKey
	oauthManager    *oauth.Manager
	appRunner       *apprunner.AppRunner
}

func New(router *mux.Router, log *log.Logger, oauthManager *oauth.Manager, appRunner *apprunner.AppRunner, websiteURL, raffleSecretKey string) error {
	key, err := raffle.DecodeSecretKey(raffleSecretKey)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	s := &HTTPServer{
		log:             log,
		websiteURL:      websiteURL,
		raffleSecretKey: key,
		oauthManager:    oauthManager,
		appRunner:       appRunner,
	}
	router.HandleFunc("/raffles/weekly/{year:[0-9]{4}}/{week:[0-9]{1,2}}/tickets", s.wrapHTTPHandler(s.RaffleTickets))
	router.HandleFunc("/raffles/weekly/{year:[0-9]{4}}/{week:[0-9]{1,2}}/", s.wrapHTTPHandler(s.RaffleInfo))
	router.HandleFunc("/oauth/callback", s.wrapHTTPHandler(s.OAuthCallback))
	router.HandleFunc("/oauth/monkeyconnect/callback", s.wrapHTTPHandler(s.OAuthCallback))
	router.HandleFunc("/assets/app/{app}/{file:[^*].*}", s.wrapHTTPHandler(s.ApplicationFile))
	router.HandleFunc("/assets/app/{app}/{page:[*].*}", s.wrapHTTPHandler(s.ApplicationPage))
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
