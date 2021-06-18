package server

import (
	"context"
	"crypto/sha256"
	"encoding/base64"

	"google.golang.org/grpc"
	"google.golang.org/grpc/metadata"
)

// VersionInterceptor intercepts gRPC requests to add a header with the API version
type VersionInterceptor struct {
	versionHash string
}

// NewVersionInterceptor returns a new VersionInterceptor
func NewVersionInterceptor(version string) *VersionInterceptor {
	h := sha256.New()
	h.Write([]byte(version))
	return &VersionInterceptor{
		versionHash: base64.StdEncoding.EncodeToString(h.Sum(nil))[:10],
	}
}

// Unary intercepts unary RPC requests
func (interceptor *VersionInterceptor) Unary() grpc.UnaryServerInterceptor {
	return func(
		ctx context.Context,
		req interface{},
		info *grpc.UnaryServerInfo,
		handler grpc.UnaryHandler,
	) (interface{}, error) {
		err := grpc.SetHeader(ctx, metadata.Pairs("X-API-Version", interceptor.versionHash))
		if err != nil {
			return nil, err
		}
		return handler(ctx, req)
	}
}

// Stream intercepts stream RPC requests
func (interceptor *VersionInterceptor) Stream() grpc.StreamServerInterceptor {
	return func(
		srv interface{},
		stream grpc.ServerStream,
		info *grpc.StreamServerInfo,
		handler grpc.StreamHandler,
	) error {
		err := grpc.SetHeader(stream.Context(), metadata.Pairs("X-API-Version", interceptor.versionHash))
		if err != nil {
			return err
		}
		return handler(srv, stream)
	}
}
