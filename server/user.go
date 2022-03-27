package server

import (
	"context"

	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/server/auth"
	authinterceptor "github.com/tnyim/jungletv/server/interceptors/auth"
)

type unknownUser struct {
}

func (u *unknownUser) Address() string {
	return ""
}

func (u *unknownUser) Nickname() *string {
	return nil
}

func (u *unknownUser) PermissionLevel() auth.PermissionLevel {
	return auth.UnauthenticatedPermissionLevel
}

func (u *unknownUser) SerializeForAPI() *proto.User {
	return &proto.User{}
}

func (u *unknownUser) IsUnknown() bool {
	return true
}

func (u *unknownUser) SetNickname(s *string) {
}

func (s *grpcServer) serializeUserForAPI(ctx context.Context, user auth.User) *proto.User {
	userAddress := user.Address()
	fetchedUser, _ := s.nicknameCache.GetOrFetchUser(ctx, userAddress)

	roles := []proto.UserRole{}
	if auth.UserPermissionLevelIsAtLeast(user, auth.AdminPermissionLevel) ||
		(fetchedUser != nil && auth.UserPermissionLevelIsAtLeast(fetchedUser, auth.AdminPermissionLevel)) {
		roles = append(roles, proto.UserRole_MODERATOR)
	}
	videoCount, requestedCurrent, err := s.mediaQueue.CountEnqueuedOrRecentlyPlayedVideosRequestedBy(ctx, user)
	if err == nil {
		switch {
		case videoCount >= 10:
			roles = append(roles, proto.UserRole_TIER_3_REQUESTER)
		case videoCount >= 5:
			roles = append(roles, proto.UserRole_TIER_2_REQUESTER)
		case videoCount > 0:
			roles = append(roles, proto.UserRole_TIER_1_REQUESTER)
		}
		if requestedCurrent {
			roles = append(roles, proto.UserRole_CURRENT_ENTRY_REQUESTER)
		}
	}

	var nickname *string
	bannedFromChat, err := s.moderationStore.LoadUserBannedFromChat(ctx, userAddress, "")
	serializingForUser := authinterceptor.UserClaimsFromContext(ctx)
	if err == nil && (!bannedFromChat || (serializingForUser != nil && serializingForUser.RewardAddress == userAddress)) {
		nickname = user.Nickname()
		if nickname == nil && fetchedUser != nil && !fetchedUser.IsUnknown() {
			nickname = fetchedUser.Nickname()
		}
	}

	return &proto.User{
		Address:  userAddress,
		Roles:    roles,
		Nickname: nickname,
		Status:   s.rewardsHandler.GetSpectatorActivityStatus(userAddress),
	}
}
