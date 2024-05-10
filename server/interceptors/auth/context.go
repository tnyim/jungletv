package auth

import (
	"context"

	"github.com/tnyim/jungletv/server/auth"
)

type userContextKey struct{}

func UserFromContext(ctx context.Context) auth.User {
	v := ctx.Value(userContextKey{})
	if v == nil {
		return auth.UnknownUser
	}
	return v.(auth.User)
}

func WithUser(ctx context.Context, claims auth.User) context.Context {
	return context.WithValue(ctx, userContextKey{}, claims)
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
