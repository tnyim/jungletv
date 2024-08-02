package server

import (
	"context"
	"fmt"
	"slices"

	"github.com/palantir/stacktrace"
	"github.com/samber/lo"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/server/components/rewards"
	authinterceptor "github.com/tnyim/jungletv/server/interceptors/auth"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"google.golang.org/protobuf/types/known/timestamppb"
)

func (s *grpcServer) Spectators(ctx context.Context, r *proto.SpectatorsRequest) (*proto.SpectatorsResponse, error) {
	spectators := s.rewardsHandler.ConnectedSpectators()

	result := make([]*proto.Spectator, 0, len(spectators))

	for _, spectator := range spectators {
		ps, err := s.serializeSpectator(ctx, spectator)
		if err != nil {
			return nil, stacktrace.Propagate(err, "")
		}

		result = append(result, ps)
	}

	// sort by watching since, descending
	slices.SortFunc(result, func(a, b *proto.Spectator) int {
		return -a.WatchingSince.AsTime().Compare(b.WatchingSince.AsTime())
	})

	return &proto.SpectatorsResponse{Spectators: result}, nil
}

func (s *grpcServer) SpectatorInfo(ctx context.Context, r *proto.SpectatorInfoRequest) (*proto.Spectator, error) {
	spectator, ok := s.rewardsHandler.GetSpectator(r.RewardsAddress)
	if !ok {
		return nil, status.Error(codes.NotFound, "spectator not found")
	}

	ps, err := s.serializeSpectator(ctx, spectator)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	return ps, nil
}

func (s *grpcServer) serializeSpectator(ctx context.Context, spectator rewards.Spectator) (*proto.Spectator, error) {
	rewardsAddress := spectator.User().Address()

	legitimate, notLegitimateSince := spectator.Legitimate()
	stoppedWatching, stoppedWatchingAt := spectator.StoppedWatching()
	activityChallenge := spectator.CurrentActivityChallenge()
	clientIntegrityChecksSkipped, err := s.moderationStore.LoadPaymentAddressSkipsClientIntegrityChecks(ctx, rewardsAddress)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	ipRepChecksSkipped, err := s.moderationStore.LoadPaymentAddressSkipsIPReputationChecks(ctx, rewardsAddress)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	hardChallengesReduced, err := s.moderationStore.LoadPaymentAddressHasReducedHardChallengeFrequency(ctx, rewardsAddress)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	remoteAddressBanned, err := s.moderationStore.LoadRemoteAddressBannedFromRewards(ctx, spectator.CurrentRemoteAddress())
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	goodRep, asn, checked := s.ipReputationChecker.AddressInformation(spectator.CurrentRemoteAddress())
	ps := &proto.Spectator{
		User:                               s.userSerializer(ctx, spectator.User()),
		NumConnections:                     uint32(spectator.ConnectionCount()),
		NumSpectatorsWithSameRemoteAddress: uint32(spectator.CountOtherConnectedSpectatorsOnSameRemoteAddress(s.rewardsHandler)),
		WatchingSince:                      timestamppb.New(spectator.WatchingSince()),
		RemoteAddressHasGoodReputation:     goodRep || !checked,
		RemoteAddressBannedFromRewards:     remoteAddressBanned,
		Legitimate:                         legitimate,
		ClientIntegrityChecksSkipped:       clientIntegrityChecksSkipped,
		IpAddressReputationChecksSkipped:   ipRepChecksSkipped,
		HardChallengeFrequencyReduced:      hardChallengesReduced,
	}
	if asn >= 0 {
		ps.AsNumber = lo.ToPtr(uint32(asn))
	}
	if !legitimate {
		ps.NotLegitimateSince = timestamppb.New(notLegitimateSince)
	}
	if stoppedWatching {
		ps.StoppedWatchingAt = timestamppb.New(stoppedWatchingAt)
	}
	if activityChallenge != nil {
		ps.ActivityChallenge = activityChallenge.SerializeForAPI()
	}

	return ps, nil
}

func (s *grpcServer) ResetSpectatorStatus(ctx context.Context, r *proto.ResetSpectatorStatusRequest) (*proto.ResetSpectatorStatusResponse, error) {
	moderator := authinterceptor.UserFromContext(ctx)
	if moderator == nil {
		// this should never happen, as the auth interceptors should have taken care of this for us
		return nil, status.Error(codes.Unauthenticated, "missing user claims")
	}

	err := s.rewardsHandler.ResetAddressLegitimacyStatus(ctx, r.RewardsAddress)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	s.log.Printf("Spectator state of address %s reset by %s (remote address %s)", r.RewardsAddress, moderator.ModeratorName(), authinterceptor.RemoteAddressFromContext(ctx))

	if s.modLogWebhook != nil {
		_, err = s.modLogWebhook.SendContent(
			fmt.Sprintf("Spectator state of address %s reset by moderator: %s (%s)",
				r.RewardsAddress,
				moderator.Address()[:14],
				moderator.ModeratorName()))
		if err != nil {
			s.log.Println("Failed to send mod log webhook:", err)
		}
	}
	return &proto.ResetSpectatorStatusResponse{}, nil
}
