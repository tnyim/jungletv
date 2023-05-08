//go:build !release

package buildconfig

const (
	// DEBUG is whether this is a debug build
	DEBUG = true

	// SecretsPath is the default path to the file containing secrets
	SecretsPath = "secrets-debug.json"
)
