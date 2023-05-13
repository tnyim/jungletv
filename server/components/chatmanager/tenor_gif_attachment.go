package chatmanager

import (
	"context"
	"fmt"
	"time"

	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/server/stores/chat"
	"github.com/tnyim/jungletv/types"
)

// MessageAttachmentTypeTenorGif is the identifier for attachments of the Tenor GIF type
const MessageAttachmentTypeTenorGif = "tenorgif"

// MessageAttachmentTenorGifStorage is the storage model for a Tenor GIF attachment. Implements MessageAttachmentStorageWithCost
type MessageAttachmentTenorGifStorage struct {
	ID   string
	Cost int
}

var _ chat.MessageAttachmentStorageWithCost = &MessageAttachmentTenorGifStorage{}

func (a MessageAttachmentTenorGifStorage) AttachmentType() string {
	return MessageAttachmentTypeTenorGif
}

func (a *MessageAttachmentTenorGifStorage) SerializeForDatabase(context.Context) string {
	return a.ID
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

var _ chat.MessageAttachmentView = &MessageAttachmentTenorGifView{}

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

func (a *MessageAttachmentTenorGifView) SerializeForJS(context.Context, func(time.Time) interface{}) map[string]interface{} {
	return map[string]interface{}{
		"type":             MessageAttachmentTypeTenorGif,
		"id":               a.ID,
		"videoURL":         a.VideoURL,
		"videoFallbackURL": a.VideoFallbackURL,
		"title":            a.Title,
		"width":            a.Width,
		"height":           a.Height,
	}
}
