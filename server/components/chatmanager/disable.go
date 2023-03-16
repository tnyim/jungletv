package chatmanager

import "github.com/tnyim/jungletv/proto"

func (c *Manager) Enabled() (bool, DisabledReason) {
	return c.enabled, c.disabledReason
}

func (c *Manager) EnableChat() {
	if !c.enabled {
		c.enabled = true
		c.chatEnabled.Notify(false)
	}
}

func (c *Manager) DisableChat(reason DisabledReason) {
	if c.enabled {
		c.enabled = false
		c.disabledReason = reason
		c.chatDisabled.Notify(reason, false)
	}
}

func (c *Manager) SlowModeEnabled() bool {
	return c.slowmode
}

func (c *Manager) SetSlowModeEnabled(enabled bool) {
	c.slowmode = enabled
}

// DisabledReason specifies the reason why chat is disabled
type DisabledReason int

const (
	DisabledReasonUnspecified DisabledReason = iota
	DisabledReasonModeratorNotPresent
)

func (r DisabledReason) SerializeForAPI() proto.ChatDisabledReason {
	switch r {
	default:
		fallthrough
	case DisabledReasonUnspecified:
		return proto.ChatDisabledReason_UNSPECIFIED
	case DisabledReasonModeratorNotPresent:
		return proto.ChatDisabledReason_MODERATOR_NOT_PRESENT
	}
}
