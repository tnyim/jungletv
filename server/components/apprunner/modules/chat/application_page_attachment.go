package chat

import (
	"context"
	"fmt"
	"time"

	"github.com/bytedance/sonic"
	"github.com/dop251/goja"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/server/components/apprunner/gojautil"
	"github.com/tnyim/jungletv/server/components/apprunner/modules/pages"
	"github.com/tnyim/jungletv/server/stores/chat"
	"github.com/tnyim/jungletv/types"
	"google.golang.org/protobuf/types/known/timestamppb"
)

// MessageAttachmentTypeApplicationPage is the identifier for attachments of the application page type
const MessageAttachmentTypeApplicationPage = "apppage"

// MessageAttachmentApplicationPageStorage is the storage model for an application page attachment. Implements MessageAttachmentStorage
type MessageAttachmentApplicationPageStorage struct {
	ApplicationID      string                   `json:"application_id"`
	ApplicationVersion types.ApplicationVersion `json:"application_version"`
	PageID             string                   `json:"page_id"`
	Height             int                      `json:"height"`
}

var _ chat.MessageAttachmentStorage = &MessageAttachmentApplicationPageStorage{}

func (a MessageAttachmentApplicationPageStorage) AttachmentType() string {
	return MessageAttachmentTypeApplicationPage
}

func (a *MessageAttachmentApplicationPageStorage) SerializeForDatabase(context.Context) string {
	jsonBytes, err := sonic.Marshal(a)
	if err != nil {
		return ""
	}
	return string(jsonBytes)
}

// MessageAttachmentApplicationPageView is the view model for an application page attachment. Implements MessageAttachmentView
type MessageAttachmentApplicationPageView struct {
	pages.PageInfo
	ApplicationID      string
	PageID             string
	ApplicationVersion types.ApplicationVersion
	Height             int
}

var _ chat.MessageAttachmentView = &MessageAttachmentApplicationPageView{}

func (a *MessageAttachmentApplicationPageView) SerializeForAPI(context.Context) *proto.ChatMessageAttachment {
	return &proto.ChatMessageAttachment{
		Attachment: &proto.ChatMessageAttachment_ApplicationPage{
			ApplicationPage: &proto.ChatMessageApplicationPageAttachment{
				ApplicationId: a.ApplicationID,
				Height:        int32(a.Height),
				PageId:        a.PageID,
				PageInfo: &proto.ResolveApplicationPageResponse{
					ApplicationVersion: timestamppb.New(time.Time(a.ApplicationVersion)),
					PageTitle:          a.Title,
				},
			},
		},
	}
}

func (a *MessageAttachmentApplicationPageView) SerializeForModLog(context.Context) string {
	return fmt.Sprintf("application page %s/%s", a.ApplicationID, a.PageID)
}

func (a *MessageAttachmentApplicationPageView) SerializeForJS(ctx context.Context, vm *goja.Runtime) map[string]interface{} {
	return map[string]interface{}{
		"type":               MessageAttachmentTypeApplicationPage,
		"applicationID":      a.ApplicationID,
		"applicationVersion": gojautil.SerializeTime(vm, time.Time(a.ApplicationVersion)),
		"pageID":             a.PageID,
		"pageTitle":          a.Title,
		"height":             a.Height,
	}
}
