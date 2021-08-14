package server

import (
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/server/auth"
)

// User represents an identity on the service
type User interface {
	Address() string
	PermissionLevel() auth.PermissionLevel
	SerializeForAPI() *proto.User
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

func (u *addressOnlyUser) PermissionLevel() auth.PermissionLevel {
	return u.permissionLevel
}

func (u *addressOnlyUser) SerializeForAPI() *proto.User {
	roles := []proto.UserRole{}
	if UserPermissionLevelIsAtLeast(u, auth.AdminPermissionLevel) {
		roles = append(roles, proto.UserRole_MODERATOR)
	}
	return &proto.User{
		Address:  u.address,
		Roles:    roles,
		Nickname: u.nickname,
	}
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
