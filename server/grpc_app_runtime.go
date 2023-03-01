package server

import (
	"context"

	"github.com/tnyim/jungletv/proto"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (s *grpcServer) ResolveApplicationPage(ctx context.Context, r *proto.ResolveApplicationPageRequest) (*proto.ResolveApplicationPageResponse, error) {
	pageInfo, ok := s.appRunner.ResolvePage(r.ApplicationId, r.PageId)
	if !ok {
		return nil, status.Error(codes.NotFound, "page not available")
	}

	return &proto.ResolveApplicationPageResponse{
		ApplicationFileName: pageInfo.File,
		PageTitle:           pageInfo.Title,
	}, nil
}
