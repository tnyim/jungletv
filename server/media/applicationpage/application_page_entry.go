package applicationpage

import (
	"context"
	"crypto/sha256"
	"fmt"
	"math/big"
	"time"

	"github.com/bytedance/sonic"
	"github.com/palantir/stacktrace"
	uuid "github.com/satori/go.uuid"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/server/auth"
	"github.com/tnyim/jungletv/server/components/payment"
	"github.com/tnyim/jungletv/server/media"
	"github.com/tnyim/jungletv/types"
	"google.golang.org/protobuf/types/known/timestamppb"
)

type queueEntryApplicationPage struct {
	media.CommonQueueEntry
	media.CommonInfo

	applicationID      string
	applicationVersion types.ApplicationVersion
	pageID             string
	thumbnailFileName  string

	mediaID string // lazily built by MediaID()
}

// NewApplicationPageQueueEntry is meant to be called by an application instance's queue module,
// after validating the parameters
func NewApplicationPageQueueEntry(applicationID string, applicationVersion types.ApplicationVersion, pageID, title, thumbnailFileName string,
	length time.Duration, requestedBy auth.User, requestCost payment.Amount, unskippable, concealed bool) media.QueueEntry {
	e := &queueEntryApplicationPage{
		applicationID:      applicationID,
		applicationVersion: applicationVersion,
		pageID:             pageID,
		thumbnailFileName:  thumbnailFileName,
	}
	e.InitializeBase(e)
	e.SetTitle(title)
	e.SetLength(length)

	// because these entries are not created through the usual payment ticket flow,
	// we need to create the queue ID here
	queueID := uuid.NewV4().String()

	e.ProduceMediaQueueEntry(requestedBy, requestCost, unskippable, concealed, queueID)
	return e
}

func (e *queueEntryApplicationPage) ProduceMediaQueueEntry(requestedBy auth.User, requestCost payment.Amount, unskippable, concealed bool, queueID string) media.QueueEntry {
	e.FillMediaQueueEntryFields(requestedBy, requestCost, unskippable, concealed, queueID)
	return e
}

func (e *queueEntryApplicationPage) MediaID() (types.MediaType, string) {
	if e.mediaID == "" {
		e.mediaID = fmt.Sprintf("%s/%s", e.applicationID, e.pageID)
		if len(e.mediaID) > 36 {
			h := sha256.New()
			h.Write([]byte(e.mediaID))
			e.mediaID = fmt.Sprintf("%x", h.Sum(nil))[0:36]
		}
	}
	return types.MediaTypeApplicationPage, e.mediaID
}

func (e *queueEntryApplicationPage) SerializeForAPIQueue(ctx context.Context) proto.IsQueueEntry_MediaInfo {
	info := &proto.QueueEntry_ApplicationPageData{
		ApplicationPageData: &proto.QueueApplicationPageData{
			ApplicationId:      e.applicationID,
			ApplicationVersion: timestamppb.New(time.Time(e.applicationVersion)),
			PageId:             e.pageID,
			Title:              e.Title(),
			ThumbnailFileName:  e.thumbnailFileName,
		},
	}
	return info
}

// we never actually decode this struct - entries are lost on restore
// we still serialize so that e.g. auditing and external tools can inspect the queue file and make sense of these entries
type queueEntryApplicationPageJsonRepresentation struct {
	ApplicationID      string
	ApplicationVersion types.ApplicationVersion
	PageID             string
	MediaID            string

	QueueID     string
	Type        string
	Title       string
	Duration    time.Duration
	RequestedBy string
	RequestCost *big.Int
	RequestedAt time.Time
	Unskippable bool
	Concealed   bool
	MovedBy     []string
}

func (e *queueEntryApplicationPage) MarshalJSON() ([]byte, error) {
	_, mediaID := e.MediaID()
	j, err := sonic.Marshal(queueEntryApplicationPageJsonRepresentation{
		QueueID:            e.QueueID(),
		Type:               string(types.MediaTypeApplicationPage),
		ApplicationID:      e.applicationID,
		ApplicationVersion: e.applicationVersion,
		PageID:             e.pageID,
		MediaID:            mediaID,
		Title:              e.Title(),
		Duration:           e.Length(),
		RequestedBy:        e.RequestedBy().Address(),
		RequestCost:        e.RequestCost().Int,
		RequestedAt:        e.RequestedAt(),
		Unskippable:        e.Unskippable(),
		Concealed:          e.Concealed(),
		MovedBy:            e.MovedBy(),
	})
	if err != nil {
		return nil, stacktrace.Propagate(err, "error serializing queue entry %s", e.QueueID())
	}
	return j, nil
}

func (e *queueEntryApplicationPage) FillAPITicketMediaInfo(ticket *proto.EnqueueMediaTicket) {
	// unused for this provider
}

func (e *queueEntryApplicationPage) ProduceCheckpointForAPI(ctx context.Context) *proto.MediaConsumptionCheckpoint {
	return &proto.MediaConsumptionCheckpoint{
		MediaInfo: &proto.MediaConsumptionCheckpoint_ApplicationPageData{
			ApplicationPageData: &proto.NowPlayingApplicationPageData{
				ApplicationId: e.applicationID,
				PageId:        e.pageID,
				PageInfo: &proto.ResolveApplicationPageResponse{
					PageTitle:          e.Title(),
					ApplicationVersion: timestamppb.New(time.Time(e.applicationVersion)),
				},
			},
		},
	}
}
