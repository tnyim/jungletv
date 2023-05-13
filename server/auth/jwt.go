package auth

import (
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/palantir/stacktrace"
)

const CurrentTokenVersion = 2

// JWTManager generates and verifies access tokens
type JWTManager struct {
	secretKey      []byte
	tokenLifetimes map[PermissionLevel]time.Duration
}

// NewJWTManager returns a new JWTManager
func NewJWTManager(secretKey []byte, tokenLifetimes map[PermissionLevel]time.Duration) *JWTManager {
	return &JWTManager{secretKey, tokenLifetimes}
}

// IsTokenAboutToExpire returns whether the given token needs renewing ASAP
func (manager *JWTManager) IsTokenAboutToExpire(claims *UserClaims) bool {
	return time.Until(time.Unix(claims.ExpiresAt, 0)) < manager.tokenLifetimes[claims.PermLevel]/2
}

// Generate generates a JWT for a user
func (manager *JWTManager) Generate(rewardAddress string, permissionLevel PermissionLevel, username string) (string, time.Time, error) {
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

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signed, err := token.SignedString(manager.secretKey)
	return signed, expiration, stacktrace.Propagate(err, "")
}

// Verify verifies a JWT
func (manager *JWTManager) Verify(accessToken string) (*UserClaims, error) {
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

	return claims, nil
}
