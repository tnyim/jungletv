package youtube

import (
	"context"

	"github.com/bytedance/sonic"
	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/server/media"
	"github.com/tnyim/jungletv/types"
)

func (e *queueEntryYouTubeVideo) ProducePlayedMedia() (*types.PlayedMedia, error) {
	playedMedia, err := e.BaseProducePlayedMedia(types.MediaTypeYouTubeVideo, e.id, dbMediaInfo{
		Title: e.Title(),
	})
	return playedMedia, stacktrace.Propagate(err, "")
}

type dbMediaInfo struct {
	Title string `json:"title"`
}

func (s *VideoProvider) SerializeReceivedRewardMediaInfo(playedMedia *types.PlayedMedia) (proto.IsReceivedReward_MediaInfo, error) {
	var info dbMediaInfo
	err := playedMedia.MediaInfo.Unmarshal(&info)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	return &proto.ReceivedReward_YoutubeVideoData{
		YoutubeVideoData: &proto.QueueYouTubeVideoData{
			Id:    playedMedia.MediaID,
			Title: info.Title,
		},
	}, nil
}

func (s *VideoProvider) SerializePlayedMediaMediaInfo(playedMedia *types.PlayedMedia) (proto.IsPlayedMedia_MediaInfo, error) {
	var info dbMediaInfo
	err := playedMedia.MediaInfo.Unmarshal(&info)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	return &proto.PlayedMedia_YoutubeVideoData{
		YoutubeVideoData: &proto.QueueYouTubeVideoData{
			Id:    playedMedia.MediaID,
			Title: info.Title,
		},
	}, nil
}

func (s *VideoProvider) SerializeUserProfileResponseFeaturedMedia(playedMedia *types.PlayedMedia) (proto.IsUserProfileResponse_FeaturedMedia, error) {
	var info dbMediaInfo
	err := playedMedia.MediaInfo.Unmarshal(&info)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	return &proto.UserProfileResponse_YoutubeVideoData{
		YoutubeVideoData: &proto.QueueYouTubeVideoData{
			Id:    playedMedia.MediaID,
			Title: info.Title,
		},
	}, nil
}

func (s *VideoProvider) UnmarshalQueueEntryJSON(ctx context.Context, b []byte) (media.QueueEntry, bool, error) {
	v := &queueEntryYouTubeVideo{}
	err := sonic.Unmarshal(b, &v)
	if err != nil {
		return nil, false, stacktrace.Propagate(err, "")
	}
	return v, true, nil
}

func (s *VideoProvider) BasicMediaInfoFromPlayedMedia(playedMedia *types.PlayedMedia) (media.BasicInfo, error) {
	var info dbMediaInfo
	err := playedMedia.MediaInfo.Unmarshal(&info)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	// let's just reuse existing types, it's safe because we return a media.BasicInfo,
	// so we are sure that the methods that depend on the fields don't fill won't be called
	// (well, ideally - unless someone messes up and decides to cast the interface improperly)

	v := &queueEntryYouTubeVideo{
		CommonInfo: media.CommonMediaInfoFromPlayedMedia(playedMedia, info.Title),
		id:         playedMedia.MediaID,
	}

	return v, nil
}
