package server

import (
	"context"
	"log"
	"sync"

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

	remoteAddress := RemoteAddressFromContext(ctx)
	ipCountry := IPCountryFromContext(ctx)
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

func (s *StatsHandler) CurrentlyWatching(ctx context.Context) int {
	s.spectatorsMutex.RLock()
	defer s.spectatorsMutex.RUnlock()
	return len(s.spectatorsByRemoteAddress)
}
