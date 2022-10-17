package auth

import (
	"context"

	"github.com/dgrijalva/jwt-go"
	"github.com/tnyim/jungletv/proto"
)

func UserPermissionLevelIsAtLeast(user User, level PermissionLevel) bool {
	return PermissionLevelOrder[user.PermissionLevel()] >= PermissionLevelOrder[level]
}

// User represents an identity on the service
type User interface {
	Address() string
	Nickname() *string
	PermissionLevel() PermissionLevel
	IsUnknown() bool
	IsFromAlienChain() bool
	SetNickname(*string)
}

// APIUserSerializer is a function that is able to return the protobuf representation of a user
type APIUserSerializer func(ctx context.Context, user User) *proto.User

// UserClaims is the claim type used
type UserClaims struct {
	jwt.StandardClaims
	userInfo
	ClaimsVersion int `json:"claims_version"`
}

type userInfo struct {
	RewardAddress string          `json:"reward_address"`
	PermLevel     PermissionLevel `json:"permission_level"`
	Username      string          `json:"username"`
	TheNickname   string          `json:"nickname"`
}

func (u *UserClaims) Address() string {
	return u.RewardAddress
}

func (u *UserClaims) Nickname() *string {
	if u.TheNickname == "" {
		return nil
	}
	return &u.TheNickname
}

func (u *UserClaims) PermissionLevel() PermissionLevel {
	return u.PermLevel
}

func (u *UserClaims) SerializeForAPI() *proto.User {
	roles := []proto.UserRole{}
	if PermissionLevelOrder[u.PermLevel] >= PermissionLevelOrder[AdminPermissionLevel] {
		roles = append(roles, proto.UserRole_MODERATOR)
	}
	pu := &proto.User{
		Address: u.RewardAddress,
		Roles:   roles,
	}
	if u.TheNickname != "" {
		pu.Nickname = &u.TheNickname
	}
	return pu
}

func (u *UserClaims) IsFromAlienChain() bool {
	return false
}

func (u *UserClaims) IsUnknown() bool {
	return u == nil
}

func (u *UserClaims) SetNickname(s *string) {
	if s == nil {
		u.TheNickname = ""
	} else {
		u.TheNickname = *s
	}
}
