package gojautil

import (
	"context"
	"strings"
	"unicode/utf8"

	"github.com/dop251/goja"
	"github.com/hectorchu/gonano/util"
	"github.com/icza/gox/stringsx"
	"github.com/tnyim/jungletv/server/auth"
	"github.com/tnyim/jungletv/server/usercache"
)

// ValidateBananoAddress panics with a TypeError containing the given message, if the given address is not a valid Banano address
func ValidateBananoAddress(vm *goja.Runtime, address string, errorMessage string) {
	_, err := util.AddressToPubkey(address)
	if err != nil || address[:4] != "ban_" { // we must check for ban since AddressToPubkey accepts nano too
		panic(vm.NewTypeError(errorMessage))
	}
}

// ValidateAndSanitizeNickname validates and sanitizes the given nickname, returning the sanitized string.
func ValidateAndSanitizeNickname(vm *goja.Runtime, nicknameString string) string {
	nicknameString = strings.TrimSpace(nicknameString)

	nicknameString = stringsx.Clean(nicknameString)
	if utf8.RuneCountInString(nicknameString) < 3 {
		panic(vm.NewTypeError("Nickname must be at least 3 characters long"))
	}
	if utf8.RuneCountInString(nicknameString) > 16 {
		panic(vm.NewTypeError("Nickname must be at most 16 characters long"))
	}
	if strings.HasPrefix(nicknameString, "ban_1") || strings.HasPrefix(nicknameString, "ban_3") {
		panic(vm.NewTypeError("Nickname must not look like a Banano address"))
	}

	return nicknameString
}

// UserSerializer serializes users in the JS context of a JAF application
type UserSerializer interface {
	SerializeUser(vm *goja.Runtime, user auth.User) goja.Value
	BuildUserGetter(vm *goja.Runtime, user auth.User) goja.Value
}

// UserSerializerImplementation is an implementation of UserSerializer that allows for setting the execution context
type UserSerializerImplementation struct {
	ctx       context.Context
	userCache usercache.UserCache
}

// NewUserSerializer creates a new UserSerializerImplementation
func NewUserSerializer(userCache usercache.UserCache) *UserSerializerImplementation {
	return &UserSerializerImplementation{
		userCache: userCache,
	}
}

var _ UserSerializer = (*UserSerializerImplementation)(nil)

// SetContext should be called with the most recent execution context for an application, every time it changes
func (s *UserSerializerImplementation) SetContext(ctx context.Context) {
	s.ctx = ctx
}

// SerializeUser converts an auth.User into a JS land object
func (s *UserSerializerImplementation) SerializeUser(vm *goja.Runtime, user auth.User) goja.Value {
	if user != nil && !user.IsUnknown() {
		fetchedUser, err := s.userCache.GetOrFetchUser(s.ctx, user.Address())
		if err == nil && fetchedUser != nil && !fetchedUser.IsUnknown() {
			user = fetchedUser
		}

		m := map[string]interface{}{
			"address":          user.Address(),
			"nickname":         user.Nickname(),
			"permissionLevel":  user.PermissionLevel(),
			"isFromAlienChain": user.IsFromAlienChain(),
		}
		applicationID := user.ApplicationID()
		if applicationID == "" {
			m["applicationID"] = goja.Undefined()
		} else {
			m["applicationID"] = applicationID
		}

		nickname := user.Nickname()
		if nickname == nil {
			m["nickname"] = goja.Undefined()
		} else {
			m["nickname"] = *nickname
		}
		return vm.ToValue(m)
	}
	return goja.Undefined()
}

// BuildUserGetter builds a JS function that can be passed as a getter to (*goja.Object).DefineAccessorProperty
func (s *UserSerializerImplementation) BuildUserGetter(vm *goja.Runtime, user auth.User) goja.Value {
	return vm.ToValue(func(call goja.FunctionCall) goja.Value {
		return s.SerializeUser(vm, user)
	})
}
