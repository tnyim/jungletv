package server

import (
	"context"
	"fmt"
	"net/netip"
	"time"

	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/rpcproxy/tokens"
	authinterceptor "github.com/tnyim/jungletv/server/interceptors/auth"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/metadata"
	"google.golang.org/grpc/status"
	"google.golang.org/protobuf/types/known/timestamppb"
)

func (s *grpcServer) RPCConfiguration(ctx context.Context, r *proto.RPCConfigurationRequest) (*proto.RPCConfigurationResponse, error) {
	if s.rpcProxyIPV4Endpoint == "" || s.rpcProxyIPV6Endpoint == "" || s.disableRPCProxy {
		return &proto.RPCConfigurationResponse{
			Endpoint:     s.websiteURL,
			RpcAuthToken: "",
			Expiration:   timestamppb.New(time.Now().Add(1 * time.Hour)),
		}, nil
	}
	ipCountry := authinterceptor.IPCountryFromContext(ctx)
	remoteAddress := authinterceptor.RemoteAddressFromContext(ctx)
	md, ok := metadata.FromIncomingContext(ctx)
	if !ok {
		return nil, status.Error(codes.InvalidArgument, "metadata is not provided")
	}

	token, expiry, err := tokens.GenerateToken(
		[]byte(s.rpcProxyTokensSecretKey),
		1*time.Hour,
		remoteAddress,
		md["user-agent"][0],
		ipCountry)
	if err != nil {
		return nil, err
	}

	endpoint := s.rpcProxyIPV4Endpoint
	addr, err := netip.ParseAddr(remoteAddress)
	if err == nil && addr.Is6() {
		endpoint = s.rpcProxyIPV6Endpoint
	}

	return &proto.RPCConfigurationResponse{
		Endpoint:     endpoint,
		RpcAuthToken: token,
		Expiration:   timestamppb.New(expiry),
	}, nil
}

func (s *grpcServer) SetRPCProxyEnabled(ctx context.Context, r *proto.SetRPCProxyEnabledRequest) (*proto.SetRPCProxyEnabledResponse, error) {
	user := authinterceptor.UserFromContext(ctx)
	if user == nil {
		// this should never happen, as the auth interceptors should have taken care of this for us
		return nil, status.Error(codes.Unauthenticated, "missing user claims")
	}

	s.disableRPCProxy = !r.Enabled

	action := "disabled"
	if r.Enabled {
		action = "enabled"
	}

	s.log.Printf("RPC proxy %s by %s (remote address %s)", action, user.ModeratorName(), authinterceptor.RemoteAddressFromContext(ctx))

	if s.modLogWebhook != nil {
		_, err := s.modLogWebhook.SendContent(
			fmt.Sprintf("Moderator %s (%s) %s the RPC proxy",
				user.Address()[:14], user.ModeratorName(), action))
		if err != nil {
			s.log.Println("Failed to send mod log webhook:", err)
		}
	}

	return &proto.SetRPCProxyEnabledResponse{}, nil
}
