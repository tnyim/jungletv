package tokens_test

import (
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
	"testing"
	"time"

	"github.com/stretchr/testify/require"
	"github.com/tnyim/jungletv/rpcproxy/tokens"
)

func TestTokens(t *testing.T) {
	key := make([]byte, sha256.Size)
	_, err := rand.Read(key)
	require.NoError(t, err)

	_, _, err = tokens.GenerateToken(key, 5*time.Minute, "127.0.0.1", "useragent", "")
	require.Error(t, err)
	require.ErrorIs(t, err, tokens.ErrInvalidCountryCode)

	token, _, err := tokens.GenerateToken(key, 5*time.Minute, "127.0.0.1", "useragent", "US")
	require.NoError(t, err)

	parser := tokens.NewParser(key)

	cc, err := parser.Parse(token, "127.0.0.1", "useragent")
	require.NoError(t, err)
	require.Equal(t, "US", cc)

	tokenBytes, err := base64.RawURLEncoding.DecodeString(token)
	require.NoError(t, err)
	tokenBytes[0] = 'A'
	modifiedToken := base64.RawURLEncoding.EncodeToString(tokenBytes)
	_, err = parser.Parse(modifiedToken, "127.0.0.1", "useragent")
	require.Error(t, err)
	require.ErrorIs(t, err, tokens.ErrTokenCorrupted)

	_, err = parser.Parse(token, "127.0.0.1", "wrong")
	require.Error(t, err)
	require.ErrorIs(t, err, tokens.ErrTokenCorrupted)

	_, err = parser.Parse(token, "127.0.0.2", "useragent")
	require.Error(t, err)
	require.ErrorIs(t, err, tokens.ErrTokenCorrupted)

	token, _, err = tokens.GenerateToken(key, -5*time.Minute, "127.0.0.1", "useragent", "US")
	require.NoError(t, err)

	_, err = parser.Parse(token, "127.0.0.1", "useragent")
	require.Error(t, err)
	require.ErrorIs(t, err, tokens.ErrTokenExpired)
}
