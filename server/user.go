package server

import (
	"context"

	"github.com/dgrijalva/jwt-go"
	"github.com/tnyim/jungletv/proto"
)

// User represents an identity on the service
type User interface {
	Address() string
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
}

type userInfo struct {
	RewardAddress   string          `json:"reward_address"`
	PermissionLevel PermissionLevel `json:"permission_level"`
	Username        string          `json:"username"`
}

func (u *UserClaims) Address() string {
	return u.RewardAddress
}

func (u *UserClaims) SerializeForAPI() *proto.User {
	return &proto.User{
		Address: u.RewardAddress,
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
