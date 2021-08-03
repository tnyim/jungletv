package server

import (
	"context"
	"time"

	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/types"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (s *grpcServer) RewardInfo(ctxCtx context.Context, r *proto.RewardInfoRequest) (*proto.RewardInfoResponse, error) {
	ctx, err := BeginTransaction(ctxCtx)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	defer ctx.Commit() // read-only tx

	userClaims := UserClaimsFromContext(ctx)
	if userClaims == nil {
		return nil, stacktrace.NewError("user claims unexpectedly missing")
	}

	delegatorsCountChan := make(chan uint64)
	delegatorsErrChan := make(chan error)

	_, cachedGoodRepResult := s.addressesWithGoodRepCache.Get(userClaims.RewardAddress)
	if !cachedGoodRepResult {
		go func() {
			representative, err := s.wallet.RPC.AccountRepresentative(userClaims.RewardAddress)
			if err != nil {
				delegatorsErrChan <- stacktrace.Propagate(err, "")
				return
			}

			cachedCount, ok := s.delegatorCountsPerRep.Get(representative)
			if ok {
				delegatorsCountChan <- cachedCount.(uint64)
				return
			}
			c, err := s.wallet.RPC.DelegatorsCount(representative)
			if err != nil {
				delegatorsErrChan <- stacktrace.Propagate(err, "")
				return
			}
			delegatorsCountChan <- c
			s.delegatorCountsPerRep.SetDefault(representative, c)
		}()
	}

	balance, err := types.GetRewardBalanceOfAddress(ctx, userClaims.RewardAddress)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	pendingWithdrawal, position, total, err := types.AddressHasPendingWithdrawal(ctx, userClaims.RewardAddress)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	badRepresentative := false
	if !cachedGoodRepResult {
		select {
		case err := <-delegatorsErrChan:
			s.log.Printf("Error checking delegators count for address %s: %v", userClaims.RewardAddress, err)
		case c := <-delegatorsCountChan:
			badRepresentative = c < 2
			s.addressesWithGoodRepCache.SetDefault(userClaims.RewardAddress, true)
		case <-time.After(5 * time.Second):
			break
		}
	}

	response := &proto.RewardInfoResponse{
		RewardAddress:     userClaims.RewardAddress,
		RewardBalance:     NewAmountFromDecimal(balance.Balance).SerializeForAPI(),
		WithdrawalPending: pendingWithdrawal,
		BadRepresentative: badRepresentative,
	}
	if pendingWithdrawal {
		p := int32(position)
		t := int32(total)
		response.WithdrawalPositionInQueue = &p
		response.WithdrawalsInQueue = &t
	}
	return response, nil
}

func (s *grpcServer) Withdraw(ctxCtx context.Context, r *proto.WithdrawRequest) (*proto.WithdrawResponse, error) {
	ctx, err := BeginTransaction(ctxCtx)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	defer ctx.Rollback()

	userClaims := UserClaimsFromContext(ctx)
	if userClaims == nil {
		return nil, stacktrace.NewError("user claims unexpectedly missing")
	}

	balance, err := types.GetRewardBalanceOfAddress(ctx, userClaims.RewardAddress)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	if balance.Balance.IsZero() || balance.Balance.IsNegative() {
		return nil, status.Error(codes.FailedPrecondition, "insufficient balance")
	}

	pendingWithdraw, _, _, err := types.AddressHasPendingWithdrawal(ctx, userClaims.RewardAddress)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	if pendingWithdraw {
		return nil, status.Error(codes.FailedPrecondition, "existing pending withdraw")
	}

	err = s.withdrawalHandler.WithdrawBalances(ctx, []*types.RewardBalance{balance})
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	err = ctx.Commit()
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	return &proto.WithdrawResponse{}, nil
}
