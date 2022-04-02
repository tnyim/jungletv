package chat

import (
	"context"

	"github.com/tnyim/jungletv/proto"
)

// MessageAttachmentStorage represents the submission and storage model for an attachment
type MessageAttachmentStorage interface {
	SerializeForDatabase(ctx context.Context) string
	PointsCost() int
}

// MessageAttachmentView represents the view model for an attachment
type MessageAttachmentView interface {
	SerializeForAPI(ctx context.Context) *proto.ChatMessageAttachment
}

// MessageAttachmentTenorGifStorage is the storage model for a Tenor GIF attachment. Implements MessageAttachmentStorage
type MessageAttachmentTenorGifStorage struct {
	ID string
}

var _ MessageAttachmentStorage = &MessageAttachmentTenorGifStorage{}

func (a *MessageAttachmentTenorGifStorage) SerializeForDatabase(context.Context) string {
	return "tenorgif:" + a.ID
}

func (a *MessageAttachmentTenorGifStorage) PointsCost() int {
	return 100
}

// MessageAttachmentTenorGifView is the view model for a Tenor GIF attachment. Implements MessageAttachmentView
type MessageAttachmentTenorGifView struct {
	ID       string
	VideoURL string
	Title    string
	Width    int
	Height   int
}

var _ MessageAttachmentView = &MessageAttachmentTenorGifView{}

func (a *MessageAttachmentTenorGifView) SerializeForAPI(context.Context) *proto.ChatMessageAttachment {
	return &proto.ChatMessageAttachment{
		Attachment: &proto.ChatMessageAttachment_TenorGif{
			TenorGif: &proto.ChatMessageTenorGifAttachment{
				Id:       a.ID,
				VideoUrl: a.VideoURL,
				Title:    a.Title,
				Width:    int32(a.Width),
				Height:   int32(a.Height),
			},
		},
	}
}
