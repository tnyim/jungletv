package server

import (
	"context"
	"math/big"
	"math/rand"
	"time"

	"github.com/hectorchu/gonano/wallet"
)

func (r *RewardsHandler) rewardUsers(ctx context.Context, media MediaQueueEntry) error {
	r.spectatorsMutex.RLock()
	defer r.spectatorsMutex.RUnlock()

	r.log.Printf("Rewarding users for \"%s\"", media.MediaInfo().Title())

	if media.RequestCost().Cmp(big.NewInt(0)) == 0 {
		r.log.Println("Request cost was 0, nothing to reward")
		return nil
	}

	eligible := getEligibleSpectators(r.spectatorsByRemoteAddress, media.RequestedBy().Address())
	if len(eligible) == 0 {
		if media.RequestedBy().IsUnknown() {
			return nil
		}
		// reimburse who added to queue
		go r.reimburseRequester(ctx, media.RequestedBy().Address(), media.RequestCost())
		return nil
	}

	amountForEach := ComputeReward(media.RequestCost(), len(eligible))
	if amountForEach.Int.Cmp(big.NewInt(0)) <= 0 {
		r.log.Printf("Not rewarding because the amount for each user would be zero")
		return nil
	}

	go r.rewardEligible(ctx, eligible, media.RequestCost(), amountForEach)
	return nil
}

func getEligibleSpectators(spectatorsByRemoteAddress map[string][]*spectator, exceptAddress string) map[string]*spectator {
	// maps addresses to spectators
	toBeRewarded := make(map[string]*spectator)

	for k := range spectatorsByRemoteAddress {
		spectators := spectatorsByRemoteAddress[k]
		if len(spectators) == 0 {
			continue
		}
		// pick a random spectator to reward within this remote address
		rand.Shuffle(len(spectators), func(i, j int) {
			spectators[i], spectators[j] = spectators[j], spectators[i]
		})
		for j := range spectators {
			// do not reward an inactive spectator
			if time.Since(spectators[j].lastActive) > spectatorInactivityTimeout+1*time.Minute {
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

func init() {
	rand.Seed(time.Now().UnixNano())
}
