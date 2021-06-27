package server

import (
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/palantir/stacktrace"
)

const CurrentTokenVersion = 2

// JWTManager generates and verifies access tokens
type JWTManager struct {
	secretKey []byte
}

// NewJWTManager returns a new JWTManager
func NewJWTManager(secretKey []byte) *JWTManager {
	return &JWTManager{secretKey}
}

// Generate generates a JWT for a user
func (manager *JWTManager) Generate(user *userInfo, tokenExpiration time.Time) (string, error) {
	claims := UserClaims{
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: tokenExpiration.Unix(),
		},
		userInfo:      *user,
		ClaimsVersion: CurrentTokenVersion,
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signed, err := token.SignedString(manager.secretKey)
	return signed, stacktrace.Propagate(err, "")
}

// Generate generates a JWT for an admin
func (manager *JWTManager) GenerateAdminToken(username string, tokenExpiration time.Time) (string, error) {
	claims := UserClaims{
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: tokenExpiration.Unix(),
		},
		userInfo: userInfo{
			RewardAddress:   "ban_1hchsy8diurojzok64ymaaw5cthgwy4wa18r7dcim9wp4nfrz88pyrgcxbdt",
			PermissionLevel: AdminPermissionLevel,
			Username:        username,
		},
		ClaimsVersion: CurrentTokenVersion,
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signed, err := token.SignedString(manager.secretKey)
	return signed, stacktrace.Propagate(err, "")
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
