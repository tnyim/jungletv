package auth

type applicationUser struct {
	address       string
	nickname      *string
	applicationID string
}

func NewApplicationUser(address string, applicationID string) User {
	return &applicationUser{
		address:       address,
		applicationID: applicationID,
	}
}

func (u *applicationUser) Address() string {
	return u.address
}

func (u *applicationUser) Nickname() *string {
	return u.nickname
}

func (u *applicationUser) PermissionLevel() PermissionLevel {
	return AdminPermissionLevel
}

func (u *applicationUser) IsUnknown() bool {
	return false
}

func (u *applicationUser) IsFromAlienChain() bool {
	return false
}

func (u *applicationUser) ApplicationID() string {
	return u.applicationID
}

func (u *applicationUser) SetNickname(s *string) {
	u.nickname = s
}
