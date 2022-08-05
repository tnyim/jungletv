package server

import (
	"context"

	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/server/components/payment"
	authinterceptor "github.com/tnyim/jungletv/server/interceptors/auth"
	"github.com/tnyim/jungletv/types"
	"github.com/tnyim/jungletv/utils/transaction"
	"google.golang.org/protobuf/types/known/timestamppb"
)

func (s *grpcServer) RewardHistory(ctxCtx context.Context, r *proto.RewardHistoryRequest) (*proto.RewardHistoryResponse, error) {
	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	defer ctx.Commit() // read-only tx

	userClaims := authinterceptor.UserClaimsFromContext(ctx)
	if userClaims == nil {
		return nil, stacktrace.NewError("user claims unexpectedly missing")
	}

	var receivedRewards []*types.ReceivedReward
	var total uint64

	receivedRewards, total, err = types.GetReceivedRewardsForAddress(ctx, userClaims.RewardAddress, readPaginationParameters(r))
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	playedMedia := make(map[string]*types.PlayedMedia)
	if len(receivedRewards) > 0 {
		mediaIDs := make([]string, len(receivedRewards))
		for i := range receivedRewards {
			mediaIDs[i] = receivedRewards[i].Media
		}
		playedMedia, err = types.GetPlayedMediaWithIDs(ctx, mediaIDs)
		if err != nil {
			return nil, stacktrace.Propagate(err, "")
		}
	}

	protoReceivedRewards, err := s.convertReceivedRewards(receivedRewards, playedMedia)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	return &proto.RewardHistoryResponse{
		ReceivedRewards: protoReceivedRewards,
		Offset:          readOffset(r),
		Total:           total,
	}, nil
}

func (s *grpcServer) convertReceivedRewards(orig []*types.ReceivedReward, playedMedia map[string]*types.PlayedMedia) ([]*proto.ReceivedReward, error) {
	protoEntries := make([]*proto.ReceivedReward, len(orig))
	for i, entry := range orig {
		var err error
		protoEntries[i], err = s.convertReceivedReward(entry, playedMedia[entry.Media])
		if err != nil {
			return nil, stacktrace.Propagate(err, "")
		}
	}
	return protoEntries, nil
}

func (s *grpcServer) convertReceivedReward(orig *types.ReceivedReward, playedMedia *types.PlayedMedia) (*proto.ReceivedReward, error) {
	reward := &proto.ReceivedReward{
		Id:             orig.ID,
		RewardsAddress: orig.RewardsAddress,
		Amount:         payment.NewAmountFromDecimal(orig.Amount).SerializeForAPI(),
		ReceivedAt:     timestamppb.New(orig.ReceivedAt),
		MediaId:        orig.Media,
	}

	if playedMedia != nil {
		var err error
		reward.MediaInfo, err = s.mediaProviders[playedMedia.MediaType].SerializeReceivedRewardMediaInfo(playedMedia)
		if err != nil {
			return nil, stacktrace.Propagate(err, "")
		}
	}

	return reward, nil
}
