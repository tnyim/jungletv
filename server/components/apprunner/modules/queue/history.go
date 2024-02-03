package queue

import (
	"math"
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

func (m *queueModule) getPlayHistory(call goja.FunctionCall) goja.Value {
	if len(call.Arguments) < 2 {
		panic(m.runtime.NewTypeError("Missing argument"))
	}

	filters := types.GetPlayedMediaFilters{
		ExcludeDisallowed:       true,
		ExcludeCurrentlyPlaying: true,
		OrderBy:                 types.GetPlayedMediaOrderByStartedAtAsc,
	}

	filters.StartedSince, filters.StartedUntil = m.parseDatesForGetPlayHistory(call, "getPlayHistory")
	pagParams := m.parseAdditionalOptionsForGetPlayHistory(call, &filters)
	return m.getPlayHistoryForFilters(filters, pagParams)
}

func (m *queueModule) getEnqueueHistory(call goja.FunctionCall) goja.Value {
	if len(call.Arguments) < 2 {
		panic(m.runtime.NewTypeError("Missing argument"))
	}

	filters := types.GetPlayedMediaFilters{
		ExcludeDisallowed:       true,
		ExcludeCurrentlyPlaying: true,
		OrderBy:                 types.GetPlayedMediaOrderByEnqueuedAtAsc,
	}

	filters.EnqueuedSince, filters.EnqueuedUntil = m.parseDatesForGetPlayHistory(call, "getEnqueueHistory")
	pagParams := m.parseAdditionalOptionsForGetPlayHistory(call, &filters)
	return m.getPlayHistoryForFilters(filters, pagParams)
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
	if since.After(until) {
		panic(m.runtime.NewTypeError("First argument to %s must correspond to a Date prior to that of the second argument", fnName))
	}
	return since, until
}

func (m *queueModule) parseAdditionalOptionsForGetPlayHistory(call goja.FunctionCall, filters *types.GetPlayedMediaFilters) *types.PaginationParams {
	var pagParams *types.PaginationParams
	if len(call.Arguments) > 2 {
		optionsMap := map[string]goja.Value{}
		err := m.runtime.ExportTo(call.Argument(2), &optionsMap)
		if err != nil {
			panic(m.runtime.NewTypeError("Third argument is not an object"))
		}

		if v, ok := optionsMap["filter"]; ok {
			filters.TextFilter = v.String()
		}
		if v, ok := optionsMap["descending"]; ok && v.ToBoolean() {
			if filters.OrderBy == types.GetPlayedMediaOrderByEnqueuedAtAsc {
				filters.OrderBy = types.GetPlayedMediaOrderByEnqueuedAtDesc
			} else {
				filters.OrderBy = types.GetPlayedMediaOrderByStartedAtDesc
			}
		}
		if v, ok := optionsMap["includeDisallowed"]; ok {
			filters.ExcludeDisallowed = !v.ToBoolean()
		}
		if v, ok := optionsMap["includePlaying"]; ok {
			filters.ExcludeCurrentlyPlaying = !v.ToBoolean()
		}
		if v, ok := optionsMap["limit"]; ok && v.ToInteger() > 0 {
			pagParams = &types.PaginationParams{
				Limit: uint64(v.ToInteger()),
			}
		}
		if v, ok := optionsMap["offset"]; ok && v.ToInteger() >= 0 {
			if pagParams != nil {
				pagParams.Offset = uint64(v.ToInteger())
			} else {
				pagParams = &types.PaginationParams{
					Offset: uint64(v.ToInteger()),
					Limit:  math.MaxInt64, // MaxUint64 is seemingly too large for Postgres
				}
			}
		}
	}
	return pagParams
}

func (m *queueModule) getPlayHistoryForFilters(filters types.GetPlayedMediaFilters, pagParams *types.PaginationParams) goja.Value {
	return gojautil.DoAsyncWithTransformer(m.runtime, m.appContext.ScheduleNoError, func(actx gojautil.AsyncContext) ([]*types.PlayedMedia, gojautil.PromiseResultTransformer[[]*types.PlayedMedia]) {
		ctx, err := transaction.Begin(m.executionContext)
		if err != nil {
			panic(actx.NewGoError(stacktrace.Propagate(err, "")))
		}
		defer ctx.Commit() // read-only tx

		playedMedias, _, err := types.GetPlayedMedia(ctx, filters, pagParams)
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

				jsMedia[i] = m.serializePerformance(vm, nil, performance)
			}
			return jsMedia
		}
	})
}

type performanceForJS struct {
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
		return time.Since(p.playedMedia.StartedAt)
	}
	return p.playedMedia.EndedAt.Time.Sub(p.playedMedia.StartedAt)
}

func (p *performanceForJS) PerformanceID() string {
	return p.playedMedia.ID
}
