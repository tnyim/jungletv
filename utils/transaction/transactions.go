package transaction

import (
	"context"

	"github.com/gbl08ma/sqalx"
	"github.com/palantir/stacktrace"
)

// WrappingContext combines a transaction and a context
type WrappingContext interface {
	context.Context
	sqalx.Node
	WithoutTx() context.Context
}

type sqalxNodeKey struct{}
type sqalxBaseNodeKey struct{}

type wrappingContextImpl struct {
	context.Context
	sqalx.Node
}

// Begin begins a new transaction and returns a transaction.WrappingContext that
// is the transaction and the context with the new sqalx transaction node.
// The caller must use the returned context in subsequent function calls that are meant
// to happen within the transaction.
func Begin(ctx context.Context) (WrappingContext, error) {
	if err := ctx.Err(); err != nil {
		return nil, stacktrace.Propagate(err, "refusing to begin transaction in context that is done")
	}
	n, ok := ctx.Value(sqalxNodeKey{}).(sqalx.Node)
	if !ok || n == nil {
		return nil, stacktrace.NewError("sqalx node not present in context")
	}
	tx, err := n.Beginx()
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	return &wrappingContextImpl{
		Context: context.WithValue(ctx, sqalxNodeKey{}, tx),
		Node:    tx,
	}, nil
}

// WithoutTx returns this context with a top-level sqalx node that is outside of any ongoing transaction
func (ctx *wrappingContextImpl) WithoutTx() context.Context {
	n, ok := ctx.Value(sqalxBaseNodeKey{}).(sqalx.Node)
	if !ok || n == nil {
		panic("base sqalx node not present in context")
	}
	return context.WithValue(ctx, sqalxNodeKey{}, n)
}

// ContextWithBaseSqalxNode returns a new context with the sqalx node set to the provided one
func ContextWithBaseSqalxNode(ctx context.Context, node sqalx.Node) context.Context {
	if node.Tx() != nil {
		panic("node already in transaction")
	}
	ctx = context.WithValue(ctx, sqalxNodeKey{}, node)
	ctx = context.WithValue(ctx, sqalxBaseNodeKey{}, node)
	return ctx
}
