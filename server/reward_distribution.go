package server

import (
	"context"
	"encoding/json"
	"log"
	"math/big"
	"math/rand"
	"net"
	"time"

	"github.com/hectorchu/gonano/rpc"
	"github.com/hectorchu/gonano/wallet"
	"github.com/palantir/stacktrace"
)

func (r *RewardsHandler) rewardUsers(ctx context.Context, media MediaQueueEntry) error {
	r.spectatorsMutex.RLock()
	defer r.spectatorsMutex.RUnlock()

	r.log.Printf("Rewarding users for \"%s\"", media.MediaInfo().Title())

	rewardBudget := media.RequestCost()

	eligible := getEligibleSpectators(r.log, r.ipReputationChecker, r.spectatorsByRemoteAddress, media.RequestedBy().Address())
	go r.statsClient.Gauge("eligible", len(eligible))

	if rewardBudget.Cmp(big.NewInt(0)) == 0 {
		r.log.Println("Request cost was 0, nothing to reward")
		return nil
	}

	if len(eligible) == 0 {
		if media.RequestedBy().IsUnknown() {
			return nil
		}
		// reimburse who added to queue
		go r.reimburseRequester(ctx, media.RequestedBy().Address(), rewardBudget)
		return nil
	}

	amountForEach := ComputeReward(rewardBudget, len(eligible))
	go func() {
		r.statsClient.Gauge("reward_per_spectator",
			float64(new(big.Int).Div(amountForEach.Int, RewardRoundingFactor).Int64())/100.0)
	}()
	if amountForEach.Int.Cmp(big.NewInt(0)) <= 0 {
		r.log.Printf("Not rewarding because the amount for each user would be zero")
		return nil
	}

	go func() {
		t := r.statsClient.NewTiming()
		r.rewardEligible(ctx, eligible, rewardBudget, amountForEach)
		t.Send("reward_distribution")
		r.rewardsDistributed.Notify(rewardBudget)
	}()
	return nil
}

func getEligibleSpectators(l *log.Logger, c *IPAddressReputationChecker, spectatorsByRemoteAddress map[string][]*spectator, exceptAddress string) map[string]*spectator {
	// maps addresses to spectators
	toBeRewarded := make(map[string]*spectator)

	spectatorsByUniquifiedRemoteAddress := make(map[string][]*spectator)
	for k := range spectatorsByRemoteAddress {
		spectators := spectatorsByRemoteAddress[k]
		if len(spectators) == 0 {
			continue
		}
		if canReceive := c.CanReceiveRewards(k); !canReceive {
			l.Println("Skipped rewarding remote address", k, "due to bad reputation")
			continue
		}
		uniquifiedIP := getUniquifiedIP(k)
		spectatorsByUniquifiedRemoteAddress[uniquifiedIP] = append(spectatorsByUniquifiedRemoteAddress[uniquifiedIP], spectators...)
	}

	for k := range spectatorsByUniquifiedRemoteAddress {
		spectators := spectatorsByUniquifiedRemoteAddress[k]
		// pick a random spectator to reward within this uniquified remote address
		rand.Shuffle(len(spectators), func(i, j int) {
			spectators[i], spectators[j] = spectators[j], spectators[i]
		})
		for j := range spectators {
			// do not reward an inactive spectator
			if spectators[j].activityChallenge != "" && time.Since(spectators[j].activityChallengeAt) > activityChallengeTolerance {
				l.Println("Skipped rewarding", spectators[j].user.Address(), spectators[j].remoteAddress, "due to inactivity")
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

func getUniquifiedIP(remoteAddress string) string {
	ip := net.ParseIP(remoteAddress)
	if ip == nil {
		return remoteAddress
	}
	if ip.To4() != nil || len(ip) != net.IPv6len {
		return remoteAddress
	}
	for i := net.IPv6len / 2; i < net.IPv6len; i++ {
		ip[i] = 0
	}
	return ip.String()
}

func (r *RewardsHandler) receiveCollectorPending(minExpectedBalance Amount) {
	done := make(chan struct{})
	r.collectorAccountQueue <- func(collectorAccount *wallet.Account) {
		defer func() { done <- struct{}{} }()
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
			r.paymentAccountPendingWaitGroup.Wait()
			r.log.Println("Payment accounts done sending their balance to the collector account")

			balance, pending, err := collectorAccount.Balance()
			if err != nil {
				r.log.Printf("Error checking balance of collector account: %v", err)
				return
			}
			balance.Add(balance, pending)

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

		err = collectorAccount.ReceivePendings()
		if err != nil {
			r.log.Printf("Error receiving pendings on collector account: %v", err)
		}
	}
	<-done
}

func (r *RewardsHandler) rewardEligible(ctx context.Context, eligible map[string]*spectator, requestCost Amount, amountForEach Amount) {
	r.receiveCollectorPending(requestCost)

	for k := range eligible {
		spectator := eligible[k]
		sendFn := func(collectorAccount *wallet.Account) {
			blockHash, err := collectorAccount.Send(spectator.user.Address(), amountForEach.Int)
			if err != nil {
				r.log.Printf("Error rewarding %s with %v: %v", spectator.user.Address(), amountForEach, err)
			} else {
				r.log.Printf("Rewarded %s with %v, block hash %s", spectator.user.Address(), amountForEach, blockHash.String())
				spectator.onRewarded.Notify(amountForEach)
			}
		}
		select {
		case r.collectorAccountQueue <- sendFn:
			continue
		case <-ctx.Done():
			return
		}
	}
}

func (r *RewardsHandler) reimburseRequester(ctx context.Context, address string, amount Amount) {
	r.receiveCollectorPending(amount)

	if ctx.Err() != nil {
		return
	}

	r.collectorAccountQueue <- func(collectorAccount *wallet.Account) {
		blockHash, err := collectorAccount.Send(address, amount.Int)
		if err != nil {
			r.log.Printf("Error reimbursing %s with %v: %v", address, amount.Int, err)
		} else {
			r.log.Printf("Reimbursed %s with %v, block hash %s", address, amount.Int, blockHash.String())
		}
	}
}

func (r *RewardsHandler) desperatelyTryToFindFundsStuckInPaymentAccounts() error {
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
		err = account.ReceivePendings()
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
		r.collectorAccountQueue <- func(collectorAccount *wallet.Account) {
			_, err = account.Send(collectorAccount.Address(), balance)
		}
		if err != nil {
			return stacktrace.Propagate(err, "")
		}
	}
}

func init() {
	rand.Seed(time.Now().UnixNano())
}
