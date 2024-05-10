package server

import (
	"context"
	"fmt"

	"github.com/tnyim/jungletv/proto"
	authinterceptor "github.com/tnyim/jungletv/server/interceptors/auth"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (s *grpcServer) TriggerClientReload(ctx context.Context, r *proto.TriggerClientReloadRequest) (*proto.TriggerClientReloadResponse, error) {
	user := authinterceptor.UserFromContext(ctx)
	if user == nil {
		// this should never happen, as the auth interceptors should have taken care of this for us
		return nil, status.Error(codes.Unauthenticated, "missing user claims")
	}

	s.versionInterceptor.TriggerClientReload()

	s.log.Printf("Client reload triggered by %s (remote address %s)", user.ModeratorName(), authinterceptor.RemoteAddressFromContext(ctx))

	if s.modLogWebhook != nil {
		_, err := s.modLogWebhook.SendContent(
			fmt.Sprintf("Moderator %s (%s) triggered client reload",
				user.Address()[:14], user.ModeratorName()))
		if err != nil {
			s.log.Println("Failed to send mod log webhook:", err)
		}
	}

	return &proto.TriggerClientReloadResponse{}, nil
}
