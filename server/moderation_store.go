package server

import (
	"context"
	"sync"

	"github.com/palantir/stacktrace"
	uuid "github.com/satori/go.uuid"
)

// ModerationStore saves and loads moderation decisions
type ModerationStore interface {
	LoadUserBannedFromChat(ctx context.Context, address, remoteAddress string) (bool, error)
	LoadRemoteAddressBannedFromVideoEnqueuing(ctx context.Context, remoteAddress string) (bool, error)
	LoadPaymentAddressBannedFromVideoEnqueuing(ctx context.Context, address string) (bool, error)
	LoadRemoteAddressBannedFromRewards(ctx context.Context, remoteAddress string) (bool, error)
	LoadPaymentAddressBannedFromRewards(ctx context.Context, address string) (bool, error)
	BanUser(ctx context.Context, fromChat, fromEnqueuing, fromRewards bool, address, remoteAddress, reason string, moderator User) (string, error)
	RemoveBan(ctx context.Context, banID, reason string, moderator User) error
}

// ModerationStoreNoOp does not actually store any decisions, nobody is banned
type ModerationStoreNoOp struct{}

var _ ModerationStore = &ModerationStoreNoOp{}

func (*ModerationStoreNoOp) LoadUserBannedFromChat(ctx context.Context, address, remoteAddress string) (bool, error) {
	return false, nil
}
func (*ModerationStoreNoOp) LoadRemoteAddressBannedFromVideoEnqueuing(ctx context.Context, remoteAddress string) (bool, error) {
	return false, nil
}
func (*ModerationStoreNoOp) LoadPaymentAddressBannedFromVideoEnqueuing(ctx context.Context, address string) (bool, error) {
	return false, nil
}
func (*ModerationStoreNoOp) LoadRemoteAddressBannedFromRewards(ctx context.Context, remoteAddress string) (bool, error) {
	return false, nil
}
func (*ModerationStoreNoOp) LoadPaymentAddressBannedFromRewards(ctx context.Context, address string) (bool, error) {
	return false, nil
}

func (*ModerationStoreNoOp) BanUser(ctx context.Context, fromChat, fromEnqueuing, fromRewards bool, address, remoteAddress, reason string, moderator User) (string, error) {
	return "", nil
}
func (*ModerationStoreNoOp) RemoveBan(ctx context.Context, banID, reason string, moderator User) error {
	return nil
}

type moderationDecision struct {
	FromChat      bool
	FromEnqueuing bool
	FromRewards   bool
	Address       string
	RemoteAddress string
	Reason        string
	Moderator     string
}

// ModerationStoreMemory stores moderation decisions in memory
type ModerationStoreMemory struct {
	l sync.RWMutex
	// reward address set
	bannedFromChat map[string]struct{}
	// remote address set
	remoteAddressesBannedFromChat map[string]struct{}

	// reward address set
	bannedFromEnqueuing map[string]struct{}
	// remote address set
	remoteAddressesBannedFromEnqueuing map[string]struct{}

	// reward address set
	bannedFromRewards map[string]struct{}
	// remote address set
	remoteAddressesBannedFromRewards map[string]struct{}

	// maps ban ID -> moderationDecision
	decisions map[string]moderationDecision
}

func NewModerationStoreMemory() ModerationStore {
	return &ModerationStoreMemory{
		bannedFromChat:                     make(map[string]struct{}),
		remoteAddressesBannedFromChat:      make(map[string]struct{}),
		bannedFromEnqueuing:                make(map[string]struct{}),
		remoteAddressesBannedFromEnqueuing: make(map[string]struct{}),
		bannedFromRewards:                  make(map[string]struct{}),
		remoteAddressesBannedFromRewards:   make(map[string]struct{}),
		decisions:                          make(map[string]moderationDecision),
	}
}

func (m *ModerationStoreMemory) LoadUserBannedFromChat(ctx context.Context, address, remoteAddress string) (bool, error) {
	m.l.RLock()
	defer m.l.RUnlock()
	_, addrBan := m.bannedFromChat[address]
	_, remBan := m.remoteAddressesBannedFromChat[getUniquifiedIP(remoteAddress)]
	return addrBan || remBan, nil
}

func (m *ModerationStoreMemory) LoadRemoteAddressBannedFromVideoEnqueuing(ctx context.Context, remoteAddress string) (bool, error) {
	m.l.RLock()
	defer m.l.RUnlock()
	_, remBan := m.remoteAddressesBannedFromEnqueuing[getUniquifiedIP(remoteAddress)]
	return remBan, nil
}

func (m *ModerationStoreMemory) LoadPaymentAddressBannedFromVideoEnqueuing(ctx context.Context, address string) (bool, error) {
	m.l.RLock()
	defer m.l.RUnlock()
	_, addrBan := m.bannedFromEnqueuing[address]
	return addrBan, nil
}

func (m *ModerationStoreMemory) LoadRemoteAddressBannedFromRewards(ctx context.Context, remoteAddress string) (bool, error) {
	m.l.RLock()
	defer m.l.RUnlock()
	_, remBan := m.remoteAddressesBannedFromRewards[getUniquifiedIP(remoteAddress)]
	return remBan, nil
}

func (m *ModerationStoreMemory) LoadPaymentAddressBannedFromRewards(ctx context.Context, address string) (bool, error) {
	m.l.RLock()
	defer m.l.RUnlock()
	_, addrBan := m.bannedFromRewards[address]
	return addrBan, nil
}

func (m *ModerationStoreMemory) BanUser(ctx context.Context, fromChat, fromEnqueuing, fromRewards bool, address, remoteAddress, reason string, moderator User) (string, error) {
	m.l.Lock()
	defer m.l.Unlock()

	id := uuid.NewV4().String()
	m.decisions[id] = moderationDecision{
		FromChat:      fromChat,
		FromEnqueuing: fromEnqueuing,
		FromRewards:   fromRewards,
		Address:       address,
		RemoteAddress: getUniquifiedIP(remoteAddress),
		Reason:        reason,
		Moderator:     moderator.Address(),
	}

	m.recomputeBanMapsInMutex()

	return id, nil
}

func (m *ModerationStoreMemory) recomputeBanMapsInMutex() {
	m.bannedFromChat = make(map[string]struct{})
	m.remoteAddressesBannedFromChat = make(map[string]struct{})
	for _, decision := range m.decisions {
		if decision.Address != "" {
			if decision.FromChat {
				m.bannedFromChat[decision.Address] = struct{}{}
			}
			if decision.FromEnqueuing {
				m.bannedFromEnqueuing[decision.Address] = struct{}{}
			}
			if decision.FromRewards {
				m.bannedFromRewards[decision.Address] = struct{}{}
			}
		}
		if decision.RemoteAddress != "" {
			if decision.FromChat {
				m.remoteAddressesBannedFromChat[decision.RemoteAddress] = struct{}{}
			}
			if decision.FromEnqueuing {
				m.remoteAddressesBannedFromEnqueuing[decision.RemoteAddress] = struct{}{}
			}
			if decision.FromRewards {
				m.remoteAddressesBannedFromRewards[decision.RemoteAddress] = struct{}{}
			}
		}
	}
}

func (m *ModerationStoreMemory) RemoveBan(ctx context.Context, banID, reason string, moderator User) error {
	m.l.Lock()
	defer m.l.Unlock()
	_, present := m.decisions[banID]
	if !present {
		return stacktrace.NewError("ban not found")
	}
	delete(m.decisions, banID)
	m.recomputeBanMapsInMutex()
	return nil
}
