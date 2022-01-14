package server

import (
	"context"
	"database/sql"
	"sync"
	"time"

	"github.com/palantir/stacktrace"
	uuid "github.com/satori/go.uuid"
	"github.com/tnyim/jungletv/types"
	"github.com/tnyim/jungletv/utils/transaction"
)

// ModerationStore saves and loads moderation decisions
type ModerationStore interface {
	LoadUserBannedFromChat(ctx context.Context, address, remoteAddress string) (bool, error)
	LoadRemoteAddressBannedFromVideoEnqueuing(ctx context.Context, remoteAddress string) (bool, error)
	LoadPaymentAddressBannedFromVideoEnqueuing(ctx context.Context, address string) (bool, error)
	LoadRemoteAddressBannedFromRewards(ctx context.Context, remoteAddress string) (bool, error)
	LoadPaymentAddressBannedFromRewards(ctx context.Context, address string) (bool, error)
	BanUser(ctx context.Context, fromChat, fromEnqueuing, fromRewards bool, until *time.Time, address, remoteAddress, reason string, moderator User, moderatorUsername string) (string, error)
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

func (*ModerationStoreNoOp) BanUser(ctx context.Context, fromChat, fromEnqueuing, fromRewards bool, until *time.Time, address, remoteAddress, reason string, moderator User, moderatorUsername string) (string, error) {
	return "", nil
}
func (*ModerationStoreNoOp) RemoveBan(ctx context.Context, banID, reason string, moderator User) error {
	return nil
}

// ModerationStoreDatabase stores moderation decisions in the database
type ModerationStoreDatabase struct {
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
}

func NewModerationStoreDatabase(ctx context.Context) (ModerationStore, error) {
	m := &ModerationStoreDatabase{
		bannedFromChat:                     make(map[string]struct{}),
		remoteAddressesBannedFromChat:      make(map[string]struct{}),
		bannedFromEnqueuing:                make(map[string]struct{}),
		remoteAddressesBannedFromEnqueuing: make(map[string]struct{}),
		bannedFromRewards:                  make(map[string]struct{}),
		remoteAddressesBannedFromRewards:   make(map[string]struct{}),
	}

	go func() {
		t := time.NewTicker(5 * time.Minute)
		defer t.Stop()
		for {
			select {
			case <-t.C:
				// updates temporary bans
				_ = m.restoreDecisionsFromDatabase(ctx, false)
			case <-ctx.Done():
				return
			}
		}
	}()

	return m, stacktrace.Propagate(m.restoreDecisionsFromDatabase(ctx, false), "")
}

func (m *ModerationStoreDatabase) LoadUserBannedFromChat(ctx context.Context, address, remoteAddress string) (bool, error) {
	m.l.RLock()
	defer m.l.RUnlock()
	_, addrBan := m.bannedFromChat[address]
	_, remBan := m.remoteAddressesBannedFromChat[getUniquifiedIP(remoteAddress)]
	return addrBan || remBan, nil
}

func (m *ModerationStoreDatabase) LoadRemoteAddressBannedFromVideoEnqueuing(ctx context.Context, remoteAddress string) (bool, error) {
	m.l.RLock()
	defer m.l.RUnlock()
	_, remBan := m.remoteAddressesBannedFromEnqueuing[getUniquifiedIP(remoteAddress)]
	return remBan, nil
}

func (m *ModerationStoreDatabase) LoadPaymentAddressBannedFromVideoEnqueuing(ctx context.Context, address string) (bool, error) {
	m.l.RLock()
	defer m.l.RUnlock()
	_, addrBan := m.bannedFromEnqueuing[address]
	return addrBan, nil
}

func (m *ModerationStoreDatabase) LoadRemoteAddressBannedFromRewards(ctx context.Context, remoteAddress string) (bool, error) {
	m.l.RLock()
	defer m.l.RUnlock()
	_, remBan := m.remoteAddressesBannedFromRewards[getUniquifiedIP(remoteAddress)]
	return remBan, nil
}

func (m *ModerationStoreDatabase) LoadPaymentAddressBannedFromRewards(ctx context.Context, address string) (bool, error) {
	m.l.RLock()
	defer m.l.RUnlock()
	_, addrBan := m.bannedFromRewards[address]
	return addrBan, nil
}

func (m *ModerationStoreDatabase) BanUser(ctxCtx context.Context, fromChat, fromEnqueuing, fromRewards bool, until *time.Time, address, remoteAddress, reason string, moderator User, moderatorUsername string) (string, error) {
	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return "", stacktrace.Propagate(err, "")
	}
	defer ctx.Rollback()

	decision := &types.BannedUser{
		BanID:            uuid.NewV4().String(),
		BannedAt:         time.Now(),
		FromChat:         fromChat,
		FromEnqueuing:    fromEnqueuing,
		FromRewards:      fromRewards,
		Address:          address,
		RemoteAddress:    getUniquifiedIP(remoteAddress),
		Reason:           reason,
		ModeratorAddress: moderator.Address(),
		ModeratorName:    moderatorUsername,
	}
	if until != nil {
		decision.BannedUntil.Time = *until
		decision.BannedUntil.Valid = true
	}

	err = decision.Update(ctx)
	if err != nil {
		return "", stacktrace.Propagate(err, "")
	}

	err = m.restoreDecisionsFromDatabase(ctx, true)
	if err != nil {
		return "", stacktrace.Propagate(err, "")
	}

	return decision.BanID, stacktrace.Propagate(ctx.Commit(), "")
}

func (m *ModerationStoreDatabase) recomputeBanMaps(decisions []*types.BannedUser) {
	m.l.Lock()
	defer m.l.Unlock()

	m.bannedFromChat = make(map[string]struct{})
	m.remoteAddressesBannedFromChat = make(map[string]struct{})
	m.bannedFromEnqueuing = make(map[string]struct{})
	m.remoteAddressesBannedFromEnqueuing = make(map[string]struct{})
	m.bannedFromRewards = make(map[string]struct{})
	m.remoteAddressesBannedFromRewards = make(map[string]struct{})
	for _, decision := range decisions {
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

func (m *ModerationStoreDatabase) RemoveBan(ctxCtx context.Context, banID, reason string, moderator User) error {
	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	defer ctx.Rollback()

	decisions, err := types.GetBannedUserWithIDs(ctx, []string{banID})
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	decision, present := decisions[banID]
	if !present {
		return stacktrace.NewError("ban not found")
	}
	if decision.BannedUntil.Valid && time.Now().After(decision.BannedUntil.Time) {
		return stacktrace.NewError("ban already removed or expired")
	}

	decision.BannedUntil = sql.NullTime{
		Time:  time.Now(),
		Valid: true,
	}

	decision.UnbanReason = reason

	err = decision.Update(ctx)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	err = m.restoreDecisionsFromDatabase(ctx, true)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	return stacktrace.Propagate(ctx.Commit(), "")
}

func (m *ModerationStoreDatabase) restoreDecisionsFromDatabase(ctxCtx context.Context, justChanged bool) error {
	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	defer ctx.Commit() // read-only tx

	instant := time.Now()
	if justChanged {
		instant = instant.Add(1 * time.Second)
	}
	decisions, _, err := types.GetBannedUsersAtInstant(ctx, instant, "", nil)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	m.recomputeBanMaps(decisions)
	return nil
}
