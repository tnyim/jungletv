package server

import (
	"sort"
	"sync"
	"time"

	"github.com/tnyim/jungletv/server/auth"
)

// StaffActivityManager keeps track of what staff members are presently active in order to inform the rest of the staff
type StaffActivityManager struct {
	activelyModerating map[string]struct{}
	challenged         map[string]struct{}
	mutex              sync.RWMutex

	rewardsHandler *RewardsHandler
}

// NewStaffActivityManager returns a new StaffActivityManager
func NewStaffActivityManager() *StaffActivityManager {
	return &StaffActivityManager{
		activelyModerating: make(map[string]struct{}),
		challenged:         make(map[string]struct{}),
	}
}

func (s *StaffActivityManager) SetRewardsHandler(r *RewardsHandler) {
	s.rewardsHandler = r
}

// IsActivelyModerating returns whether the specified staff member is currently active
func (s *StaffActivityManager) IsActivelyModerating(staffMember auth.User) bool {
	s.mutex.RLock()
	defer s.mutex.RUnlock()
	_, present := s.activelyModerating[staffMember.Address()]
	return present
}

// MarkAsActive marks the specified staff member as active
func (s *StaffActivityManager) MarkAsActive(staffMember auth.User) {
	if !UserPermissionLevelIsAtLeast(staffMember, auth.AdminPermissionLevel) {
		return
	}

	s.mutex.Lock()
	defer s.mutex.Unlock()
	s.activelyModerating[staffMember.Address()] = struct{}{}
	delete(s.challenged, staffMember.Address())
}

// MarkAsActive marks the specified staff member as inactive
func (s *StaffActivityManager) MarkAsInactive(staffMember auth.User) {
	s.mutex.Lock()
	defer s.mutex.Unlock()
	delete(s.activelyModerating, staffMember.Address())
	delete(s.challenged, staffMember.Address())
}

// MarkAsActivityChallenged marks the specified staff member as having been challenged for activity with the specified
// challenge response timeout
func (s *StaffActivityManager) MarkAsActivityChallenged(staffMember auth.User, tolerance time.Duration) {
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
			s.rewardsHandler.MarkAddressAsActiveEvenIfChallenged(staffMember.Address())
		}
	}()
}

// MarkAsStillActive clears the activity challenged status of the specified staff member, if they are actively moderating
func (s *StaffActivityManager) MarkAsStillActive(staffMember auth.User) {
	if !UserPermissionLevelIsAtLeast(staffMember, auth.AdminPermissionLevel) {
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
