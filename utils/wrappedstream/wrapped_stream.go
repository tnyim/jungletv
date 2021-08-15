package wrappedstream

import (
	"context"

	"google.golang.org/grpc"
)

// ServerStream is a thin wrapper around grpc.ServerStream that allows modifying context.
type ServerStream struct {
	grpc.ServerStream
	// WrappedContext is the wrapper's own Context. You can assign it.
	WrappedContext context.Context
}

// Context returns the wrapper's WrappedContext, overwriting the nested grpc.ServerStream.Context()
func (w *ServerStream) Context() context.Context {
	return w.WrappedContext
}

// WrapServerStream returns a ServerStream that has the ability to overwrite context.
func WrapServerStream(stream grpc.ServerStream) *ServerStream {
	if existing, ok := stream.(*ServerStream); ok {
		return existing
	}
	return &ServerStream{ServerStream: stream, WrappedContext: stream.Context()}
}
