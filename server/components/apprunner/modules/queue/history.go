package queue

import (
	"time"

	"github.com/dop251/goja"
	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/server/auth"
	"github.com/tnyim/jungletv/server/components/apprunner/gojautil"
	"github.com/tnyim/jungletv/server/components/payment"
	"github.com/tnyim/jungletv/server/media"
	"github.com/tnyim/jungletv/types"
	"github.com/tnyim/jungletv/utils/transaction"
)

func (m *queueModule) getPlayHistoryByPerformanceTime(call goja.FunctionCall) goja.Value {
	if len(call.Arguments) < 2 {
		panic(m.runtime.NewTypeError("Missing argument"))
	}

	filters := types.GetPlayedMediaFilters{}

	filters.StartedSince, filters.StartedUntil = m.parseDatesForGetPlayHistory(call, "getPlayHistoryByPerformanceTime")

	// TODO parameters for additional filters
	return m.getPlayHistoryForFilters(filters)
}

func (m *queueModule) getPlayHistoryByRequestTime(call goja.FunctionCall) goja.Value {
	if len(call.Arguments) < 2 {
		panic(m.runtime.NewTypeError("Missing argument"))
	}

	filters := types.GetPlayedMediaFilters{}

	filters.StartedSince, filters.StartedUntil = m.parseDatesForGetPlayHistory(call, "getPlayHistoryByRequestTime")

	// TODO parameters for additional filters
	return m.getPlayHistoryForFilters(filters)
}

func (m *queueModule) parseDatesForGetPlayHistory(call goja.FunctionCall, fnName string) (time.Time, time.Time) {
	var since, until time.Time
	err := m.runtime.ExportTo(call.Argument(0), &since)
	if err != nil {
		panic(m.runtime.NewTypeError("First argument to %s must be a Date", fnName))
	}
	err = m.runtime.ExportTo(call.Argument(1), &until)
	if err != nil {
		panic(m.runtime.NewTypeError("Second argument to %s must be a Date", fnName))
	}
	return since, until
}

func (m *queueModule) getPlayHistoryForFilters(filters types.GetPlayedMediaFilters) goja.Value {
	return gojautil.DoAsyncWithTransformer(m.runtime, m.appContext.ScheduleNoError, func(actx gojautil.AsyncContext) ([]*types.PlayedMedia, gojautil.PromiseResultTransformer[[]*types.PlayedMedia]) {
		ctx, err := transaction.Begin(m.executionContext)
		if err != nil {
			panic(actx.NewGoError(stacktrace.Propagate(err, "")))
		}
		defer ctx.Commit() // read-only tx

		playedMedias, _, err := types.GetPlayedMedia(ctx, filters, nil)
		if err != nil {
			panic(actx.NewGoError(stacktrace.Propagate(err, "")))
		}

		return playedMedias, func(vm *goja.Runtime, playedMedias []*types.PlayedMedia) interface{} {
			jsMedia := make([]goja.Value, len(playedMedias))
			for i, playedMedia := range playedMedias {
				provider, ok := m.mediaProviders[playedMedia.MediaType]
				if !ok {
					panic(actx.NewGoError(stacktrace.NewError("Unknown media type %s", playedMedia.MediaType)))
				}

				mediaInfo, err := provider.BasicMediaInfoFromPlayedMedia(playedMedia)
				if err != nil {
					panic(actx.NewGoError(stacktrace.Propagate(err, "")))
				}

				performance := &performanceForJS{
					playedMedia: playedMedia,
					basicInfo:   mediaInfo,
				}

				jsMedia[i] = serializePerformance(vm, nil, performance)
			}
			return jsMedia
		}
	})
}

type performanceForJS struct {
	m           *queueModule
	playedMedia *types.PlayedMedia
	basicInfo   media.BasicInfo
}

func (p *performanceForJS) MediaInfo() media.BasicInfo {
	return p.basicInfo
}

func (p *performanceForJS) RequestedBy() auth.User {
	return auth.NewAddressOnlyUser(p.playedMedia.RequestedBy)
}

func (p *performanceForJS) RequestCost() payment.Amount {
	return payment.NewAmountFromDecimal(p.playedMedia.RequestCost)
}

func (p *performanceForJS) RequestedAt() time.Time {
	return p.playedMedia.EnqueuedAt
}

func (p *performanceForJS) Unskippable() bool {
	return p.playedMedia.Unskippable
}

func (p *performanceForJS) Played() bool {
	return p.playedMedia.EndedAt.Valid
}

func (p *performanceForJS) Playing() bool {
	return !p.Played()
}

func (p *performanceForJS) StartedAt() time.Time {
	return p.playedMedia.StartedAt
}
func (p *performanceForJS) PlayedFor() time.Duration {
	if !p.Played() {
		return time.Now().Sub(p.playedMedia.StartedAt)
	}
	return p.playedMedia.EndedAt.Time.Sub(p.playedMedia.StartedAt)
}

func (p *performanceForJS) PerformanceID() string {
	return p.playedMedia.ID
}
