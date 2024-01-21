package main

import (
	"bytes"
	"crypto/sha256"
	"encoding/base32"
	"encoding/binary"
	"encoding/hex"
	"io"
	"strings"
	"time"

	"github.com/hectorchu/gonano/rpc"
	"golang.org/x/crypto/hkdf"

	"github.com/gbl08ma/keybox"
	"github.com/hectorchu/gonano/wallet"
	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/types"

	"github.com/hectorchu/gonano/wallet/ed25519"
	"golang.org/x/crypto/blake2b"
)

func buildWallet(secrets *keybox.Keybox) (*wallet.Wallet, *walletBuilder, error) {
	seedHex, present := secrets.Get("walletSeed")
	if !present {
		return nil, nil, stacktrace.NewError("wallet seed not present in keybox")
	}
	seed, err := hex.DecodeString(seedHex)
	if err != nil {
		return nil, nil, stacktrace.Propagate(err, "failed to decode seed")
	}

	wallet, err := wallet.NewBananoWallet(seed)
	if err != nil {
		return nil, nil, stacktrace.Propagate(err, "failed to create wallet")
	}
	wallet.WorkDifficulty = "fffffe0000000000"
	wallet.ReceiveWorkDifficulty = "fffffe0000000000"

	walletRPCAddress, present := secrets.Get("walletRPCAddress")
	if present {
		wallet.RPC = rpc.Client{URL: walletRPCAddress}
	}

	walletWorkRPCAddress, present := secrets.Get("walletWorkRPCAddress")
	if present {
		wallet.RPCWork = rpc.Client{URL: walletWorkRPCAddress}
	}
	return wallet, &walletBuilder{
		masterSeed:           seed,
		walletRPCAddress:     walletRPCAddress,
		walletWorkRPCAddress: walletWorkRPCAddress,
	}, nil
}

type walletBuilder struct {
	masterSeed           []byte
	walletRPCAddress     string
	walletWorkRPCAddress string
}

func (b *walletBuilder) BuildApplicationWallet(applicationID string, earliestVersion types.ApplicationVersion) (*wallet.Wallet, error) {
	info := new(bytes.Buffer)
	_, err := info.WriteString("wallet-" + applicationID)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	err = binary.Write(info, binary.BigEndian, time.Time(earliestVersion).UnixNano())
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	hkdf := hkdf.New(sha256.New, b.masterSeed, nil, info.Bytes())

	seed := make([]byte, 32)
	_, err = io.ReadFull(hkdf, seed)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	wallet, err := wallet.NewBananoWallet(seed)
	if err != nil {
		return nil, stacktrace.Propagate(err, "failed to create wallet")
	}
	wallet.WorkDifficulty = "fffffe0000000000"
	wallet.ReceiveWorkDifficulty = "fffffe0000000000"

	if b.walletRPCAddress != "" {
		wallet.RPC = rpc.Client{URL: b.walletRPCAddress}
	}
	if b.walletWorkRPCAddress != "" {
		wallet.RPCWork = rpc.Client{URL: b.walletWorkRPCAddress}
	}

	return wallet, nil
}

func (b *walletBuilder) GetApplicationVersionForWalletWithPrefix(applicationID string, prefix string, timeout time.Duration) (types.ApplicationVersion, error) {
	startTime := time.Now()
	if prefix == "" {
		return types.ApplicationVersion(startTime), nil
	}
	if prefix[0] != '1' && prefix[0] != '3' {
		return types.ApplicationVersion{}, stacktrace.NewError("prefix must start with '1' or '3'")
	}
	timeoutCheck := 0
	walletString := "wallet-" + applicationID
	for t := startTime.Round(time.Microsecond); ; t = t.Add(-time.Microsecond) { // postgres precision is 1 microsecond
		timeoutCheck++
		if timeoutCheck == 2000 {
			// avoid calling time.Now() on every iteration as that can be quite slow
			timeoutCheck = 0
			if time.Since(startTime) > timeout {
				break
			}
		}

		// this duplicates a lot of code in the name of speed and bypassing things that we don't need here
		// (like error checking and all the mutexes and map accesses inside gonano's wallet/account mechanism)
		info := new(bytes.Buffer)
		_, _ = info.WriteString(walletString)
		_ = binary.Write(info, binary.BigEndian, time.Time(t).UnixNano())

		hkdf := hkdf.New(sha256.New, b.masterSeed, nil, info.Bytes())

		seed := make([]byte, 32)
		_, _ = io.ReadFull(hkdf, seed)

		key := deriveKey(seed, 0)
		pubKey, _, _ := deriveKeypair(key)

		pubKey = append([]byte{0, 0, 0}, pubKey...)
		b32 := base32.NewEncoding("13456789abcdefghijkmnopqrstuwxyz")
		// we don't care about the checksum (it's at the end) nor the ban_ prefix
		// the [4:] was already present in util.PubkeyToBananoAddress
		if strings.HasPrefix(b32.EncodeToString(pubKey)[4:], prefix) {
			return types.ApplicationVersion(t), nil
		}
	}
	return types.ApplicationVersion{}, stacktrace.NewError("timed out bruteforcing desired wallet prefix")
}

// copied from gonano to help with the bruteforcing, error checks removed:
func deriveKey(seed []byte, index uint32) (key []byte) {
	hash, _ := blake2b.New256(nil)
	hash.Write(seed)
	binary.Write(hash, binary.BigEndian, index)
	return hash.Sum(nil)
}

func deriveKeypair(key []byte) (pubkey, privkey []byte, err error) {
	return ed25519.GenerateKey(bytes.NewReader(key))
}
