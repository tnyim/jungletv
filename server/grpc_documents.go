package server

import (
	"context"
	"fmt"
	"time"

	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/server/auth"
	"github.com/tnyim/jungletv/types"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (s *grpcServer) GetDocument(ctxCtx context.Context, r *proto.GetDocumentRequest) (*proto.Document, error) {
	ctx, err := BeginTransaction(ctxCtx)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	defer ctx.Commit() // read-only tx

	user := auth.UserClaimsFromContext(ctx)

	documents, err := types.GetDocumentsWithIDs(ctx, []string{r.Id})
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	document, ok := documents[r.Id]
	if !ok {
		return nil, status.Error(codes.NotFound, "document not found")
	}
	if !document.Public && (user == nil || !UserPermissionLevelIsAtLeast(user, auth.AdminPermissionLevel)) {
		return nil, status.Error(codes.NotFound, "document not found")
	}

	return &proto.Document{
		Id:      document.ID,
		Format:  document.Format,
		Content: document.Content,
	}, nil
}

func (s *grpcServer) UpdateDocument(ctxCtx context.Context, r *proto.Document) (*proto.UpdateDocumentResponse, error) {
	ctx, err := BeginTransaction(ctxCtx)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	defer ctx.Rollback()

	moderator := auth.UserClaimsFromContext(ctx)
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

	s.log.Printf("Document with ID %s updated by %s (remote address %s)", r.Id, moderator.Username, auth.RemoteAddressFromContext(ctx))

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
