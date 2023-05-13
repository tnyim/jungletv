package main

import (
	"bytes"
	"crypto/sha256"
	"encoding/binary"
	"encoding/hex"
	"io"
	"time"

	"github.com/hectorchu/gonano/rpc"
	"golang.org/x/crypto/hkdf"

	"github.com/gbl08ma/keybox"
	"github.com/hectorchu/gonano/wallet"
	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/types"
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
