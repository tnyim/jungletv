package server

import (
	"encoding/binary"
	"sync"
	"time"

	"github.com/hectorchu/gonano/pow"
	"github.com/hectorchu/gonano/rpc"
	"github.com/hectorchu/gonano/wallet"
	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/utils/event"
	"golang.org/x/crypto/blake2b"
)

// WorkGenerator handles distributed work generation for reward sending
type WorkGenerator struct {
	taskChan      chan WorkRequest
	activeTasks   map[[32]byte]WorkRequest
	work          map[[32]byte][8]byte
	workMutex     sync.RWMutex
	workDelivered *event.Event
	sendMutex     sync.Mutex
}

// WorkRequest is a single work task
type WorkRequest struct {
	Data   rpc.BlockHash
	Target [8]byte
}

// NewWorkGenerator returns a new initialized WorkGenerator
func NewWorkGenerator() *WorkGenerator {
	return &WorkGenerator{
		taskChan:      make(chan WorkRequest),
		activeTasks:   make(map[[32]byte]WorkRequest),
		work:          make(map[[32]byte][8]byte),
		workDelivered: event.New(),
	}
}

// TaskChannel returns a channel on which new requests for work will be sent
func (w *WorkGenerator) TaskChannel() <-chan WorkRequest {
	return w.taskChan
}

// DeliverWork is used to deliver completed work
func (w *WorkGenerator) DeliverWork(forPrevious [32]byte, work [8]byte) error {
	w.workMutex.Lock()
	defer w.workMutex.Unlock()

	// check if we needed this work
	task, ok := w.activeTasks[forPrevious]
	if !ok {
		return nil
	}

	// validate work
	hash, _ := blake2b.New(8, nil)
	var workForValidation [8]byte
	copy(workForValidation[:], work[:])
	for i, j := 0, len(work)-1; i < j; i, j = i+1, j-1 {
		workForValidation[i], workForValidation[j] = workForValidation[j], workForValidation[i]
	}
	hash.Write(workForValidation[:])
	hash.Write(forPrevious[:])
	if binary.LittleEndian.Uint64(hash.Sum(nil)) < binary.LittleEndian.Uint64(task.Target[:]) {
		return stacktrace.NewError("invalid work")
	}

	w.work[forPrevious] = work
	delete(w.activeTasks, forPrevious)
	w.workDelivered.Notify()
	return nil
}

func (w *WorkGenerator) requestWork(forPrevious [32]byte, target [8]byte) {
	task := WorkRequest{
		Data:   forPrevious[:],
		Target: target,
	}
	w.workMutex.Lock()
	defer w.workMutex.Unlock()

	w.activeTasks[forPrevious] = task
	select {
	case w.taskChan <- task:
	default:
	}
}

// SendMultiple sends multiple amounts to multiple accounts. The caller must guarantee that no new blocks are created for this account until this function returns
func (w *WorkGenerator) SendMultiple(RPC rpc.Client, RPCWork rpc.Client, a *wallet.Account, destinations []wallet.SendDestination) (hashes []rpc.BlockHash, err error) {
	w.sendMutex.Lock()
	defer func() {
		w.workMutex.Lock()
		defer w.workMutex.Unlock()
		w.work = make(map[[32]byte][8]byte)
		w.activeTasks = make(map[[32]byte]WorkRequest)
		w.sendMutex.Unlock()
	}()

	blocks, err := a.SendBlocks(destinations)
	if err != nil {
		return
	}

	_, networkCurrent, _, _, _, _, err := RPC.ActiveDifficulty()
	if err != nil {
		return
	}
	var target [8]byte
	copy(target[:], networkCurrent)

	for i := range blocks {
		if len(blocks[i].Previous) != 32 {
			return nil, stacktrace.NewError("invalid previous length")
		}
		var previous [32]byte
		copy(previous[:], blocks[i].Previous)
		w.requestWork(previous, target)
	}

	timeout := time.NewTimer(15 * time.Second)
	workDelivered := w.workDelivered.Subscribe(event.AtLeastOnceGuarantee)
	defer w.workDelivered.Unsubscribe(workDelivered)
	for {
		done := false
		select {
		case <-timeout.C:
			done = true
		case <-workDelivered:
			func() {
				w.workMutex.RLock()
				defer w.workMutex.RUnlock()
				if len(w.activeTasks) == 0 {
					// surprisingly, everyone got their work done before the timeout!
					done = true
				}
			}()

		}
		if done {
			break
		}
	}

	getWork := func(previous rpc.BlockHash) ([]byte, error) {
		// first, see if our minions did it for us
		var previousArray [32]byte
		copy(previousArray[:], previous)
		w.workMutex.RLock()
		work, ok := w.work[previousArray]
		w.workMutex.RUnlock()
		if ok {
			return work[:], nil
		}
		// looks like we'll have to do it using our work server
		if workSlice, _, _, err := RPCWork.WorkGenerate(previous, networkCurrent); err == nil {
			return workSlice, nil
		}
		// looks like this will have to be an inside job
		return pow.Generate(previous, networkCurrent)
	}

	blocksWithWorkChan := make(chan *rpc.Block, len(destinations))
	errChan := make(chan error)
	go func() {
		for i := range blocks {
			if blocks[i].Work, err = getWork(blocks[i].Previous); err != nil {
				errChan <- err
				return
			}
			blocksWithWorkChan <- blocks[i]
		}
		close(blocksWithWorkChan)
	}()

	for {
		select {
		case block, ok := <-blocksWithWorkChan:
			if !ok {
				return hashes, nil
			}
			hash, err := RPC.Process(block, "send")
			if err != nil {
				return nil, err
			}
			hashes = append(hashes, hash)
		case err := <-errChan:
			return nil, err
		}
	}
}
