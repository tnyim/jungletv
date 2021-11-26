package types

type ConnectionService string

const ConnectionServiceCryptomonKeys ConnectionService = "cryptomonkeys"

var ConnectionServices = []ConnectionService{ConnectionServiceCryptomonKeys}

var MaxConnectionsPerService = map[ConnectionService]int{
	ConnectionServiceCryptomonKeys: 1,
}
