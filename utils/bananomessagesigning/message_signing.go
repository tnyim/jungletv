package bananomessagesigning

import (
	"math/big"

	"github.com/hectorchu/gonano/rpc"
	"github.com/hectorchu/gonano/util"
	"github.com/hectorchu/gonano/wallet/ed25519"
	"github.com/palantir/stacktrace"
	"github.com/samber/lo"
	"golang.org/x/crypto/blake2b"
)

func hashMessageToBytes(message []byte) ([]byte, error) {
	h, err := blake2b.New256(nil)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	_, err = h.Write([]byte("bananomsg-"))
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	_, err = h.Write(message)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	return h.Sum(nil), nil
}

func messageDummyBlockHash(account string, message []byte) (rpc.BlockHash, error) {
	hashedMessageBytes, err := hashMessageToBytes(message)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	representative, err := util.PubkeyToAddress(hashedMessageBytes)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	dummyBlock := rpc.Block{
		Account:        account,
		Previous:       make(rpc.BlockHash, 32),
		Representative: representative,
		Balance:        &rpc.RawAmount{Int: lo.FromPtr(big.NewInt(0))},
		Link:           make(rpc.BlockHash, 32),
	}

	hash, err := dummyBlock.Hash()
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	return hash, nil
}

// VerifyMessage verifies that the given signature has been produced by the specified Banano account for the specified message
func VerifyMessage(account string, message []byte, signature []byte) (bool, error) {
	pubKey, err := util.AddressToPubkey(account)
	if err != nil {
		return false, stacktrace.Propagate(err, "")
	}

	dummyBlockHashBytes, err := messageDummyBlockHash(account, message)
	if err != nil {
		return false, stacktrace.Propagate(err, "")
	}

	return ed25519.Verify(pubKey, dummyBlockHashBytes, signature), nil
}
