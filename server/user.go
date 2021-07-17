package server

import (
	"context"

	"github.com/dgrijalva/jwt-go"
	"github.com/tnyim/jungletv/proto"
)

// User represents an identity on the service
type User interface {
	Address() string
	PermissionLevel() PermissionLevel
	SerializeForAPI() *proto.User
	IsUnknown() bool
	SetNickname(*string)
}

type addressOnlyUser struct {
	address         string
	permissionLevel PermissionLevel
	nickname        *string
}

func NewAddressOnlyUser(address string) User {
	return &addressOnlyUser{
		address:         address,
		permissionLevel: UnauthenticatedPermissionLevel,
	}
}

func NewAddressOnlyUserWithPermissionLevel(address string, permLevel PermissionLevel) User {
	return &addressOnlyUser{
		address:         address,
		permissionLevel: permLevel,
	}
}

func (u *addressOnlyUser) Address() string {
	return u.address
}

func (u *addressOnlyUser) PermissionLevel() PermissionLevel {
	return u.permissionLevel
}

func (u *addressOnlyUser) SerializeForAPI() *proto.User {
	roles := []proto.UserRole{}
	if permissionLevelOrder[u.permissionLevel] >= permissionLevelOrder[AdminPermissionLevel] {
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
	Nickname      string          `json:"nickname"`
}

func (u *UserClaims) Address() string {
	return u.RewardAddress
}

func (u *UserClaims) PermissionLevel() PermissionLevel {
	return u.PermLevel
}

func (u *UserClaims) SerializeForAPI() *proto.User {
	roles := []proto.UserRole{}
	if permissionLevelOrder[u.PermLevel] >= permissionLevelOrder[AdminPermissionLevel] {
		roles = append(roles, proto.UserRole_MODERATOR)
	}
	pu := &proto.User{
		Address: u.RewardAddress,
		Roles:   roles,
	}
	if u.Nickname != "" {
		pu.Nickname = &u.Nickname
	}
	return pu
}

func (u *UserClaims) IsUnknown() bool {
	return false
}

func (u *UserClaims) SetNickname(s *string) {
	if s == nil {
		u.Nickname = ""
	} else {
		u.Nickname = *s
	}
}

type unknownUser struct {
}

func (u *unknownUser) Address() string {
	return ""
}

func (u *unknownUser) PermissionLevel() PermissionLevel {
	return UnauthenticatedPermissionLevel
}

func (u *unknownUser) SerializeForAPI() *proto.User {
	return &proto.User{}
}

func (u *unknownUser) IsUnknown() bool {
	return true
}

func (u *unknownUser) SetNickname(s *string) {
}

func UserClaimsFromContext(ctx context.Context) *UserClaims {
	v := ctx.Value("UserClaims")
	if v == nil {
		return nil
	}
	return v.(*UserClaims)
}

func RemoteAddressFromContext(ctx context.Context) string {
	v := ctx.Value("RemoteAddress")
	if v == nil {
		return ""
	}
	return v.(string)
}

func IPCountryFromContext(ctx context.Context) string {
	v := ctx.Value("IPCountry")
	if v == nil {
		return ""
	}
	return v.(string)
}
