package apprunner

import (
	"sync"
	"time"

	"github.com/tnyim/jungletv/utils/event"
)

type appInstanceStatus int

const (
	appInstanceStatusPaused appInstanceStatus = iota
	appInstanceStatusPausing
	appInstanceStatusRunning
	appInstanceStatusTerminated
)

type appInstanceState struct {
	mu                 sync.RWMutex
	status             appInstanceStatus
	startedOrStoppedAt time.Time

	onPaused     event.NoArgEvent
	onTerminated event.NoArgEvent
}

func (a *appInstanceState) Terminated() event.NoArgEvent {
	return a.onTerminated
}

func (a *appInstanceState) Paused() event.NoArgEvent {
	return a.onPaused
}

func (s *appInstanceState) StartedOrTerminatedAt() time.Time {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return s.startedOrStoppedAt
}

func (s *appInstanceState) MarkAsRunning() {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.status = appInstanceStatusRunning
	s.startedOrStoppedAt = time.Now()
}

func (s *appInstanceState) MarkAsPausing() {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.status = appInstanceStatusPausing
}

func (s *appInstanceState) MarkAsPaused() {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.status = appInstanceStatusPaused
	s.onPaused.Notify(false)
}

func (s *appInstanceState) MarkAsTerminated() {
	s.mu.Lock()
	defer s.mu.Unlock()
	if s.status != appInstanceStatusPaused {
		panic("application can only be marked as terminated after being marked as paused")
	}
	s.status = appInstanceStatusTerminated
	s.onTerminated.Notify(false)
	s.startedOrStoppedAt = time.Now()
}

func (s *appInstanceState) IsRunning() bool {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return s.status == appInstanceStatusRunning
}

func (s *appInstanceState) IsTerminated() bool {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return s.status == appInstanceStatusTerminated
}

func (s *appInstanceState) IsPaused() bool {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return s.status == appInstanceStatusPaused || s.status == appInstanceStatusPausing
}

type readOnlyAppInstanceState interface {
	IsRunning() bool
	IsTerminated() bool
	IsPaused() bool
	StartedOrTerminatedAt() time.Time
}

func (s *appInstanceState) Snapshot() readOnlyAppInstanceState {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return &appInstanceState{
		status:             s.status,
		startedOrStoppedAt: s.startedOrStoppedAt,
	}
}
