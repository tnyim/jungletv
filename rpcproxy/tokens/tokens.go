package tokens

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
	"encoding/binary"
	"errors"
	"hash"
	"sync"
	"time"

	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/utils"
)

const tokenSizeDecodedBytes = 2 + 8 + sha256.Size

var tokenSizeEncodedBytes = base64.RawURLEncoding.EncodedLen(tokenSizeDecodedBytes)

// HeaderName is the HTTP header name for the rpcproxy authorization token
const HeaderName = "RPC-Authorization"

// ErrInvalidCountryCode is returned when the country code is invalid
var ErrInvalidCountryCode = errors.New("invalid country code")

// ErrTokenCorrupted is returned when a token has been tampered with
var ErrTokenCorrupted = errors.New("token is corrupt")

// ErrTokenExpired is returned when a token has expired
var ErrTokenExpired = errors.New("token has expired")

// Parser parses authorization tokens
type Parser struct {
	hasherPool *sync.Pool
}

// NewParser creates a new Parser
func NewParser(secretKey []byte) *Parser {
	return &Parser{
		hasherPool: &sync.Pool{
			New: func() interface{} {
				return hmac.New(sha256.New, []byte(secretKey))
			},
		},
	}
}

// Parse parses an authorization token and checks that it is within the validity period
func (p *Parser) Parse(stringToken, expectedRemoteAddress, expectedUserAgent string) (string, error) {
	h := p.hasherPool.Get().(hash.Hash)
	defer p.hasherPool.Put(h)
	defer h.Reset()

	if len(stringToken) > tokenSizeEncodedBytes {
		return "", stacktrace.Propagate(ErrTokenCorrupted, "invalid encoded token size")
	}

	tokenBytes, err := base64.RawURLEncoding.DecodeString(stringToken)
	if err != nil {
		return "", errors.Join(ErrTokenCorrupted, stacktrace.Propagate(err, ""))
	}

	if len(tokenBytes) != tokenSizeDecodedBytes {
		return "", stacktrace.Propagate(ErrTokenCorrupted, "invalid decoded token size")
	}

	h.Write(tokenBytes[0:2])  // country code
	h.Write(tokenBytes[2:10]) // expiration
	h.Write([]byte(utils.GetUniquifiedIP(expectedRemoteAddress)))
	h.Write([]byte(expectedUserAgent))
	sig := h.Sum(nil)
	if !hmac.Equal(sig, tokenBytes[10:10+sha256.Size]) {
		return "", stacktrace.Propagate(ErrTokenCorrupted, "invalid token signature")
	}

	countryCode := string(tokenBytes[0:2])
	expiration := time.Unix(0, int64(binary.LittleEndian.Uint64(tokenBytes[2:10])))
	if !expiration.After(time.Now()) {
		return "", stacktrace.Propagate(ErrTokenExpired, "")
	}

	return countryCode, nil
}

// GenerateToken generates an authorization token
func GenerateToken(secretKey []byte, validFor time.Duration, remoteAddress, userAgent, countryCode string) (string, time.Time, error) {
	expiration := time.Now().Add(validFor)

	tokenBytes := make([]byte, 10, 2+8+sha256.Size)
	copy(tokenBytes[0:2], []byte(countryCode))
	binary.LittleEndian.PutUint64(tokenBytes[2:10], uint64(expiration.UnixNano()))

	h := hmac.New(sha256.New, []byte(secretKey))

	h.Write([]byte(countryCode))
	h.Write(tokenBytes[2:10])
	h.Write([]byte(utils.GetUniquifiedIP(remoteAddress)))
	h.Write([]byte(userAgent))

	if len(countryCode) != 2 {
		return "", time.Time{}, stacktrace.Propagate(ErrInvalidCountryCode, "")
	}

	// sum appends the current hash to tokenBytes and returns the result
	tokenBytes = h.Sum(tokenBytes)

	// base64 encode the token
	return base64.RawURLEncoding.EncodeToString(tokenBytes), expiration, nil
}
