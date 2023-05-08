package rewards

import (
	"context"
	"encoding/json"
	"log"
	"math/big"
	"math/rand"
	"sync"
	"time"

	"github.com/hectorchu/gonano/rpc"
	"github.com/hectorchu/gonano/wallet"
	"github.com/palantir/stacktrace"
	uuid "github.com/satori/go.uuid"
	"github.com/tnyim/jungletv/buildconfig"
	"github.com/tnyim/jungletv/server/components/ipreputation"
	"github.com/tnyim/jungletv/server/components/payment"
	"github.com/tnyim/jungletv/server/components/pricer"
	"github.com/tnyim/jungletv/server/media"
	"github.com/tnyim/jungletv/server/stores/moderation"
	"github.com/tnyim/jungletv/types"
	"github.com/tnyim/jungletv/utils"
	"github.com/tnyim/jungletv/utils/transaction"
)

func (r *Handler) rewardUsers(ctx context.Context, media media.QueueEntry) error {
	defer func() {
		err := r.withdrawalHandler.AutoWithdrawBalances(ctx)
		if err != nil {
			r.log.Println(stacktrace.Propagate(err, ""))
		}
	}()
	r.log.Printf("Rewarding users for \"%s\"", media.MediaInfo().Title())

	requestedByValidUser := media.RequestedBy() != nil && !media.RequestedBy().IsUnknown() && !media.RequestedBy().IsFromAlienChain()

	mediaCostBudget := media.RequestCost()
	var requestedBy *string
	if requestedByValidUser {
		address := media.RequestedBy().Address()
		requestedBy = &address
	}

	skipBudget, rainBudget, rainedByRequester, err := r.skipManager.EmptySkipAndRainAccounts(ctx, media.QueueID(), requestedBy)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	rewardBudget := payment.NewAmount(mediaCostBudget.Int, skipBudget.Int)

	r.receiveCollectorPending(payment.NewAmount(rewardBudget.Int, rainBudget.Int))

	r.spectatorsMutex.RLock()
	defer r.spectatorsMutex.RUnlock()

	requesterReward := payment.NewAmount()
	requesterSpectator, requesterIsSpectator := r.spectatorsByRewardAddress[media.RequestedBy().Address()]
	if requestedByValidUser && requesterIsSpectator && rainBudget.Cmp(big.NewInt(0)) > 0 {
		banned, err := r.moderationStore.LoadPaymentAddressBannedFromRewards(ctx, requesterSpectator.user.Address())
		if err != nil {
			return stacktrace.Propagate(err, "")
		}
		if !banned {
			// requester is eligible for receiving part of the rained amount that was not added by themselves
			// the crowd receives 80% of the rained amount, and the requester receives 20% (since they wouldn't receive anything otherwise)
			totalRainMinusRequester := payment.NewAmount(big.NewInt(0).Sub(rainBudget.Int, rainedByRequester.Int))
			// the requester receives 20% of the amount that wasn't rained by them
			requesterReward = payment.NewAmount(big.NewInt(0).Mul(totalRainMinusRequester.Int, big.NewInt(2000)))
			requesterReward = payment.NewAmount(big.NewInt(0).Div(requesterReward.Int, big.NewInt(10000)))
			requesterReward.Div(requesterReward.Int, pricer.RewardRoundingFactor)
			requesterReward.Mul(requesterReward.Int, pricer.RewardRoundingFactor)

			rainBudget.Sub(rainBudget.Int, requesterReward.Int)

			if requesterReward.Cmp(big.NewInt(0)) > 0 {
				err = r.rewardRequester(ctx, media.QueueID(), requesterSpectator, requesterReward)
				if err != nil {
					return stacktrace.Propagate(err, "")
				}
			}
		}
	}
	rewardBudget.Add(rewardBudget.Int, rainBudget.Int)

	eligible := getEligibleSpectators(ctx, r.log, r.ipReputationChecker, r.moderationStore,
		r.spectatorsByRemoteAddress, media.RequestedBy().Address(), media.PlayedFor())
	go r.statsClient.Gauge("eligible", len(eligible))
	r.eligibleMovingAverage.Add(float64(len(eligible)))

	if rewardBudget.Cmp(big.NewInt(0)) == 0 {
		r.log.Println("Request cost was 0 and additional budget is 0, nothing to reward")
		return nil
	}

	if len(eligible) == 0 {
		if requestedByValidUser && media.RequestCost().Cmp(big.NewInt(0)) > 0 {
			// reimburse who added to queue
			go r.reimburseRequester(ctx, media.RequestedBy().Address(), mediaCostBudget)
		}
		return nil
	}

	amountForEach := ComputeReward(rewardBudget, len(eligible))
	go func() {
		r.statsClient.Gauge("reward_per_spectator",
			float64(new(big.Int).Div(amountForEach.Int, pricer.RewardRoundingFactor).Int64())/100.0)
	}()
	if amountForEach.Int.Cmp(big.NewInt(0)) <= 0 {
		r.log.Printf("Not rewarding because the amount for each user would be zero")
	} else {
		err = r.rewardEligible(ctx, media.QueueID(), eligible, rewardBudget, amountForEach)
		if err != nil {
			return stacktrace.Propagate(err, "")
		}
	}

	r.rewardsDistributed.Notify(RewardsDistributedEventArgs{rewardBudget, len(eligible), requesterReward, media}, true)
	return nil
}

func getEligibleSpectators(ctx context.Context,
	l *log.Logger,
	c *ipreputation.Checker,
	moderationStore moderation.Store,
	spectatorsByRemoteAddress map[string][]*spectator,
	exceptAddress string,
	mediaPlayedFor time.Duration) map[string]*spectator {
	// maps addresses to spectators
	toBeRewarded := make(map[string]*spectator)

	spectatorsByUniquifiedRemoteAddress := make(map[string][]*spectator)
	for k := range spectatorsByRemoteAddress {
		spectators := spectatorsByRemoteAddress[k]
		if len(spectators) == 0 {
			continue
		}
		uniquifiedIP := utils.GetUniquifiedIP(k)
		spectatorsByUniquifiedRemoteAddress[uniquifiedIP] = append(spectatorsByUniquifiedRemoteAddress[uniquifiedIP], spectators...)
	}

	minAcceptableDuration := ((mediaPlayedFor * 40) / 100)

	for k := range spectatorsByUniquifiedRemoteAddress {
		spectators := spectatorsByUniquifiedRemoteAddress[k]
		// pick a random spectator to reward within this uniquified remote address
		rand.Shuffle(len(spectators), func(i, j int) {
			spectators[i], spectators[j] = spectators[j], spectators[i]
		})
		for j := range spectators {
			if canReceive := c.CanReceiveRewards(spectators[j].remoteAddress); !canReceive {
				canUseBadIP, err := moderationStore.LoadPaymentAddressSkipsIPReputationChecks(ctx, spectators[j].user.Address())
				if err == nil && !canUseBadIP {
					l.Println("Skipped rewarding", spectators[j].user.Address(), spectators[j].remoteAddress, "due to bad IP reputation")
					continue
				}
			}
			if !spectators[j].stoppedWatching.IsZero() {
				// spectator not currently watching
				continue
			}
			// do not reward spectators who didn't watch at least 40% of the media
			if time.Since(spectators[j].startedWatching) < minAcceptableDuration {
				l.Println("Skipped rewarding", spectators[j].user.Address(), spectators[j].remoteAddress, "due to watching less than 40% of the last media")
				continue
			}
			// do not reward an inactive spectator
			if spectators[j].activityChallenge != nil && time.Since(spectators[j].activityChallenge.ChallengedAt) > spectators[j].activityChallenge.Tolerance {
				l.Println("Skipped rewarding", spectators[j].user.Address(), spectators[j].remoteAddress, "due to inactivity")
				continue
			}
			// do not reward an illegitimate spectator
			if !spectators[j].legitimate {
				l.Println("Skipped rewarding", spectators[j].user.Address(), spectators[j].remoteAddress, "because it is not considered legitimate")
				continue
			}
			// do not reward a banned spectator
			if banned, err := moderationStore.LoadPaymentAddressBannedFromRewards(ctx, spectators[j].user.Address()); err == nil && banned {
				l.Println("Skipped rewarding", spectators[j].user.Address(), "due to ban")
				continue
			}
			if banned, err := moderationStore.LoadRemoteAddressBannedFromRewards(ctx, spectators[j].remoteAddress); err == nil && banned {
				l.Println("Skipped rewarding", spectators[j].user.Address(), "due to ban")
				continue
			}
			// do not reward an address that would have received a reward via another remote address already
			if _, present := toBeRewarded[spectators[j].user.Address()]; !present {
				toBeRewarded[spectators[j].user.Address()] = spectators[j]
				break
			}
		}
	}
	delete(toBeRewarded, exceptAddress)
	return toBeRewarded
}

func (r *Handler) receiveCollectorPending(minExpectedBalance payment.Amount) {
	wg := new(sync.WaitGroup)
	wg.Add(1)
	r.collectorAccountQueue <- func(collectorAccount *wallet.Account, RPC *rpc.Client, RPCWork *rpc.Client) {
		defer wg.Done()
		balance, pending, err := collectorAccount.Balance()
		if err != nil {
			r.log.Printf("Error checking balance of collector account: %v", err)
			return
		}
		balance.Add(balance, pending)

		if balance.Cmp(minExpectedBalance.Int) < 0 {
			// this should happen very rarely (mostly when a very short video just played)
			// we are probably yet to send money from the payment accounts to the collector account
			// wait for those goroutines to finish
			r.log.Println("Waiting for payment accounts to send their balance to the collector account")
			r.paymentAccountPool.AwaitConclusionOfInFlightPayments()
			r.log.Println("Payment accounts done sending their balance to the collector account")

			for attempt := 0; attempt < 10 && balance.Cmp(minExpectedBalance.Int) < 0; attempt++ {
				// we are probably just waiting for blocks to be confirmed
				r.log.Println("Waiting for block confirmations...")
				balance, pending, err = collectorAccount.Balance()
				if err != nil {
					r.log.Printf("Error checking balance of collector account: %v", err)
					return
				}
				balance.Add(balance, pending)
				time.Sleep(2 * time.Second)
			}

			if balance.Cmp(minExpectedBalance.Int) < 0 {
				// oh boy. let's go through all ever-used accounts, see if anything got stuck in them and send to the collector account
				r.log.Println("Funds still not enough, desperately trying to find more")
				err = r.desperatelyTryToFindFundsStuckInPaymentAccounts()
				if err != nil {
					r.log.Printf("Error desperately trying to find funds: %v", err)
					return
				}
			}
		}

		err = collectorAccount.ReceivePendings(pricer.DustThreshold)
		if err != nil {
			r.log.Printf("Error receiving pendings on collector account: %v", err)
		}
	}
	wg.Wait()
}

func (r *Handler) rewardEligible(ctxCtx context.Context, mediaID string, eligible map[string]*spectator, requestCost payment.Amount, amountForEach payment.Amount) error {
	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	defer ctx.Rollback()

	addresses := make([]string, len(eligible))
	i := 0
	for address := range eligible {
		addresses[i] = address
		i++
	}

	newBalances, err := types.AdjustRewardBalanceOfAddresses(ctx, addresses, amountForEach.Decimal())
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	balancesByAddress := make(map[string]*types.RewardBalance)
	for _, balance := range newBalances {
		balancesByAddress[balance.RewardsAddress] = balance
	}

	rewards := make([]*types.ReceivedReward, len(eligible))
	rewardsIdx := 0
	now := time.Now()
	for _, spectator := range eligible {
		rewardBalance, ok := balancesByAddress[spectator.user.Address()]
		if ok {
			spectator.onRewarded.Notify(SpectatorRewardedEventArgs{amountForEach, payment.NewAmountFromDecimal(rewardBalance.Balance)}, false)
		}

		rewards[rewardsIdx] = &types.ReceivedReward{
			ID:             uuid.NewV4().String(),
			RewardsAddress: spectator.user.Address(),
			ReceivedAt:     now,
			Amount:         amountForEach.Decimal(),
			Media:          mediaID,
		}
		rewardsIdx++
	}

	err = types.InsertReceivedRewards(ctx, rewards)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	return stacktrace.Propagate(ctx.Commit(), "")
}

func (r *Handler) rewardRequester(ctxCtx context.Context, mediaID string, requester *spectator, reward payment.Amount) error {
	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	defer ctx.Rollback()

	newBalances, err := types.AdjustRewardBalanceOfAddresses(ctx, []string{requester.user.Address()}, reward.Decimal())
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	balancesByAddress := make(map[string]*types.RewardBalance)
	for _, balance := range newBalances {
		balancesByAddress[balance.RewardsAddress] = balance
	}

	requester.onRewarded.Notify(SpectatorRewardedEventArgs{reward, payment.NewAmountFromDecimal(newBalances[0].Balance)}, false)

	err = types.InsertReceivedRewards(ctx, []*types.ReceivedReward{{
		ID:             uuid.NewV4().String(),
		RewardsAddress: requester.user.Address(),
		ReceivedAt:     time.Now(),
		Amount:         reward.Decimal(),
		Media:          mediaID,
	}})
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	return stacktrace.Propagate(ctx.Commit(), "")
}

func (r *Handler) reimburseRequester(ctx context.Context, address string, amount payment.Amount) {
	r.receiveCollectorPending(amount)

	if ctx.Err() != nil || !buildconfig.AllowWithdrawalsAndRefunds {
		return
	}

	r.collectorAccountQueue <- func(collectorAccount *wallet.Account, _, _ *rpc.Client) {
		blockHash, err := collectorAccount.Send(address, amount.Int)
		if err != nil {
			r.log.Printf("Error reimbursing %s with %v: %v", address, amount.Int, err)
		} else {
			r.log.Printf("Reimbursed %s with %v, block hash %s", address, amount.Int, blockHash.String())
		}
	}
}

func (r *Handler) desperatelyTryToFindFundsStuckInPaymentAccounts() error {
	for accountIdx := uint32(1); ; accountIdx++ {
		r.log.Printf("Attempting to find lost funds in account %d", accountIdx)
		account, err := r.wallet.NewAccount(&accountIdx)
		if err != nil {
			return stacktrace.Propagate(err, "")
		}
		r.log.Printf("Attempting to receive pendings in account %s", account.Address())
		history, _, err := r.wallet.RPC.AccountHistory(account.Address(), 10, nil)
		if err != nil {
			if _, ok := err.(*json.UnmarshalTypeError); !ok {
				return stacktrace.Propagate(err, "failed to retrieve history for account %v", account.Address())
			}
			history = []rpc.AccountHistory{}
		}
		if len(history) == 0 {
			r.log.Println("Account has no history, which means there are no funds beyond here, giving up")
			return nil
		}
		err = account.ReceivePendings(pricer.DustThreshold)
		if err != nil {
			return stacktrace.Propagate(err, "")
		}
		balance, _, err := account.Balance()
		if err != nil {
			return stacktrace.Propagate(err, "")
		}
		if balance.Cmp(big.NewInt(0)) == 0 {
			r.log.Printf("No balance in account %s, continuing to next account", account.Address())
			continue
		}
		r.log.Printf("Sending all balance in account %s to collector account", account.Address())
		r.collectorAccountQueue <- func(collectorAccount *wallet.Account, _, _ *rpc.Client) {
			_, err = account.Send(collectorAccount.Address(), balance)
		}
		if err != nil {
			return stacktrace.Propagate(err, "")
		}
	}
}

// ComputeReward calculates how much each user should receive
func ComputeReward(totalAmount payment.Amount, numUsers int) payment.Amount {
	amountForEach := payment.NewAmount()
	amountForEach.Div(totalAmount.Int, big.NewInt(int64(numUsers)))
	// "floor" (round down) reward to prevent dust amounts
	amountForEach.Div(amountForEach.Int, pricer.RewardRoundingFactor)
	amountForEach.Mul(amountForEach.Int, pricer.RewardRoundingFactor)
	return amountForEach
}

func init() {
	rand.Seed(time.Now().UnixNano())
}
