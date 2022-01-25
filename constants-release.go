// +build release

package main

const (
	// DEBUG is whether this is a debug build
	DEBUG = false

	// LogDBQueries is whether database queries should be logged
	LogDBQueries = false

	// SecretsPath is the default path to the file containing secrets
	SecretsPath = "secrets.json"

	// ServerListenAddr is the address the HTTPS server will listen on
	ServerListenAddr = ":9090"

	// MaxDBconnectionPoolSize is the maximum number of simultaneous database connections in the connection pool
	MaxDBconnectionPoolSize = 100
)
