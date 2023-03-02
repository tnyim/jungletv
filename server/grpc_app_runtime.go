package server

import (
	"context"
	"time"

	"github.com/palantir/stacktrace"
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

func (s *grpcServer) ConsumeApplicationEventStream(r *proto.ConsumeApplicationEventStreamRequest, stream proto.JungleTV_ConsumeApplicationEventStreamServer) error {
	// TODO
	return stacktrace.NewError("not implemented")
}

func (s *grpcServer) ApplicationServerMethod(ctx context.Context, r *proto.ApplicationServerMethodRequest) (*proto.ApplicationServerMethodResponse, error) {
	result, err := s.appRunner.ApplicationMethod(ctx, r.ApplicationId, r.Method, r.Arguments)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	return &proto.ApplicationServerMethodResponse{
		Result: result,
	}, nil
}

func (s *grpcServer) TriggerApplicationEvent(ctx context.Context, r *proto.TriggerApplicationEventRequest) (*proto.TriggerApplicationEventResponse, error) {
	return nil, stacktrace.NewError("not implemented") // TODO
}
