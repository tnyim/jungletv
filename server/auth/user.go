package auth

import (
	"context"

	"github.com/tnyim/jungletv/proto"
)

func UserPermissionLevelIsAtLeast(user User, level PermissionLevel) bool {
	userLevel := UnauthenticatedPermissionLevel
	if user != nil && user != User(nil) {
		userLevel = user.PermissionLevel()
	}
	return PermissionLevelOrder[userLevel] >= PermissionLevelOrder[level]
}

// User represents an identity on the service
type User interface {
	Address() string
	PermissionLevel() PermissionLevel
	IsUnknown() bool
	IsFromAlienChain() bool
	ApplicationID() string

	Nickname() *string
	SetNickname(*string)
	ModeratorName() string
}

// APIUserSerializer is a function that is able to return the protobuf representation of a user
type APIUserSerializer func(ctx context.Context, user User) *proto.User

// BuildNonAuthorizedUser uses the specified components to return a User that is not backed by JWT claims
func BuildNonAuthorizedUser(address string, permissionLevel PermissionLevel, nickname *string, applicationID *string) User {
	var user User
	if applicationID == nil || *applicationID == "" {
		user = NewAddressOnlyUserWithPermissionLevel(address, permissionLevel)
	} else {
		user = NewApplicationUser(address, *applicationID)
	}
	user.SetNickname(nickname)
	return user
}
