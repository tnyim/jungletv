package server

import (
	"context"

	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/server/auth"
)

// User represents an identity on the service
type User interface {
	Address() string
	Nickname() *string
	PermissionLevel() auth.PermissionLevel
	IsUnknown() bool
	SetNickname(*string)
}

type addressOnlyUser struct {
	address         string
	permissionLevel auth.PermissionLevel
	nickname        *string
}

func NewAddressOnlyUser(address string) *addressOnlyUser {
	return &addressOnlyUser{
		address:         address,
		permissionLevel: auth.UnauthenticatedPermissionLevel,
	}
}

func NewAddressOnlyUserWithPermissionLevel(address string, permLevel auth.PermissionLevel) *addressOnlyUser {
	return &addressOnlyUser{
		address:         address,
		permissionLevel: permLevel,
	}
}

func (u *addressOnlyUser) Address() string {
	return u.address
}

func (u *addressOnlyUser) Nickname() *string {
	return u.nickname
}

func (u *addressOnlyUser) PermissionLevel() auth.PermissionLevel {
	return u.permissionLevel
}

func (u *addressOnlyUser) IsUnknown() bool {
	return u.address == ""
}

func (u *addressOnlyUser) SetNickname(s *string) {
	u.nickname = s
}

type unknownUser struct {
}

func (u *unknownUser) Address() string {
	return ""
}

func (u *unknownUser) Nickname() *string {
	return nil
}

func (u *unknownUser) PermissionLevel() auth.PermissionLevel {
	return auth.UnauthenticatedPermissionLevel
}

func (u *unknownUser) SerializeForAPI() *proto.User {
	return &proto.User{}
}

func (u *unknownUser) IsUnknown() bool {
	return true
}

func (u *unknownUser) SetNickname(s *string) {
}

func UserPermissionLevelIsAtLeast(user User, level auth.PermissionLevel) bool {
	return auth.PermissionLevelOrder[user.PermissionLevel()] >= auth.PermissionLevelOrder[level]
}

// APIUserSerializer is a function that is able to return the protobuf representation of a user
type APIUserSerializer func(ctx context.Context, user User) *proto.User

func (s *grpcServer) serializeUserForAPI(ctx context.Context, user User) *proto.User {
	userAddress := user.Address()
	fetchedUser, _ := s.nicknameCache.GetOrFetchUser(ctx, userAddress)

	roles := []proto.UserRole{}
	if UserPermissionLevelIsAtLeast(user, auth.AdminPermissionLevel) ||
		(fetchedUser != nil && UserPermissionLevelIsAtLeast(fetchedUser, auth.AdminPermissionLevel)) {
		roles = append(roles, proto.UserRole_MODERATOR)
	}
	videoCount, requestedCurrent, err := s.mediaQueue.CountEnqueuedOrRecentlyPlayedVideosRequestedBy(ctx, user)
	if err == nil {
		switch {
		case videoCount >= 10:
			roles = append(roles, proto.UserRole_TIER_3_REQUESTER)
		case videoCount >= 5:
			roles = append(roles, proto.UserRole_TIER_2_REQUESTER)
		case videoCount > 0:
			roles = append(roles, proto.UserRole_TIER_1_REQUESTER)
		}
		if requestedCurrent {
			roles = append(roles, proto.UserRole_CURRENT_ENTRY_REQUESTER)
		}
	}

	var nickname *string
	bannedFromChat, err := s.moderationStore.LoadUserBannedFromChat(ctx, userAddress, "")
	serializingForUser := auth.UserClaimsFromContext(ctx)
	if err == nil && (!bannedFromChat || (serializingForUser != nil && serializingForUser.RewardAddress == userAddress)) {
		nickname = user.Nickname()
		if nickname == nil && fetchedUser != nil && !fetchedUser.IsUnknown() {
			nickname = fetchedUser.Nickname()
		}
	}

	return &proto.User{
		Address:  userAddress,
		Roles:    roles,
		Nickname: nickname,
		Status:   s.rewardsHandler.GetSpectatorActivityStatus(userAddress),
	}
}
