package server

import (
	"context"
	"math"
	"time"

	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/server/auth"
	"github.com/tnyim/jungletv/types"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

var knownGoodReps = map[string]struct{}{
	"ban_19potasho7ozny8r1drz3u3hb3r97fw4ndm4hegdsdzzns1c3nobdastcgaa": {},
	"ban_3px37c9f6w361j65yoasrcs6wh3hmmyb6eacpis7dwzp8th4hbb9izgba51j": {},
	"ban_1wha1enz8k8r65k6nb89cxqh6cq534zpixmuzqwbifpnqrsycuegbmh54au6": {},
	"ban_3p3sp1ynb5i3qxmqoha3pt79hyk8gxhtr58tk51qctwyyik6hy4dbbqbanan": {},
	"ban_3batmanuenphd7osrez9c45b3uqw9d9u81ne8xa6m43e1py56y9p48ap69zg": {},
	"ban_1hentaiqzbhasuyg5tcyhso79ma3wuiektphbnjcekifmawuugdri93trt8f": {},
	"ban_1ry7kqi1msam7ay8qreo1mddc6ga6hg4s5tsqgtqhdhbxxwgcuo5mwfno379": {},
	"ban_3tacocatezozswnu8xkh66qa1dbcdujktzmfpdj7ax66wtfrio6h5sxikkep": {},
	"ban_1gt4ti4gnzjre341pqakzme8z94atcyuuawoso8gqwdx5m4a77wu1mxxighh": {},
	"ban_1crpaybw8jip7fm98fzfxnjajb55ty76oyzmpfwe9s66u4aod37tm3kxba8q": {},
	"ban_3goobcumtuqe37htu4qwtpkxnjj4jjheyz6e6kke3mro7d8zq5d36yskphqt": {},
	"ban_1banbet1hxxe9aeu11oqss9sxwe814jo9ym8c98653j1chq4k4yaxjsacnhc": {},

	// these are not actually "good" but they are bound to appear many times and we aren't warning for excessively large reps yet
	"ban_1bananobh5rat99qfgt1ptpieie5swmoth87thi74qgbfrij7dcgjiij94xr": {},
	"ban_1ka1ium4pfue3uxtntqsrib8mumxgazsjf58gidh1xeo5te3whsq8z476goo": {},
	"ban_1fomoz167m7o38gw4rzt7hz67oq6itejpt4yocrfywujbpatd711cjew8gjj": {},
	"ban_1cake36ua5aqcq1c5i3dg7k8xtosw7r9r7qbbf5j15sk75csp9okesz87nfn": {},
}

func (s *grpcServer) RewardInfo(ctxCtx context.Context, r *proto.RewardInfoRequest) (*proto.RewardInfoResponse, error) {
	ctx, err := BeginTransaction(ctxCtx)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	defer ctx.Commit() // read-only tx

	userClaims := auth.UserClaimsFromContext(ctx)
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

			_, ok := knownGoodReps[representative]
			if ok {
				delegatorsCountChan <- math.MaxUint64
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
			if c == 0 {
				s.delegatorCountsPerRep.Set(representative, c, 1*time.Minute)
			} else {
				s.delegatorCountsPerRep.SetDefault(representative, c)
			}
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
			if !badRepresentative {
				s.addressesWithGoodRepCache.SetDefault(userClaims.RewardAddress, true)
			}
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

	userClaims := auth.UserClaimsFromContext(ctx)
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
