package auth

type addressOnlyUser struct {
	address         string
	permissionLevel PermissionLevel
	nickname        *string
}

func NewAddressOnlyUser(address string) User {
	return &addressOnlyUser{
		address:         address,
		permissionLevel: UnauthenticatedPermissionLevel,
	}
}

func NewAddressOnlyUserWithPermissionLevel(address string, permLevel PermissionLevel) User {
	return &addressOnlyUser{
		address:         address,
		permissionLevel: permLevel,
	}
}

func (u *addressOnlyUser) Address() string {
	return u.address
}

func (u *addressOnlyUser) Nickname() *string {
	return u.nickname
}

func (u *addressOnlyUser) PermissionLevel() PermissionLevel {
	return u.permissionLevel
}

func (u *addressOnlyUser) IsUnknown() bool {
	return u == nil || u.address == ""
}

func (u *addressOnlyUser) SetNickname(s *string) {
	u.nickname = s
}
