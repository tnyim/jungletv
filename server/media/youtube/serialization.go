package youtube

import (
	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/proto"
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
