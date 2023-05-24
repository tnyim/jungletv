package auth

import "github.com/palantir/stacktrace"

// PermissionLevel represents the elevation of a user
type PermissionLevel string

const UnauthenticatedPermissionLevel PermissionLevel = "" // must be the empty string
const UserPermissionLevel PermissionLevel = "user"
const AppEditorPermissionLevel PermissionLevel = "appeditor"
const AdminPermissionLevel PermissionLevel = "admin"

// ParsePermissionLevel parses a permission level into a PermissionLevel
func ParsePermissionLevel(p string) (PermissionLevel, error) {
	switch p {
	case string(UnauthenticatedPermissionLevel), "unauthenticated":
		return UnauthenticatedPermissionLevel, nil
	case string(UserPermissionLevel):
		return UserPermissionLevel, nil
	case string(AppEditorPermissionLevel):
		return AppEditorPermissionLevel, nil
	case string(AdminPermissionLevel):
		return AdminPermissionLevel, nil
	default:
		return "", stacktrace.NewError("invalid permission level")
	}
}

// PermissionLevelOrder allows for checking which permission levels are more elevated; a higher value means higher privileges
var PermissionLevelOrder = map[PermissionLevel]int{
	UnauthenticatedPermissionLevel: 0,
	UserPermissionLevel:            1,
	AppEditorPermissionLevel:       2,
	AdminPermissionLevel:           3,
}
