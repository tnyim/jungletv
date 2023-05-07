//go:build !release

package buildconfig

const (
	// DEBUG is whether this is a debug build
	DEBUG = true

	// LogDBQueries is whether database queries should be logged
	LogDBQueries = false

	// SecretsPath is the default path to the file containing secrets
	SecretsPath = "secrets-debug.json"

	// ServerListenAddr is the address the HTTPS server will listen on
	ServerListenAddr = ":9090"

	// MaxDBconnectionPoolSize is the maximum number of simultaneous database connections in the connection pool
	MaxDBconnectionPoolSize = 100
)
