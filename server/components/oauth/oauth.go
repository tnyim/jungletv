package oauth

import (
	"context"
	"errors"
	"time"

	"github.com/palantir/stacktrace"
	"github.com/patrickmn/go-cache"
	uuid "github.com/satori/go.uuid"
	"github.com/tnyim/jungletv/server/auth"
	"github.com/tnyim/jungletv/types"
	"github.com/tnyim/jungletv/utils/transaction"
	"golang.org/x/oauth2"
)

// Manager manages oauth account association requests
type Manager struct {
	oauthConfigs map[types.ConnectionService]*oauth2.Config
	oauthStates  *cache.Cache[string, oauthStateData]
}

type ServiceCallbackFunction func(context.Context, *oauth2.Token, *types.Connection) error

type oauthStateData struct {
	Service    types.ConnectionService
	OnCallback ServiceCallbackFunction
	User       auth.User
}

// NewManager returns a new oauth manager
func NewManager() *Manager {
	return &Manager{
		oauthConfigs: make(map[types.ConnectionService]*oauth2.Config),
		oauthStates:  cache.New[string, oauthStateData](2*time.Hour, 15*time.Minute),
	}
}

func (m *Manager) RegisterConnectionService(service types.ConnectionService, config *oauth2.Config) {
	m.oauthConfigs[service] = config
}

// ErrMaximumConnectionsReached is returned when a user has reached their maximum number of connections to a service
var ErrMaximumConnectionsReached = errors.New("maximum number of connections to this service reached")

func (m *Manager) BeginFlow(ctxCtx context.Context, service types.ConnectionService, user auth.User, callback ServiceCallbackFunction) (string, error) {
	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return "", stacktrace.Propagate(err, "")
	}
	defer ctx.Commit() // read-only tx

	existingConnections, err := types.GetConnectionsForServiceAndRewardsAddress(ctx, service, user.Address())
	if err != nil {
		return "", stacktrace.Propagate(err, "")
	}

	if max, hasMax := types.MaxConnectionsPerService[service]; hasMax && len(existingConnections) >= max {
		return "", stacktrace.Propagate(ErrMaximumConnectionsReached, "")
	}

	oauthConfig, ok := m.oauthConfigs[service]
	if !ok {
		return "", stacktrace.NewError("oauth config missing for specified service")
	}

	oauthState := uuid.NewV4().String()

	m.oauthStates.SetDefault(oauthState, oauthStateData{
		Service:    service,
		OnCallback: callback,
		User:       user,
	})

	return oauthConfig.AuthCodeURL(oauthState), nil
}

func (m *Manager) CompleteFlow(ctxCtx context.Context, state string, code string) error {
	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	defer ctx.Rollback()

	// recover user and service
	stateData, ok := m.oauthStates.Get(state)
	if !ok {
		return stacktrace.NewError("state not found")
	}

	oauthConfig, ok := m.oauthConfigs[stateData.Service]
	if !ok {
		return stacktrace.NewError("oauth config missing for specified service")
	}

	exchangeCtx, cancelFn := context.WithTimeout(ctx, 10*time.Second)
	token, err := oauthConfig.Exchange(exchangeCtx, code)
	cancelFn()
	if err != nil {
		return stacktrace.Propagate(err, "error exchanging OAuth authorization into token")
	}

	if !token.Valid() {
		return stacktrace.Propagate(err, "retrieved invalid OAuth token")
	}

	existingConnections, err := types.GetConnectionsForServiceAndRewardsAddress(ctx, stateData.Service, stateData.User.Address())
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	if max, hasMax := types.MaxConnectionsPerService[stateData.Service]; hasMax && len(existingConnections) >= max {
		return stacktrace.Propagate(ErrMaximumConnectionsReached, "")
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
			return stacktrace.Propagate(err, "")
		}
	}

	err = newConnection.Update(ctx)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	return stacktrace.Propagate(ctx.Commit(), "")
}
