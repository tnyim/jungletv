package auth

import (
	"github.com/dgrijalva/jwt-go"
)

// UserClaims is the claim type used
type UserClaims struct {
	jwt.StandardClaims
	authenticatedUser
	ClaimsVersion int `json:"claims_version"`
	Season        int `json:"season"` // incremented on a per-user basis when each user wants to invalidate all of their auth tokens
}

type authenticatedUser struct {
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

func (u *UserClaims) IsFromAlienChain() bool {
	return false
}

func (u *UserClaims) IsUnknown() bool {
	return u == nil
}

func (u *UserClaims) ApplicationID() string {
	return ""
}

func (u *UserClaims) SetNickname(s *string) {
	if s == nil {
		u.TheNickname = ""
	} else {
		u.TheNickname = *s
	}
}

func (u *UserClaims) ModeratorName() string {
	return u.Username
}
