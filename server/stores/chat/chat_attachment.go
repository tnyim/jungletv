package chat

import (
	"context"
	"time"

	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/types"
)

// MessageAttachmentStorage represents the submission and storage model for an attachment
type MessageAttachmentStorage interface {
	AttachmentType() string
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
	SerializeForJS(ctx context.Context, dateSerializer func(time.Time) interface{}) map[string]interface{}
}
