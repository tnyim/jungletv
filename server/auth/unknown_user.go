package auth

import "github.com/tnyim/jungletv/proto"

var UnknownUser User = &unknownUser{}

type unknownUser struct{}

func (u *unknownUser) Address() string {
	return ""
}

func (u *unknownUser) Nickname() *string {
	return nil
}

func (u *unknownUser) PermissionLevel() PermissionLevel {
	return UnauthenticatedPermissionLevel
}

func (u *unknownUser) SerializeForAPI() *proto.User {
	return &proto.User{}
}

func (u *unknownUser) IsUnknown() bool {
	return true
}

func (u *unknownUser) IsFromAlienChain() bool {
	return true
}

func (u *unknownUser) ApplicationID() string {
	return ""
}

func (u *unknownUser) SetNickname(s *string) {
}

func (u *unknownUser) ModeratorName() string {
	return ""
}
