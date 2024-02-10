package auth

import (
	"context"
	"errors"
	"time"

	"github.com/Yiling-J/theine-go"
	"github.com/golang-jwt/jwt/v4"
	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/buildconfig"
	"github.com/tnyim/jungletv/types"
	"github.com/tnyim/jungletv/utils/transaction"
)

const CurrentTokenVersion = 2

// JWTManager generates and verifies access tokens
type JWTManager struct {
	secretKey      []byte
	tokenLifetimes map[PermissionLevel]time.Duration
	userSeasons    *theine.LoadingCache[string, int]
}

// NewJWTManager returns a new JWTManager
func NewJWTManager(secretKey []byte, tokenLifetimes map[PermissionLevel]time.Duration) (*JWTManager, error) {
	manager := &JWTManager{
		secretKey:      secretKey,
		tokenLifetimes: tokenLifetimes,
	}
	var err error
	manager.userSeasons, err = theine.NewBuilder[string, int](buildconfig.ExpectedConcurrentUsers).Loading(seasonCacheLoader).Build()
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	return manager, nil
}

// IsTokenAboutToExpire returns whether the given token needs renewing ASAP
func (manager *JWTManager) IsTokenAboutToExpire(claims *UserClaims) bool {
	return time.Until(time.Unix(claims.ExpiresAt, 0)) < manager.tokenLifetimes[claims.PermLevel]/2
}

// Generate generates a JWT for a user
func (manager *JWTManager) Generate(ctx context.Context, rewardAddress string, permissionLevel PermissionLevel, username string) (string, time.Time, int, error) {
	expiration := time.Now().Add(manager.tokenLifetimes[permissionLevel])
	claims := UserClaims{
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expiration.Unix(),
		},
		authenticatedUser: authenticatedUser{
			RewardAddress: rewardAddress,
			PermLevel:     permissionLevel,
			Username:      username,
		},
		ClaimsVersion: CurrentTokenVersion,
	}

	var err error
	claims.Season, err = manager.currentUserSeason(ctx, &claims)
	if err != nil {
		return "", time.Time{}, claims.Season, stacktrace.Propagate(err, "")
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signed, err := token.SignedString(manager.secretKey)
	return signed, expiration, claims.Season, stacktrace.Propagate(err, "")
}

// Verify verifies a JWT
func (manager *JWTManager) Verify(ctx context.Context, accessToken string) (*UserClaims, error) {
	token, err := jwt.ParseWithClaims(
		accessToken,
		&UserClaims{},
		func(token *jwt.Token) (interface{}, error) {
			return []byte(manager.secretKey), nil
		}, jwt.WithValidMethods([]string{jwt.SigningMethodHS256.Alg()}))
	if err != nil {
		return nil, stacktrace.Propagate(err, "invalid token")
	}

	claims, ok := token.Claims.(*UserClaims)
	if !ok {
		return nil, stacktrace.NewError("invalid token claims")
	}

	if claims.ClaimsVersion != CurrentTokenVersion {
		return nil, stacktrace.NewError("token claims version is outdated")
	}

	correctSeason, err := manager.currentUserSeason(ctx, claims)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	if claims.Season != correctSeason {
		return nil, stacktrace.NewError("token claims version is invalidated")
	}

	return claims, nil
}

func (manager *JWTManager) currentUserSeason(ctxCtx context.Context, user User) (int, error) {
	season, err := manager.userSeasons.Get(ctxCtx, user.Address())
	if err != nil {
		return 0, stacktrace.Propagate(err, "")
	}
	return season, nil
}

func seasonCacheLoader(ctxCtx context.Context, address string) (theine.Loaded[int], error) {
	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return theine.Loaded[int]{}, stacktrace.Propagate(err, "")
	}
	defer ctx.Commit() // read-only tx

	var season int
	s, err := types.GetUserJWTClaimSeason(ctx, address)
	if err != nil && !errors.Is(err, types.ErrJWTClaimSeasonNotFound) {
		return theine.Loaded[int]{}, stacktrace.Propagate(err, "")
	} else if err != nil {
		season = 0
	} else {
		season = s.Season
	}

	return theine.Loaded[int]{
		Value: season,
		Cost:  1,
		TTL:   30 * time.Minute,
	}, nil
}

// InvalidateUserAuthTokens invalidates all previously issued authentication tokens for the given user
func (manager *JWTManager) InvalidateUserAuthTokens(ctxCtx context.Context, user User) error {
	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	defer ctx.Rollback()

	season, err := manager.currentUserSeason(ctx, user)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	season += 1

	s := &types.UserJWTClaimSeason{
		Address:   user.Address(),
		Season:    season,
		UpdatedAt: time.Now(),
	}
	err = s.Update(ctx)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	manager.userSeasons.SetWithTTL(user.Address(), season, 1, 30*time.Minute)

	return stacktrace.Propagate(ctx.Commit(), "")
}
