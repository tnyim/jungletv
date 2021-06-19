package server

import (
	"context"
	"encoding/json"
	"errors"
	"io/ioutil"
	"log"
	"os"
	"sync"

	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/utils/event"
	"gopkg.in/alexcesaro/statsd.v2"
)

// MediaQueue queues media for synced broadcast
type MediaQueue struct {
	log         *log.Logger
	statsClient *statsd.Client
	queue       []MediaQueueEntry
	queueMutex  sync.RWMutex

	queueUpdated *event.Event
	mediaChanged *event.Event
	entryAdded   *event.Event

	// fired when an entry that is not at the top of the queue is removed prematurely
	// receives the removed entry as an argument
	deepEntryRemoved *event.Event
}

func NewMediaQueue(ctx context.Context, log *log.Logger, statsClient *statsd.Client, persistenceFile string) (*MediaQueue, error) {
	q := &MediaQueue{
		log:              log,
		statsClient:      statsClient,
		queueUpdated:     event.New(),
		mediaChanged:     event.New(),
		entryAdded:       event.New(),
		deepEntryRemoved: event.New(),
	}
	if persistenceFile != "" {
		err := q.restoreQueueFromFile(persistenceFile)
		if err != nil {
			return nil, stacktrace.Propagate(err, "")
		}
		go q.persistenceWorker(ctx, persistenceFile)
	}
	return q, nil
}

func (q *MediaQueue) Length() int {
	q.queueMutex.RLock()
	defer q.queueMutex.RUnlock()
	return len(q.queue)
}

func (q *MediaQueue) Entries() []MediaQueueEntry {
	q.queueMutex.RLock()
	defer q.queueMutex.RUnlock()
	queueCopy := make([]MediaQueueEntry, len(q.queue))
	copy(queueCopy, q.queue)
	return queueCopy
}

func (q *MediaQueue) Enqueue(entry MediaQueueEntry) {
	q.queueMutex.Lock()
	defer q.queueMutex.Unlock()

	q.queue = append(q.queue, entry)
	go q.statsClient.Gauge("queue_length", len(q.queue))
	q.queueUpdated.Notify()
	q.entryAdded.Notify("enqueue", entry)
}

func (q *MediaQueue) playAfterNextNoMutex(entry MediaQueueEntry) {
	if len(q.queue) < 2 {
		q.queue = append(q.queue, entry)
	} else {
		q.queue = append(q.queue, nil)
		copy(q.queue[2:], q.queue[1:])
		q.queue[1] = entry
	}
}

func (q *MediaQueue) PlayAfterNext(entry MediaQueueEntry) {
	q.queueMutex.Lock()
	defer q.queueMutex.Unlock()

	q.playAfterNextNoMutex(entry)
	go q.statsClient.Gauge("queue_length", len(q.queue))
	q.queueUpdated.Notify()
	q.entryAdded.Notify("play_after_next", entry)
}

func (q *MediaQueue) PlayNow(entry MediaQueueEntry) {
	q.queueMutex.Lock()
	defer q.queueMutex.Unlock()

	q.playAfterNextNoMutex(entry)
	if len(q.queue) > 1 && !q.queue[0].Unskippable() {
		q.queue[0].Stop()
	}

	go q.statsClient.Gauge("queue_length", len(q.queue))
	q.queueUpdated.Notify()
	q.entryAdded.Notify("play_now", entry)
}

func (q *MediaQueue) RemoveEntry(entryID string) error {
	q.queueMutex.Lock()
	defer q.queueMutex.Unlock()

	if len(q.queue) == 0 {
		return stacktrace.NewError("the queue is empty")
	}

	if entryID == q.queue[0].QueueID() {
		q.queue[0].Stop()
		return nil
	}

	for i, entry := range q.queue {
		if entryID == entry.QueueID() {
			q.queue = append(q.queue[:i], q.queue[i+1:]...)
			q.deepEntryRemoved.Notify(entry)
			go q.statsClient.Gauge("queue_length", len(q.queue))
			q.queueUpdated.Notify()
			return nil
		}
	}
	return stacktrace.NewError("entry not found in the queue")
}

func (q *MediaQueue) ProcessQueueWorker(ctx context.Context) {
	onQueueUpdated := q.queueUpdated.Subscribe(event.AtLeastOnceGuarantee)
	defer q.queueUpdated.Unsubscribe(onQueueUpdated)
	var prevQueueEntry MediaQueueEntry
	for {
		onNextMedia := make(<-chan []interface{})
		unsubscribe := func() {}
		var currentQueueEntry MediaQueueEntry
		func() {
			q.queueMutex.RLock()
			defer q.queueMutex.RUnlock()

			if len(q.queue) > 0 {
				currentQueueEntry = q.queue[0]
			}
		}()

		if prevQueueEntry != currentQueueEntry {
			prevQueueEntry = currentQueueEntry
			q.mediaChanged.Notify(currentQueueEntry)
		}

		if currentQueueEntry != nil {
			if currentQueueEntry.Played() {
				q.playNext()
				continue
			}
			if !currentQueueEntry.Playing() {
				currentQueueEntry.Play()
			}
			ev := currentQueueEntry.DonePlaying()
			onNextMedia = ev.Subscribe(event.AtLeastOnceGuarantee)
			unsubscribe = func() {
				ev.Unsubscribe(onNextMedia)
			}
			q.log.Printf("Current queue entry: \"%s\" with length %s", currentQueueEntry.MediaInfo().Title(), currentQueueEntry.MediaInfo().Length())
		} else {
			q.log.Println("No current queue entry")
		}

		select {
		case <-ctx.Done():
			unsubscribe()
			return
		case <-onNextMedia:
			q.playNext()
		case <-onQueueUpdated:
			// loop again to update currentQueueEntry and nextMediaChan
		}
		unsubscribe()
	}
}

func (q *MediaQueue) playNext() {
	q.queueMutex.Lock()
	defer q.queueMutex.Unlock()

	if len(q.queue) == 0 {
		return
	}
	q.queue = q.queue[1:]
	go q.statsClient.Gauge("queue_length", len(q.queue))
	q.queueUpdated.Notify()
}

func (q *MediaQueue) CurrentlyPlaying() (MediaQueueEntry, bool) {
	q.queueMutex.RLock()
	defer q.queueMutex.RUnlock()
	if len(q.queue) == 0 {
		return nil, false
	}
	return q.queue[0], true
}

func (q *MediaQueue) ProduceCheckpointForAPI() *proto.MediaConsumptionCheckpoint {
	q.queueMutex.RLock()
	defer q.queueMutex.RUnlock()
	if len(q.queue) == 0 {
		return &proto.MediaConsumptionCheckpoint{}
	}
	return q.queue[0].ProduceCheckpointForAPI()
}

func (q *MediaQueue) persistenceWorker(ctx context.Context, file string) {
	c := q.queueUpdated.Subscribe(event.AtLeastOnceGuarantee)
	defer q.queueUpdated.Unsubscribe(c)

	for {
		select {
		case <-c:
			marshalled, err := json.Marshal(q.Entries())
			if err != nil {
				q.log.Printf("error serializing queue: %v", err)
				continue
			}
			err = ioutil.WriteFile(file, marshalled, 0644)
			if err != nil {
				q.log.Printf("error writing queue to file: %v", err)
				continue
			}
		case <-ctx.Done():
			return
		}
	}
}

func (q *MediaQueue) restoreQueueFromFile(file string) error {
	b, err := ioutil.ReadFile(file)
	if err != nil {
		if errors.Is(err, os.ErrNotExist) {
			return nil
		}
		return stacktrace.Propagate(err, "error reading queue from file: %v", err)
	}

	var entries []*queueEntryYouTubeVideo
	err = json.Unmarshal(b, &entries)
	if err != nil {
		return stacktrace.Propagate(err, "error decoding queue from file: %v", err)
	}
	q.queueMutex.Lock()
	defer q.queueMutex.Unlock()

	q.queue = make([]MediaQueueEntry, len(entries))
	for i := range entries {
		q.queue[i] = entries[i]
	}
	go q.statsClient.Gauge("queue_length", len(q.queue))
	q.queueUpdated.Notify()
	return nil
}
