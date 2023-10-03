package applicationpage

import (
	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/server/media"
	"github.com/tnyim/jungletv/utils/transaction"
)

// ApplicationPageProvider provides application pages as enqueuable media
type ApplicationPageProvider struct {
	mediaQueue media.MediaQueueStub
}

// NewProvider returns a new application page provider
func NewProvider() media.Provider {
	return &ApplicationPageProvider{}
}

func (c *ApplicationPageProvider) SetMediaQueue(mediaQueue media.MediaQueueStub) {
	c.mediaQueue = mediaQueue
}

func (c *ApplicationPageProvider) CanHandleRequestType(mediaParameters proto.IsEnqueueMediaRequest_MediaInfo) bool {
	return false
}

func (c *ApplicationPageProvider) BeginEnqueueRequest(ctx *transaction.WrappingContext, mediaParameters proto.IsEnqueueMediaRequest_MediaInfo) (media.InitialInfo, media.EnqueueRequestCreationResult, error) {
	return nil, media.EnqueueRequestCreationFailed, stacktrace.NewError("not supported")
}

func (c *ApplicationPageProvider) ContinueEnqueueRequest(ctx *transaction.WrappingContext, genericInfo media.InitialInfo, unskippable, concealed, anonymous,
	allowUnpopular, skipLengthChecks, skipDuplicationChecks bool) (media.EnqueueRequest, media.EnqueueRequestCreationResult, error) {
	return nil, media.EnqueueRequestCreationFailed, stacktrace.NewError("not supported")
}
