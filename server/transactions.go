package server

import (
	"context"

	"github.com/gbl08ma/sqalx"
	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/types"
)

// TransactionWrappingContext combines a transaction and a context
type TransactionWrappingContext struct {
	context.Context
	sqalx.Node
}

// BeginTransaction begins a new transaction and returns a TransactionWrappingContext
// that is the transaction and the context with the new sqalx transaction node.
// The caller must use the returned context in subsequent function calls that are meant
// to happen within the transaction.
func BeginTransaction(ctx context.Context) (*TransactionWrappingContext, error) {
	n, ok := ctx.Value("SqalxNode").(sqalx.Node)
	if !ok || n == nil {
		return nil, stacktrace.NewError("SqalxNode not present in context")
	}
	tx, err := n.Beginx()
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	return &TransactionWrappingContext{
		Context: context.WithValue(ctx, "SqalxNode", tx),
		Node:    tx,
	}, nil
}

type requestWithPaginationParams interface {
	GetPaginationParams() *proto.PaginationParameters
}

func readPaginationParameters(r requestWithPaginationParams) *types.PaginationParams {
	params := r.GetPaginationParams()
	if params != nil {
		offset := params.Offset
		limit := params.Limit
		if limit == 0 && offset == 0 {
			return nil
		}
		return &types.PaginationParams{
			Offset: offset,
			Limit:  limit,
		}
	}
	return nil
}

func readOffset(r requestWithPaginationParams) uint64 {
	params := r.GetPaginationParams()
	if params != nil {
		return params.Offset
	}
	return 0
}
