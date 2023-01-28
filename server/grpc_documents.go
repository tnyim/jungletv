package server

import (
	"context"
	"fmt"
	"time"

	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/server/auth"
	authinterceptor "github.com/tnyim/jungletv/server/interceptors/auth"
	"github.com/tnyim/jungletv/types"
	"github.com/tnyim/jungletv/utils/transaction"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"google.golang.org/protobuf/types/known/timestamppb"
)

func (s *grpcServer) Documents(ctxCtx context.Context, r *proto.DocumentsRequest) (*proto.DocumentsResponse, error) {
	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	defer ctx.Commit() // read-only tx

	searchQuery := ""
	if len(r.SearchQuery) >= 3 {
		searchQuery = r.SearchQuery
	}

	documents, total, err := types.GetDocuments(ctx, searchQuery, readPaginationParameters(r))
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	return &proto.DocumentsResponse{
		Documents: convertDocumentHeaders(ctx, documents, s.userSerializer),
		Offset:    readOffset(r),
		Total:     total,
	}, nil
}

func convertDocumentHeaders(ctx context.Context, orig []*types.Document, userSerializer auth.APIUserSerializer) []*proto.DocumentHeader {
	protoEntries := make([]*proto.DocumentHeader, len(orig))
	for i, entry := range orig {
		protoEntries[i] = convertDocumentHeader(ctx, entry, userSerializer)
	}
	return protoEntries
}

func convertDocumentHeader(ctx context.Context, orig *types.Document, userSerializer auth.APIUserSerializer) *proto.DocumentHeader {
	return &proto.DocumentHeader{
		Id:        orig.ID,
		Format:    orig.Format,
		UpdatedAt: timestamppb.New(orig.UpdatedAt),
		UpdatedBy: userSerializer(ctx, auth.NewAddressOnlyUser(orig.UpdatedBy)),
		Public:    orig.Public,
	}
}

func (s *grpcServer) GetDocument(ctxCtx context.Context, r *proto.GetDocumentRequest) (*proto.Document, error) {
	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	defer ctx.Commit() // read-only tx

	user := authinterceptor.UserClaimsFromContext(ctx)

	documents, err := types.GetDocumentsWithIDs(ctx, []string{r.Id})
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	document, ok := documents[r.Id]
	if !ok {
		return nil, status.Error(codes.NotFound, "document not found")
	}
	if !document.Public && (user == nil || !auth.UserPermissionLevelIsAtLeast(user, auth.AdminPermissionLevel)) {
		return nil, status.Error(codes.NotFound, "document not found")
	}

	return &proto.Document{
		Id:        document.ID,
		Format:    document.Format,
		Content:   document.Content,
		UpdatedAt: timestamppb.New(document.UpdatedAt),
	}, nil
}

func (s *grpcServer) UpdateDocument(ctxCtx context.Context, r *proto.Document) (*proto.UpdateDocumentResponse, error) {
	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	defer ctx.Rollback()

	moderator := authinterceptor.UserClaimsFromContext(ctx)
	if moderator == nil {
		// this should never happen, as the auth interceptors should have taken care of this for us
		return nil, status.Error(codes.Unauthenticated, "missing user claims")
	}

	document := &types.Document{
		ID:        r.Id,
		UpdatedAt: time.Now(),
		UpdatedBy: moderator.Address(),
		Public:    true,
		Format:    r.Format,
		Content:   r.Content,
	}

	err = document.Update(ctx)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	err = ctx.Commit()
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	s.log.Printf("Document with ID %s updated by %s (remote address %s)", r.Id, moderator.Username, authinterceptor.RemoteAddressFromContext(ctx))

	if s.modLogWebhook != nil {
		_, err = s.modLogWebhook.SendContent(
			fmt.Sprintf("Document with ID `%s` updated by moderator: %s (%s)",
				r.Id,
				moderator.Address()[:14],
				moderator.Username))
		if err != nil {
			s.log.Println("Failed to send mod log webhook:", err)
		}
	}

	return &proto.UpdateDocumentResponse{}, nil
}

func (s *grpcServer) TriggerAnnouncementsNotification(ctxCtx context.Context, r *proto.TriggerAnnouncementsNotificationRequest) (*proto.TriggerAnnouncementsNotificationResponse, error) {
	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	defer ctx.Rollback()

	moderator := authinterceptor.UserClaimsFromContext(ctx)
	if moderator == nil {
		// this should never happen, as the auth interceptors should have taken care of this for us
		return nil, status.Error(codes.Unauthenticated, "missing user claims")
	}

	counter, err := s.getAnnouncementsCounter(ctx)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	counter.CounterValue++
	counter.UpdatedAt = time.Now()

	err = counter.Update(ctx)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	err = ctx.Commit()
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	s.announcementsUpdated.Notify(counter.CounterValue, true)

	s.log.Printf("Announcements notification triggered by %s (remote address %s)", moderator.Username, authinterceptor.RemoteAddressFromContext(ctx))

	if s.modLogWebhook != nil {
		_, err = s.modLogWebhook.SendContent(
			fmt.Sprintf("Announcements notification triggered by moderator: %s (%s)",
				moderator.Address()[:14],
				moderator.Username))
		if err != nil {
			s.log.Println("Failed to send mod log webhook:", err)
		}
	}

	return &proto.TriggerAnnouncementsNotificationResponse{}, nil
}

func (s *grpcServer) getAnnouncementsCounter(ctxCtx context.Context) (*types.Counter, error) {
	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	defer ctx.Commit() // read-only tx

	counters, err := types.GetCountersWithNames(ctx, []string{"announcements"})
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	counter, ok := counters["announcements"]
	if !ok {
		counter = &types.Counter{
			CounterName:  "announcements",
			CounterValue: 0,
		}
	}

	return counter, nil
}
