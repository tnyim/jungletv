package server

import (
	"context"
	"time"

	"github.com/tnyim/jungletv/proto"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"google.golang.org/protobuf/types/known/timestamppb"
)

func (s *grpcServer) ResolveApplicationPage(ctx context.Context, r *proto.ResolveApplicationPageRequest) (*proto.ResolveApplicationPageResponse, error) {
	pageInfo, appVersion, ok := s.appRunner.ResolvePage(r.ApplicationId, r.PageId)
	if !ok {
		return nil, status.Error(codes.NotFound, "page not available")
	}

	return &proto.ResolveApplicationPageResponse{
		ApplicationFileName: pageInfo.File,
		PageTitle:           pageInfo.Title,
		ApplicationVersion:  timestamppb.New(time.Time(appVersion)),
	}, nil
}
