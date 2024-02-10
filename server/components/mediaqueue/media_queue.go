package mediaqueue

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"log"
	"math"
	"os"
	"sync"
	"time"

	"github.com/Yiling-J/theine-go"
	"github.com/bytedance/sonic"
	"github.com/palantir/stacktrace"
	"github.com/sethvargo/go-limiter"
	"github.com/sethvargo/go-limiter/memorystore"
	"github.com/tnyim/jungletv/buildconfig"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/server/auth"
	"github.com/tnyim/jungletv/server/media"
	"github.com/tnyim/jungletv/types"
	"github.com/tnyim/jungletv/utils/event"
	"github.com/tnyim/jungletv/utils/transaction"
	"golang.org/x/exp/slices"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"google.golang.org/protobuf/types/known/durationpb"
	"gopkg.in/alexcesaro/statsd.v2"
)

// MediaQueue queues media for synced broadcast
type MediaQueue struct {
	log                        *log.Logger
	statsClient                *statsd.Client
	queue                      []media.QueueEntry
	queueMutex                 sync.RWMutex
	recentEntryCounts          map[string]int
	recentEntryCountsMutex     sync.RWMutex
	recentEntryCountsCache     *theine.LoadingCache[string, recentEntryCountsValue]
	removalOfOwnEntriesAllowed bool
	entryReorderingAllowed     bool
	skippingEnabled            bool // all entries will behave as unskippable when false
	insertCursor               string
	playingSince               time.Time

	mediaProviders map[types.MediaType]media.Provider

	ownEntryRemovalRateLimiter limiter.Store

	queueUpdated           event.NoArgEvent
	skippingAllowedUpdated event.NoArgEvent
	mediaChanged           event.Event[media.QueueEntry]
	entryAdded             event.Event[EntryAddedEventArg]
	entryMoved             event.Event[EntryMovedEventArg]

	// fired when an entry is removed by any means: because it finished playing,
	// because it was skipped, or because it was removed from the queue before it could begin playing
	entryRemoved event.Event[EntryRemovedEventArg]
}

// ErrInsufficientPermissionsToRemoveEntry indicates the user has insufficient permissions to remove an entry
var ErrInsufficientPermissionsToRemoveEntry = errors.New("insufficient permissions to remove queue entry")

func New(ctx context.Context, log *log.Logger, statsClient *statsd.Client, persistenceFile string, mediaProviders map[types.MediaType]media.Provider) (*MediaQueue, error) {
	q := &MediaQueue{
		log:                        log,
		statsClient:                statsClient,
		recentEntryCounts:          make(map[string]int),
		queueUpdated:               event.NewNoArg(),
		mediaChanged:               event.New[media.QueueEntry](),
		skippingAllowedUpdated:     event.NewNoArg(),
		entryAdded:                 event.New[EntryAddedEventArg](),
		entryRemoved:               event.New[EntryRemovedEventArg](),
		entryMoved:                 event.New[EntryMovedEventArg](),
		removalOfOwnEntriesAllowed: true,
		entryReorderingAllowed:     true,
		skippingEnabled:            true,
		mediaProviders:             mediaProviders,
	}
	for _, provider := range mediaProviders {
		provider.SetMediaQueue(q)
	}
	var err error
	q.recentEntryCountsCache, err = theine.NewBuilder[string, recentEntryCountsValue](buildconfig.ExpectedConcurrentUsers).Loading(q.recentEntryCountsCacheLoader).Build()
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	q.ownEntryRemovalRateLimiter, err = memorystore.New(&memorystore.Config{
		Tokens:   4,
		Interval: 4 * time.Hour,
	})
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	if persistenceFile != "" {
		err := q.restoreQueueFromFile(ctx, persistenceFile)
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
	q.queueUpdated.Notify(false)
}

func (q *MediaQueue) RemovalOfOwnEntriesAllowed() bool {
	return q.removalOfOwnEntriesAllowed
}

func (q *MediaQueue) UserCanRemoveOwnEntries(ctx context.Context, user auth.User) (bool, error) {
	used, remaining, err := q.ownEntryRemovalRateLimiter.Get(ctx, user.Address())
	if err != nil {
		return false, stacktrace.Propagate(err, "")
	}
	// rate limiter memory store returns (0, 0, nil) when it doesn't find a key, instead of returning the maximum for remaining...
	tokensExhausted := remaining == 0 && used != 0
	return !tokensExhausted, nil
}

func (q *MediaQueue) SetRemovalOfOwnEntriesAllowed(allowed bool) {
	q.removalOfOwnEntriesAllowed = allowed
	q.queueUpdated.Notify(false)
}

func (q *MediaQueue) SkippingEnabled() bool {
	return q.skippingEnabled
}

func (q *MediaQueue) SetSkippingEnabled(enabled bool) {
	q.skippingEnabled = enabled
	q.skippingAllowedUpdated.Notify(false)
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
		if i != 0 && entryID == entry.PerformanceID() {
			q.insertCursor = entryID
			q.queueUpdated.Notify(false)
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
		q.queueUpdated.Notify(false)
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
		if q.insertCursor == entry.PerformanceID() {
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

func (q *MediaQueue) Entries() []media.QueueEntry {
	q.queueMutex.RLock()
	defer q.queueMutex.RUnlock()
	return slices.Clone(q.queue)
}

func (q *MediaQueue) Enqueue(newEntry media.QueueEntry) {
	q.queueMutex.Lock()
	defer q.queueMutex.Unlock()

	insertedAtCursor := false
	insertionIndex := 0
	if q.insertCursor != "" {
		for i, entry := range q.queue {
			if i == 0 {
				// never insert at the beginning (skip) even if that's where the cursor is
				continue
			}
			if q.insertCursor == entry.PerformanceID() {
				q.queue = append(q.queue[:i+1], q.queue[i:]...)
				q.queue[i] = newEntry
				insertedAtCursor = true
				insertionIndex = i
				break
			}
		}
	}
	if !insertedAtCursor {
		q.insertCursor = "" // if we had a cursor, it has clearly become invalid, so clear it
		q.queue = append(q.queue, newEntry)
		insertionIndex = len(q.queue) - 1
	}
	go q.statsClient.Gauge("queue_length", len(q.queue))
	q.queueUpdated.Notify(false)
	q.entryAdded.Notify(EntryAddedEventArg{insertionIndex, EntryAddedPlacementEnqueue, newEntry}, false)
}

func (q *MediaQueue) playAfterNextNoMutex(entry media.QueueEntry) int {
	if len(q.queue) < 2 {
		q.queue = append(q.queue, entry)
		return len(q.queue) - 1
	}
	q.queue = append(q.queue, nil)
	copy(q.queue[2:], q.queue[1:])
	q.queue[1] = entry
	return 1
}

func (q *MediaQueue) PlayAfterCurrent(entry media.QueueEntry) {
	q.queueMutex.Lock()
	defer q.queueMutex.Unlock()

	insertionIndex := q.playAfterNextNoMutex(entry)
	go q.statsClient.Gauge("queue_length", len(q.queue))
	q.queueUpdated.Notify(false)
	q.entryAdded.Notify(EntryAddedEventArg{insertionIndex, EntryAddedPlacementPlayNext, entry}, false)
}

func (q *MediaQueue) PlayNow(entry media.QueueEntry) {
	q.queueMutex.Lock()
	defer q.queueMutex.Unlock()

	q.playAfterNextNoMutex(entry)
	placement := EntryAddedPlacementPlayNext
	if len(q.queue) <= 1 {
		placement = EntryAddedPlacementEnqueue
	}
	if len(q.queue) > 1 && !q.queue[0].Unskippable() && q.SkippingEnabled() {
		placement = EntryAddedPlacementPlayNow
		q.queue[0].Stop()
	}

	go q.statsClient.Gauge("queue_length", len(q.queue))
	q.queueUpdated.Notify(false)
	q.entryAdded.Notify(EntryAddedEventArg{0, placement, entry}, false)
}

func (q *MediaQueue) SkipCurrentEntry() {
	q.queueMutex.Lock()
	defer q.queueMutex.Unlock()

	if len(q.queue) > 0 && !q.queue[0].Unskippable() {
		q.queue[0].Stop()

		go q.statsClient.Gauge("queue_length", len(q.queue))
		q.queueUpdated.Notify(false)
	}
}

func (q *MediaQueue) RemoveEntry(entryID string) (media.QueueEntry, error) {
	q.queueMutex.Lock()
	defer q.queueMutex.Unlock()

	entry, err := q.removeEntryInMutex(entryID, false)
	return entry, stacktrace.Propagate(err, "")
}

func (q *MediaQueue) RemoveOwnEntry(ctx context.Context, entryID string, user auth.User) error {
	if !q.removalOfOwnEntriesAllowed {
		return stacktrace.NewError("queue entry removal disallowed")
	}
	q.queueMutex.Lock()
	defer q.queueMutex.Unlock()

	for _, entry := range q.queue {
		if entryID == entry.PerformanceID() {
			reqBy := entry.RequestedBy()
			if reqBy == nil || reqBy.IsUnknown() || (reqBy != nil && reqBy.Address() != user.Address()) {
				return ErrInsufficientPermissionsToRemoveEntry
			}

			_, _, _, ok, err := q.ownEntryRemovalRateLimiter.Take(ctx, user.Address())
			if err != nil {
				return stacktrace.Propagate(err, "")
			}
			if !ok {
				return status.Errorf(codes.ResourceExhausted, "rate limit reached")
			}

			_, err = q.removeEntryInMutex(entryID, true)
			if err != nil {
				return stacktrace.Propagate(err, "")
			}
			return nil
		}
	}

	return stacktrace.NewError("queue entry not found")
}

func (q *MediaQueue) removeEntryInMutex(entryID string, selfRemoval bool) (media.QueueEntry, error) {
	if len(q.queue) == 0 {
		return nil, stacktrace.NewError("the queue is empty")
	}

	if entryID == q.queue[0].PerformanceID() {
		q.queue[0].Stop()
		// ProcessQueueWorker will take care of firing entryRemoved
		return q.queue[0], nil
	}

	for i, entry := range q.queue {
		if entryID == entry.PerformanceID() {
			q.queue = append(q.queue[:i], q.queue[i+1:]...)
			q.entryRemoved.Notify(EntryRemovedEventArg{i, entry, selfRemoval}, false)
			go q.statsClient.Gauge("queue_length", len(q.queue))
			q.queueUpdated.Notify(false)
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
		if entryID != entry.PerformanceID() {
			continue
		}

		err := q.canMoveEntryInMutex(i, user, up)
		if err != nil {
			return stacktrace.Propagate(err, "")
		}

		entry.SetAsMovedBy(user)

		newIndex := i + 1
		if up {
			newIndex = i - 1
		}
		q.queue[newIndex], q.queue[i] = q.queue[i], q.queue[newIndex]
		q.queueUpdated.Notify(false)
		q.entryMoved.Notify(EntryMovedEventArg{
			PreviousIndex: i,
			CurrentIndex:  newIndex,
			User:          user,
			Entry:         entry,
			Up:            up,
		}, false)

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
		(q.insertCursor == q.queue[i].PerformanceID() ||
			(up && q.insertCursor == q.queue[i-1].PerformanceID()) ||
			(!up && q.insertCursor == q.queue[i+1].PerformanceID())) {
		return stacktrace.NewError("this entry is not in a position where it can be moved")
	}

	if q.queue[i].WasMovedBy(user) {
		return stacktrace.NewError("this user has already moved this entry")
	}
	return nil
}

func (q *MediaQueue) ProcessQueueWorker(ctx context.Context) {
	onQueueUpdated, queueUpdatedU := q.queueUpdated.Subscribe(event.BufferFirst)
	defer queueUpdatedU()
	var prevQueueEntry media.QueueEntry
	for {
		onNextMedia := make(<-chan struct{})
		unsubscribe := func() {}
		var currentQueueEntry media.QueueEntry
		func() {
			q.queueMutex.Lock()
			defer q.queueMutex.Unlock()

			if len(q.queue) > 0 {
				currentQueueEntry = q.queue[0]
				if currentQueueEntry.PerformanceID() == q.insertCursor {
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
			if prevQueueEntry != nil {
				q.entryRemoved.Notify(EntryRemovedEventArg{0, prevQueueEntry, false}, false)
			}
			prevQueueEntry = currentQueueEntry
			q.mediaChanged.Notify(currentQueueEntry, false)
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
			onNextMedia, unsubscribe = ev.Subscribe(event.BufferFirst)
			length := currentQueueEntry.MediaInfo().Length()
			lengthStr := "infinite"
			if length != math.MaxInt64 {
				lengthStr = currentQueueEntry.MediaInfo().Length().String()
			}
			q.log.Printf("Current queue entry: \"%s\" with length %s", currentQueueEntry.MediaInfo().Title(), lengthStr)
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
	q.queueUpdated.Notify(false)
}

func (q *MediaQueue) CurrentlyPlaying() (media.QueueEntry, bool) {
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
	cp := currentEntry.ProduceCheckpointForAPI(ctx)
	cp.MediaPresent = true
	cp.CurrentPosition = durationpb.New(currentEntry.MediaInfo().Offset() + currentEntry.PlayedFor())
	cp.RequestCost = currentEntry.RequestCost().SerializeForAPI()
	if needsTitle {
		title := currentEntry.MediaInfo().Title()
		cp.MediaTitle = &title
	}
	if !currentEntry.RequestedBy().IsUnknown() {
		cp.RequestedBy = userSerializer(ctx, currentEntry.RequestedBy())
	}
	return cp
}

func (q *MediaQueue) persistenceWorker(ctx context.Context, file string) {
	c, queueUpdatedU := q.queueUpdated.Subscribe(event.BufferFirst)
	defer queueUpdatedU()

	for {
		select {
		case <-c:
			marshalled, err := sonic.Marshal(q.Entries())
			if err != nil {
				q.log.Printf("error serializing queue: %v", err)
				continue
			}
			err = os.WriteFile(file, marshalled, 0644)
			if err != nil {
				q.log.Printf("error writing queue to file: %v", err)
				continue
			}
		case <-ctx.Done():
			return
		}
	}
}

func (q *MediaQueue) restoreQueueFromFile(ctx context.Context, file string) error {
	b, err := os.ReadFile(file)
	if err != nil {
		if errors.Is(err, os.ErrNotExist) {
			return nil
		}
		return stacktrace.Propagate(err, "error reading queue from file: %v", err)
	}

	type unknownTypeEntry struct {
		Type string
	}

	var entries []json.RawMessage
	err = sonic.Unmarshal(b, &entries)
	if err != nil {
		return stacktrace.Propagate(err, "error decoding queue from file: %v", err)
	}
	q.queueMutex.Lock()
	defer q.queueMutex.Unlock()

	q.queue = make([]media.QueueEntry, 0, len(entries))
	for i := range entries {
		unknownEntry := unknownTypeEntry{}
		err := sonic.Unmarshal(entries[i], &unknownEntry)
		if err != nil {
			return stacktrace.Propagate(err, "")
		}

		provider, ok := q.mediaProviders[types.MediaType(unknownEntry.Type)]
		if !ok {
			return stacktrace.NewError("unknown media queue entry type %s in persisted queue", unknownEntry.Type)
		}

		entry, keepInQueue, err := provider.UnmarshalQueueEntryJSON(ctx, entries[i])
		if err != nil {
			return stacktrace.Propagate(err, "")
		}

		if entry != nil && keepInQueue {
			q.queue = append(q.queue, entry)
		}
	}
	go q.statsClient.Gauge("queue_length", len(q.queue))
	q.queueUpdated.Notify(false)
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

func (q *MediaQueue) logPlayedMedia(ctxCtx context.Context, prevMedia media.QueueEntry, newMedia media.QueueEntry) error {
	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	defer ctx.Rollback()

	now := time.Now()
	if prevMedia != nil {
		medias, err := types.GetPlayedMediaWithIDs(ctx, []string{prevMedia.PerformanceID()})
		if err != nil {
			return stacktrace.Propagate(err, "")
		}

		prevPlayedMedia, ok := medias[prevMedia.PerformanceID()]
		if !ok {
			return stacktrace.NewError("previous media not returned from database")
		}
		prevPlayedMedia.EndedAt = sql.NullTime{
			Time:  now,
			Valid: true,
		}
		if prevPlayedMedia.MediaLength == 0 { // e.g. application pages with "undefined" duration
			prevPlayedMedia.MediaLength = types.Duration(now.Sub(prevPlayedMedia.StartedAt))
		}
		err = prevPlayedMedia.Update(ctx)
		if err != nil {
			return stacktrace.Propagate(err, "")
		}
		ctx.DeferToCommit(func() {
			q.recentEntryCountsCache.Delete(prevPlayedMedia.RequestedBy)
			if prevMedia.RequestedBy() != nil && !prevMedia.RequestedBy().IsUnknown() {
				go q.incrementRecentlyPlayedFor(prevMedia.RequestedBy().Address(), recentPlayDuration)
			}
		})
	}

	if newMedia != nil {
		newPlayedMedia, err := newMedia.ProducePlayedMedia()
		if err != nil {
			return stacktrace.Propagate(err, "")
		}
		newPlayedMedia.StartedAt = now

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

func (q *MediaQueue) incrementRecentlyPlayedFor(requesterAddress string, incrementFor time.Duration) {
	func() {
		q.recentEntryCountsMutex.Lock()
		defer q.recentEntryCountsMutex.Unlock()
		q.recentEntryCounts[requesterAddress]++
	}()

	time.Sleep(incrementFor)

	q.recentEntryCountsMutex.Lock()
	defer q.recentEntryCountsMutex.Unlock()
	q.recentEntryCounts[requesterAddress]--
}

func (q *MediaQueue) getRecentlyPlayedMediaRequestedBy(ctx context.Context, requesterAddress string) (int, error) {
	var count int
	var present bool
	func() {
		q.recentEntryCountsMutex.RLock()
		defer q.recentEntryCountsMutex.RUnlock()
		count, present = q.recentEntryCounts[requesterAddress]
	}()
	if present {
		return count, nil
	}
	count, err := q.fetchAndUpdateRecentlyPlayedMediaCount(ctx, requesterAddress)
	if err != nil {
		return 0, stacktrace.Propagate(err, "")
	}
	return count, nil
}

func (q *MediaQueue) fetchAndUpdateRecentlyPlayedMediaCount(ctxCtx context.Context, requesterAddress string) (int, error) {
	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return 0, stacktrace.Propagate(err, "")
	}
	defer ctx.Commit() // read-only tx

	playedMedia, err := types.GetPlayedMediaRequestedBySince(ctx, requesterAddress, time.Now().Add(-recentPlayDuration))
	if err != nil {
		return 0, stacktrace.Propagate(err, "")
	}

	count := len(playedMedia)
	for _, m := range playedMedia {
		if !m.EndedAt.Valid {
			// we subtract one because this function should only return the count for entries that have already finished playing
			// (we include the currently playing entry in the total that is computed from the current queue in
			// CountEnqueuedOrRecentlyPlayedMediaRequestedBy)
			count--
			continue
		}
		go q.incrementRecentlyPlayedFor(requesterAddress, recentPlayDuration-time.Since(m.EndedAt.Time))
	}

	return count, nil
}

type recentEntryCountsValue struct {
	count            int
	requestedCurrent bool
}

// CountEnqueuedOrRecentlyPlayedMediaRequestedBy returns the number of entries which are currently in queue or which have
// been recently enqueued by the specified user.
func (q *MediaQueue) CountEnqueuedOrRecentlyPlayedMediaRequestedBy(ctx context.Context, requester auth.User) (int, bool, error) {
	if requester == nil || requester.IsUnknown() {
		return 0, false, nil
	}

	cached, err := q.recentEntryCountsCache.Get(ctx, requester.Address())
	if err != nil {
		return 0, false, stacktrace.Propagate(err, "")
	}

	return cached.count, cached.requestedCurrent, nil
}

func (q *MediaQueue) recentEntryCountsCacheLoader(ctx context.Context, reqAddress string) (theine.Loaded[recentEntryCountsValue], error) {
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

	recentCount, err := q.getRecentlyPlayedMediaRequestedBy(ctx, reqAddress)
	if err != nil {
		return theine.Loaded[recentEntryCountsValue]{}, stacktrace.Propagate(err, "")
	}

	return theine.Loaded[recentEntryCountsValue]{
		Value: recentEntryCountsValue{
			count:            count + recentCount,
			requestedCurrent: requestedCurrent,
		},
		Cost: 1,
		TTL:  10 * time.Minute,
	}, nil
}
