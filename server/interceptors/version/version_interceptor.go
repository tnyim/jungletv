package version

import (
	"context"
	"crypto/sha256"
	"encoding/base64"
	"fmt"

	"github.com/tnyim/jungletv/utils/event"
	"google.golang.org/grpc"
	"google.golang.org/grpc/metadata"
)

// VersionInterceptor intercepts gRPC requests to add a header with the API version
type VersionInterceptor struct {
	buildDate string
	gitCommit string

	forcedClientReloads int
	cachedVersion       string

	versionHashUpdated event.Event[string]
}

// New returns a new VersionInterceptor
func New(buildDate string, gitCommit string) *VersionInterceptor {
	vi := &VersionInterceptor{
		buildDate:          buildDate,
		gitCommit:          gitCommit,
		versionHashUpdated: event.New[string](),
	}

	vi.computeVersionHash()
	return vi
}

// VersionHash returns the current version hash
func (interceptor *VersionInterceptor) VersionHash() string {
	return interceptor.cachedVersion
}

// VersionHashUpdated returns an event that is fired when the version hash changes
func (interceptor *VersionInterceptor) VersionHashUpdated() event.Event[string] {
	return interceptor.versionHashUpdated
}

// TriggerClientReload increments the count of forced client reloads such that the version hash changes
func (interceptor *VersionInterceptor) TriggerClientReload() {
	interceptor.forcedClientReloads++
	interceptor.computeVersionHash()
}

func (interceptor *VersionInterceptor) computeVersionHash() {
	o := interceptor.cachedVersion
	h := sha256.New()
	h.Write([]byte(interceptor.buildDate + interceptor.gitCommit))
	baseVersionHash := base64.StdEncoding.EncodeToString(h.Sum(nil))[:10]
	interceptor.cachedVersion = fmt.Sprintf("%s-%d", baseVersionHash, interceptor.forcedClientReloads)
	if interceptor.cachedVersion != o {
		interceptor.versionHashUpdated.Notify(interceptor.cachedVersion, false)
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
		err := grpc.SetHeader(ctx, metadata.Pairs("X-API-Version", interceptor.cachedVersion))
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
		err := grpc.SetHeader(stream.Context(), metadata.Pairs("X-API-Version", interceptor.cachedVersion))
		if err != nil {
			return err
		}
		return handler(srv, stream)
	}
}
