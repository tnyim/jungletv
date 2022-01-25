package server

import (
	"context"
	"log"
	"sync"

	authinterceptor "github.com/tnyim/jungletv/server/interceptors/auth"
	"gopkg.in/alexcesaro/statsd.v2"
)

// StatsHandler handles statistics
type StatsHandler struct {
	log         *log.Logger
	mediaQueue  *MediaQueue
	statsClient *statsd.Client

	// spectatorsByRemoteAddress is a set of remote addresses
	spectatorsByRemoteAddress map[string]int
	spectatorsMutex           sync.RWMutex

	queueSubs              int
	authenticatedQueueSubs int

	chatSubs              int
	authenticatedChatSubs int
}

// NewStatsHandler creates a new StatsHandler
func NewStatsHandler(log *log.Logger, mediaQueue *MediaQueue, statsClient *statsd.Client) (*StatsHandler, error) {
	go statsClient.Gauge("spectators", 0)
	return &StatsHandler{
		log:         log,
		mediaQueue:  mediaQueue,
		statsClient: statsClient,

		spectatorsByRemoteAddress: make(map[string]int),
	}, nil
}

func (s *StatsHandler) RegisterSpectator(ctx context.Context) (func(), error) {
	s.spectatorsMutex.Lock()
	defer s.spectatorsMutex.Unlock()

	remoteAddress := authinterceptor.RemoteAddressFromContext(ctx)
	ipCountry := authinterceptor.IPCountryFromContext(ctx)
	if ipCountry == "T1" {
		return func() {}, nil
	}
	s.spectatorsByRemoteAddress[remoteAddress]++
	go s.statsClient.Gauge("spectators", len(s.spectatorsByRemoteAddress))
	return func() {
		s.spectatorsMutex.Lock()
		defer s.spectatorsMutex.Unlock()
		s.spectatorsByRemoteAddress[remoteAddress]--
		if s.spectatorsByRemoteAddress[remoteAddress] <= 0 {
			delete(s.spectatorsByRemoteAddress, remoteAddress)
		}
		go s.statsClient.Gauge("spectators", len(s.spectatorsByRemoteAddress))
	}, nil
}

func (s *StatsHandler) CurrentlyWatching() int {
	s.spectatorsMutex.RLock()
	defer s.spectatorsMutex.RUnlock()
	return len(s.spectatorsByRemoteAddress)
}

func (s *StatsHandler) RegisterQueueSubscriber(authenticated bool) func() {
	s.queueSubs++
	go s.statsClient.Gauge("subscribers.queue", s.queueSubs)
	if authenticated {
		s.authenticatedQueueSubs++
		go s.statsClient.Gauge("subscribers.queue_authenticated", s.authenticatedQueueSubs)
	}

	return func() {
		s.queueSubs--
		go s.statsClient.Gauge("subscribers.queue", s.queueSubs)
		if authenticated {
			s.authenticatedQueueSubs--
			go s.statsClient.Gauge("subscribers.queue_authenticated", s.authenticatedQueueSubs)
		}
	}
}

func (s *StatsHandler) RegisterChatSubscriber(authenticated bool) func() {
	s.chatSubs++
	go s.statsClient.Gauge("subscribers.chat", s.chatSubs)
	if authenticated {
		s.authenticatedChatSubs++
		go s.statsClient.Gauge("subscribers.chat_authenticated", s.authenticatedChatSubs)
	}

	return func() {
		s.chatSubs--
		go s.statsClient.Gauge("subscribers.chat", s.chatSubs)
		if authenticated {
			s.authenticatedChatSubs--
			go s.statsClient.Gauge("subscribers.chat_authenticated", s.authenticatedChatSubs)
		}
	}
}
