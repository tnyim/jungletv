package server

import (
	"context"

	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/server/auth"
)

type appRuntimeMiscMethods struct {
	s *grpcServer
}

// MediaEnqueuingPermission implements modules.OtherMediaQueueMethods.
func (m *appRuntimeMiscMethods) MediaEnqueuingPermission() proto.AllowedMediaEnqueuingType {
	return m.s.getAllowMediaEnqueuing()
}

// NewQueueEntriesAllUnskippable implements modules.OtherMediaQueueMethods.
func (m *appRuntimeMiscMethods) NewQueueEntriesAllUnskippable() bool {
	return m.s.enqueueManager.NewEntriesAlwaysUnskippableForFree()
}

// SetMediaEnqueuingPermission implements modules.OtherMediaQueueMethods.
func (m *appRuntimeMiscMethods) SetMediaEnqueuingPermission(permission proto.AllowedMediaEnqueuingType, password string) {
	m.s.setAllowMediaEnqueuing(permission, password)
}

// SetNewQueueEntriesAllUnskippable implements modules.OtherMediaQueueMethods.
func (m *appRuntimeMiscMethods) SetNewQueueEntriesAllUnskippable(v bool) {
	m.s.enqueueManager.SetNewQueueEntriesAlwaysUnskippableForFree(v)
}

// MoveQueueEntryWithCost implements modules.OtherMediaQueueMethods.
func (m *appRuntimeMiscMethods) MoveQueueEntryWithCost(ctx context.Context, entryID string, up bool, user auth.User) error {
	return stacktrace.Propagate(m.s.moveQueueEntryWithCost(ctx, entryID, up, user), "")
}
