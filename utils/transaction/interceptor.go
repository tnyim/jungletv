package transaction

import (
	"context"

	"github.com/gbl08ma/sqalx"
	"github.com/tnyim/jungletv/utils/wrappedstream"
	"google.golang.org/grpc"
)

// Interceptor intercepts gRPC requests to set the transaction context
type Interceptor struct {
	rootNode sqalx.Node
}

// NewInterceptor returns a new initialized Interceptor
func NewInterceptor(rootNode sqalx.Node) *Interceptor {
	return &Interceptor{
		rootNode: rootNode,
	}
}

type sqalxNodeKey struct{}

// ContextWithSqalxNode returns a new context with the sqalx node set to the provided one
func ContextWithSqalxNode(ctx context.Context, node sqalx.Node) context.Context {
	return context.WithValue(ctx, sqalxNodeKey{}, node)
}

// Unary intercepts unary RPC requests
func (interceptor *Interceptor) Unary() grpc.UnaryServerInterceptor {
	return func(
		ctx context.Context,
		req interface{},
		info *grpc.UnaryServerInfo,
		handler grpc.UnaryHandler,
	) (interface{}, error) {
		newCtx := ContextWithSqalxNode(ctx, interceptor.rootNode)
		return handler(newCtx, req)
	}
}

// Stream intercepts stream RPC requests
func (interceptor *Interceptor) Stream() grpc.StreamServerInterceptor {
	return func(
		srv interface{},
		stream grpc.ServerStream,
		info *grpc.StreamServerInfo,
		handler grpc.StreamHandler,
	) error {
		newCtx := ContextWithSqalxNode(stream.Context(), interceptor.rootNode)
		wrapped := wrappedstream.WrapServerStream(stream)
		wrapped.WrappedContext = newCtx
		return handler(srv, wrapped)
	}
}
