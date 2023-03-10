package pointsmanager

import (
	"context"
	"errors"
	"time"

	"github.com/lib/pq"
	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/server/auth"
	"github.com/tnyim/jungletv/types"
	"github.com/tnyim/jungletv/utils/transaction"
)

func (m *Manager) GetCurrentUserSubscription(ctxCtx context.Context, user auth.User) (*types.Subscription, error) {
	if user.IsUnknown() {
		return nil, nil
	}
	subscription, present := m.subscriptionCache.Get(user.Address())
	if present {
		if subscription != nil && time.Now().After(subscription.EndsAt) {
			m.subscriptionCache.SetDefault(user.Address(), nil)
			return nil, nil
		}
		return subscription, nil
	}

	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	defer ctx.Commit() // read-only tx

	subscription, err = types.GetCurrentSubscriptionAtTime(ctx, user.Address(), time.Now())
	if err != nil && !errors.Is(err, types.ErrNoSubscription) {
		return nil, stacktrace.Propagate(err, "")
	}
	m.subscriptionCache.SetDefault(user.Address(), subscription)
	return subscription, nil
}

func (m *Manager) IsUserCurrentlySubscribed(ctxCtx context.Context, user auth.User) (bool, error) {
	subscription, err := m.GetCurrentUserSubscription(ctxCtx, user)
	if err != nil {
		return false, stacktrace.Propagate(err, "")
	}
	return subscription != nil, nil
}

func (m *Manager) SubscribeOrExtendSubscription(ctxCtx context.Context, user auth.User) (*types.Subscription, error) {
	if user.IsUnknown() {
		return nil, stacktrace.NewError("user is unknown")
	}
	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	defer ctx.Rollback()

	now := time.Now()
	oneMonthFromNow := now.AddDate(0, 1, 0)

	subscription, err := types.GetCurrentSubscriptionAtTime(ctx, user.Address(), now)
	if err != nil && !errors.Is(err, types.ErrNoSubscription) {
		return nil, stacktrace.Propagate(err, "")
	}

	if subscription != nil && subscription.EndsAt.After(oneMonthFromNow) {
		return nil, stacktrace.NewError("the user is already subscribed")
	}

	pointsTx, err := m.CreateTransaction(ctx, user, types.PointsTxTypeMonthlySubscription, -6900)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	if subscription == nil {
		subscription = &types.Subscription{
			RewardsAddress: user.Address(),
			StartsAt:       now,
			EndsAt:         oneMonthFromNow,
			PaymentTxs:     pq.Int64Array{pointsTx.ID},
		}
	} else {
		// this logic ensures that subscriptions which started e.g. on the 31st of some month
		// continue to be valid through the 31st of months after
		// Jan 31st -> Feb 28th -> Mar 31st, instead of Jan 31st -> Feb 28th -> Mar 28th
		// (which is what would happen with naive AddDate(0,1,0) on the previous EndsAt)
		// this also deals reasonably with any unforeseen calendar awkwardness (e.g. a month with just 7 days)
		// by ensuring that people get at least 25 more days of subscription every time they renew
		min := subscription.EndsAt.Add(25 * 24 * time.Hour)
		for m := 1; !subscription.EndsAt.After(min); m++ {
			subscription.EndsAt = subscription.StartsAt.AddDate(0, m, 0)
		}
		subscription.PaymentTxs = append(subscription.PaymentTxs, pointsTx.ID)
	}

	err = subscription.Update(ctx)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	ctx.DeferToCommit(func() {
		m.subscriptionCache.SetDefault(user.Address(), subscription)
	})

	err = ctx.Commit()
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	return subscription, nil
}
