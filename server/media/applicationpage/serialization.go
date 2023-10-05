package applicationpage

import (
	"context"
	"math"

	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/server/media"
	"github.com/tnyim/jungletv/types"
)

func (e *queueEntryApplicationPage) ProducePlayedMedia() (*types.PlayedMedia, error) {
	mediaType, mediaID := e.MediaID()
	playedMedia, err := e.BaseProducePlayedMedia(mediaType, mediaID, dbMediaInfo{
		ApplicationID:      e.applicationID,
		ApplicationVersion: e.applicationVersion,
		PageID:             e.pageID,
		Title:              e.Title(),
		ThumbnailFile:      e.thumbnailFileName,
	})
	if e.Length() == math.MaxInt64 {
		playedMedia.MediaLength = 0
	}
	return playedMedia, stacktrace.Propagate(err, "")
}

type dbMediaInfo struct {
	ApplicationID      string                   `json:"application_id"`
	ApplicationVersion types.ApplicationVersion `json:"application_version"`
	PageID             string                   `json:"page_id"`
	Title              string                   `json:"title"`
	ThumbnailFile      string                   `json:"thumbnail_file"`
}

func (s *ApplicationPageProvider) serializeProtoApplicationPageData(playedMedia *types.PlayedMedia) (*proto.QueueApplicationPageData, error) {
	var info dbMediaInfo
	err := playedMedia.MediaInfo.Unmarshal(&info)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	return &proto.QueueApplicationPageData{
		ApplicationId: info.ApplicationID,
		PageId:        info.PageID,
		Title:         info.Title,
		// Thumbnail is only available while the application runs, don't send it
	}, nil
}

func (s *ApplicationPageProvider) SerializeReceivedRewardMediaInfo(playedMedia *types.PlayedMedia) (proto.IsReceivedReward_MediaInfo, error) {
	info, err := s.serializeProtoApplicationPageData(playedMedia)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	return &proto.ReceivedReward_ApplicationPageData{
		ApplicationPageData: info,
	}, nil
}

func (s *ApplicationPageProvider) SerializePlayedMediaMediaInfo(playedMedia *types.PlayedMedia) (proto.IsPlayedMedia_MediaInfo, error) {
	info, err := s.serializeProtoApplicationPageData(playedMedia)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	return &proto.PlayedMedia_ApplicationPageData{
		ApplicationPageData: info,
	}, nil
}

func (s *ApplicationPageProvider) SerializeUserProfileResponseFeaturedMedia(playedMedia *types.PlayedMedia) (proto.IsUserProfileResponse_FeaturedMedia, error) {
	// application pages may only be enqueued by applications, which do not have a regular profile and can't pin featured media
	return nil, stacktrace.NewError("not supported")
}

func (s *ApplicationPageProvider) UnmarshalQueueEntryJSON(ctxCtx context.Context, b []byte) (media.QueueEntry, bool, error) {
	// application pages become invalid after a server restart as all application state is lost,
	// so we want all application pages to disappear from queue
	return nil, false, nil
}
