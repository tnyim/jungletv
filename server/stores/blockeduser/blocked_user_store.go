package blockeduser

import (
	"context"
	"time"

	"github.com/palantir/stacktrace"
	uuid "github.com/satori/go.uuid"
	"github.com/tnyim/jungletv/server/auth"
	"github.com/tnyim/jungletv/types"
	"github.com/tnyim/jungletv/utils/transaction"
)

type Store interface {
	LoadUsersBlockedBy(context.Context, auth.User) ([]string, error)
	BlockUser(ctx context.Context, userToBlock, blockedBy auth.User) error
	UnblockUser(ctx context.Context, blockID string, blockedBy auth.User) (auth.User, error)
	UnblockUserByAddress(ctx context.Context, address string, blockedBy auth.User) (auth.User, error)
}

// StoreDatabase stores blocked users in the database
type StoreDatabase struct{}

// NewStoreDatabase initializes and returns a new StoreDatabase
func NewStoreDatabase() *StoreDatabase {
	return &StoreDatabase{}
}

func (s *StoreDatabase) LoadUsersBlockedBy(ctxCtx context.Context, user auth.User) ([]string, error) {
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

func (s *StoreDatabase) BlockUser(ctxCtx context.Context, userToBlock, blockedBy auth.User) error {
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

func (s *StoreDatabase) UnblockUser(ctxCtx context.Context, blockID string, blockedBy auth.User) (auth.User, error) {
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
	return auth.NewAddressOnlyUser(blockedUser.Address), nil
}

func (s *StoreDatabase) UnblockUserByAddress(ctxCtx context.Context, address string, blockedBy auth.User) (auth.User, error) {
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
	return auth.NewAddressOnlyUser(blockedUser.Address), nil
}
