package chatmanager

import (
	"context"
	"strings"

	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/server/stores/chat"
)

func (c *Manager) AttachmentLoader(ctx context.Context, attachmentString string) (chat.MessageAttachmentView, error) {
	parts := strings.SplitN(attachmentString, ":", 2)
	switch parts[0] {
	case "tenorgif":
		if len(parts) < 2 {
			return nil, stacktrace.NewError("malformed attachment string")
		}
		gif, err := c.getTenorGifInfo(ctx, parts[1])
		if err != nil {
			return nil, stacktrace.Propagate(err, "")
		}
		return gif, nil
	default:
		return nil, stacktrace.NewError("unknown attachment type")
	}
}
