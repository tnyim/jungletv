package server

import (
	"context"
	"encoding/json"
	"errors"
	"io/ioutil"
	"os"
	"time"

	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/types"
)

type moderationDecision struct {
	FromChat      bool
	FromEnqueuing bool
	FromRewards   bool
	Address       string
	RemoteAddress string
	Reason        string
	Moderator     string
}

func migrateModerationDecisionsFromFile(ctxCtx context.Context, file string) error {
	b, err := ioutil.ReadFile(file)
	if err != nil {
		if errors.Is(err, os.ErrNotExist) {
			return nil
		}
		return stacktrace.Propagate(err, "error reading bans from file for migration: %v", err)
	}

	decisions := make(map[string]moderationDecision)

	err = json.Unmarshal(b, &decisions)
	if err != nil {
		return stacktrace.Propagate(err, "error decoding bans from file for migration: %v", err)
	}

	ctx, err := BeginTransaction(ctxCtx)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	defer ctx.Rollback()

	for id, decision := range decisions {
		nd := &types.BannedUser{
			BanID:            id,
			BannedAt:         time.Now(),
			FromChat:         decision.FromChat,
			FromEnqueuing:    decision.FromEnqueuing,
			FromRewards:      decision.FromRewards,
			Address:          decision.Address,
			RemoteAddress:    decision.RemoteAddress,
			Reason:           decision.Reason,
			ModeratorAddress: decision.Moderator,
			ModeratorName:    "migrated",
		}

		err = nd.Update(ctx)
		if err != nil {
			return stacktrace.Propagate(err, "")
		}
	}

	err = ctx.Commit()
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	return stacktrace.Propagate(os.Rename(file, file+".migrated"), "")
}
