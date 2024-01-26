package gojautil

import (
	"github.com/dop251/goja"
	"github.com/tnyim/jungletv/server/auth"
)

// SerializeUser converts an auth.User into a JS land object
func SerializeUser(vm *goja.Runtime, user auth.User) goja.Value {
	if user != nil && !user.IsUnknown() {
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
