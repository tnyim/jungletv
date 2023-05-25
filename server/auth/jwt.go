package auth

import (
	"context"
	"errors"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/palantir/stacktrace"
	"github.com/patrickmn/go-cache"
	"github.com/tnyim/jungletv/types"
	"github.com/tnyim/jungletv/utils/transaction"
)

const CurrentTokenVersion = 2

// JWTManager generates and verifies access tokens
type JWTManager struct {
	secretKey      []byte
	tokenLifetimes map[PermissionLevel]time.Duration
	userSeasons    *cache.Cache[string, int]
}

// NewJWTManager returns a new JWTManager
func NewJWTManager(secretKey []byte, tokenLifetimes map[PermissionLevel]time.Duration) *JWTManager {
	return &JWTManager{
		secretKey:      secretKey,
		tokenLifetimes: tokenLifetimes,
		userSeasons:    cache.New[string, int](30*time.Minute, 5*time.Minute),
	}
}

// IsTokenAboutToExpire returns whether the given token needs renewing ASAP
func (manager *JWTManager) IsTokenAboutToExpire(claims *UserClaims) bool {
	return time.Until(time.Unix(claims.ExpiresAt, 0)) < manager.tokenLifetimes[claims.PermLevel]/2
}

// Generate generates a JWT for a user
func (manager *JWTManager) Generate(ctx context.Context, rewardAddress string, permissionLevel PermissionLevel, username string) (string, time.Time, error) {
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
		return "", time.Time{}, stacktrace.Propagate(err, "")
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signed, err := token.SignedString(manager.secretKey)
	return signed, expiration, stacktrace.Propagate(err, "")
}

// Verify verifies a JWT
func (manager *JWTManager) Verify(ctx context.Context, accessToken string) (*UserClaims, error) {
	token, err := jwt.ParseWithClaims(
		accessToken,
		&UserClaims{},
		func(token *jwt.Token) (interface{}, error) {
			_, ok := token.Method.(*jwt.SigningMethodHMAC)
			if !ok {
				return nil, stacktrace.NewError("unexpected token signing method")
			}

			return []byte(manager.secretKey), nil
		})
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
	season, ok := manager.userSeasons.Get(user.Address())
	if ok {
		return season, nil
	}

	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return 0, stacktrace.Propagate(err, "")
	}
	defer ctx.Commit() // read-only tx

	s, err := types.GetUserJWTClaimSeason(ctx, user.Address())
	if err != nil && !errors.Is(err, types.ErrJWTClaimSeasonNotFound) {
		return 0, stacktrace.Propagate(err, "")
	} else if err != nil {
		season = 0
	} else {
		season = s.Season
	}

	manager.userSeasons.SetDefault(user.Address(), season)

	return season, nil
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

	manager.userSeasons.SetDefault(user.Address(), season)

	return stacktrace.Propagate(ctx.Commit(), "")
}
