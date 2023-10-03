package server

import (
	"github.com/tnyim/jungletv/proto"
)

type appRuntimeMiscMethods struct {
	s *grpcServer
}

// MediaEnqueuingRestriction implements modules.OtherMediaQueueMethods.
func (m *appRuntimeMiscMethods) MediaEnqueuingRestriction() proto.AllowedMediaEnqueuingType {
	return m.s.getAllowMediaEnqueuing()
}

// NewQueueEntriesAllUnskippable implements modules.OtherMediaQueueMethods.
func (m *appRuntimeMiscMethods) NewQueueEntriesAllUnskippable() bool {
	return m.s.enqueueManager.NewEntriesAlwaysUnskippableForFree()
}

// SetMediaEnqueuingRestriction implements modules.OtherMediaQueueMethods.
func (m *appRuntimeMiscMethods) SetMediaEnqueuingRestriction(restriction proto.AllowedMediaEnqueuingType, password string) {
	m.s.setAllowMediaEnqueuing(restriction, password)
}

// SetNewQueueEntriesAllUnskippable implements modules.OtherMediaQueueMethods.
func (m *appRuntimeMiscMethods) SetNewQueueEntriesAllUnskippable(v bool) {
	m.s.enqueueManager.SetNewQueueEntriesAlwaysUnskippableForFree(v)
}
