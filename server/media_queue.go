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
	"github.com/tnyim/jungletv/server/auth"
	"github.com/tnyim/jungletv/types"
	"github.com/tnyim/jungletv/utils/event"
	"github.com/tnyim/jungletv/utils/transaction"
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
	recentEntryCountsCache          *cache.Cache[string, recentEntryCountsValue]
	recentEntryCountsCacheUserMutex *nsync.NamedMutex
	removalOfOwnEntriesAllowed      bool
	entryReorderingAllowed          bool
	skippingEnabled                 bool // all entries will behave as unskippable when false
	insertCursor                    string
	playingSince                    time.Time

	queueUpdated           *event.NoArgEvent
	skippingAllowedUpdated *event.NoArgEvent
	mediaChanged           *event.Event[MediaQueueEntry]
	entryAdded             *event.Event[entryAddedEventArg]

	// fired when an entry that is not at the top of the queue is removed prematurely
	// receives the removed entry as an argument
	deepEntryRemoved *event.Event[MediaQueueEntry]
	ownEntryRemoved  *event.Event[MediaQueueEntry] // receives the removed entry as an argument
	entryMoved       *event.Event[entryMovedEventArg]
}

type entryAddedEventArg struct {
	addType string
	entry   MediaQueueEntry
}

type entryMovedEventArg struct {
	user  auth.User
	entry MediaQueueEntry
	up    bool
}

// ErrInsufficientPermissionsToRemoveEntry indicates the user has insufficient permissions to remove an entry
var ErrInsufficientPermissionsToRemoveEntry = errors.New("insufficient permissions to remove queue entry")

func NewMediaQueue(ctx context.Context, log *log.Logger, statsClient *statsd.Client, persistenceFile string) (*MediaQueue, error) {
	q := &MediaQueue{
		log:                             log,
		statsClient:                     statsClient,
		recentEntryCounts:               make(map[string]int),
		recentEntryCountsCacheUserMutex: nsync.NewNamedMutex(),
		queueUpdated:                    event.NewNoArg(),
		mediaChanged:                    event.New[MediaQueueEntry](),
		skippingAllowedUpdated:          event.NewNoArg(),
		entryAdded:                      event.New[entryAddedEventArg](),
		deepEntryRemoved:                event.New[MediaQueueEntry](),
		ownEntryRemoved:                 event.New[MediaQueueEntry](),
		entryMoved:                      event.New[entryMovedEventArg](),
		recentEntryCountsCache:          cache.New[string, recentEntryCountsValue](10*time.Second, 30*time.Second),
		removalOfOwnEntriesAllowed:      true,
		entryReorderingAllowed:          true,
		skippingEnabled:                 true,
	}
	if persistenceFile != "" {
		err := q.restoreQueueFromFile(persistenceFile)
		if err != nil {
			return nil, stacktrace.Propagate(err, "")
		}

		err = q.restorePlayingSinceFromDatabase(ctx)
		if err != nil {
			return nil, stacktrace.Propagate(err, "")
		}
		go q.persistenceWorker(ctx, persistenceFile)
	}
	return q, nil
}

func (q *MediaQueue) EntryReorderingAllowed() bool {
	return q.entryReorderingAllowed
}

func (q *MediaQueue) SetEntryReorderingAllowed(allowed bool) {
	q.entryReorderingAllowed = allowed
	q.queueUpdated.Notify()
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

func (q *MediaQueue) InsertCursor() (string, bool) {
	q.queueMutex.RLock()
	defer q.queueMutex.RUnlock()
	return q.insertCursor, q.insertCursor != ""
}

func (q *MediaQueue) SetInsertCursor(entryID string) error {
	q.queueMutex.Lock()
	defer q.queueMutex.Unlock()

	for i, entry := range q.queue {
		// never allow for setting the cursor to the currently playing entry
		if i != 0 && entryID == entry.QueueID() {
			q.insertCursor = entryID
			q.queueUpdated.Notify()
			return nil
		}
	}

	return stacktrace.NewError("entry not found")
}

func (q *MediaQueue) ClearInsertCursor() {
	q.queueMutex.Lock()
	defer q.queueMutex.Unlock()

	if q.insertCursor != "" {
		q.insertCursor = ""
		q.queueUpdated.Notify()
	}
}

func (q *MediaQueue) Length() int {
	q.queueMutex.RLock()
	defer q.queueMutex.RUnlock()
	return len(q.queue)
}

func (q *MediaQueue) LengthUpToCursor() int {
	q.queueMutex.RLock()
	defer q.queueMutex.RUnlock()

	if q.insertCursor == "" {
		return len(q.queue)
	}

	l := 0
	for _, entry := range q.queue {
		if q.insertCursor == entry.QueueID() {
			return l
		}
		l++
	}
	return l
}

func (q *MediaQueue) PlayingSince() time.Time {
	q.queueMutex.RLock()
	defer q.queueMutex.RUnlock()
	return q.playingSince
}

func (q *MediaQueue) Entries() []MediaQueueEntry {
	q.queueMutex.RLock()
	defer q.queueMutex.RUnlock()
	queueCopy := make([]MediaQueueEntry, len(q.queue))
	copy(queueCopy, q.queue)
	return queueCopy
}

func (q *MediaQueue) Enqueue(newEntry MediaQueueEntry) {
	q.queueMutex.Lock()
	defer q.queueMutex.Unlock()

	insertedAtCursor := false
	if q.insertCursor != "" {
		for i, entry := range q.queue {
			if i == 0 {
				// never insert at the beginning (skip) even if that's where the cursor is
				continue
			}
			if q.insertCursor == entry.QueueID() {
				q.queue = append(q.queue[:i+1], q.queue[i:]...)
				q.queue[i] = newEntry
				insertedAtCursor = true
				break
			}
		}
	}
	if !insertedAtCursor {
		q.insertCursor = "" // if we had a cursor, it has clearly become invalid, so clear it
		q.queue = append(q.queue, newEntry)
	}
	go q.statsClient.Gauge("queue_length", len(q.queue))
	q.queueUpdated.Notify()
	q.entryAdded.Notify(entryAddedEventArg{"enqueue", newEntry})
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
	q.entryAdded.Notify(entryAddedEventArg{"play_after_next", entry})
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
	q.entryAdded.Notify(entryAddedEventArg{"play_now", entry})
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

func (q *MediaQueue) RemoveOwnEntry(entryID string, user auth.User) error {
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

func (q *MediaQueue) MoveEntry(entryID string, user auth.User, up bool) error {
	if !q.entryReorderingAllowed {
		return stacktrace.NewError("queue entry reordering disallowed")
	}
	q.queueMutex.Lock()
	defer q.queueMutex.Unlock()

	for i, entry := range q.queue {
		if entryID != entry.QueueID() {
			continue
		}

		err := q.canMoveEntryInMutex(i, user, up)
		if err != nil {
			return stacktrace.Propagate(err, "")
		}

		entry.SetAsMovedBy(user)

		if up {
			q.queue[i-1], q.queue[i] = q.queue[i], q.queue[i-1]
		} else {
			q.queue[i+1], q.queue[i] = q.queue[i], q.queue[i+1]
		}
		q.queueUpdated.Notify()
		q.entryMoved.Notify(entryMovedEventArg{
			user:  user,
			entry: entry,
			up:    up,
		})

		return nil
	}
	return stacktrace.NewError("queue entry not found")
}

func (q *MediaQueue) CanMoveEntryByIndex(index int, user auth.User, up bool) bool {
	if !q.entryReorderingAllowed || user == nil || user.IsUnknown() {
		return false
	}
	q.queueMutex.RLock()
	defer q.queueMutex.RUnlock()

	if index <= 0 || index >= len(q.queue) {
		return false
	}

	err := q.canMoveEntryInMutex(index, user, up)
	return err == nil
}

func (q *MediaQueue) canMoveEntryInMutex(i int, user auth.User, up bool) error {
	if i == 0 ||
		(i <= 1 && up) ||
		(i >= len(q.queue)-1 && !up) {
		return stacktrace.NewError("this entry is not in a position where it can be moved")
	}

	if q.insertCursor != "" &&
		(q.insertCursor == q.queue[i].QueueID() ||
			(up && q.insertCursor == q.queue[i-1].QueueID()) ||
			(!up && q.insertCursor == q.queue[i+1].QueueID())) {
		return stacktrace.NewError("this entry is not in a position where it can be moved")
	}

	if q.queue[i].WasMovedBy(user) {
		return stacktrace.NewError("this user has already moved this entry")
	}
	return nil
}

func (q *MediaQueue) ProcessQueueWorker(ctx context.Context) {
	onQueueUpdated, queueUpdatedU := q.queueUpdated.Subscribe(event.AtLeastOnceGuarantee)
	defer queueUpdatedU()
	var prevQueueEntry MediaQueueEntry
	for {
		onNextMedia := make(<-chan struct{})
		unsubscribe := func() {}
		var currentQueueEntry MediaQueueEntry
		func() {
			q.queueMutex.Lock()
			defer q.queueMutex.Unlock()

			if len(q.queue) > 0 {
				currentQueueEntry = q.queue[0]
				if currentQueueEntry.QueueID() == q.insertCursor {
					q.insertCursor = ""
				}
				if q.playingSince.IsZero() {
					q.playingSince = time.Now()
				}
			} else {
				q.insertCursor = ""
				q.playingSince = time.Time{}
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
			onNextMedia, unsubscribe = ev.Subscribe(event.AtLeastOnceGuarantee)
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

	length := len(q.queue)
	if length == 0 {
		return
	}

	q.queue = q.queue[1:]
	length = length - 1

	go q.statsClient.Gauge("queue_length", length)
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

func (q *MediaQueue) ProduceCheckpointForAPI(ctx context.Context, userSerializer auth.APIUserSerializer, needsTitle bool) *proto.MediaConsumptionCheckpoint {
	currentEntry, playingSomething := q.CurrentlyPlaying()
	if !playingSomething {
		return &proto.MediaConsumptionCheckpoint{}
	}
	// the user serializer may request the queue lock. hence why we get the currently playing entry separately
	return currentEntry.ProduceCheckpointForAPI(ctx, userSerializer, needsTitle)
}

func (q *MediaQueue) persistenceWorker(ctx context.Context, file string) {
	c, queueUpdatedU := q.queueUpdated.Subscribe(event.AtLeastOnceGuarantee)
	defer queueUpdatedU()

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

func (q *MediaQueue) restorePlayingSinceFromDatabase(ctxCtx context.Context) error {
	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	defer ctx.Commit() // read-only tx

	q.queueMutex.Lock()
	defer q.queueMutex.Unlock()

	mostRecentEvent, err := types.GetMostRecentMediaQueueEventWithType(ctx, types.MediaQueueEmptied, types.MediaQueueFilled)
	if err != nil {
		if !errors.Is(err, types.ErrMediaQueueEventNotFound) {
			return stacktrace.Propagate(err, "")
		}
		q.playingSince = time.Time{}
		return nil
	}

	if mostRecentEvent.EventType == types.MediaQueueEmptied {
		q.playingSince = time.Time{}
	} else {
		q.playingSince = mostRecentEvent.CreatedAt
	}
	return nil
}

func (q *MediaQueue) logPlayedMedia(ctxCtx context.Context, prevMedia MediaQueueEntry, newMedia MediaQueueEntry) error {
	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	defer ctx.Rollback()

	now := time.Now()
	if prevMedia != nil {
		medias, err := types.GetPlayedMediaWithIDs(ctx, []string{prevMedia.QueueID()})
		if err != nil {
			return stacktrace.Propagate(err, "")
		}

		prevPlayedMedia, ok := medias[prevMedia.QueueID()]
		if !ok {
			return stacktrace.NewError("previous media not returned from database")
		}
		prevPlayedMedia.EndedAt = sql.NullTime{
			Time:  now,
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
		mediaInfo := newMedia.MediaInfo()
		newPlayedMedia := &types.PlayedMedia{
			ID:          newMedia.QueueID(),
			EnqueuedAt:  newMedia.RequestedAt(),
			StartedAt:   now,
			MediaLength: types.Duration(mediaInfo.Length()),
			MediaOffset: types.Duration(mediaInfo.Offset()),
			RequestedBy: newMedia.RequestedBy().Address(),
			RequestCost: newMedia.RequestCost().Decimal(),
			Unskippable: newMedia.Unskippable(),
		}
		// this is not elegant but it will have to do for now
		// later on, we can specify that media queue entries need to know how to serialize themselves into a PlayedMedia
		mediaType, mediaID := mediaInfo.MediaID()
		switch mediaType {
		case types.MediaTypeYouTubeVideo:
			newPlayedMedia.MediaType = types.MediaTypeYouTubeVideo
			newPlayedMedia.YouTubeVideoID = &mediaID
			mediaTitle := mediaInfo.Title()
			newPlayedMedia.YouTubeVideoTitle = &mediaTitle
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

	mostRecentEvent, err := types.GetMostRecentMediaQueueEventWithType(ctx, types.MediaQueueEmptied, types.MediaQueueFilled)
	if err != nil {
		if !errors.Is(err, types.ErrMediaQueueEventNotFound) {
			return stacktrace.Propagate(err, "")
		}
		mostRecentEvent = nil
	}

	if prevMedia == nil && newMedia != nil &&
		(mostRecentEvent == nil || mostRecentEvent.EventType != types.MediaQueueFilled) {
		err = types.InsertMediaQueueEvents(ctx, []*types.MediaQueueEvent{
			{
				CreatedAt: now,
				EventType: types.MediaQueueFilled,
			},
		})
		if err != nil {
			return stacktrace.Propagate(err, "")
		}
	}

	if prevMedia != nil && newMedia == nil &&
		(mostRecentEvent == nil || mostRecentEvent.EventType != types.MediaQueueEmptied) {
		err = types.InsertMediaQueueEvents(ctx, []*types.MediaQueueEvent{
			{
				CreatedAt: now,
				EventType: types.MediaQueueEmptied,
			},
		})
		if err != nil {
			return stacktrace.Propagate(err, "")
		}
	}

	return stacktrace.Propagate(ctx.Commit(), "")
}

const recentPlayDuration = 4 * time.Hour

func (q *MediaQueue) incrementRecentlyPlayedFor(requester auth.User, incrementFor time.Duration) {
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

func (q *MediaQueue) getRecentlyPlayedVideosRequestedBy(ctx context.Context, requester auth.User) (int, error) {
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

func (q *MediaQueue) fetchAndUpdateRecentlyPlayedVideosCount(ctxCtx context.Context, requester auth.User) (int, error) {
	if requester == nil || requester.IsUnknown() {
		return 0, nil
	}

	ctx, err := transaction.Begin(ctxCtx)
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

type recentEntryCountsValue struct {
	count            int
	requestedCurrent bool
}

// CountEnqueuedOrRecentlyPlayedVideosRequestedBy returns the number of videos which are currently in queue or which have
// been recently enqueued by the specified user.
func (q *MediaQueue) CountEnqueuedOrRecentlyPlayedVideosRequestedBy(ctx context.Context, requester auth.User) (int, bool, error) {
	if requester == nil || requester.IsUnknown() {
		return 0, false, nil
	}

	reqAddress := requester.Address()

	// this is to ensure that we don't spawn concurrent cache filling processes for this user, even if this function is
	// concurrently called with the same user as argument
	q.recentEntryCountsCacheUserMutex.Lock(reqAddress)
	defer q.recentEntryCountsCacheUserMutex.Unlock(reqAddress)

	c, present := q.recentEntryCountsCache.Get(reqAddress)
	if present {
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
	q.recentEntryCountsCache.SetDefault(reqAddress, recentEntryCountsValue{
		count:            count + recentCount,
		requestedCurrent: requestedCurrent,
	})
	return count + recentCount, requestedCurrent, nil
}
