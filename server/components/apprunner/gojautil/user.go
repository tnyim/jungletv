package gojautil

import (
	"github.com/dop251/goja"
	"github.com/tnyim/jungletv/server/auth"
)

// SerializeUser converts an auth.User into a JS land object
func SerializeUser(vm *goja.Runtime, user auth.User) goja.Value {
	if user != nil && !user.IsUnknown() {
		return vm.ToValue(map[string]interface{}{
			"address":          user.Address(),
			"nickname":         user.Nickname(),
			"permissionLevel":  user.PermissionLevel(),
			"isFromAlienChain": user.IsFromAlienChain(),
			"applicationID":    user.ApplicationID(),
		})
	}
	return goja.Undefined()
}
