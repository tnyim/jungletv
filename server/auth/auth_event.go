package auth

import (
	"context"
	"time"

	"github.com/bytedance/sonic"
	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/types"
	"github.com/tnyim/jungletv/utils/transaction"
)

// RecordAuthEvent records an auth event in the database
func RecordAuthEvent(ctxCtx context.Context, address string, reason types.AuthReason, reasonInfo interface{}, method types.AuthMethod, methodInfo interface{}) error {
	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	defer ctx.Rollback()

	authEvent := types.AuthEvent{
		Address:         address,
		AuthenticatedAt: time.Now(),
		Reason:          reason,
		Method:          method,
	}

	authEvent.ReasonInfo, err = sonic.Marshal(reasonInfo)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	authEvent.MethodInfo, err = sonic.Marshal(methodInfo)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	err = authEvent.Update(ctx)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	err = ctx.Commit()
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	return nil
}
