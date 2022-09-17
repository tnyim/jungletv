package server

import (
	"context"

	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/server/auth"
	authinterceptor "github.com/tnyim/jungletv/server/interceptors/auth"
)

func (s *grpcServer) serializeUserForAPI(ctx context.Context, user auth.User) *proto.User {
	userAddress := user.Address()
	fetchedUser, _ := s.nicknameCache.GetOrFetchUser(ctx, userAddress)

	s.vipUsersMutex.RLock()
	vipUserAppearance, isVip := s.vipUsers[userAddress]
	s.vipUsersMutex.RUnlock()

	roles := []proto.UserRole{}
	if isVip {
		switch vipUserAppearance {
		case vipUserAppearanceModerator:
			roles = append(roles, proto.UserRole_MODERATOR)
		case vipUserAppearanceVIP:
			roles = append(roles, proto.UserRole_VIP)
		case vipUserAppearanceVIPModerator:
			roles = append(roles, proto.UserRole_VIP)
			roles = append(roles, proto.UserRole_MODERATOR)
		}
	} else if auth.UserPermissionLevelIsAtLeast(user, auth.AdminPermissionLevel) ||
		(fetchedUser != nil && auth.UserPermissionLevelIsAtLeast(fetchedUser, auth.AdminPermissionLevel)) {
		roles = append(roles, proto.UserRole_MODERATOR)
	}

	mediaCount, requestedCurrent, err := s.mediaQueue.CountEnqueuedOrRecentlyPlayedMediaRequestedBy(ctx, user)
	if err == nil {
		switch {
		case mediaCount >= 10:
			roles = append(roles, proto.UserRole_TIER_3_REQUESTER)
		case mediaCount >= 5:
			roles = append(roles, proto.UserRole_TIER_2_REQUESTER)
		case mediaCount > 0:
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

type vipUserAppearance int

const (
	vipUserAppearanceNormal vipUserAppearance = iota
	vipUserAppearanceModerator
	vipUserAppearanceVIP
	vipUserAppearanceVIPModerator
)

func (s *grpcServer) isVIPUser(user auth.User) bool {
	s.vipUsersMutex.RLock()
	defer s.vipUsersMutex.RUnlock()
	if user != nil && !user.IsUnknown() {
		_, present := s.vipUsers[user.Address()]
		return present
	}
	return false
}
