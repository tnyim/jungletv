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
		PageTitle:          pageInfo.Title,
		ApplicationVersion: timestamppb.New(time.Time(appVersion)),
	}, nil
}

func (s *grpcServer) ConsumeApplicationEvents(r *proto.ConsumeApplicationEventsRequest, stream proto.JungleTV_ConsumeApplicationEventsServer) error {
	eventCh, unsub, err := s.appRunner.ConsumeApplicationEvents(stream.Context(), r.ApplicationId, r.PageId)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	defer unsub()

	err = s.appRunner.ApplicationEvent(stream.Context(), true, r.ApplicationId, r.PageId, "connected", []string{})
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	defer func() {
		_ = s.appRunner.ApplicationEvent(stream.Context(), true, r.ApplicationId, r.PageId, "disconnected", []string{})
	}()

	heartbeat := time.NewTicker(5 * time.Second)
	defer heartbeat.Stop()
	var seq uint32

	sendHeartbeat := func() error {
		err := stream.Send(&proto.ApplicationEventUpdate{
			Type: &proto.ApplicationEventUpdate_Heartbeat{
				Heartbeat: &proto.ApplicationHeartbeatEvent{
					Sequence: seq,
				},
			},
		})
		seq++
		return stacktrace.Propagate(err, "")
	}

	// immediately send a heartbeat so the client knows it's connected
	err = sendHeartbeat()
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	for {
		select {
		case e, ok := <-eventCh:
			if !ok {
				err = stream.Send(&proto.ApplicationEventUpdate{
					Type: &proto.ApplicationEventUpdate_PageUnpublishedEvent{
						PageUnpublishedEvent: &proto.ApplicationPageUnpublishedEvent{},
					},
				})
				return stacktrace.Propagate(err, "")
			}
			err = stream.Send(&proto.ApplicationEventUpdate{
				Type: &proto.ApplicationEventUpdate_ApplicationEvent{
					ApplicationEvent: &proto.ApplicationServerEvent{
						Name:      e.EventName,
						Arguments: e.EventArgs,
					},
				},
			})
		case <-heartbeat.C:
			err = sendHeartbeat()
		case <-stream.Context().Done():
			return nil
		}
		if err != nil {
			return stacktrace.Propagate(err, "")
		}
	}
}

func (s *grpcServer) ApplicationServerMethod(ctx context.Context, r *proto.ApplicationServerMethodRequest) (*proto.ApplicationServerMethodResponse, error) {
	result, err := s.appRunner.ApplicationMethod(ctx, r.ApplicationId, r.PageId, r.Method, r.Arguments)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	return &proto.ApplicationServerMethodResponse{
		Result: result,
	}, nil
}

func (s *grpcServer) TriggerApplicationEvent(ctx context.Context, r *proto.TriggerApplicationEventRequest) (*proto.TriggerApplicationEventResponse, error) {
	err := s.appRunner.ApplicationEvent(ctx, false, r.ApplicationId, r.PageId, r.Name, r.Arguments)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	return &proto.TriggerApplicationEventResponse{}, nil
}
