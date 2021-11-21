package server

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"io/ioutil"
	"log"
	"os"
	"sync"
	"time"

	"github.com/palantir/stacktrace"
	"github.com/patrickmn/go-cache"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/types"
	"github.com/tnyim/jungletv/utils/event"
	"github.com/vburenin/nsync"
	"gopkg.in/alexcesaro/statsd.v2"
)

// MediaQueue queues media for synced broadcast
type MediaQueue struct {
	log                             *log.Logger
	statsClient                     *statsd.Client
	queue                           []MediaQueueEntry
	queueMutex                      sync.RWMutex
	recentEntryCounts               map[string]int
	recentEntryCountsMutex          sync.RWMutex
	recentEntryCountsCache          *cache.Cache
	recentEntryCountsCacheUserMutex *nsync.NamedMutex
	removalOfOwnEntriesAllowed      bool
	skippingEnabled                 bool // all entries will behave as unskippable when false

	queueUpdated           *event.Event
	skippingAllowedUpdated *event.Event
	mediaChanged           *event.Event
	entryAdded             *event.Event

	// fired when an entry that is not at the top of the queue is removed prematurely
	// receives the removed entry as an argument
	deepEntryRemoved *event.Event
	ownEntryRemoved  *event.Event // receives the removed entry as an argument
}

// ErrInsufficientPermissionsToRemoveEntry indicates the user has insufficient permissions to remove an entry
var ErrInsufficientPermissionsToRemoveEntry = errors.New("insufficient permissions to remove queue entry")

func NewMediaQueue(ctx context.Context, log *log.Logger, statsClient *statsd.Client, persistenceFile string) (*MediaQueue, error) {
	q := &MediaQueue{
		log:                             log,
		statsClient:                     statsClient,
		recentEntryCounts:               make(map[string]int),
		recentEntryCountsCacheUserMutex: nsync.NewNamedMutex(),
		queueUpdated:                    event.New(),
		mediaChanged:                    event.New(),
		skippingAllowedUpdated:          event.New(),
		entryAdded:                      event.New(),
		deepEntryRemoved:                event.New(),
		ownEntryRemoved:                 event.New(),
		recentEntryCountsCache:          cache.New(10*time.Second, 30*time.Second),
		removalOfOwnEntriesAllowed:      true,
		skippingEnabled:                 true,
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

func (q *MediaQueue) RemovalOfOwnEntriesAllowed() bool {
	return q.removalOfOwnEntriesAllowed
}

func (q *MediaQueue) SetRemovalOfOwnEntriesAllowed(allowed bool) {
	q.removalOfOwnEntriesAllowed = allowed
	q.queueUpdated.Notify()
}

func (q *MediaQueue) SkippingEnabled() bool {
	return q.skippingEnabled
}

func (q *MediaQueue) SetSkippingEnabled(enabled bool) {
	q.skippingEnabled = enabled
	q.skippingAllowedUpdated.Notify()
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
	if len(q.queue) > 1 && !q.queue[0].Unskippable() && q.SkippingEnabled() {
		q.queue[0].Stop()
	}

	go q.statsClient.Gauge("queue_length", len(q.queue))
	q.queueUpdated.Notify()
	q.entryAdded.Notify("play_now", entry)
}

func (q *MediaQueue) SkipCurrentEntry() {
	q.queueMutex.Lock()
	defer q.queueMutex.Unlock()

	if len(q.queue) > 0 && !q.queue[0].Unskippable() {
		q.queue[0].Stop()

		go q.statsClient.Gauge("queue_length", len(q.queue))
		q.queueUpdated.Notify()
	}
}

func (q *MediaQueue) RemoveEntry(entryID string) (MediaQueueEntry, error) {
	q.queueMutex.Lock()
	defer q.queueMutex.Unlock()

	entry, err := q.removeEntryInMutex(entryID)
	return entry, stacktrace.Propagate(err, "")
}

func (q *MediaQueue) RemoveOwnEntry(entryID string, user User) error {
	if !q.removalOfOwnEntriesAllowed {
		return stacktrace.NewError("queue entry removal disallowed")
	}
	q.queueMutex.Lock()
	defer q.queueMutex.Unlock()

	for _, entry := range q.queue {
		if entryID == entry.QueueID() {
			reqBy := entry.RequestedBy()
			if reqBy == nil || reqBy.IsUnknown() || (reqBy != nil && reqBy.Address() != user.Address()) {
				return ErrInsufficientPermissionsToRemoveEntry
			}
			entry, err := q.removeEntryInMutex(entryID)
			if err != nil {
				return stacktrace.Propagate(err, "")
			}
			q.ownEntryRemoved.Notify(entry)
			return nil
		}
	}

	return stacktrace.NewError("queue entry not found")
}

func (q *MediaQueue) removeEntryInMutex(entryID string) (MediaQueueEntry, error) {
	if len(q.queue) == 0 {
		return nil, stacktrace.NewError("the queue is empty")
	}

	if entryID == q.queue[0].QueueID() {
		q.queue[0].Stop()
		return q.queue[0], nil
	}

	for i, entry := range q.queue {
		if entryID == entry.QueueID() {
			q.queue = append(q.queue[:i], q.queue[i+1:]...)
			q.deepEntryRemoved.Notify(entry)
			go q.statsClient.Gauge("queue_length", len(q.queue))
			q.queueUpdated.Notify()
			return entry, nil
		}
	}
	return nil, stacktrace.NewError("entry not found in the queue")
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
			err := q.logPlayedMedia(ctx, prevQueueEntry, currentQueueEntry)
			if err != nil {
				q.log.Println("Error logging played media:", stacktrace.Propagate(err, ""))
			}
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

func (q *MediaQueue) ProduceCheckpointForAPI(ctx context.Context, userSerializer APIUserSerializer) *proto.MediaConsumptionCheckpoint {
	currentEntry, playingSomething := q.CurrentlyPlaying()
	if !playingSomething {
		return &proto.MediaConsumptionCheckpoint{}
	}
	// the user serializer may request the queue lock. hence why we get the currently playing entry separately
	return currentEntry.ProduceCheckpointForAPI(ctx, userSerializer)
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

func (q *MediaQueue) logPlayedMedia(ctxCtx context.Context, prevMedia MediaQueueEntry, newMedia MediaQueueEntry) error {
	ctx, err := BeginTransaction(ctxCtx)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	defer ctx.Rollback()

	if prevMedia != nil {
		medias, err := types.GetPlayedMediaWithIDs(ctx, []string{prevMedia.QueueID()})
		if err != nil {
			return stacktrace.Propagate(err, "")
		}

		prevPlayedMedia := medias[prevMedia.QueueID()]
		prevPlayedMedia.EndedAt = sql.NullTime{
			Time:  time.Now(),
			Valid: true,
		}
		err = prevPlayedMedia.Update(ctx)
		if err != nil {
			return stacktrace.Propagate(err, "")
		}
		ctx.DeferToCommit(func() {
			q.recentEntryCountsCache.Delete(prevPlayedMedia.RequestedBy)
			go q.incrementRecentlyPlayedFor(prevMedia.RequestedBy(), recentPlayDuration)
		})
	}

	if newMedia != nil {
		newPlayedMedia := &types.PlayedMedia{
			ID:          newMedia.QueueID(),
			StartedAt:   time.Now(),
			MediaLength: types.Duration(newMedia.MediaInfo().Length()),
			MediaOffset: types.Duration(newMedia.MediaInfo().Offset()),
			RequestedBy: newMedia.RequestedBy().Address(),
			RequestCost: newMedia.RequestCost().Decimal(),
			Unskippable: newMedia.Unskippable(),
		}
		// this is not elegant but it will have to do for now
		// later on, we can specify that media queue entries need to know how to serialize themselves into a PlayedMedia
		switch v := newMedia.(type) {
		case *queueEntryYouTubeVideo:
			newPlayedMedia.MediaType = types.MediaTypeYouTubeVideo
			newPlayedMedia.YouTubeVideoID = &v.id
			newPlayedMedia.YouTubeVideoTitle = &v.title
		default:
			return stacktrace.NewError("unknown media queue entry type")
		}

		err = newPlayedMedia.Update(ctx)
		if err != nil {
			return stacktrace.Propagate(err, "")
		}
		ctx.DeferToCommit(func() {
			q.recentEntryCountsCache.Delete(newPlayedMedia.RequestedBy)
		})
	}

	return stacktrace.Propagate(ctx.Commit(), "")
}

const recentPlayDuration = 4 * time.Hour

func (q *MediaQueue) incrementRecentlyPlayedFor(requester User, incrementFor time.Duration) {
	if requester == nil || requester.IsUnknown() {
		return
	}

	func() {
		q.recentEntryCountsMutex.Lock()
		defer q.recentEntryCountsMutex.Unlock()
		q.recentEntryCounts[requester.Address()]++
	}()

	time.Sleep(incrementFor)

	q.recentEntryCountsMutex.Lock()
	defer q.recentEntryCountsMutex.Unlock()
	q.recentEntryCounts[requester.Address()]--
}

func (q *MediaQueue) getRecentlyPlayedVideosRequestedBy(ctx context.Context, requester User) (int, error) {
	if requester == nil || requester.IsUnknown() {
		return 0, nil
	}

	var count int
	var present bool
	func() {
		q.recentEntryCountsMutex.RLock()
		defer q.recentEntryCountsMutex.RUnlock()
		count, present = q.recentEntryCounts[requester.Address()]
	}()
	if present {
		return count, nil
	}
	count, err := q.fetchAndUpdateRecentlyPlayedVideosCount(ctx, requester)
	if err != nil {
		return 0, stacktrace.Propagate(err, "")
	}
	return count, nil
}

func (q *MediaQueue) fetchAndUpdateRecentlyPlayedVideosCount(ctxCtx context.Context, requester User) (int, error) {
	if requester == nil || requester.IsUnknown() {
		return 0, nil
	}

	ctx, err := BeginTransaction(ctxCtx)
	if err != nil {
		return 0, stacktrace.Propagate(err, "")
	}
	defer ctx.Commit() // read-only tx

	playedMedia, err := types.GetPlayedMediaRequestedBySince(ctx, requester.Address(), time.Now().Add(-recentPlayDuration))
	if err != nil {
		return 0, stacktrace.Propagate(err, "")
	}

	count := len(playedMedia)
	for _, m := range playedMedia {
		if !m.EndedAt.Valid {
			// we subtract one because this function should only return the count for entries that have already finished playing
			// (we include the currently playing entry in the total that is computed from the current queue in
			// CountEnqueuedOrRecentlyPlayedVideosRequestedBy)
			count--
			continue
		}
		go q.incrementRecentlyPlayedFor(requester, recentPlayDuration-time.Since(m.EndedAt.Time))
	}

	return count, nil
}

// CountEnqueuedOrRecentlyPlayedVideosRequestedBy returns the number of videos which are currently in queue or which have
// been recently enqueued by the specified user.
func (q *MediaQueue) CountEnqueuedOrRecentlyPlayedVideosRequestedBy(ctx context.Context, requester User) (int, bool, error) {
	if requester == nil || requester.IsUnknown() {
		return 0, false, nil
	}

	reqAddress := requester.Address()

	type cacheType struct {
		count            int
		requestedCurrent bool
	}

	// this is to ensure that we don't spawn concurrent cache filling processes for this user, even if this function is
	// concurrently called with the same user as argument
	q.recentEntryCountsCacheUserMutex.Lock(reqAddress)
	defer q.recentEntryCountsCacheUserMutex.Unlock(reqAddress)

	cachedIface, present := q.recentEntryCountsCache.Get(reqAddress)
	if present {
		c := cachedIface.(cacheType)
		return c.count, c.requestedCurrent, nil
	}

	count := 0
	requestedCurrent := false
	func() {
		q.queueMutex.RLock()
		defer q.queueMutex.RUnlock()
		for i, entry := range q.queue {
			if entry.RequestedBy() != nil && entry.RequestedBy().Address() == reqAddress {
				if i == 0 {
					requestedCurrent = true
				}
				count++
			}
		}
	}()

	recentCount, err := q.getRecentlyPlayedVideosRequestedBy(ctx, requester)
	if err != nil {
		return 0, false, stacktrace.Propagate(err, "")
	}
	q.recentEntryCountsCache.SetDefault(reqAddress, cacheType{
		count:            count + recentCount,
		requestedCurrent: requestedCurrent,
	})
	return count + recentCount, requestedCurrent, nil
}
