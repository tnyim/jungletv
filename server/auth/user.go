package auth

import (
	"context"

	"github.com/dgrijalva/jwt-go"
	"github.com/tnyim/jungletv/proto"
)

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

func (u *UserClaims) IsUnknown() bool {
	return false
}

func (u *UserClaims) SetNickname(s *string) {
	if s == nil {
		u.TheNickname = ""
	} else {
		u.TheNickname = *s
	}
}

type userClaimsContextKey struct{}

func UserClaimsFromContext(ctx context.Context) *UserClaims {
	v := ctx.Value(userClaimsContextKey{})
	if v == nil {
		return nil
	}
	return v.(*UserClaims)
}

type remoteAddressContextKey struct{}

func RemoteAddressFromContext(ctx context.Context) string {
	v := ctx.Value(remoteAddressContextKey{})
	if v == nil {
		return ""
	}
	return v.(string)
}

type ipCountryRequestKey struct{}

func IPCountryFromContext(ctx context.Context) string {
	v := ctx.Value(ipCountryRequestKey{})
	if v == nil {
		return ""
	}
	return v.(string)
}
