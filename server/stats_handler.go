package server

import (
	"context"
	"log"
	"sync"

	"github.com/patrickmn/go-cache"
	authinterceptor "github.com/tnyim/jungletv/server/interceptors/auth"
	"gopkg.in/alexcesaro/statsd.v2"
)

// StatsHandler handles statistics
type StatsHandler struct {
	log         *log.Logger
	statsClient *statsd.Client

	// spectatorsByRemoteAddress is a set of remote addresses
	spectatorsByRemoteAddress map[string]int
	spectatorsMutex           sync.RWMutex

	streamingSubsCounters *cache.OrderedCache[StreamStatsType, int]
}

type StreamStatsType string

const StreamStatsQueue StreamStatsType = "queue"
const StreamStatsCommunitySkipping StreamStatsType = "community_skipping"
const StreamStatsChat StreamStatsType = "chat"

// NewStatsHandler creates a new StatsHandler
func NewStatsHandler(log *log.Logger, statsClient *statsd.Client) (*StatsHandler, error) {
	go statsClient.Gauge("spectators", 0)
	s := &StatsHandler{
		log:         log,
		statsClient: statsClient,

		spectatorsByRemoteAddress: make(map[string]int),
		streamingSubsCounters:     cache.NewOrderedCache[StreamStatsType, int](cache.NoExpiration, -1),
	}

	s.streamingSubsCounters.SetDefault(StreamStatsQueue, 0)
	s.streamingSubsCounters.SetDefault(StreamStatsQueue+"_authenticated", 0)
	s.streamingSubsCounters.SetDefault(StreamStatsCommunitySkipping, 0)
	s.streamingSubsCounters.SetDefault(StreamStatsCommunitySkipping+"_authenticated", 0)
	s.streamingSubsCounters.SetDefault(StreamStatsChat, 0)
	s.streamingSubsCounters.SetDefault(StreamStatsChat+"_authenticated", 0)

	return s, nil
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

func (s *StatsHandler) RegisterStreamSubscriber(stream StreamStatsType, authenticated bool) func() {
	s.streamingSubsCounters.Increment(stream, 1)

	authenticatedKey := stream + "_authenticated"
	if authenticated {
		s.streamingSubsCounters.Increment(authenticatedKey, 1)
	}

	gauge := func() {
		v, _ := s.streamingSubsCounters.Get(stream)
		s.statsClient.Gauge("subscribers."+string(stream), *v)

		v, _ = s.streamingSubsCounters.Get(authenticatedKey)
		s.statsClient.Gauge(string("subscribers."+authenticatedKey), *v)
	}
	go gauge()

	return func() {
		s.streamingSubsCounters.Increment(stream, -1)
		if authenticated {
			s.streamingSubsCounters.Increment(authenticatedKey, -1)
		}
		go gauge()
	}
}
