// +build !release

package main

const (
	// DEBUG is whether this is a debug build
	DEBUG = true

	// SecretsPath is the default path to the file containing secrets
	SecretsPath = "secrets-debug.json"

	// ServerListenAddr is the address the HTTPS server will listen on
	ServerListenAddr = ":9090"
)
