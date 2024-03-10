package notificationmanager_test

import (
	"testing"

	"github.com/stretchr/testify/require"
	"github.com/tnyim/jungletv/server/auth"
	"github.com/tnyim/jungletv/server/components/notificationmanager"
)

func TestUserRecipientFullyContainedWithin(t *testing.T) {
	user1 := auth.NewAddressOnlyUser("user1_address")
	user2 := auth.NewAddressOnlyUser("user2_address")

	recipient := notificationmanager.MakeUserRecipient(user1)

	require.False(t, recipient.FullyContainedWithin([]auth.User{user2}))
	require.True(t, recipient.FullyContainedWithin([]auth.User{user1}))
	require.True(t, recipient.FullyContainedWithin([]auth.User{user1, user2}))
}

func TestUsersRecipientFullyContainedWithin(t *testing.T) {
	user1 := auth.NewAddressOnlyUser("user1_address")
	user2 := auth.NewAddressOnlyUser("user2_address")
	user3 := auth.NewAddressOnlyUser("user3_address")

	recipient := notificationmanager.MakeUsersRecipient([]auth.User{user1, user2})

	require.False(t, recipient.FullyContainedWithin([]auth.User{user2}))
	require.True(t, recipient.FullyContainedWithin([]auth.User{user1, user2}))
	require.False(t, recipient.FullyContainedWithin([]auth.User{user1, user3}))
	require.True(t, recipient.FullyContainedWithin([]auth.User{user1, user2, user3}))
}
