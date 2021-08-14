package main

import (
	"context"

	"github.com/gbl08ma/sqalx"
	"github.com/tnyim/jungletv/server/auth"
	"google.golang.org/grpc"
)

type sqalxInterceptor struct {
	rootNode sqalx.Node
}

// Unary intercepts unary RPC requests
func (interceptor *sqalxInterceptor) Unary() grpc.UnaryServerInterceptor {
	return func(
		ctx context.Context,
		req interface{},
		info *grpc.UnaryServerInfo,
		handler grpc.UnaryHandler,
	) (interface{}, error) {
		newCtx := context.WithValue(ctx, "SqalxNode", rootSqalxNode)
		return handler(newCtx, req)
	}
}

// Stream intercepts stream RPC requests
func (interceptor *sqalxInterceptor) Stream() grpc.StreamServerInterceptor {
	return func(
		srv interface{},
		stream grpc.ServerStream,
		info *grpc.StreamServerInfo,
		handler grpc.StreamHandler,
	) error {
		newCtx := context.WithValue(stream.Context(), "SqalxNode", rootSqalxNode)
		wrapped := auth.WrapServerStream(stream)
		wrapped.WrappedContext = newCtx
		return handler(srv, wrapped)
	}
}
