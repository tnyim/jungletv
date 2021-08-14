package auth

// PermissionLevel represents the elevation of a user
type PermissionLevel string

const UnauthenticatedPermissionLevel PermissionLevel = "" // must be the empty string
const UserPermissionLevel PermissionLevel = "user"
const AdminPermissionLevel PermissionLevel = "admin"

// PermissionLevelOrder allows for checking which permission levels are more elevated; a higher value means higher privileges
var PermissionLevelOrder = map[PermissionLevel]int{
	UnauthenticatedPermissionLevel: 0,
	UserPermissionLevel:            1,
	AdminPermissionLevel:           2,
}
