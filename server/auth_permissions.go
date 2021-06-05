package server

// PermissionLevel represents the elevation of a user
type PermissionLevel string

const UnauthenticatedPermissionLevel PermissionLevel = "" // must be the empty string
const UserPermissionLevel PermissionLevel = "user"
const AdminPermissionLevel PermissionLevel = "admin"

var permissionLevelOrder = map[PermissionLevel]int{
	UnauthenticatedPermissionLevel: 0,
	UserPermissionLevel:            1,
	AdminPermissionLevel:           2,
}
