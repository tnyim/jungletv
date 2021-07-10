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
}

type addressOnlyUser struct {
	address string
}

func NewAddressOnlyUser(address string) User {
	return &addressOnlyUser{
		address: address,
	}
}

func (u *addressOnlyUser) Address() string {
	return u.address
}

func (u *addressOnlyUser) PermissionLevel() PermissionLevel {
	return UnauthenticatedPermissionLevel
}

func (u *addressOnlyUser) SerializeForAPI() *proto.User {
	return &proto.User{
		Address: u.address,
	}
}

func (u *addressOnlyUser) IsUnknown() bool {
	return false
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
	return &proto.User{
		Address: u.RewardAddress,
		Roles:   roles,
	}
}

func (u *UserClaims) IsUnknown() bool {
	return false
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
