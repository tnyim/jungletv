package server

import (
	"context"
	"fmt"
	"math/big"
	"time"

	"github.com/palantir/stacktrace"
	"github.com/sethvargo/go-limiter"
	"github.com/sethvargo/go-limiter/memorystore"
	"github.com/tnyim/jungletv/server/components/mediaqueue"
	"github.com/tnyim/jungletv/server/components/pricer"
	"github.com/tnyim/jungletv/types"
	"github.com/tnyim/jungletv/utils"
	"github.com/tnyim/jungletv/utils/event"
)

func (s *grpcServer) ChatSystemMessagesWorker(ctx context.Context) error {
	mediaChangedC, mediaChangedU := s.mediaQueue.MediaChanged().Subscribe(event.BufferAll)
	defer mediaChangedU()

	entryAddedC, entryAddedU := s.mediaQueue.EntryAdded().Subscribe(event.BufferAll)
	defer entryAddedU()

	entryRemovedC, entryRemovedU := s.mediaQueue.EntryRemoved().Subscribe(event.BufferAll)
	defer entryRemovedU()

	entryMovedC, entryMovedU := s.mediaQueue.EntryMoved().Subscribe(event.BufferAll)
	defer entryMovedU()

	rewardsDistributedC, rewardsDistributedU := s.rewardsHandler.RewardsDistributed().Subscribe(event.BufferAll)
	defer rewardsDistributedU()

	crowdfundedSkippedC, crowdfundedSkippedU := s.skipManager.CrowdfundedSkip().Subscribe(event.BufferAll)
	defer crowdfundedSkippedU()

	crowdfundedTransactionReceivedC, crowdfundedTransactionReceivedU := s.skipManager.CrowdfundedTransactionReceived().Subscribe(event.BufferAll)
	defer crowdfundedTransactionReceivedU()

	skipThresholdReductionMilestoneReachedC, skipThresholdReductionMilestoneReachedU := s.skipManager.SkipThresholdReductionMilestoneReached().Subscribe(event.BufferAll)
	defer skipThresholdReductionMilestoneReachedU()

	announcementsUpdatedC, announcementsUpdatedU := s.announcementsUpdated.Subscribe(event.BufferAll)
	defer announcementsUpdatedU()

	var crowdfundedNotificationLimiter limiter.Store
	var sentCrowdfundedLimiterMessage map[types.CrowdfundedTransactionType]bool
	resetRateLimiter := func() error {
		sentCrowdfundedLimiterMessage = make(map[types.CrowdfundedTransactionType]bool)
		var err error
		crowdfundedNotificationLimiter, err = memorystore.New(&memorystore.Config{
			Tokens:   3,
			Interval: 2 * time.Minute, // this also resets whenever the media changes, see below
		})
		return stacktrace.Propagate(err, "")
	}
	err := resetRateLimiter()
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	for {
		select {
		case v := <-mediaChangedC:
			var err error
			if v == nil {
				_, err = s.chat.CreateSystemMessage(ctx, "_The queue is now empty._")
			} else {
				title := utils.EscapeMarkdownCharacters(v.MediaInfo().Title())
				_, err = s.chat.CreateSystemMessage(ctx, fmt.Sprintf("_Now playing:_ %s", title))
			}
			if err != nil {
				return stacktrace.Propagate(err, "")
			}

			err = resetRateLimiter()
			if err != nil {
				return stacktrace.Propagate(err, "")
			}
		case args := <-entryAddedC:
			t := args.AddType
			entry := args.Entry
			if !entry.RequestedBy().IsUnknown() {
				name, err := s.getChatFriendlyUserName(ctx, entry.RequestedBy().Address())
				if err != nil {
					return stacktrace.Propagate(err, "")
				}
				name = utils.EscapeMarkdownCharacters(name)
				title := utils.EscapeMarkdownCharacters(entry.MediaInfo().Title())
				switch t {
				case mediaqueue.EntryAddedPlacementEnqueue:
					if entry.Concealed() {
						_, err = s.chat.CreateSystemMessage(ctx, fmt.Sprintf(
							"_%s just enqueued something_", name))
					} else {
						_, err = s.chat.CreateSystemMessage(ctx, fmt.Sprintf(
							"_%s just enqueued_ %s", name, title))
					}
				case mediaqueue.EntryAddedPlacementPlayNext:
					if entry.Concealed() {
						_, err = s.chat.CreateSystemMessage(ctx, fmt.Sprintf(
							"_%s just set something to play after the current queue entry_",
							name))
					} else {
						_, err = s.chat.CreateSystemMessage(ctx, fmt.Sprintf(
							"_%s just set_ %s _to play after the current queue entry_",
							name, title))
					}
				case mediaqueue.EntryAddedPlacementPlayNow:
					_, err = s.chat.CreateSystemMessage(ctx, fmt.Sprintf(
						"_%s just skipped the previous queue entry!_", name))
				}
				if err != nil {
					return stacktrace.Propagate(err, "")
				}
			}
		case args := <-entryRemovedC:
			if args.SelfRemoval {
				name, err := s.getChatFriendlyUserName(ctx, args.Entry.RequestedBy().Address())
				if err != nil {
					return stacktrace.Propagate(err, "")
				}
				name = utils.EscapeMarkdownCharacters(name)
				if args.Entry.Concealed() {
					_, err = s.chat.CreateSystemMessage(ctx, fmt.Sprintf(
						"_%s just removed one of their own queue entries_", name))
				} else {
					title := utils.EscapeMarkdownCharacters(args.Entry.MediaInfo().Title())
					_, err = s.chat.CreateSystemMessage(ctx, fmt.Sprintf(
						"_%s just removed their own queue entry_ %s", name, title))
				}
				if err != nil {
					return stacktrace.Propagate(err, "")
				}
			}
		case args := <-entryMovedC:
			if args.User.IsUnknown() {
				continue
			}
			name, err := s.getChatFriendlyUserName(ctx, args.User.Address())
			if err != nil {
				return stacktrace.Propagate(err, "")
			}
			name = utils.EscapeMarkdownCharacters(name)
			title := utils.EscapeMarkdownCharacters(args.Entry.MediaInfo().Title())
			direction := "down"
			if args.Up {
				direction = "up"
			}
			if args.Entry.Concealed() {
				_, err = s.chat.CreateSystemMessage(ctx, fmt.Sprintf(
					"_%s just moved something %s in the queue_", name, direction))
			} else {
				_, err = s.chat.CreateSystemMessage(ctx, fmt.Sprintf(
					"_%s just moved_ %s _%s in the queue_", name, title, direction))
			}
			if err != nil {
				return stacktrace.Propagate(err, "")
			}
		case args := <-rewardsDistributedC:
			amount := args.RewardBudget
			eligibleCount := args.EligibleSpectators
			enqueuerTip := args.RequesterReward
			mediaEntry := args.Media
			exp := new(big.Int).Exp(big.NewInt(10), big.NewInt(29), nil)
			banStr := new(big.Rat).SetFrac(amount.Int, exp).FloatString(2)

			message := ""
			if enqueuerTip.Cmp(big.NewInt(0)) > 0 && !mediaEntry.RequestedBy().IsUnknown() {
				name, err := s.getChatFriendlyUserName(ctx, mediaEntry.RequestedBy().Address())
				if err != nil {
					return stacktrace.Propagate(err, "")
				}
				tipBanStr := new(big.Rat).SetFrac(enqueuerTip.Int, exp).FloatString(2)
				name = utils.EscapeMarkdownCharacters(name)
				message = fmt.Sprintf(
					"_**%s BAN** distributed among %d spectators and **%s BAN** tipped to %s._", banStr, eligibleCount, tipBanStr, name)
			} else {
				message = fmt.Sprintf(
					"_**%s BAN** distributed among %d spectators._", banStr, eligibleCount)
			}
			_, err := s.chat.CreateSystemMessage(ctx, message)
			if err != nil {
				return stacktrace.Propagate(err, "")
			}
		case amount := <-crowdfundedSkippedC:
			exp := new(big.Int).Exp(big.NewInt(10), big.NewInt(29), nil)
			banStr := new(big.Rat).SetFrac(amount.Int, exp).FloatString(2)

			_, err := s.chat.CreateSystemMessage(ctx, fmt.Sprintf(
				"_Spectators paid **%s BAN** to skip the previous queue entry!_", banStr))
			if err != nil {
				return stacktrace.Propagate(err, "")
			}
		case milestone := <-skipThresholdReductionMilestoneReachedC:
			_, err := s.chat.CreateSystemMessage(ctx, fmt.Sprintf(
				"_Community skip target reduced to **%.0f%%** of the original!_", milestone*100.0))
			if err != nil {
				return stacktrace.Propagate(err, "")
			}
		case tx := <-crowdfundedTransactionReceivedC:
			err := s.handleCrowdfundedTransactionSystemMessage(ctx, tx, crowdfundedNotificationLimiter, sentCrowdfundedLimiterMessage)
			if err != nil {
				return stacktrace.Propagate(err, "")
			}
		case <-announcementsUpdatedC:
			_, err := s.chat.CreateSystemMessage(ctx, "_**Announcements updated!**_")
			if err != nil {
				return stacktrace.Propagate(err, "")
			}
		case <-ctx.Done():
			s.log.Println("Chat system message sender done")
			return nil
		}
	}
}

func (s *grpcServer) handleCrowdfundedTransactionSystemMessage(ctx context.Context, tx *types.CrowdfundedTransaction, limiter limiter.Store, sentCrowdfundedLimiterMessage map[types.CrowdfundedTransactionType]bool) error {
	amount := tx.Amount.BigInt()
	if amount.Cmp(pricer.RewardRoundingFactor) < 0 {
		// values below 0.01 wouldn't show properly with the FloatString(2) below, anyway
		return nil
	}

	formatStr := ""
	limiterMessage := ""
	switch tx.TransactionType {
	case types.CrowdfundedTransactionTypeSkip:
		formatStr = "_%s just contributed **%s BAN** towards skipping the current queue entry!_"
		limiterMessage = "_More contributions towards skipping the current queue entry are being received!_"
	case types.CrowdfundedTransactionTypeRain:
		formatStr = "_%s just increased the rewards for the current queue entry by **%s BAN**!_"
		limiterMessage = "_More contributions towards the rewards for the current queue entry are being received!_"
	}

	// avoid spamming the chat if too many small-ish transactions are received in a short time span
	// (otherwise we'd let the chat be spammed for the low low price of 1 BAN per 100 messages)
	// apply only the rate limit to transactions < 10 BAN
	applyRateLimit := amount.Cmp(big.NewInt(0).Mul(pricer.BananoUnit, big.NewInt(10))) < 0

	if applyRateLimit {
		_, _, _, ok, err := limiter.Take(ctx, string(tx.TransactionType))
		if err != nil {
			return stacktrace.Propagate(err, "")
		}
		if !ok {
			if !sentCrowdfundedLimiterMessage[tx.TransactionType] {
				_, err = s.chat.CreateSystemMessage(ctx, limiterMessage)
				if err != nil {
					return stacktrace.Propagate(err, "")
				}
				sentCrowdfundedLimiterMessage[tx.TransactionType] = true
			}
			return nil
		}
	}

	name, err := s.getChatFriendlyUserName(ctx, tx.FromAddress)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	name = utils.EscapeMarkdownCharacters(name)

	banStr := new(big.Rat).SetFrac(amount, pricer.BananoUnit).FloatString(2)

	msg := fmt.Sprintf(formatStr, name, banStr)
	_, err = s.chat.CreateSystemMessage(ctx, msg)
	return stacktrace.Propagate(err, "")
}
