package server

import (
	"context"
	"time"

	"github.com/palantir/stacktrace"
	uuid "github.com/satori/go.uuid"
	"github.com/tnyim/jungletv/types"
	"github.com/tnyim/jungletv/utils/transaction"
)

type BlockedUserStore interface {
	LoadUsersBlockedBy(context.Context, User) ([]string, error)
	BlockUser(ctx context.Context, userToBlock, blockedBy User) error
	UnblockUser(ctx context.Context, blockID string, blockedBy User) (User, error)
	UnblockUserByAddress(ctx context.Context, address string, blockedBy User) (User, error)
}

// BlockedUserStoreDatabase stores blocked users in the database
type BlockedUserStoreDatabase struct{}

// NewBlockedUserStoreDatabase initializes and returns a new BlockedUserStoreDatabase
func NewBlockedUserStoreDatabase() *BlockedUserStoreDatabase {
	return &BlockedUserStoreDatabase{}
}

func (s *BlockedUserStoreDatabase) LoadUsersBlockedBy(ctxCtx context.Context, user User) ([]string, error) {
	if user == nil || user.IsUnknown() {
		return []string{}, nil
	}
	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	defer ctx.Commit() // read-only tx

	blockedUsers, _, err := types.GetUsersBlockedByAddress(ctx, user.Address(), nil)
	if err != nil {
		return nil, stacktrace.Propagate(err, "failed to load blocked users")
	}
	blockedAddresses := make([]string, len(blockedUsers))
	for i := range blockedUsers {
		blockedAddresses[i] = blockedUsers[i].Address
	}
	return blockedAddresses, nil
}

func (s *BlockedUserStoreDatabase) BlockUser(ctxCtx context.Context, userToBlock, blockedBy User) error {
	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	defer ctx.Rollback()

	newBlockedUser := types.BlockedUser{
		ID:        uuid.NewV4().String(),
		Address:   userToBlock.Address(),
		BlockedBy: blockedBy.Address(),
		CreatedAt: time.Now(),
	}

	err = newBlockedUser.Update(ctx)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	return stacktrace.Propagate(ctx.Commit(), "")
}

func (s *BlockedUserStoreDatabase) UnblockUser(ctxCtx context.Context, blockID string, blockedBy User) (User, error) {
	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	defer ctx.Rollback()

	blockedUser, err := types.GetBlockedUserByID(ctx, blockID)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	if blockedUser.BlockedBy != blockedBy.Address() {
		return nil, stacktrace.NewError("user not blocked by the provided user")
	}

	err = blockedUser.Delete(ctx)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	err = ctx.Commit()
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	return NewAddressOnlyUser(blockedUser.Address), nil
}

func (s *BlockedUserStoreDatabase) UnblockUserByAddress(ctxCtx context.Context, address string, blockedBy User) (User, error) {
	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	defer ctx.Rollback()

	blockedUser, err := types.GetBlockedUserByAddress(ctx, address, blockedBy.Address())
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	err = blockedUser.Delete(ctx)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	err = ctx.Commit()
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	return NewAddressOnlyUser(blockedUser.Address), nil
}
