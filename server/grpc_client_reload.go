package server

import (
	"context"
	"fmt"

	"github.com/tnyim/jungletv/proto"
	authinterceptor "github.com/tnyim/jungletv/server/interceptors/auth"
	"github.com/tnyim/jungletv/utils/event"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (s *grpcServer) ClientReloadTriggered() event.NoArgEvent {
	return s.clientReloadTriggered
}

func (s *grpcServer) NotifyVersionHashChanged() {
	s.versionHashChanged.Notify(false)
}

func (s *grpcServer) TriggerClientReload(ctx context.Context, r *proto.TriggerClientReloadRequest) (*proto.TriggerClientReloadResponse, error) {
	user := authinterceptor.UserClaimsFromContext(ctx)
	if user == nil {
		// this should never happen, as the auth interceptors should have taken care of this for us
		return nil, status.Error(codes.Unauthenticated, "missing user claims")
	}

	s.ClientReloadTriggered().Notify(false)

	s.log.Printf("Client reload triggered by %s (remote address %s)", user.Username, authinterceptor.RemoteAddressFromContext(ctx))

	if s.modLogWebhook != nil {
		_, err := s.modLogWebhook.SendContent(
			fmt.Sprintf("Moderator %s (%s) triggered client reload",
				user.Address()[:14], user.Username))
		if err != nil {
			s.log.Println("Failed to send mod log webhook:", err)
		}
	}

	return &proto.TriggerClientReloadResponse{}, nil
}
