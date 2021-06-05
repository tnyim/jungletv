package server

import (
	"context"
	"log"
	"sync"
)

// StatsHandler handles statistics
type StatsHandler struct {
	log        *log.Logger
	mediaQueue *MediaQueue

	// spectatorsByRemoteAddress is a set of remote addresses
	spectatorsByRemoteAddress map[string]int
	spectatorsMutex           sync.RWMutex
}

// NewStatsHandler creates a new StatsHandler
func NewStatsHandler(log *log.Logger, mediaQueue *MediaQueue) (*StatsHandler, error) {
	return &StatsHandler{
		log:        log,
		mediaQueue: mediaQueue,

		spectatorsByRemoteAddress: make(map[string]int),
	}, nil
}

func (s *StatsHandler) RegisterSpectator(ctx context.Context) (func(), error) {
	s.spectatorsMutex.Lock()
	defer s.spectatorsMutex.Unlock()

	remoteAddress := RemoteAddressFromContext(ctx)
	s.spectatorsByRemoteAddress[remoteAddress]++
	s.log.Println("Stats considering spectator with remote address", remoteAddress)
	return func() {
		s.spectatorsMutex.Lock()
		defer s.spectatorsMutex.Unlock()
		s.spectatorsByRemoteAddress[remoteAddress]--
		if s.spectatorsByRemoteAddress[remoteAddress] <= 0 {
			delete(s.spectatorsByRemoteAddress, remoteAddress)
		}
		s.log.Println("Stats no longer considering spectator with remote address", remoteAddress)
	}, nil
}

func (s *StatsHandler) CurrentlyWatching(ctx context.Context) int {
	s.spectatorsMutex.RLock()
	defer s.spectatorsMutex.RUnlock()
	return len(s.spectatorsByRemoteAddress)
}
