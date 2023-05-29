package auth

import (
	"context"

	"github.com/tnyim/jungletv/server/auth"
)

type userClaimsContextKey struct{}

func UserClaimsFromContext(ctx context.Context) auth.User {
	v := ctx.Value(userClaimsContextKey{})
	if v == nil {
		return nil
	}
	return v.(*auth.UserClaims)
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
