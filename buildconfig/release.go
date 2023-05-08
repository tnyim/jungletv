//go:build release && !lab

package buildconfig

const (
	// DEBUG is whether this is a debug build
	DEBUG = false

	// SecretsPath is the default path to the file containing secrets
	SecretsPath = "secrets.json"
)
