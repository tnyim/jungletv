package apprunner

import (
	"sync"
	"time"

	"github.com/dop251/goja"
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

type runtimeInterruptManager struct {
	mu                 sync.Mutex
	vmInterrupt        func(v any)
	vmClearInterrupt   func()
	tokenCounter       runtimeInterruptToken
	activeTokens       map[runtimeInterruptToken]struct{}
	lastInterruptValue any
}

type runtimeInterruptToken int64

func (r *runtimeInterruptManager) configureForRuntime(vm *goja.Runtime) {
	r.mu.Lock()
	defer r.mu.Unlock()

	r.activeTokens = make(map[runtimeInterruptToken]struct{})
	r.vmInterrupt = vm.Interrupt
	r.vmClearInterrupt = vm.ClearInterrupt
}

func (r *runtimeInterruptManager) Interrupt(v any) runtimeInterruptToken {
	r.mu.Lock()
	defer r.mu.Unlock()
	if r.vmInterrupt == nil {
		panic("attempt to interrupt without configuring with a runtime first")
	}

	// start the first token at 1 so that the zero value of runtimeInterruptToken is never a valid token
	r.tokenCounter++
	token := r.tokenCounter
	r.activeTokens[token] = struct{}{}
	r.lastInterruptValue = v
	r.vmInterrupt(v)
	return token
}

func (r *runtimeInterruptManager) ReinterruptIfNecessary() {
	r.mu.Lock()
	defer r.mu.Unlock()

	if len(r.activeTokens) > 0 {
		r.vmInterrupt(r.lastInterruptValue)
	}
}

func (r *runtimeInterruptManager) ClearInterrupt(token runtimeInterruptToken) {
	if token <= 0 {
		return
	}
	r.mu.Lock()
	defer r.mu.Unlock()
	if r.vmClearInterrupt == nil {
		panic("attempt to clear interrupt without configuring with a runtime first")
	}

	delete(r.activeTokens, token)
	if len(r.activeTokens) == 0 {
		r.vmClearInterrupt()
	}
}
