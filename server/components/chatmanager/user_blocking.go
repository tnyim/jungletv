package chatmanager

import (
	"context"

	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/server/auth"
)

func (c *Manager) LoadUsersBlockedBy(ctx context.Context, blockedBy auth.User) ([]string, error) {
	users, err := c.blockedUserStore.LoadUsersBlockedBy(ctx, blockedBy)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	return users, nil
}

func (c *Manager) BlockUser(ctx context.Context, userToBlock, blockedBy auth.User) error {
	err := c.blockedUserStore.BlockUser(ctx, userToBlock, blockedBy)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	c.userBlockedBy.Notify(blockedBy.Address(), userToBlock.Address(), false)
	return nil
}

func (c *Manager) UnblockUser(ctx context.Context, blockID string, blockedBy auth.User) error {
	unblockedUser, err := c.blockedUserStore.UnblockUser(ctx, blockID, blockedBy)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	c.userUnblockedBy.Notify(blockedBy.Address(), unblockedUser.Address(), false)
	return nil
}

func (c *Manager) UnblockUserByAddress(ctx context.Context, address string, blockedBy auth.User) error {
	unblockedUser, err := c.blockedUserStore.UnblockUserByAddress(ctx, address, blockedBy)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	c.userUnblockedBy.Notify(blockedBy.Address(), unblockedUser.Address(), false)
	return nil
}
