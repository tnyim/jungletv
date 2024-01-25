package soundcloud

import (
	"context"

	"github.com/bytedance/sonic"
	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/server/media"
	"github.com/tnyim/jungletv/types"
)

func (e *queueEntrySoundCloudTrack) ProducePlayedMedia() (*types.PlayedMedia, error) {
	playedMedia, err := e.BaseProducePlayedMedia(types.MediaTypeSoundCloudTrack, e.id, dbMediaInfo{
		Title:     e.Title(),
		Artist:    e.artist,
		Uploader:  e.uploader,
		Permalink: e.permalink,
	})
	return playedMedia, stacktrace.Propagate(err, "")
}

type dbMediaInfo struct {
	Title     string `json:"title"`
	Artist    string `json:"artist"`
	Uploader  string `json:"uploader"`
	Permalink string `json:"permalink"`
}

func (s *TrackProvider) serializeProtoTrackData(playedMedia *types.PlayedMedia) (*proto.QueueSoundCloudTrackData, error) {
	var info dbMediaInfo
	err := playedMedia.MediaInfo.Unmarshal(&info)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	return &proto.QueueSoundCloudTrackData{
		Id:        playedMedia.MediaID,
		Title:     info.Title,
		Artist:    info.Artist,
		Uploader:  info.Uploader,
		Permalink: info.Permalink,
	}, nil
}

func (s *TrackProvider) SerializeReceivedRewardMediaInfo(playedMedia *types.PlayedMedia) (proto.IsReceivedReward_MediaInfo, error) {
	info, err := s.serializeProtoTrackData(playedMedia)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	return &proto.ReceivedReward_SoundcloudTrackData{
		SoundcloudTrackData: info,
	}, nil
}

func (s *TrackProvider) SerializePlayedMediaMediaInfo(playedMedia *types.PlayedMedia) (proto.IsPlayedMedia_MediaInfo, error) {
	info, err := s.serializeProtoTrackData(playedMedia)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	return &proto.PlayedMedia_SoundcloudTrackData{
		SoundcloudTrackData: info,
	}, nil
}

func (s *TrackProvider) SerializeUserProfileResponseFeaturedMedia(playedMedia *types.PlayedMedia) (proto.IsUserProfileResponse_FeaturedMedia, error) {
	info, err := s.serializeProtoTrackData(playedMedia)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	return &proto.UserProfileResponse_SoundcloudTrackData{
		SoundcloudTrackData: info,
	}, nil
}

func (s *TrackProvider) UnmarshalQueueEntryJSON(ctx context.Context, b []byte) (media.QueueEntry, bool, error) {
	v := &queueEntrySoundCloudTrack{}
	err := sonic.Unmarshal(b, &v)
	if err != nil {
		return nil, false, stacktrace.Propagate(err, "")
	}
	return v, true, nil
}

func (s *TrackProvider) BasicMediaInfoFromPlayedMedia(playedMedia *types.PlayedMedia) (media.BasicInfo, error) {

	var info dbMediaInfo
	err := playedMedia.MediaInfo.Unmarshal(&info)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	// let's just reuse existing types, it's safe because we return a media.BasicInfo,
	// so we are sure that the methods that depend on the fields don't fill won't be called
	// (well, ideally - unless someone messes up and decides to cast the interface improperly)

	v := &queueEntrySoundCloudTrack{
		CommonInfo: media.CommonMediaInfoFromPlayedMedia(playedMedia, info.Title),
		id:         playedMedia.MediaID,
		artist:     info.Artist,
		permalink:  info.Permalink,
		uploader:   info.Uploader,
	}

	return v, nil
}
