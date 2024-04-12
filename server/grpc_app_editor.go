package server

import (
	"context"
	"fmt"
	"os"
	"time"

	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/server/auth"
	"github.com/tnyim/jungletv/server/components/apprunner"
	authinterceptor "github.com/tnyim/jungletv/server/interceptors/auth"
	"github.com/tnyim/jungletv/types"
	"github.com/tnyim/jungletv/utils/transaction"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"google.golang.org/protobuf/types/known/timestamppb"
)

func (s *grpcServer) Applications(ctxCtx context.Context, r *proto.ApplicationsRequest) (*proto.ApplicationsResponse, error) {
	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	defer ctx.Commit() // read-only tx

	searchQuery := ""
	if len(r.SearchQuery) >= 3 {
		searchQuery = r.SearchQuery
	}

	applications, total, err := types.GetApplications(ctx, searchQuery, readPaginationParameters(r))
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	return &proto.ApplicationsResponse{
		Applications: convertApplications(ctx, applications, s.userSerializer),
		Offset:       readOffset(r),
		Total:        total,
	}, nil
}

func convertApplications(ctx context.Context, orig []*types.Application, userSerializer auth.APIUserSerializer) []*proto.Application {
	protoEntries := make([]*proto.Application, len(orig))
	for i, entry := range orig {
		protoEntries[i] = convertApplication(ctx, entry, userSerializer)
	}
	return protoEntries
}

func convertApplication(ctx context.Context, orig *types.Application, userSerializer auth.APIUserSerializer) *proto.Application {
	return &proto.Application{
		Id:               orig.ID,
		UpdatedAt:        timestamppb.New(time.Time(orig.UpdatedAt)),
		UpdatedBy:        userSerializer(ctx, auth.NewAddressOnlyUser(orig.UpdatedBy)),
		EditMessage:      orig.EditMessage,
		AllowLaunching:   orig.AllowLaunching,
		AllowFileEditing: orig.AllowFileEditing,
		Autorun:          orig.Autorun,
		RuntimeVersion:   uint32(orig.RuntimeVersion),
	}
}

func (s *grpcServer) GetApplication(ctxCtx context.Context, r *proto.GetApplicationRequest) (*proto.Application, error) {
	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	defer ctx.Commit() // read-only tx

	applications, err := types.GetApplicationsWithIDs(ctx, []string{r.Id})
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	application, ok := applications[r.Id]
	if !ok {
		return nil, status.Error(codes.NotFound, "document not found")
	}

	return convertApplication(ctx, application, s.userSerializer), nil
}

func (s *grpcServer) UpdateApplication(ctx context.Context, r *proto.Application) (*proto.UpdateApplicationResponse, error) {
	moderator := authinterceptor.UserClaimsFromContext(ctx)
	if moderator == nil {
		// this should never happen, as the auth interceptors should have taken care of this for us
		return nil, status.Error(codes.Unauthenticated, "missing user claims")
	}

	err := s.appEditor.UpdateApplication(ctx, r.Id, moderator, r.EditMessage, r.AllowLaunching, r.AllowFileEditing, r.Autorun)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	return &proto.UpdateApplicationResponse{}, nil
}

func (s *grpcServer) CloneApplication(ctx context.Context, r *proto.CloneApplicationRequest) (*proto.CloneApplicationResponse, error) {
	moderator := authinterceptor.UserClaimsFromContext(ctx)
	if moderator == nil {
		// this should never happen, as the auth interceptors should have taken care of this for us
		return nil, status.Error(codes.Unauthenticated, "missing user claims")
	}

	err := s.appEditor.CloneApplication(ctx, r.Id, r.DestinationId, moderator)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	return &proto.CloneApplicationResponse{}, nil
}

func (s *grpcServer) DeleteApplication(ctx context.Context, r *proto.DeleteApplicationRequest) (*proto.DeleteApplicationResponse, error) {
	moderator := authinterceptor.UserClaimsFromContext(ctx)
	if moderator == nil {
		// this should never happen, as the auth interceptors should have taken care of this for us
		return nil, status.Error(codes.Unauthenticated, "missing user claims")
	}

	err := s.appEditor.DeleteApplication(ctx, r.Id)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	s.log.Printf("Application with ID %s deleted by %s (remote address %s)", r.Id, moderator.ModeratorName(), authinterceptor.RemoteAddressFromContext(ctx))

	if s.modLogWebhook != nil {
		_, err = s.modLogWebhook.SendContent(
			fmt.Sprintf("Application with ID `%s` deleted by: %s (%s)",
				r.Id,
				moderator.Address()[:14],
				moderator.ModeratorName()))
		if err != nil {
			s.log.Println("Failed to send mod log webhook:", err)
		}
	}

	return &proto.DeleteApplicationResponse{}, nil
}

func (s *grpcServer) ApplicationFiles(ctxCtx context.Context, r *proto.ApplicationFilesRequest) (*proto.ApplicationFilesResponse, error) {
	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	defer ctx.Commit() // read-only tx

	searchQuery := ""
	if len(r.SearchQuery) >= 3 {
		searchQuery = r.SearchQuery
	}

	applicationFiles, total, err := types.GetApplicationFilesForApplication[*types.ApplicationFileMetadata](ctx, r.ApplicationId, searchQuery, readPaginationParameters(r))
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	return &proto.ApplicationFilesResponse{
		Files:  convertApplicationFiles(ctx, applicationFiles, s.userSerializer),
		Offset: readOffset(r),
		Total:  total,
	}, nil
}

func convertApplicationFiles[T types.ApplicationFileLike](ctx context.Context, orig []T, userSerializer auth.APIUserSerializer) []*proto.ApplicationFile {
	protoEntries := make([]*proto.ApplicationFile, len(orig))
	for i, entry := range orig {
		protoEntries[i] = convertApplicationFile(ctx, entry, userSerializer)
	}
	return protoEntries
}

func convertApplicationFile[T types.ApplicationFileLike](ctx context.Context, orig T, userSerializer auth.APIUserSerializer) *proto.ApplicationFile {
	switch o := any(orig).(type) {
	case *types.ApplicationFile:
		return &proto.ApplicationFile{
			ApplicationId: o.ApplicationID,
			Name:          o.Name,
			UpdatedAt:     timestamppb.New(time.Time(o.UpdatedAt)),
			UpdatedBy:     userSerializer(ctx, auth.NewAddressOnlyUser(o.UpdatedBy)),
			EditMessage:   o.EditMessage,
			Public:        o.Public,
			Type:          o.Type,
			Content:       o.Content,
		}
	case *types.ApplicationFileMetadata:
		return &proto.ApplicationFile{
			ApplicationId: o.ApplicationID,
			Name:          o.Name,
			UpdatedAt:     timestamppb.New(time.Time(o.UpdatedAt)),
			UpdatedBy:     userSerializer(ctx, auth.NewAddressOnlyUser(o.UpdatedBy)),
			EditMessage:   o.EditMessage,
			Public:        o.Public,
			Type:          o.Type,
		}
	default:
		// should never happen as long as this case switch stays in sync with the types.ApplicationFileLike constraint
		return nil
	}
}

func (s *grpcServer) GetApplicationFile(ctxCtx context.Context, r *proto.GetApplicationFileRequest) (*proto.ApplicationFile, error) {
	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	defer ctx.Commit() // read-only tx

	files, err := types.GetApplicationFilesWithNamesForApplication(ctx, r.ApplicationId, []string{r.Name})
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	file, ok := files[r.Name]
	if !ok {
		return nil, status.Error(codes.NotFound, "file not found")
	}

	return convertApplicationFile(ctx, file, s.userSerializer), nil
}

func (s *grpcServer) UpdateApplicationFile(ctx context.Context, r *proto.ApplicationFile) (*proto.UpdateApplicationFileResponse, error) {
	moderator := authinterceptor.UserClaimsFromContext(ctx)
	if moderator == nil {
		// this should never happen, as the auth interceptors should have taken care of this for us
		return nil, status.Error(codes.Unauthenticated, "missing user claims")
	}

	r.GetContent()

	err := s.appEditor.UpdateApplicationFile(ctx, r.ApplicationId, r.Name, moderator, r.Type, r.Public, r.Content, r.EditMessage)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	return &proto.UpdateApplicationFileResponse{}, nil
}

func (s *grpcServer) CloneApplicationFile(ctx context.Context, r *proto.CloneApplicationFileRequest) (*proto.CloneApplicationFileResponse, error) {
	moderator := authinterceptor.UserClaimsFromContext(ctx)
	if moderator == nil {
		// this should never happen, as the auth interceptors should have taken care of this for us
		return nil, status.Error(codes.Unauthenticated, "missing user claims")
	}

	err := s.appEditor.CloneApplicationFile(ctx, r.ApplicationId, r.Name, r.DestinationApplicationId, r.DestinationName, moderator)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	return &proto.CloneApplicationFileResponse{}, nil
}

func (s *grpcServer) DeleteApplicationFile(ctx context.Context, r *proto.DeleteApplicationFileRequest) (*proto.DeleteApplicationFileResponse, error) {
	moderator := authinterceptor.UserClaimsFromContext(ctx)
	if moderator == nil {
		// this should never happen, as the auth interceptors should have taken care of this for us
		return nil, status.Error(codes.Unauthenticated, "missing user claims")
	}

	err := s.appEditor.DeleteApplicationFile(ctx, r.ApplicationId, r.Name, moderator)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	return &proto.DeleteApplicationFileResponse{}, nil
}

func (s *grpcServer) ExportApplication(ctx context.Context, r *proto.ExportApplicationRequest) (*proto.ExportApplicationResponse, error) {
	zipContent, err := s.appEditor.CreateApplicationZIP(ctx, r.ApplicationId, r.OpaqueFormat)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	if r.OpaqueFormat {
		return &proto.ExportApplicationResponse{
			ArchiveName:    r.ApplicationId + ".jungletvapp",
			ArchiveType:    "application/x.jungletv.app",
			ArchiveContent: zipContent,
		}, nil
	}

	return &proto.ExportApplicationResponse{
		ArchiveName:    r.ApplicationId + ".zip",
		ArchiveType:    "application/zip",
		ArchiveContent: zipContent,
	}, nil
}

func (s *grpcServer) ImportApplication(ctx context.Context, r *proto.ImportApplicationRequest) (*proto.ImportApplicationResponse, error) {
	moderator := authinterceptor.UserClaimsFromContext(ctx)
	if moderator == nil {
		// this should never happen, as the auth interceptors should have taken care of this for us
		return nil, status.Error(codes.Unauthenticated, "missing user claims")
	}

	err := s.appEditor.ImportApplicationFilesFromZIP(ctx, r.ApplicationId, r.ArchiveContent, !r.AppendOnly, r.RestoreEditMessages, moderator)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	return &proto.ImportApplicationResponse{}, nil
}

func (s *grpcServer) TypeScriptTypeDefinitions(ctx context.Context, r *proto.TypeScriptTypeDefinitionsRequest) (*proto.TypeScriptTypeDefinitionsResponse, error) {
	fileContents := []byte{}
	if s.typeScriptTypeDefinitionsFile != "" {
		var err error
		fileContents, err = os.ReadFile(s.typeScriptTypeDefinitionsFile)
		if err != nil {
			return nil, stacktrace.Propagate(err, "")
		}
	}
	return &proto.TypeScriptTypeDefinitionsResponse{
		TypescriptVersion:   apprunner.TypeScriptVersion,
		TypeDefinitionsFile: fileContents,
	}, nil
}
