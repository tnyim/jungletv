package server

import (
	"net/http"
	"time"

	"context"

	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/types"
	"github.com/tnyim/jungletv/utils/transaction"
)

func (s *grpcServer) OAuthCallback(w http.ResponseWriter, r *http.Request) error {
	ctx, err := transaction.Begin(r.Context())
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	defer ctx.Rollback()

	state := r.FormValue("state")
	code := r.FormValue("code")

	// recover user and service
	stateData, ok := s.oauthStates.Get(state)
	if !ok {
		w.WriteHeader(http.StatusBadRequest)
		return nil
	}

	oauthConfig, ok := s.oauthConfigs[stateData.Service]
	if !ok {
		w.WriteHeader(http.StatusInternalServerError)
		return stacktrace.NewError("oauth config missing for specified service")
	}

	exchangeCtx, cancelFn := context.WithTimeout(ctx, 10*time.Second)
	token, err := oauthConfig.Exchange(exchangeCtx, code)
	cancelFn()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return stacktrace.Propagate(err, "error exchanging OAuth authorization into token")
	}

	if !token.Valid() {
		w.WriteHeader(http.StatusInternalServerError)
		return stacktrace.Propagate(err, "retrieved invalid OAuth token")
	}

	existingConnections, err := types.GetConnectionsForServiceAndRewardsAddress(ctx, stateData.Service, stateData.User.Address())
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return stacktrace.Propagate(err, "")
	}

	if max, hasMax := types.MaxConnectionsPerService[stateData.Service]; hasMax && len(existingConnections) >= max {
		w.WriteHeader(http.StatusBadRequest)
		return stacktrace.NewError("maximum number of connections to this service reached")
	}

	now := time.Now()
	newConnection := &types.Connection{
		ID:                state, // there should be no problem in reusing the nonce that was used for the OAuth state. Connection IDs are user-facing anyway
		Service:           stateData.Service,
		RewardsAddress:    stateData.User.Address(),
		CreatedAt:         now,
		UpdatedAt:         now,
		OAuthRefreshToken: &token.RefreshToken,
	}

	if stateData.OnCallback != nil {
		err = stateData.OnCallback(ctx, token, newConnection)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return stacktrace.Propagate(err, "")
		}
	}

	err = newConnection.Update(ctx)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return stacktrace.Propagate(err, "")
	}

	err = ctx.Commit()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return stacktrace.Propagate(err, "")
	}

	http.Redirect(w, r, s.websiteURL+"/rewards", http.StatusFound)

	return nil
}
