package document

import (
	"context"
	"time"

	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/server/auth"
	authinterceptor "github.com/tnyim/jungletv/server/interceptors/auth"
	"github.com/tnyim/jungletv/server/media"
	"github.com/tnyim/jungletv/types"
	"github.com/tnyim/jungletv/utils/transaction"
)

// DocumentProvider provides document-based media
type DocumentProvider struct {
	queueContext context.Context
	mediaQueue   media.MediaQueueStub
}

// NewProvider returns a new document provider
func NewProvider(ctx context.Context) media.Provider {
	return &DocumentProvider{
		queueContext: ctx,
	}
}

func (c *DocumentProvider) SetMediaQueue(mediaQueue media.MediaQueueStub) {
	c.mediaQueue = mediaQueue
}

func (c *DocumentProvider) CanHandleRequestType(mediaParameters proto.IsEnqueueMediaRequest_MediaInfo) bool {
	_, ok := mediaParameters.(*proto.EnqueueMediaRequest_DocumentData)
	return ok
}

type initialInfo struct {
	parameters *proto.EnqueueMediaRequest_DocumentData
	document   *types.Document
}

func (i *initialInfo) MediaID() (types.MediaType, string) {
	return types.MediaTypeDocument, i.parameters.DocumentData.DocumentId
}

func (i *initialInfo) Title() string {
	return i.parameters.DocumentData.Title
}

func (i *initialInfo) Collections() []media.CollectionKey {
	return []media.CollectionKey{}
}

func (c *DocumentProvider) BeginEnqueueRequest(ctx transaction.WrappingContext, mediaParameters proto.IsEnqueueMediaRequest_MediaInfo) (media.InitialInfo, media.EnqueueRequestCreationResult, error) {
	ctx, err := transaction.Begin(ctx)
	if err != nil {
		return nil, media.EnqueueRequestCreationFailed, stacktrace.Propagate(err, "")
	}
	defer ctx.Commit() // read-only tx

	user := authinterceptor.UserFromContext(ctx)
	if !auth.UserPermissionLevelIsAtLeast(user, auth.AdminPermissionLevel) && user.ApplicationID() == "" {
		return nil, media.EnqueueRequestCreationFailed, nil
	}

	documentParameters, ok := mediaParameters.(*proto.EnqueueMediaRequest_DocumentData)
	if !ok {
		return nil, media.EnqueueRequestCreationFailed, stacktrace.NewError("invalid parameter type for document provider")
	}

	// confirm that a document with this ID exists
	documents, err := types.GetDocumentsWithIDs(ctx, []string{documentParameters.DocumentData.DocumentId})
	if err != nil {
		return nil, media.EnqueueRequestCreationFailed, stacktrace.Propagate(err, "")
	}
	document, ok := documents[documentParameters.DocumentData.DocumentId]
	if !ok {
		return nil, media.EnqueueRequestCreationFailedMediumNotFound, nil
	}

	if !document.Public {
		return nil, media.EnqueueRequestCreationFailedMediumIsNotEmbeddable, nil
	}

	return &initialInfo{
		parameters: documentParameters,
		document:   document,
	}, media.EnqueueRequestCreationSucceeded, nil
}

func (c *DocumentProvider) ContinueEnqueueRequest(ctx transaction.WrappingContext, genericInfo media.InitialInfo, unskippable, concealed, anonymous,
	allowUnpopular, skipLengthChecks, skipDuplicationChecks bool) (media.EnqueueRequest, media.EnqueueRequestCreationResult, error) {
	preInfo, ok := genericInfo.(*initialInfo)
	if !ok {
		return nil, media.EnqueueRequestCreationFailed, stacktrace.NewError("unexpected type")
	}

	duration := 5 * time.Minute
	if preInfo.parameters.DocumentData.Duration != nil {
		duration = preInfo.parameters.DocumentData.Duration.AsDuration()
	}

	request := &queueEntryDocument{
		document:          preInfo.document,
		backgroundContext: c.queueContext,
	}
	request.InitializeBase(request, request)
	request.SetTitle(preInfo.parameters.DocumentData.Title)
	request.SetLength(duration)
	request.SetOffset(0)
	request.SetUnskippable(unskippable)
	request.SetConcealed(concealed)

	userClaims := authinterceptor.UserFromContext(ctx)
	if userClaims != nil && !anonymous {
		request.SetRequestedBy(userClaims)
	}

	return request, media.EnqueueRequestCreationSucceeded, nil
}
