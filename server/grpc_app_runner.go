package server

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/oklog/ulid/v2"
	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/server/components/apprunner"
	authinterceptor "github.com/tnyim/jungletv/server/interceptors/auth"
	"github.com/tnyim/jungletv/utils"
	"github.com/tnyim/jungletv/utils/event"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"google.golang.org/protobuf/types/known/durationpb"
	"google.golang.org/protobuf/types/known/timestamppb"
)

func (s *grpcServer) LaunchApplication(ctx context.Context, r *proto.LaunchApplicationRequest) (*proto.LaunchApplicationResponse, error) {
	moderator := authinterceptor.UserClaimsFromContext(ctx)
	if moderator == nil {
		// this should never happen, as the auth interceptors should have taken care of this for us
		return nil, status.Error(codes.Unauthenticated, "missing user claims")
	}

	err := s.appRunner.LaunchApplication(r.Id)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	s.log.Printf("Application with ID %s launched by %s (remote address %s)", r.Id, moderator.Username, authinterceptor.RemoteAddressFromContext(ctx))

	if s.modLogWebhook != nil {
		_, err = s.modLogWebhook.SendContent(
			fmt.Sprintf("Application with ID `%s` launched by: %s (%s)",
				r.Id,
				moderator.Address()[:14],
				moderator.Username))
		if err != nil {
			s.log.Println("Failed to send mod log webhook:", err)
		}
	}
	return &proto.LaunchApplicationResponse{}, nil
}

func (s *grpcServer) StopApplication(ctx context.Context, r *proto.StopApplicationRequest) (*proto.StopApplicationResponse, error) {
	moderator := authinterceptor.UserClaimsFromContext(ctx)
	if moderator == nil {
		// this should never happen, as the auth interceptors should have taken care of this for us
		return nil, status.Error(codes.Unauthenticated, "missing user claims")
	}

	err := s.appRunner.StopApplication(r.Id)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	s.log.Printf("Application with ID %s stopped by %s (remote address %s)", r.Id, moderator.Username, authinterceptor.RemoteAddressFromContext(ctx))

	if s.modLogWebhook != nil {
		_, err = s.modLogWebhook.SendContent(
			fmt.Sprintf("Application with ID `%s` stopped by: %s (%s)",
				r.Id,
				moderator.Address()[:14],
				moderator.Username))
		if err != nil {
			s.log.Println("Failed to send mod log webhook:", err)
		}
	}
	return &proto.StopApplicationResponse{}, nil
}

func (s *grpcServer) ApplicationLog(ctx context.Context, r *proto.ApplicationLogRequest) (*proto.ApplicationLogResponse, error) {
	appLog, err := s.appRunner.ApplicationLog(r.ApplicationId)
	if err != nil {
		if errors.Is(err, apprunner.ErrApplicationLogNotFound) {
			return nil, status.Error(codes.NotFound, "application log not found")
		}
		return nil, stacktrace.Propagate(err, "")
	}

	offset := ulid.Make()
	if r.Offset != nil {
		offset, err = ulid.Parse(*r.Offset)
	} else {
		err = offset.SetTime(ulid.MaxTime())
	}
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	levels, err := convertApplicationLogLevelsFromProto(r.Levels)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	entries, hasMore := appLog.LogEntries(offset, int(r.Limit), levels)

	protoEntries := convertApplicationLogEntries(entries)

	return &proto.ApplicationLogResponse{
		Entries: protoEntries,
		HasMore: hasMore,
	}, nil
}

func (s *grpcServer) ConsumeApplicationLog(r *proto.ConsumeApplicationLogRequest, stream proto.JungleTV_ConsumeApplicationLogServer) error {
	appLog, err := s.appRunner.ApplicationLog(r.ApplicationId)
	if err != nil {
		if errors.Is(err, apprunner.ErrApplicationLogNotFound) {
			return status.Error(codes.NotFound, "application log not found")
		}
		return stacktrace.Propagate(err, "")
	}

	onLogEntryAdded, logEntryAddedU := appLog.LogEntryAdded().Subscribe(event.ExactlyOnceGuarantee)
	defer logEntryAddedU()

	levels, err := convertApplicationLogLevelsFromProto(r.Levels)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	levelsSet := utils.SliceToSet(levels)

	heartbeat := time.NewTicker(5 * time.Second)
	defer heartbeat.Stop()

	for {
		var err error
		select {
		case entry := <-onLogEntryAdded:
			if _, ok := levelsSet[entry.LogLevel()]; ok || len(levels) == 0 {
				err = stream.Send(&proto.ApplicationLogEntryContainer{
					IsHeartbeat: false,
					Entry:       convertApplicationLogEntry(entry),
				})
			}
		case <-heartbeat.C:
			err = stream.Send(&proto.ApplicationLogEntryContainer{
				IsHeartbeat: true,
			})
		case <-stream.Context().Done():
			return nil
		}
		if err != nil {
			return stacktrace.Propagate(err, "failed to send log update")
		}
	}
}

func convertApplicationLogLevelsFromProto(orig []proto.ApplicationLogLevel) ([]apprunner.ApplicationLogLevel, error) {
	entries := make([]apprunner.ApplicationLogLevel, len(orig))
	for i, entry := range orig {
		var err error
		entries[i], err = convertApplicationLogLevelFromProto(entry)
		if err != nil {
			return nil, stacktrace.Propagate(err, "")
		}
	}
	return entries, nil
}

func convertApplicationLogLevelFromProto(orig proto.ApplicationLogLevel) (apprunner.ApplicationLogLevel, error) {
	l, ok := map[proto.ApplicationLogLevel]apprunner.ApplicationLogLevel{
		proto.ApplicationLogLevel_APPLICATION_LOG_LEVEL_JS_LOG:        apprunner.ApplicationLogLevelJSLog,
		proto.ApplicationLogLevel_APPLICATION_LOG_LEVEL_JS_WARN:       apprunner.ApplicationLogLevelJSWarn,
		proto.ApplicationLogLevel_APPLICATION_LOG_LEVEL_JS_ERROR:      apprunner.ApplicationLogLevelJSError,
		proto.ApplicationLogLevel_APPLICATION_LOG_LEVEL_RUNTIME_LOG:   apprunner.ApplicationLogLevelRuntimeLog,
		proto.ApplicationLogLevel_APPLICATION_LOG_LEVEL_RUNTIME_ERROR: apprunner.ApplicationLogLevelRuntimeError,
	}[orig]
	if !ok {
		var zero apprunner.ApplicationLogLevel
		return zero, stacktrace.NewError("unknown log level")
	}
	return l, nil
}

func convertApplicationLogLevel(orig apprunner.ApplicationLogLevel) proto.ApplicationLogLevel {
	l, ok := map[apprunner.ApplicationLogLevel]proto.ApplicationLogLevel{
		apprunner.ApplicationLogLevelJSLog:        proto.ApplicationLogLevel_APPLICATION_LOG_LEVEL_JS_LOG,
		apprunner.ApplicationLogLevelJSWarn:       proto.ApplicationLogLevel_APPLICATION_LOG_LEVEL_JS_WARN,
		apprunner.ApplicationLogLevelJSError:      proto.ApplicationLogLevel_APPLICATION_LOG_LEVEL_JS_ERROR,
		apprunner.ApplicationLogLevelRuntimeLog:   proto.ApplicationLogLevel_APPLICATION_LOG_LEVEL_RUNTIME_LOG,
		apprunner.ApplicationLogLevelRuntimeError: proto.ApplicationLogLevel_APPLICATION_LOG_LEVEL_RUNTIME_ERROR,
	}[orig]
	if !ok {
		return proto.ApplicationLogLevel_UNKNOWN_APPLICATION_LOG_LEVEL
	}
	return l
}

func convertApplicationLogEntries(orig []apprunner.ApplicationLogEntry) []*proto.ApplicationLogEntry {
	entries := make([]*proto.ApplicationLogEntry, len(orig))
	for i, entry := range orig {
		entries[i] = convertApplicationLogEntry(entry)
	}
	return entries
}

func convertApplicationLogEntry(orig apprunner.ApplicationLogEntry) *proto.ApplicationLogEntry {
	return &proto.ApplicationLogEntry{
		Cursor:    orig.Cursor().String(),
		CreatedAt: timestamppb.New(orig.CreatedAt()),
		Level:     convertApplicationLogLevel(orig.LogLevel()),
		Message:   orig.Message(),
	}
}

func (s *grpcServer) MonitorRunningApplications(_ *proto.MonitorRunningApplicationsRequest, stream proto.JungleTV_MonitorRunningApplicationsServer) error {
	onRunningApplicationsUpdated, runningApplicationsUpdatedU := s.appRunner.RunningApplicationsUpdated().Subscribe(event.AtLeastOnceGuarantee)
	defer runningApplicationsUpdatedU()

	runningApplications := s.appRunner.RunningApplications()

	send := func(apps []apprunner.RunningApplication) error {
		return stacktrace.Propagate(stream.Send(&proto.RunningApplications{
			RunningApplications: convertRunningApplications(apps),
		}), "")
	}
	send(runningApplications)

	heartbeat := time.NewTicker(5 * time.Second)
	defer heartbeat.Stop()

	for {
		var err error
		select {
		case runningApplications := <-onRunningApplicationsUpdated:
			err = send(runningApplications)
		case <-heartbeat.C:
			err = stream.Send(&proto.RunningApplications{
				IsHeartbeat: true,
			})
		case <-stream.Context().Done():
			return nil
		}
		if err != nil {
			return stacktrace.Propagate(err, "failed to send running applications update")
		}
	}
}

func convertRunningApplications(orig []apprunner.RunningApplication) []*proto.RunningApplication {
	entries := make([]*proto.RunningApplication, len(orig))
	for i, entry := range orig {
		entries[i] = convertRunningApplication(entry)
	}
	return entries
}

func convertRunningApplication(orig apprunner.RunningApplication) *proto.RunningApplication {
	return &proto.RunningApplication{
		ApplicationId:      orig.ApplicationID,
		ApplicationVersion: timestamppb.New(time.Time(orig.ApplicationVersion)),
		StartedAt:          timestamppb.New(orig.StartedAt),
	}
}

func (s *grpcServer) EvaluateExpressionOnApplication(ctx context.Context, r *proto.EvaluateExpressionOnApplicationRequest) (*proto.EvaluateExpressionOnApplicationResponse, error) {
	successful, result, executionTime, err := s.appRunner.EvaluateExpressionOnApplication(ctx, r.ApplicationId, r.Expression)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	return &proto.EvaluateExpressionOnApplicationResponse{
		Successful:    successful,
		Result:        result,
		ExecutionTime: durationpb.New(executionTime),
	}, nil
}
