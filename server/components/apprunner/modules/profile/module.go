package profile

import (
	"context"
	"fmt"
	"sync"
	"time"

	"github.com/dop251/goja"
	"github.com/dop251/goja_nodejs/require"
	"github.com/palantir/stacktrace"
	"github.com/samber/lo"
	"github.com/tnyim/jungletv/server/auth"
	"github.com/tnyim/jungletv/server/components/apprunner/gojautil"
	"github.com/tnyim/jungletv/server/components/apprunner/modules"
	"github.com/tnyim/jungletv/server/components/chatmanager"
	"github.com/tnyim/jungletv/server/components/payment"
	"github.com/tnyim/jungletv/types"
	"github.com/tnyim/jungletv/utils/transaction"
)

// ModuleName is the name by which this module can be require()d in a script
const ModuleName = "jungletv:profile"

type profileModule struct {
	runtime    *goja.Runtime
	appContext modules.ApplicationContext

	userSerializer gojautil.UserSerializer
	chatManager    *chatmanager.Manager
	ctx            context.Context // just to pass the sqalx node around...
}

// New returns a new profile module
func New(appContext modules.ApplicationContext, userSerializer gojautil.UserSerializer, chatManager *chatmanager.Manager) modules.NativeModule {
	return &profileModule{
		appContext:     appContext,
		userSerializer: userSerializer,
		chatManager:    chatManager,
	}
}

func (m *profileModule) IsNodeBuiltin() bool {
	return false
}

func (m *profileModule) ModuleLoader() require.ModuleLoader {
	return func(runtime *goja.Runtime, module *goja.Object) {
		m.runtime = runtime
		exports := module.Get("exports").(*goja.Object)
		exports.Set("getUser", m.getUser)
		exports.Set("getProfile", m.getProfile)
		exports.Set("setProfileFeaturedMedia", m.setProfileFeaturedMedia)
		exports.Set("setProfileBiography", m.setProfileBiography)
		exports.Set("clearProfile", m.clearProfile)
		exports.Set("setUserNickname", m.setUserNickname)
		exports.Set("getStatistics", m.getStatistics)
	}
}
func (m *profileModule) ModuleName() string {
	return ModuleName
}
func (m *profileModule) AutoRequire() (bool, string) {
	return false, ""
}
func (m *profileModule) ExecutionResumed(ctx context.Context, _ *sync.WaitGroup, runtime *goja.Runtime) {
	m.runtime = runtime
	m.ctx = ctx
}

func (m *profileModule) getUser(call goja.FunctionCall) goja.Value {
	if len(call.Arguments) < 1 {
		panic(m.runtime.NewTypeError("Missing argument"))
	}
	userAddress := call.Argument(0).String()

	gojautil.ValidateBananoAddress(m.runtime, userAddress, "Invalid user address")

	return m.userSerializer.SerializeUser(m.runtime, auth.NewAddressOnlyUser(userAddress))
}

func (m *profileModule) getProfile(call goja.FunctionCall) goja.Value {
	if len(call.Arguments) < 1 {
		panic(m.runtime.NewTypeError("Missing argument"))
	}
	userAddress := call.Argument(0).String()

	gojautil.ValidateBananoAddress(m.runtime, userAddress, "Invalid user address")

	return gojautil.DoAsync(m.runtime, m.appContext.ScheduleNoError, func(actx gojautil.AsyncContext) map[string]interface{} {
		ctx, err := transaction.Begin(m.ctx)
		if err != nil {
			panic(actx.NewGoError(stacktrace.Propagate(err, "")))
		}
		defer ctx.Commit() // read-only tx

		profile, err := types.GetUserProfileForAddress(ctx, userAddress)
		if err != nil {
			panic(actx.NewGoError(stacktrace.Propagate(err, "")))
		}

		result := map[string]interface{}{
			"biography":       profile.Biography,
			"featuredMediaID": goja.Undefined(),
		}
		if profile.FeaturedMedia != nil {
			result["featuredMediaID"] = *profile.FeaturedMedia
		}
		return result
	})
}

func (m *profileModule) setProfileFeaturedMedia(call goja.FunctionCall) goja.Value {
	if len(call.Arguments) < 2 {
		panic(m.runtime.NewTypeError("Missing argument"))
	}
	userAddress := call.Argument(0).String()
	var mediaID *string
	mediaValue := call.Argument(1)
	if !goja.IsUndefined(mediaValue) && !goja.IsNull(mediaValue) && mediaValue.String() != "" {
		mediaID = lo.ToPtr(mediaValue.String())
	}

	return gojautil.DoAsync(m.runtime, m.appContext.ScheduleNoError, func(actx gojautil.AsyncContext) goja.Value {
		ctx, err := transaction.Begin(m.ctx)
		if err != nil {
			panic(actx.NewGoError(stacktrace.Propagate(err, "")))
		}
		defer ctx.Rollback()

		profile, err := types.GetUserProfileForAddress(ctx, userAddress)
		if err != nil {
			panic(actx.NewGoError(stacktrace.Propagate(err, "")))
		}

		if mediaID != nil {
			// confirm that the media ID exists
			playedMedias, err := types.GetPlayedMediaWithIDs(ctx, []string{*mediaID})
			if err != nil {
				panic(actx.NewGoError(stacktrace.Propagate(err, "")))
			}
			playedMedia, ok := playedMedias[*mediaID]
			if !ok {
				panic(actx.NewTypeError("Media not found"))
			}

			if playedMedia.MediaType == types.MediaTypeApplicationPage {
				// maybe in the future, and only for pages belonging to this application
				// there are some interesting use cases, like applications being able to show a detailed "documentation page" or a status page of sorts in their profile
				// this is always tricky because the application needs to be running for the page to be displayed,
				// and a page ID might refer to different pages depending on app version (which might make sense but needs to be documented nevertheless)
				panic(actx.NewTypeError("Media type not allowed"))
			}

			allowed, err := types.IsMediaAllowed(ctx, playedMedia.MediaType, playedMedia.MediaID)
			if err != nil {
				panic(actx.NewGoError(stacktrace.Propagate(err, "")))
			}
			if !allowed {
				panic(actx.NewTypeError("Media not allowed"))
			}
		}
		profile.FeaturedMedia = mediaID

		err = profile.Update(ctx)
		if err != nil {
			panic(actx.NewGoError(stacktrace.Propagate(err, "")))
		}

		err = ctx.Commit()
		if err != nil {
			panic(actx.NewGoError(stacktrace.Propagate(err, "")))
		}

		if mediaID != nil {
			m.appContext.Logger().RuntimeAuditLog(fmt.Sprintf("set featured media of user %s to \"%s\"", userAddress[:14], *mediaID))
		} else {
			m.appContext.Logger().RuntimeAuditLog(fmt.Sprintf("cleared featured media of user %s", userAddress[:14]))
		}

		return goja.Undefined()
	})
}

func (m *profileModule) setProfileBiography(call goja.FunctionCall) goja.Value {
	if len(call.Arguments) < 2 {
		panic(m.runtime.NewTypeError("Missing argument"))
	}
	userAddress := call.Argument(0).String()

	biographyValue := call.Argument(1)
	biography := ""
	if !goja.IsUndefined(biographyValue) && !goja.IsNull(biographyValue) {
		biography = biographyValue.String()
	}

	if len(biography) > 512 {
		panic(m.runtime.NewTypeError("Second argument to setProfileBiography must not be longer than 512 characters"))
	}

	return gojautil.DoAsync(m.runtime, m.appContext.ScheduleNoError, func(actx gojautil.AsyncContext) goja.Value {
		ctx, err := transaction.Begin(m.ctx)
		if err != nil {
			panic(actx.NewGoError(stacktrace.Propagate(err, "")))
		}
		defer ctx.Rollback()

		profile, err := types.GetUserProfileForAddress(ctx, userAddress)
		if err != nil {
			panic(actx.NewGoError(stacktrace.Propagate(err, "")))
		}

		profile.Biography = biography

		err = profile.Update(ctx)
		if err != nil {
			panic(actx.NewGoError(stacktrace.Propagate(err, "")))
		}

		err = ctx.Commit()
		if err != nil {
			panic(actx.NewGoError(stacktrace.Propagate(err, "")))
		}

		if biography != "" {
			m.appContext.Logger().RuntimeAuditLog(fmt.Sprintf("set biography of user %s to \"%s\"", userAddress[:14], biography))
		} else {
			m.appContext.Logger().RuntimeAuditLog(fmt.Sprintf("cleared biography of user %s", userAddress[:14]))
		}

		return goja.Undefined()
	})
}

func (m *profileModule) clearProfile(call goja.FunctionCall) goja.Value {
	if len(call.Arguments) < 1 {
		panic(m.runtime.NewTypeError("Missing argument"))
	}
	userAddress := call.Argument(0).String()

	gojautil.ValidateBananoAddress(m.runtime, userAddress, "Invalid user address")

	return gojautil.DoAsync(m.runtime, m.appContext.ScheduleNoError, func(actx gojautil.AsyncContext) goja.Value {
		ctx, err := transaction.Begin(m.ctx)
		if err != nil {
			panic(actx.NewGoError(stacktrace.Propagate(err, "")))
		}
		defer ctx.Rollback()

		profile, err := types.GetUserProfileForAddress(ctx, userAddress)
		if err != nil {
			panic(actx.NewGoError(stacktrace.Propagate(err, "")))
		}

		err = profile.Delete(ctx)
		if err != nil {
			panic(actx.NewGoError(stacktrace.Propagate(err, "")))
		}

		err = ctx.Commit()
		if err != nil {
			panic(actx.NewGoError(stacktrace.Propagate(err, "")))
		}

		m.appContext.Logger().RuntimeAuditLog(fmt.Sprintf("cleared profile of user %s", profile.Address[:14]))

		return goja.Undefined()
	})
}

func (m *profileModule) setUserNickname(call goja.FunctionCall) goja.Value {
	if len(call.Arguments) < 2 {
		panic(m.runtime.NewTypeError("Missing argument"))
	}
	userAddress := call.Argument(0).String()

	gojautil.ValidateBananoAddress(m.runtime, userAddress, "Invalid user address")

	nicknameValue := call.Argument(1)
	var newNickname *string
	if !goja.IsNull(nicknameValue) && !goja.IsUndefined(nicknameValue) && nicknameValue.String() != "" {
		newNickname = lo.ToPtr(gojautil.ValidateAndSanitizeNickname(m.runtime, nicknameValue.String()))
	}
	user := auth.NewAddressOnlyUser(userAddress)

	err := m.chatManager.SetNickname(m.ctx, user, newNickname, true)
	if err != nil {
		panic(m.runtime.NewGoError(stacktrace.Propagate(err, "")))
	}

	if newNickname != nil {
		m.appContext.Logger().RuntimeAuditLog(fmt.Sprintf("set nickname of user %s to \"%s\"", userAddress[:14], *newNickname))
	} else {
		m.appContext.Logger().RuntimeAuditLog(fmt.Sprintf("cleared nickname of user %s", userAddress[:14]))
	}

	return goja.Undefined()
}

func (m *profileModule) getStatistics(call goja.FunctionCall) goja.Value {
	if len(call.Arguments) < 2 {
		panic(m.runtime.NewTypeError("Missing argument"))
	}
	userAddress := call.Argument(0).String()

	var since time.Time
	err := m.runtime.ExportTo(call.Argument(1), &since)
	if err != nil {
		panic(m.runtime.NewTypeError("Second argument to getStatistics must be a Date"))
	}

	return gojautil.DoAsync(m.runtime, m.appContext.ScheduleNoError, func(actx gojautil.AsyncContext) map[string]interface{} {
		ctx, err := transaction.Begin(m.ctx)
		if err != nil {
			panic(actx.NewGoError(stacktrace.Propagate(err, "")))
		}
		defer ctx.Commit() // read-only tx

		requestCostTotal, err := types.SumRequestCostsOfAddressSince(ctx, userAddress, since)
		if err != nil {
			panic(actx.NewGoError(stacktrace.Propagate(err, "")))
		}

		crowdfunded, err := types.SumCrowdfundedTransactionsFromAddressSince(ctx, userAddress, since)
		if err != nil {
			panic(actx.NewGoError(stacktrace.Propagate(err, "")))
		}
		totalSpent := requestCostTotal.Add(crowdfunded)

		totalWithdrawn, err := types.SumWithdrawalsToAddressSince(ctx, userAddress, since)
		if err != nil {
			panic(actx.NewGoError(stacktrace.Propagate(err, "")))
		}

		mediaCount, playTime, err := types.CountRequestsOfAddressSince(ctx, userAddress, since)
		if err != nil {
			panic(actx.NewGoError(stacktrace.Propagate(err, "")))
		}

		return map[string]interface{}{
			"spentRequesting":      payment.NewAmountFromDecimal(requestCostTotal).SerializeForAPI(),
			"spentCrowdfunding":    payment.NewAmountFromDecimal(crowdfunded).SerializeForAPI(),
			"spent":                payment.NewAmountFromDecimal(totalSpent).SerializeForAPI(),
			"withdrawn":            payment.NewAmountFromDecimal(totalWithdrawn).SerializeForAPI(),
			"mediaRequestCount":    mediaCount,
			"mediaRequestPlayTime": time.Duration(playTime).Milliseconds(),
		}
	})
}
