package server

import (
	"context"
	"sort"
	"sync"
	"time"

	"github.com/tnyim/jungletv/server/auth"
	"gopkg.in/alexcesaro/statsd.v2"
)

// StaffActivityManager keeps track of what staff members are presently active in order to inform the rest of the staff
type StaffActivityManager struct {
	activelyModerating map[string]struct{}
	challenged         map[string]struct{}
	mutex              sync.RWMutex

	rewardsHandler *RewardsHandler
	statsClient    *statsd.Client
}

// NewStaffActivityManager returns a new StaffActivityManager
func NewStaffActivityManager(statsClient *statsd.Client) *StaffActivityManager {
	manager := &StaffActivityManager{
		activelyModerating: make(map[string]struct{}),
		challenged:         make(map[string]struct{}),
		statsClient:        statsClient,
	}

	return manager
}

func (s *StaffActivityManager) SetRewardsHandler(r *RewardsHandler) {
	s.rewardsHandler = r
}

func (s *StaffActivityManager) StatsWorker(ctx context.Context) {
	ticker := time.NewTicker(1 * time.Minute)
	defer ticker.Stop()
	for {
		select {
		case <-ticker.C:
			func() {
				s.mutex.RLock()
				defer s.mutex.RUnlock()
				count := len(s.activelyModerating)
				go s.statsClient.Gauge("staff_actively_moderating", count)
			}()
		case <-ctx.Done():
			return
		}
	}
}

// IsActivelyModerating returns whether the specified staff member is currently active
func (s *StaffActivityManager) IsActivelyModerating(staffMember auth.User) bool {
	s.mutex.RLock()
	defer s.mutex.RUnlock()
	_, present := s.activelyModerating[staffMember.Address()]
	return present
}

// MarkAsActive marks the specified staff member as active
func (s *StaffActivityManager) MarkAsActive(ctx context.Context, staffMember auth.User) {
	if !auth.UserPermissionLevelIsAtLeast(staffMember, auth.AdminPermissionLevel) {
		return
	}

	defer func() {
		// this triggers a recalculation of the time until the next activity challenge
		// it must happen outside of the mutex-protected region to avoid a deadlock
		if s.rewardsHandler != nil {
			_ = s.rewardsHandler.MarkAddressAsActiveEvenIfChallenged(ctx, staffMember.Address())
		}
	}()

	s.mutex.Lock()
	defer s.mutex.Unlock()
	s.activelyModerating[staffMember.Address()] = struct{}{}
	delete(s.challenged, staffMember.Address())
}

// MarkAsActive marks the specified staff member as inactive
func (s *StaffActivityManager) MarkAsInactive(ctx context.Context, staffMember auth.User) {
	defer func() {
		// restore usual staff member activity challenge behavior
		if s.rewardsHandler != nil {
			_ = s.rewardsHandler.MarkAddressAsActiveEvenIfChallenged(ctx, staffMember.Address())
		}
	}()

	s.mutex.Lock()
	defer s.mutex.Unlock()
	delete(s.activelyModerating, staffMember.Address())
	delete(s.challenged, staffMember.Address())
}

// MarkAsActivityChallenged marks the specified staff member as having been challenged for activity with the specified
// challenge response timeout
func (s *StaffActivityManager) MarkAsActivityChallenged(ctx context.Context, staffMember auth.User, tolerance time.Duration) {
	s.mutex.Lock()
	defer s.mutex.Unlock()
	s.challenged[staffMember.Address()] = struct{}{}

	go func() {
		time.Sleep(tolerance)

		s.mutex.Lock()
		if _, stillChallenged := s.challenged[staffMember.Address()]; stillChallenged {
			delete(s.activelyModerating, staffMember.Address())
			delete(s.challenged, staffMember.Address())
		}
		s.mutex.Unlock()

		if s.rewardsHandler != nil {
			// restore usual staff member activity challenge behavior
			_ = s.rewardsHandler.MarkAddressAsActiveEvenIfChallenged(ctx, staffMember.Address())
		}
	}()
}

// MarkAsStillActive clears the activity challenged status of the specified staff member, if they are actively moderating
func (s *StaffActivityManager) MarkAsStillActive(staffMember auth.User) {
	if !auth.UserPermissionLevelIsAtLeast(staffMember, auth.AdminPermissionLevel) {
		return
	}

	s.mutex.Lock()
	defer s.mutex.Unlock()
	// re-add user to the set of actively moderating addresses, since they might be solving an already expired activity challenge
	s.activelyModerating[staffMember.Address()] = struct{}{}
	delete(s.challenged, staffMember.Address())
}

// ActivelyModerating returns the list of actively moderating staff members
func (s *StaffActivityManager) ActivelyModerating() []auth.User {
	list := []auth.User{}

	for address := range s.activelyModerating {
		list = append(list, auth.NewAddressOnlyUser(address))
	}

	sort.Slice(list, func(i, j int) bool {
		return list[i].Address() < list[j].Address()
	})
	return list
}
