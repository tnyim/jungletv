package notificationmanager

import (
	"slices"
	"strings"

	"github.com/samber/lo"
	"github.com/tnyim/jungletv/server/auth"
)

// Recipient defines a set of users who should receive the notification
type Recipient interface {
	// ID must return a value that can be used to compare recipients
	ID() RecipientID

	// ContainsUser returns true if the recipient set contains the specified user
	ContainsUser(user auth.User) bool

	// FullyContainedWithin returns true if the recipient is a subset of the specified users
	// The specified users are guaranteed not to be anonymous/unknown
	FullyContainedWithin(users []auth.User) bool
}

// RecipientID is any type that can be used to compare two recipients
type RecipientID any

type UserRecipient interface {
	Recipient
	ForUser() auth.User
}

// RecipientEveryone is used for notifications that should be sent to all users
var RecipientEveryone Recipient = recipientEveryone{}

type recipientEveryone struct{}

func (r recipientEveryone) ID() RecipientID {
	return r
}

func (r recipientEveryone) ContainsUser(user auth.User) bool {
	return true
}

func (r recipientEveryone) FullyContainedWithin(users []auth.User) bool {
	// we can come up with an "infinite" number of recipient user addresses, so this is effectively always false
	return false
}

type recipientUser struct {
	user string
}

func (r recipientUser) ID() RecipientID {
	return r
}

func (r recipientUser) ContainsUser(user auth.User) bool {
	if user == nil || user.IsUnknown() {
		return false
	}
	return user.Address() == r.user
}

func (r recipientUser) FullyContainedWithin(users []auth.User) bool {
	for _, user := range users {
		if user.Address() == r.user {
			return true
		}
	}
	return false
}

func (r recipientUser) ForUser() auth.User {
	return auth.NewAddressOnlyUser(r.user)
}

// MakeUserRecipient creates a notification Recipient that corresponds to a specific user
// Do not specify an anonymous/unknown user
func MakeUserRecipient(user auth.User) UserRecipient {
	return recipientUser{user: user.Address()}
}

type recipientEveryoneExcept struct {
	exclusions map[string]struct{}
}

func (r recipientEveryoneExcept) ID() RecipientID {
	k := lo.Keys(r.exclusions)
	slices.Sort(k)
	return strings.Join(k, ",")
}

func (r recipientEveryoneExcept) ContainsUser(user auth.User) bool {
	_, ok := r.exclusions[buildDirectKeyForUser(user)]
	return !ok
}

func (r recipientEveryoneExcept) FullyContainedWithin(users []auth.User) bool {
	// we can come up with an "infinite" number of recipient user addresses, so this is effectively always false
	return false
}

// MakeEveryoneExceptSpecifiedRecipient creates a notification Recipient that corresponds to all users except the specified ones
// Do not specify anonymous/unknown users
func MakeEveryoneExceptSpecifiedRecipient(users []auth.User) Recipient {
	return recipientEveryoneExcept{
		exclusions: lo.SliceToMap(users, func(user auth.User) (string, struct{}) {
			return user.Address(), struct{}{}
		}),
	}
}

type recipientUsers struct {
	inclusions map[string]struct{}
}

func (r recipientUsers) ID() RecipientID {
	k := lo.Keys(r.inclusions)
	slices.Sort(k)
	return strings.Join(k, ",")
}

func (r recipientUsers) ContainsUser(user auth.User) bool {
	_, ok := r.inclusions[buildDirectKeyForUser(user)]
	return ok
}

func (r recipientUsers) FullyContainedWithin(users []auth.User) bool {
	// should return true if all of the included users are in the passed superset
	superSet := lo.SliceToMap(users, func(user auth.User) (string, struct{}) {
		return user.Address(), struct{}{}
	})
	for address := range r.inclusions {
		if _, ok := superSet[address]; !ok {
			return false
		}
	}
	return true
}

// MakeUsersRecipient creates a notification Recipient that corresponds to the specified users
// Do not specify anonymous/unknown users
func MakeUsersRecipient(users []auth.User) Recipient {
	return recipientUsers{
		inclusions: lo.SliceToMap(users, func(user auth.User) (string, struct{}) {
			return user.Address(), struct{}{}
		}),
	}
}
