package chat

import (
	"context"
	"fmt"

	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/types"
)

// MessageAttachmentStorage represents the submission and storage model for an attachment
type MessageAttachmentStorage interface {
	SerializeForDatabase(ctx context.Context) string
}

// MessageAttachmentStorage represents the submission and storage model for an attachment that has a points cost
type MessageAttachmentStorageWithCost interface {
	MessageAttachmentStorage
	PointsCost() int
	PointsTxType() types.PointsTxType
}

// MessageAttachmentView represents the view model for an attachment
type MessageAttachmentView interface {
	SerializeForAPI(ctx context.Context) *proto.ChatMessageAttachment
	SerializeForModLog(ctx context.Context) string
	SerializeForJS(ctx context.Context) map[string]interface{}
}

// MessageAttachmentTenorGifStorage is the storage model for a Tenor GIF attachment. Implements MessageAttachmentStorage
type MessageAttachmentTenorGifStorage struct {
	ID   string
	Cost int
}

var _ MessageAttachmentStorage = &MessageAttachmentTenorGifStorage{}

func (a *MessageAttachmentTenorGifStorage) SerializeForDatabase(context.Context) string {
	return "tenorgif:" + a.ID
}

func (a *MessageAttachmentTenorGifStorage) PointsCost() int {
	return a.Cost
}

func (a *MessageAttachmentTenorGifStorage) PointsTxType() types.PointsTxType {
	return types.PointsTxTypeChatGifAttachment
}

// MessageAttachmentTenorGifView is the view model for a Tenor GIF attachment. Implements MessageAttachmentView
type MessageAttachmentTenorGifView struct {
	ID               string
	VideoURL         string
	VideoFallbackURL string
	Title            string
	Width            int
	Height           int
}

var _ MessageAttachmentView = &MessageAttachmentTenorGifView{}

func (a *MessageAttachmentTenorGifView) SerializeForAPI(context.Context) *proto.ChatMessageAttachment {
	return &proto.ChatMessageAttachment{
		Attachment: &proto.ChatMessageAttachment_TenorGif{
			TenorGif: &proto.ChatMessageTenorGifAttachment{
				Id:               a.ID,
				VideoUrl:         a.VideoURL,
				VideoFallbackUrl: a.VideoFallbackURL,
				Title:            a.Title,
				Width:            int32(a.Width),
				Height:           int32(a.Height),
			},
		},
	}
}

func (a *MessageAttachmentTenorGifView) SerializeForModLog(context.Context) string {
	return fmt.Sprintf("https://tenor.com/view/%s", a.ID)
}

func (a *MessageAttachmentTenorGifView) SerializeForJS(context.Context) map[string]interface{} {
	return map[string]interface{}{
		"type":             "tenorgif",
		"id":               a.ID,
		"videoURL":         a.VideoURL,
		"videoFallbackURL": a.VideoFallbackURL,
		"title":            a.Title,
		"width":            a.Width,
		"height":           a.Height,
	}
}
