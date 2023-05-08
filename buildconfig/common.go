package buildconfig

const (
	// AllowWithdrawalsAndRefunds is whether this build allows withdrawals to be made
	AllowWithdrawalsAndRefunds = !LAB

	// LogDBQueries is whether database queries should be logged
	LogDBQueries = false

	// ServerListenAddr is the address the HTTPS server will listen on
	ServerListenAddr = ":9090"

	// MaxDBconnectionPoolSize is the maximum number of simultaneous database connections in the connection pool
	MaxDBconnectionPoolSize = 100
)
