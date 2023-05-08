package server

import (
	"context"
	"math"
	"time"

	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/server/components/payment"
	authinterceptor "github.com/tnyim/jungletv/server/interceptors/auth"
	"github.com/tnyim/jungletv/types"
	"github.com/tnyim/jungletv/utils/transaction"
)

var knownGoodReps = map[string]struct{}{
	"ban_19potasho7ozny8r1drz3u3hb3r97fw4ndm4hegdsdzzns1c3nobdastcgaa": {},
	"ban_1nannerspntaoqyrtnzjj76joe6yqjcterj6ef3qkdc6kfgswqu3pfaaqphe": {},
	"ban_1wha1enz8k8r65k6nb89cxqh6cq534zpixmuzqwbifpnqrsycuegbmh54au6": {},
	"ban_3p3sp1ynb5i3qxmqoha3pt79hyk8gxhtr58tk51qctwyyik6hy4dbbqbanan": {},
	"ban_3batmanuenphd7osrez9c45b3uqw9d9u81ne8xa6m43e1py56y9p48ap69zg": {},
	"ban_1hentaiqzbhasuyg5tcyhso79ma3wuiektphbnjcekifmawuugdri93trt8f": {},
	"ban_1ry7kqi1msam7ay8qreo1mddc6ga6hg4s5tsqgtqhdhbxxwgcuo5mwfno379": {},
	"ban_3tacocatezozswnu8xkh66qa1dbcdujktzmfpdj7ax66wtfrio6h5sxikkep": {},
	"ban_1gt4ti4gnzjre341pqakzme8z94atcyuuawoso8gqwdx5m4a77wu1mxxighh": {},
	"ban_1crpaybw8jip7fm98fzfxnjajb55ty76oyzmpfwe9s66u4aod37tm3kxba8q": {},
	"ban_1oaocnrcaystcdtaae6woh381wftyg4k7bespu19m5w18ze699refhyzu6bo": {},
	"ban_1on1ybanskzzsqize1477wximtkdzrftmxqtajtwh4p4tg1w6awn1hq677cp": {},
	"ban_1banbet1hxxe9aeu11oqss9sxwe814jo9ym8c98653j1chq4k4yaxjsacnhc": {},
}

var badReps = map[string]struct{}{
	"ban_1bananobh5rat99qfgt1ptpieie5swmoth87thi74qgbfrij7dcgjiij94xr": {}, // too big, generally bad uptime
	"ban_1ka1ium4pfue3uxtntqsrib8mumxgazsjf58gidh1xeo5te3whsq8z476goo": {}, // too big
	"ban_1fomoz167m7o38gw4rzt7hz67oq6itejpt4yocrfywujbpatd711cjew8gjj": {}, // too big, generally bad uptime
	"ban_1cake36ua5aqcq1c5i3dg7k8xtosw7r9r7qbbf5j15sk75csp9okesz87nfn": {}, // too big
	"ban_1sebrep1mbkdtdb39nsouw5wkkk6o497wyrxtdp71sm878fxzo1kwbf9k79b": {}, // offline since long ago
	"ban_1nano4cqttsbdo5nwttfse8h3oaxickjwq4qobqphg7hifbcauaokz9q6ugj": {}, // offline since long ago
	"ban_3binance1adje7uwzjmsyxsqxjt8c471i33xo39k94twkipntmrqt1ii5t57": {}, // generally bad uptime/rarely votes

}

func (s *grpcServer) RewardInfo(ctxCtx context.Context, r *proto.RewardInfoRequest) (*proto.RewardInfoResponse, error) {
	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	defer ctx.Commit() // read-only tx

	userClaims := authinterceptor.UserClaimsFromContext(ctx)
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

			_, badRep := badReps[representative]
			if badRep {
				delegatorsCountChan <- 0
				return
			}

			cachedCount, ok := s.delegatorCountsPerRep.Get(representative)
			if ok {
				delegatorsCountChan <- cachedCount
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

	timeoutTimer := time.NewTimer(5 * time.Second)
	defer timeoutTimer.Stop()
	badRepresentative := false
	if !cachedGoodRepResult {
		select {
		case err := <-delegatorsErrChan:
			s.log.Printf("Error checking delegators count for address %s: %v", userClaims.RewardAddress, err)
		case c := <-delegatorsCountChan:
			badRepresentative = c < 2
			if !badRepresentative {
				s.addressesWithGoodRepCache.SetDefault(userClaims.RewardAddress, struct{}{})
			}
		case <-timeoutTimer.C:
			break
		}
	}

	response := &proto.RewardInfoResponse{
		RewardsAddress:    userClaims.RewardAddress,
		RewardBalance:     payment.NewAmountFromDecimal(balance.Balance).SerializeForAPI(),
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
