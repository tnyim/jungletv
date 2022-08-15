package raffle

import (
	"crypto/ecdsa"
	"encoding/hex"

	"github.com/btcsuite/btcd/btcec"
	"github.com/palantir/stacktrace"
)

func DecodeSecretKey(raffleSecretKey string) (*ecdsa.PrivateKey, error) {
	skBytes, err := hex.DecodeString(raffleSecretKey)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	sk, _ := btcec.PrivKeyFromBytes(btcec.S256(), skBytes)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	return sk.ToECDSA(), nil
}
