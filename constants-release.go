// +build release

package main

const (
	// DEBUG is whether this is a debug build
	DEBUG = false

	// SecretsPath is the default path to the file containing secrets
	SecretsPath = "secrets.json"

	// MaxDBconnectionPoolSize is the maximum number of simultaneous database connections in the connection pool
	MaxDBconnectionPoolSize = 30

	// APIserverListenAddr is the address the API server will listen on
	APIserverListenAddr = ":14000"
)
