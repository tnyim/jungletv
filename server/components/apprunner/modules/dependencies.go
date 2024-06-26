package modules

import (
	"context"

	"github.com/DisgoOrg/disgohook/api"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/server/auth"
	"github.com/tnyim/jungletv/server/components/chatmanager"
	"github.com/tnyim/jungletv/server/components/mediaqueue"
	"github.com/tnyim/jungletv/server/components/payment"
	"github.com/tnyim/jungletv/server/components/pointsmanager"
	"github.com/tnyim/jungletv/server/components/pricer"
	"github.com/tnyim/jungletv/server/components/rewards"
	"github.com/tnyim/jungletv/server/components/skipmanager"
	"github.com/tnyim/jungletv/server/components/stats"
	"github.com/tnyim/jungletv/server/media"
	"github.com/tnyim/jungletv/server/usercache"
	"github.com/tnyim/jungletv/types"
)

// Dependencies is a "everything and the kitchen sink" struct used for injection of singleton dependencies in modules
type Dependencies struct {
	ModLogWebhook                api.WebhookClient
	ChatManager                  *chatmanager.Manager
	PointsManager                *pointsmanager.Manager
	MediaQueue                   *mediaqueue.MediaQueue
	MediaProviders               map[types.MediaType]media.Provider
	Pricer                       *pricer.Pricer
	SkipManager                  *skipmanager.Manager
	OtherMediaQueueMethods       OtherMediaQueueMethods
	PaymentAccountPool           *payment.PaymentAccountPool
	DefaultAccountRepresentative string
	UserCache                    usercache.UserCache
	RewardsHandler               *rewards.Handler
	StatsRegistry                *stats.Registry
}

type OtherMediaQueueMethods interface {
	MediaEnqueuingPermission() proto.AllowedMediaEnqueuingType
	SetMediaEnqueuingPermission(permission proto.AllowedMediaEnqueuingType, password string)
	NewQueueEntriesAllUnskippable() bool
	SetNewQueueEntriesAllUnskippable(bool)
	MoveQueueEntryWithCost(ctx context.Context, entryID string, up bool, user auth.User) error
}
