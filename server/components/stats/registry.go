package stats

import (
	"context"
	"log"
	"sync"

	"github.com/patrickmn/go-cache"
	authinterceptor "github.com/tnyim/jungletv/server/interceptors/auth"
	"gopkg.in/alexcesaro/statsd.v2"
)

// Registry handles statistics
type Registry struct {
	log         *log.Logger
	statsClient *statsd.Client

	// spectatorsByRemoteAddress is a set of remote addresses
	spectatorsByRemoteAddress map[string]int
	spectatorsMutex           sync.RWMutex

	streamingSubsCounters *cache.OrderedCache[StatStreamConsumersType, int]
}

// StatStreamConsumersType is a type of gRPC stream consumer count
type StatStreamConsumersType string

// StatStreamConsumersQueue is the queue gRPC stream consumer count
const StatStreamConsumersQueue StatStreamConsumersType = "queue"

// StatStreamConsumersCommunitySkipping is the community skipping gRPC stream consumer count
const StatStreamConsumersCommunitySkipping StatStreamConsumersType = "community_skipping"

// StatStreamConsumersChat is the chat gRPC stream consumer count
const StatStreamConsumersChat StatStreamConsumersType = "chat"

// NewRegistry creates a new stats Registry
func NewRegistry(log *log.Logger, statsClient *statsd.Client) (*Registry, error) {
	go statsClient.Gauge("spectators", 0)
	s := &Registry{
		log:         log,
		statsClient: statsClient,

		spectatorsByRemoteAddress: make(map[string]int),
		streamingSubsCounters:     cache.NewOrderedCache[StatStreamConsumersType, int](cache.NoExpiration, -1),
	}

	s.streamingSubsCounters.SetDefault(StatStreamConsumersQueue, 0)
	s.streamingSubsCounters.SetDefault(StatStreamConsumersQueue+"_authenticated", 0)
	s.streamingSubsCounters.SetDefault(StatStreamConsumersCommunitySkipping, 0)
	s.streamingSubsCounters.SetDefault(StatStreamConsumersCommunitySkipping+"_authenticated", 0)
	s.streamingSubsCounters.SetDefault(StatStreamConsumersChat, 0)
	s.streamingSubsCounters.SetDefault(StatStreamConsumersChat+"_authenticated", 0)

	return s, nil
}

func (s *Registry) RegisterSpectator(ctx context.Context) (func(), error) {
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

func (s *Registry) CurrentlyWatching() int {
	s.spectatorsMutex.RLock()
	defer s.spectatorsMutex.RUnlock()
	return len(s.spectatorsByRemoteAddress)
}

func (s *Registry) RegisterStreamSubscriber(stream StatStreamConsumersType, authenticated bool) func() {
	s.streamingSubsCounters.Increment(stream, 1)

	authenticatedKey := stream + "_authenticated"
	if authenticated {
		s.streamingSubsCounters.Increment(authenticatedKey, 1)
	}

	gauge := func() {
		v, _ := s.streamingSubsCounters.Get(stream)
		s.statsClient.Gauge("subscribers."+string(stream), v)

		v, _ = s.streamingSubsCounters.Get(authenticatedKey)
		s.statsClient.Gauge(string("subscribers."+authenticatedKey), v)
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
