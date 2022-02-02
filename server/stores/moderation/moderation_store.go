package moderation

import (
	"context"
	"database/sql"
	"sync"
	"time"

	"github.com/palantir/stacktrace"
	uuid "github.com/satori/go.uuid"
	"github.com/tnyim/jungletv/server/auth"
	"github.com/tnyim/jungletv/types"
	"github.com/tnyim/jungletv/utils"
	"github.com/tnyim/jungletv/utils/transaction"
)

// Store saves and loads moderation decisions
type Store interface {
	LoadUserBannedFromChat(ctx context.Context, address, remoteAddress string) (bool, error)
	LoadRemoteAddressBannedFromVideoEnqueuing(ctx context.Context, remoteAddress string) (bool, error)
	LoadPaymentAddressBannedFromVideoEnqueuing(ctx context.Context, address string) (bool, error)
	LoadRemoteAddressBannedFromRewards(ctx context.Context, remoteAddress string) (bool, error)
	LoadPaymentAddressBannedFromRewards(ctx context.Context, address string) (bool, error)
	BanUser(ctx context.Context, fromChat, fromEnqueuing, fromRewards bool, until *time.Time, address, remoteAddress, reason string, moderator auth.User, moderatorUsername string) (string, error)
	RemoveBan(ctx context.Context, banID, reason string, moderator auth.User) error

	LoadPaymentAddressSkipsClientIntegrityChecks(ctx context.Context, address string) (bool, error)
	LoadPaymentAddressSkipsIPReputationChecks(ctx context.Context, address string) (bool, error)
	LoadPaymentAddressHasReducedHardChallengeFrequency(ctx context.Context, address string) (bool, error)
	VerifyUser(ctx context.Context, skipClientIntegrityChecks, skipIPAddressReputationChecks, reduceHardChallengeFrequency bool, address, reason string, moderator auth.User, moderatorUsername string) (string, error)
	RemoveVerification(ctx context.Context, verificationID, reason string, moderator auth.User) error
}

// StoreNoOp does not actually store any decisions, nobody is banned
type StoreNoOp struct{}

var _ Store = &StoreNoOp{}

func (*StoreNoOp) LoadUserBannedFromChat(ctx context.Context, address, remoteAddress string) (bool, error) {
	return false, nil
}
func (*StoreNoOp) LoadRemoteAddressBannedFromVideoEnqueuing(ctx context.Context, remoteAddress string) (bool, error) {
	return false, nil
}
func (*StoreNoOp) LoadPaymentAddressBannedFromVideoEnqueuing(ctx context.Context, address string) (bool, error) {
	return false, nil
}
func (*StoreNoOp) LoadRemoteAddressBannedFromRewards(ctx context.Context, remoteAddress string) (bool, error) {
	return false, nil
}
func (*StoreNoOp) LoadPaymentAddressBannedFromRewards(ctx context.Context, address string) (bool, error) {
	return false, nil
}

func (*StoreNoOp) BanUser(ctx context.Context, fromChat, fromEnqueuing, fromRewards bool, until *time.Time, address, remoteAddress, reason string, moderator auth.User, moderatorUsername string) (string, error) {
	return "", nil
}
func (*StoreNoOp) RemoveBan(ctx context.Context, banID, reason string, moderator auth.User) error {
	return nil
}

func (*StoreNoOp) LoadPaymentAddressSkipsClientIntegrityChecks(ctx context.Context, address string) (bool, error) {
	return false, nil
}
func (*StoreNoOp) LoadPaymentAddressSkipsIPReputationChecks(ctx context.Context, address string) (bool, error) {
	return false, nil
}
func (*StoreNoOp) LoadPaymentAddressHasReducedHardChallengeFrequency(ctx context.Context, address string) (bool, error) {
	return false, nil
}

func (*StoreNoOp) VerifyUser(ctx context.Context, skipClientIntegrityChecks, skipIPAddressReputationChecks, reduceHardChallengeFrequency bool, address, reason string, moderator auth.User, moderatorUsername string) (string, error) {
	return "", nil
}
func (*StoreNoOp) RemoveVerification(ctx context.Context, verificationID, reason string, moderator auth.User) error {
	return nil
}

// StoreDatabase stores moderation decisions in the database
type StoreDatabase struct {
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

	// reward address sets:
	skipsClientIntegrityChecks map[string]struct{}
	skipsIPRepChecks           map[string]struct{}
	hasReducedHardChallenges   map[string]struct{}
}

func NewStoreDatabase(ctx context.Context) (Store, error) {
	m := &StoreDatabase{
		bannedFromChat:                     make(map[string]struct{}),
		remoteAddressesBannedFromChat:      make(map[string]struct{}),
		bannedFromEnqueuing:                make(map[string]struct{}),
		remoteAddressesBannedFromEnqueuing: make(map[string]struct{}),
		bannedFromRewards:                  make(map[string]struct{}),
		remoteAddressesBannedFromRewards:   make(map[string]struct{}),
		skipsClientIntegrityChecks:         make(map[string]struct{}),
		skipsIPRepChecks:                   make(map[string]struct{}),
		hasReducedHardChallenges:           make(map[string]struct{}),
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

func (m *StoreDatabase) LoadUserBannedFromChat(ctx context.Context, address, remoteAddress string) (bool, error) {
	m.l.RLock()
	defer m.l.RUnlock()
	_, addrBan := m.bannedFromChat[address]
	_, remBan := m.remoteAddressesBannedFromChat[utils.GetUniquifiedIP(remoteAddress)]
	return addrBan || remBan, nil
}

func (m *StoreDatabase) LoadRemoteAddressBannedFromVideoEnqueuing(ctx context.Context, remoteAddress string) (bool, error) {
	m.l.RLock()
	defer m.l.RUnlock()
	_, remBan := m.remoteAddressesBannedFromEnqueuing[utils.GetUniquifiedIP(remoteAddress)]
	return remBan, nil
}

func (m *StoreDatabase) LoadPaymentAddressBannedFromVideoEnqueuing(ctx context.Context, address string) (bool, error) {
	m.l.RLock()
	defer m.l.RUnlock()
	_, addrBan := m.bannedFromEnqueuing[address]
	return addrBan, nil
}

func (m *StoreDatabase) LoadRemoteAddressBannedFromRewards(ctx context.Context, remoteAddress string) (bool, error) {
	m.l.RLock()
	defer m.l.RUnlock()
	_, remBan := m.remoteAddressesBannedFromRewards[utils.GetUniquifiedIP(remoteAddress)]
	return remBan, nil
}

func (m *StoreDatabase) LoadPaymentAddressBannedFromRewards(ctx context.Context, address string) (bool, error) {
	m.l.RLock()
	defer m.l.RUnlock()
	_, addrBan := m.bannedFromRewards[address]
	return addrBan, nil
}

func (m *StoreDatabase) BanUser(ctxCtx context.Context, fromChat, fromEnqueuing, fromRewards bool, until *time.Time, address, remoteAddress, reason string, moderator auth.User, moderatorUsername string) (string, error) {
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
		RemoteAddress:    utils.GetUniquifiedIP(remoteAddress),
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

func (m *StoreDatabase) recomputeDecisionMaps(bannedUsers []*types.BannedUser, verifiedUsers []*types.VerifiedUser) {
	m.l.Lock()
	defer m.l.Unlock()

	m.bannedFromChat = make(map[string]struct{})
	m.remoteAddressesBannedFromChat = make(map[string]struct{})
	m.bannedFromEnqueuing = make(map[string]struct{})
	m.remoteAddressesBannedFromEnqueuing = make(map[string]struct{})
	m.bannedFromRewards = make(map[string]struct{})
	m.remoteAddressesBannedFromRewards = make(map[string]struct{})

	for _, decision := range bannedUsers {
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

	m.skipsClientIntegrityChecks = make(map[string]struct{})
	m.skipsIPRepChecks = make(map[string]struct{})
	m.hasReducedHardChallenges = make(map[string]struct{})

	for _, decision := range verifiedUsers {
		if decision.SkipClientIntegrityChecks {
			m.skipsClientIntegrityChecks[decision.Address] = struct{}{}
		}
		if decision.SkipIPAddressReputationChecks {
			m.skipsIPRepChecks[decision.Address] = struct{}{}
		}
		if decision.ReduceHardChallengeFrequency {
			m.hasReducedHardChallenges[decision.Address] = struct{}{}
		}
	}
}

func (m *StoreDatabase) RemoveBan(ctxCtx context.Context, banID, reason string, moderator auth.User) error {
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

func (m *StoreDatabase) restoreDecisionsFromDatabase(ctxCtx context.Context, justChanged bool) error {
	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	defer ctx.Commit() // read-only tx

	instant := time.Now()
	if justChanged {
		instant = instant.Add(1 * time.Second)
	}
	bannedUsers, _, err := types.GetBannedUsersAtInstant(ctx, instant, "", nil)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	verifiedUsers, _, err := types.GetVerifiedUsers(ctx, "", nil)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	m.recomputeDecisionMaps(bannedUsers, verifiedUsers)
	return nil
}

func (m *StoreDatabase) LoadPaymentAddressSkipsClientIntegrityChecks(ctx context.Context, address string) (bool, error) {
	m.l.RLock()
	defer m.l.RUnlock()
	_, addrBan := m.skipsClientIntegrityChecks[address]
	return addrBan, nil
}

func (m *StoreDatabase) LoadPaymentAddressSkipsIPReputationChecks(ctx context.Context, address string) (bool, error) {
	m.l.RLock()
	defer m.l.RUnlock()
	_, addrBan := m.skipsIPRepChecks[address]
	return addrBan, nil
}

func (m *StoreDatabase) LoadPaymentAddressHasReducedHardChallengeFrequency(ctx context.Context, address string) (bool, error) {
	m.l.RLock()
	defer m.l.RUnlock()
	_, addrBan := m.hasReducedHardChallenges[address]
	return addrBan, nil
}

func (m *StoreDatabase) VerifyUser(ctxCtx context.Context, skipClientIntegrityChecks, skipIPAddressReputationChecks, reduceHardChallengeFrequency bool, address, reason string, moderator auth.User, moderatorUsername string) (string, error) {
	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return "", stacktrace.Propagate(err, "")
	}
	defer ctx.Rollback()

	decision := &types.VerifiedUser{
		ID:                            uuid.NewV4().String(),
		Address:                       address,
		CreatedAt:                     time.Now(),
		SkipClientIntegrityChecks:     skipClientIntegrityChecks,
		SkipIPAddressReputationChecks: skipIPAddressReputationChecks,
		ReduceHardChallengeFrequency:  reduceHardChallengeFrequency,
		Reason:                        reason,
		ModeratorAddress:              moderator.Address(),
		ModeratorName:                 moderatorUsername,
	}

	err = decision.Update(ctx)
	if err != nil {
		return "", stacktrace.Propagate(err, "")
	}

	err = m.restoreDecisionsFromDatabase(ctx, true)
	if err != nil {
		return "", stacktrace.Propagate(err, "")
	}

	return decision.ID, stacktrace.Propagate(ctx.Commit(), "")
}
func (m *StoreDatabase) RemoveVerification(ctxCtx context.Context, verificationID, reason string, moderator auth.User) error {
	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	defer ctx.Rollback()

	decisions, err := types.GetVerifiedUserWithIDs(ctx, []string{verificationID})
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	decision, present := decisions[verificationID]
	if !present {
		return stacktrace.NewError("verification not found")
	}

	err = decision.Delete(ctx)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	err = m.restoreDecisionsFromDatabase(ctx, true)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	return stacktrace.Propagate(ctx.Commit(), "")
}
