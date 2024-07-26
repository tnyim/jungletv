package applicationpage

import (
	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/server/media"
	"github.com/tnyim/jungletv/types"
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

func (c *ApplicationPageProvider) BeginEnqueueRequest(ctx transaction.WrappingContext, mediaParameters proto.IsEnqueueMediaRequest_MediaInfo) (media.InitialInfo, media.EnqueueRequestCreationResult, error) {
	return nil, media.EnqueueRequestCreationFailed, stacktrace.NewError("not supported")
}

func (c *ApplicationPageProvider) ContinueEnqueueRequest(ctx transaction.WrappingContext, genericInfo media.InitialInfo, unskippable, concealed, anonymous,
	allowUnpopular, skipLengthChecks, skipDuplicationChecks bool) (media.EnqueueRequest, media.EnqueueRequestCreationResult, error) {
	return nil, media.EnqueueRequestCreationFailed, stacktrace.NewError("not supported")
}

func (s *ApplicationPageProvider) BasicMediaInfoFromPlayedMedia(playedMedia *types.PlayedMedia) (media.BasicInfo, error) {
	var info dbMediaInfo
	err := playedMedia.MediaInfo.Unmarshal(&info)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	// let's just reuse existing types, it's safe because we return a media.BasicInfo,
	// so we are sure that the methods that depend on the fields don't fill won't be called
	// (well, ideally - unless someone messes up and decides to cast the interface improperly)

	v := &queueEntryApplicationPage{
		CommonInfo:         media.CommonMediaInfoFromPlayedMedia(playedMedia, info.Title),
		applicationID:      info.ApplicationID,
		applicationVersion: info.ApplicationVersion,
		pageID:             info.PageID,
		thumbnailFileName:  info.ThumbnailFile,
	}

	return v, nil
}
