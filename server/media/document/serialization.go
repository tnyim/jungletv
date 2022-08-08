package document

import (
	"context"
	"encoding/json"

	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/server/media"
	"github.com/tnyim/jungletv/types"
	"github.com/tnyim/jungletv/utils/transaction"
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

func (s *DocumentProvider) serializeProtoTrackData(playedMedia *types.PlayedMedia) (*proto.QueueDocumentData, error) {
	var info dbMediaInfo
	err := playedMedia.MediaInfo.Unmarshal(&info)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	return &proto.QueueDocumentData{
		Title: info.Title,
	}, nil
}

func (s *DocumentProvider) SerializeReceivedRewardMediaInfo(playedMedia *types.PlayedMedia) (proto.IsReceivedReward_MediaInfo, error) {
	info, err := s.serializeProtoTrackData(playedMedia)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	return &proto.ReceivedReward_DocumentData{
		DocumentData: info,
	}, nil
}

func (s *DocumentProvider) SerializePlayedMediaMediaInfo(playedMedia *types.PlayedMedia) (proto.IsPlayedMedia_MediaInfo, error) {
	info, err := s.serializeProtoTrackData(playedMedia)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	return &proto.PlayedMedia_DocumentData{
		DocumentData: info,
	}, nil
}

func (s *DocumentProvider) SerializeUserProfileResponseFeaturedMedia(playedMedia *types.PlayedMedia) (proto.IsUserProfileResponse_FeaturedMedia, error) {
	info, err := s.serializeProtoTrackData(playedMedia)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	return &proto.UserProfileResponse_DocumentData{
		DocumentData: info,
	}, nil
}

func (s *DocumentProvider) UnmarshalQueueEntryJSON(ctxCtx context.Context, b []byte) (media.QueueEntry, error) {
	v := &queueEntryDocument{}
	err := json.Unmarshal(b, &v)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	defer ctx.Commit() // read-only tx

	documents, err := types.GetDocumentsWithIDs(ctx, []string{v.documentID})
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	document, ok := documents[v.documentID]
	if !ok {
		return nil, stacktrace.NewError("document in queue not found in database")
	}

	v.document = document

	return v, nil
}

// TODO remove this once simplified
func (s *DocumentProvider) CanUnmarshalQueueEntryJSONType(t string) bool {
	return t == string(types.MediaTypeDocument)
}
