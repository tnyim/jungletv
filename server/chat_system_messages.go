package server

import (
	"context"
	"fmt"
	"math/big"

	"github.com/JohannesKaufmann/html-to-markdown/escape"
	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/types"
	"github.com/tnyim/jungletv/utils/event"
)

func (s *grpcServer) ChatSystemMessagesWorker(ctx context.Context) error {
	mediaChangedC, mediaChangedU := s.mediaQueue.mediaChanged.Subscribe(event.AtLeastOnceGuarantee)
	defer mediaChangedU()

	entryAddedC, entryAddedU := s.mediaQueue.entryAdded.Subscribe(event.AtLeastOnceGuarantee)
	defer entryAddedU()

	ownEntryRemovedC, ownEntryRemovedU := s.mediaQueue.ownEntryRemoved.Subscribe(event.AtLeastOnceGuarantee)
	defer ownEntryRemovedU()

	rewardsDistributedC, rewardsDistributedU := s.rewardsHandler.rewardsDistributed.Subscribe(event.AtLeastOnceGuarantee)
	defer rewardsDistributedU()

	crowdfundedSkippedC, crowdfundedSkippedU := s.skipManager.crowdfundedSkip.Subscribe(event.AtLeastOnceGuarantee)
	defer crowdfundedSkippedU()

	crowdfundedTransactionReceivedC, crowdfundedTransactionReceivedU := s.skipManager.crowdfundedTransactionReceived.Subscribe(event.AtLeastOnceGuarantee)
	defer crowdfundedTransactionReceivedU()

	announcementsUpdatedC, announcementsUpdatedU := s.announcementsUpdated.Subscribe(event.AtLeastOnceGuarantee)
	defer announcementsUpdatedU()

	for {
		select {
		case v := <-mediaChangedC:
			var err error
			if v == nil || v == (MediaQueueEntry)(nil) {
				_, err = s.chat.CreateSystemMessage(ctx, "_The queue is now empty._")
			} else {
				title := escape.MarkdownCharacters(v.MediaInfo().Title())
				_, err = s.chat.CreateSystemMessage(ctx, fmt.Sprintf("_Now playing:_ %s", title))
			}
			if err != nil {
				return stacktrace.Propagate(err, "")
			}
		case args := <-entryAddedC:
			t := args.addType
			entry := args.entry
			if !entry.RequestedBy().IsUnknown() {
				name, err := s.getChatFriendlyUserName(ctx, entry.RequestedBy().Address())
				if err != nil {
					return stacktrace.Propagate(err, "")
				}
				name = escape.MarkdownCharacters(name)
				title := escape.MarkdownCharacters(entry.MediaInfo().Title())
				switch t {
				case "enqueue":
					_, err = s.chat.CreateSystemMessage(ctx, fmt.Sprintf(
						"_%s just enqueued_ %s", name, title))
				case "play_after_next":
					_, err = s.chat.CreateSystemMessage(ctx, fmt.Sprintf(
						"_%s just set_ %s _to play after the current video_",
						name, title))
				case "play_now":
					_, err = s.chat.CreateSystemMessage(ctx, fmt.Sprintf(
						"_%s just skipped the previous video!_", name))
				}
				if err != nil {
					return stacktrace.Propagate(err, "")
				}
			}
		case entry := <-ownEntryRemovedC:
			name, err := s.getChatFriendlyUserName(ctx, entry.RequestedBy().Address())
			if err != nil {
				return stacktrace.Propagate(err, "")
			}
			name = escape.MarkdownCharacters(name)
			title := escape.MarkdownCharacters(entry.MediaInfo().Title())
			_, err = s.chat.CreateSystemMessage(ctx, fmt.Sprintf(
				"_%s just removed their own queue entry_ %s", name, title))
			if err != nil {
				return stacktrace.Propagate(err, "")
			}
		case args := <-rewardsDistributedC:
			amount := args.rewardBudget
			eligibleCount := args.eligibleSpectators
			enqueuerTip := args.requesterReward
			mediaEntry := args.media
			exp := new(big.Int).Exp(big.NewInt(10), big.NewInt(29), nil)
			banStr := new(big.Rat).SetFrac(amount.Int, exp).FloatString(2)

			message := ""
			if enqueuerTip.Cmp(big.NewInt(0)) > 0 && !mediaEntry.RequestedBy().IsUnknown() {
				name, err := s.getChatFriendlyUserName(ctx, mediaEntry.RequestedBy().Address())
				if err != nil {
					return stacktrace.Propagate(err, "")
				}
				tipBanStr := new(big.Rat).SetFrac(enqueuerTip.Int, exp).FloatString(2)
				name = escape.MarkdownCharacters(name)
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
				"_Spectators paid **%s BAN** to skip the previous video!_", banStr))
			if err != nil {
				return stacktrace.Propagate(err, "")
			}
		case tx := <-crowdfundedTransactionReceivedC:
			name, err := s.getChatFriendlyUserName(ctx, tx.FromAddress)
			if err != nil {
				return stacktrace.Propagate(err, "")
			}
			name = escape.MarkdownCharacters(name)

			exp := new(big.Int).Exp(big.NewInt(10), big.NewInt(29), nil)
			banStr := new(big.Rat).SetFrac(tx.Amount.BigInt(), exp).FloatString(2)

			msg := ""
			switch tx.TransactionType {
			case types.CrowdfundedTransactionTypeSkip:
				msg = fmt.Sprintf("_%s just contributed **%s BAN** towards skipping the current video!_", name, banStr)
			case types.CrowdfundedTransactionTypeRain:
				msg = fmt.Sprintf("_%s just increased the rewards for the current video by **%s BAN**!_", name, banStr)
			}
			if msg != "" {
				_, err = s.chat.CreateSystemMessage(ctx, msg)
				if err != nil {
					return stacktrace.Propagate(err, "")
				}
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
