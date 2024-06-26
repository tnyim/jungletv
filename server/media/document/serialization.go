package document

import (
	"context"

	"github.com/bytedance/sonic"
	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/server/media"
	"github.com/tnyim/jungletv/types"
)

func (e *queueEntryDocument) ProducePlayedMedia() (*types.PlayedMedia, error) {
	playedMedia, err := e.BaseProducePlayedMedia(types.MediaTypeDocument, e.document.ID, dbMediaInfo{
		Title: e.Title(),
	})
	return playedMedia, stacktrace.Propagate(err, "")
}

type dbMediaInfo struct {
	Title string `json:"title"`
}

func (s *DocumentProvider) serializeProtoDocumentData(playedMedia *types.PlayedMedia) (*proto.QueueDocumentData, error) {
	var info dbMediaInfo
	err := playedMedia.MediaInfo.Unmarshal(&info)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	return &proto.QueueDocumentData{
		Title: info.Title,
		Id:    playedMedia.MediaID,
	}, nil
}

func (s *DocumentProvider) SerializePlayedMediaMediaInfo(playedMedia *types.PlayedMedia) (proto.IsPlayedMedia_MediaInfo, error) {
	info, err := s.serializeProtoDocumentData(playedMedia)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	return &proto.PlayedMedia_DocumentData{
		DocumentData: info,
	}, nil
}

func (s *DocumentProvider) SerializeUserProfileResponseFeaturedMedia(playedMedia *types.PlayedMedia) (proto.IsUserProfileResponse_FeaturedMedia, error) {
	info, err := s.serializeProtoDocumentData(playedMedia)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	return &proto.UserProfileResponse_DocumentData{
		DocumentData: info,
	}, nil
}

func (s *DocumentProvider) UnmarshalQueueEntryJSON(ctxCtx context.Context, b []byte) (media.QueueEntry, bool, error) {
	v := &queueEntryDocument{
		backgroundContext: s.queueContext,
	}
	err := sonic.Unmarshal(b, &v)
	if err != nil {
		return nil, false, stacktrace.Propagate(err, "")
	}

	return v, true, nil
}

func (s *DocumentProvider) BasicMediaInfoFromPlayedMedia(playedMedia *types.PlayedMedia) (media.BasicInfo, error) {
	var info dbMediaInfo
	err := playedMedia.MediaInfo.Unmarshal(&info)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	// let's just reuse existing types, it's safe because we return a media.BasicInfo,
	// so we are sure that the methods that depend on the fields don't fill won't be called
	// (well, ideally - unless someone messes up and decides to cast the interface improperly)

	v := &queueEntryDocument{
		CommonInfo: media.CommonMediaInfoFromPlayedMedia(playedMedia, info.Title),
		document:   &types.Document{ID: playedMedia.MediaID},
	}

	return v, nil
}
