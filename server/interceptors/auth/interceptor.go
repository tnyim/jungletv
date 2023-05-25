package auth

import (
	"context"
	"net/netip"
	"strings"

	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/server/auth"
	"github.com/tnyim/jungletv/utils/wrappedstream"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/metadata"
	"google.golang.org/grpc/peer"
	"google.golang.org/grpc/status"
)

// UserAuthorizer allows for checking if users are authorized to use the service
type UserAuthorizer interface {
	IsRemoteAddressAllowed(remoteAddr string) bool
	IsRewardAddressAllowed(rewardAddr string) bool
}

// Interceptor intercepts gRPC requests to ensure user authentication and authorization
type Interceptor struct {
	jwtManager                  *auth.JWTManager
	minPermissionLevelForMethod map[string]auth.PermissionLevel
	authorizer                  UserAuthorizer
}

// New returns a new Interceptor
func New(jwtManager *auth.JWTManager, authorizer UserAuthorizer) *Interceptor {
	return &Interceptor{
		jwtManager,
		make(map[string]auth.PermissionLevel),
		authorizer,
	}
}

// SetMinimumPermissionLevelForMethod sets the minimum permission level required to use the given method
func (interceptor *Interceptor) SetMinimumPermissionLevelForMethod(method string, level auth.PermissionLevel) {
	interceptor.minPermissionLevelForMethod[method] = level
}

// Unary intercepts unary RPC requests
func (interceptor *Interceptor) Unary() grpc.UnaryServerInterceptor {
	return func(
		ctx context.Context,
		req interface{},
		info *grpc.UnaryServerInfo,
		handler grpc.UnaryHandler,
	) (interface{}, error) {
		newCtx, err := interceptor.authorize(ctx, info.FullMethod)
		if err != nil {
			return nil, err
		}
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
		newCtx, err := interceptor.authorize(stream.Context(), info.FullMethod)
		if err != nil {
			return err
		}
		wrapped := wrappedstream.WrapServerStream(stream)
		wrapped.WrappedContext = newCtx
		return handler(srv, wrapped)
	}
}

func (interceptor *Interceptor) authorize(ctx context.Context, method string) (context.Context, error) {
	authErr := status.Errorf(codes.Unauthenticated, "metadata is not provided")
	var claims *auth.UserClaims
	md, ok := metadata.FromIncomingContext(ctx)
	remoteAddress := ""
	if ok {
		remoteAddress = interceptor.getRemoteAddress(ctx, md)
		if !interceptor.authorizer.IsRemoteAddressAllowed(remoteAddress) {
			return ctx, status.Error(codes.PermissionDenied, "no permission to access this RPC")
		}

		claims, authErr = interceptor.tryAuthenticate(ctx, md)
	}
	ctx = context.WithValue(ctx, remoteAddressContextKey{}, remoteAddress)

	ipCountry := "XX"
	if len(md["cf-ipcountry"]) > 0 {
		ipCountry = md["cf-ipcountry"][0]
	}
	ctx = context.WithValue(ctx, ipCountryRequestKey{}, ipCountry)

	if authErr == nil {
		if !interceptor.authorizer.IsRewardAddressAllowed(claims.RewardAddress) {
			return ctx, status.Error(codes.PermissionDenied, "no permission to access this RPC")
		}

		// place claims in context
		ctx = context.WithValue(ctx, userClaimsContextKey{}, claims)

		if interceptor.jwtManager.IsTokenAboutToExpire(claims) {
			err := interceptor.renewAuthToken(ctx, claims)
			if err != nil {
				return ctx, stacktrace.Propagate(err, "")
			}
		}
	}

	minPermissionLevel := interceptor.minPermissionLevelForMethod[method]
	if auth.PermissionLevelOrder[minPermissionLevel] <= auth.PermissionLevelOrder[auth.UnauthenticatedPermissionLevel] {
		// maybe authErr != nil, but we don't care because this method doesn't require auth
		// (we have already placed the claims in the context so the request handler can optionally see
		// who the user is, even if authentication is not required)
		return ctx, nil
	}

	// permission levels beyond UnauthenticatedPermissionLevel require successful auth
	if authErr != nil {
		return ctx, authErr
	}

	if auth.PermissionLevelOrder[minPermissionLevel] > auth.PermissionLevelOrder[claims.PermLevel] {
		return ctx, status.Errorf(codes.PermissionDenied, "no permission to access this RPC")
	}

	return ctx, nil
}

func (interceptor *Interceptor) tryAuthenticate(ctx context.Context, md metadata.MD) (*auth.UserClaims, error) {
	values := md["authorization"]
	if len(values) == 0 {
		return nil, status.Errorf(codes.Unauthenticated, "authorization token is not provided")
	}

	accessToken := values[0]
	claims, err := interceptor.jwtManager.Verify(ctx, accessToken)
	if err != nil {
		return nil, status.Errorf(codes.Unauthenticated, "access token is invalid: %v", err)
	}
	return claims, nil
}

func (interceptor *Interceptor) renewAuthToken(ctx context.Context, claims *auth.UserClaims) error {
	token, expiration, err := interceptor.jwtManager.Generate(claims.RewardAddress, claims.PermLevel, claims.Username)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	err = grpc.SetHeader(ctx, metadata.New(map[string]string{
		"X-Replacement-Authorization-Token":      token,
		"X-Replacement-Authorization-Expiration": expiration.UTC().Format("2006-01-02T15:04:05.999Z07:00"),
	}))
	return stacktrace.Propagate(err, "")
}

func (interceptor *Interceptor) getRemoteAddress(ctx context.Context, md metadata.MD) string {
	ip := ""

	getMetadataIP := func(header string) string {
		value := strings.Join(md[header], ",")
		return strings.TrimSpace(strings.Split(value, ",")[0])
	}

	for _, header := range []string{"cf-connecting-ip", "x-forwarded-for", "x-forwarded", "forwarded-for", "forwarded", "x-real-ip", "real-ip"} {
		ip = getMetadataIP(header)
		if ip != "" {
			break
		}
	}

	if ip == "" {
		if p, ok := peer.FromContext(ctx); ok {
			ip = p.Addr.String()
		} else {
			return ""
		}
	}

	addrPort, err := netip.ParseAddrPort(ip)
	if err == nil {
		return addrPort.Addr().Unmap().WithZone("").String()
	}
	addr, err := netip.ParseAddr(ip)
	if err != nil {
		return ""
	}
	return addr.Unmap().WithZone("").String()
}
