package media

import (
	"time"

	"github.com/bytedance/sonic"
	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/server/auth"
	"github.com/tnyim/jungletv/server/components/payment"
	"github.com/tnyim/jungletv/types"
	"github.com/tnyim/jungletv/utils/event"
	"golang.org/x/exp/maps"
)

// CommonQueueEntry contains the common implementation of some QueueEntry functionality
type CommonQueueEntry struct {
	overrider QueueEntry
	queueID   string

	unskippable bool
	concealed   bool

	requestedBy auth.User
	requestCost payment.Amount
	requestedAt time.Time

	startedPlaying time.Time
	stoppedPlaying time.Time
	played         bool
	donePlaying    event.NoArgEvent

	movedBy map[string]struct{}

	mediaInfo Info
}

func (e *CommonQueueEntry) InitializeBase(mediaInfo Info, overrider QueueEntry) {
	e.overrider = overrider
	e.donePlaying = event.NewNoArg()
	e.movedBy = make(map[string]struct{})
	e.mediaInfo = mediaInfo
	e.requestedBy = auth.UnknownUser
}

// QueueID implements the QueueEntry interface
func (e *CommonQueueEntry) QueueID() string {
	return e.queueID
}

func (e *CommonQueueEntry) MediaInfo() Info {
	return e.mediaInfo
}

func (e *CommonQueueEntry) SetQueueID(queueID string) {
	e.queueID = queueID
}

// Play implements the QueueEntry interface
func (e *CommonQueueEntry) Play() {
	e.startedPlaying = time.Now()
	c := time.NewTimer(e.mediaInfo.Length()).C
	go func() {
		donePlaying, donePlayingU := e.overrider.DonePlaying().Subscribe(event.BufferFirst)
		defer donePlayingU()
		select {
		case <-donePlaying:
			return
		case <-c:
			e.overrider.Stop()
		}

	}()
}

func (e *CommonQueueEntry) SetStartedPlaying(t time.Time) {
	e.startedPlaying = t
}

// Played implements the QueueEntry interface
func (e *CommonQueueEntry) Played() bool {
	return e.played
}

// Stop implements the QueueEntry interface
func (e *CommonQueueEntry) Stop() {
	if !e.overrider.Playing() {
		return
	}
	e.played = true
	e.stoppedPlaying = time.Now()
	e.overrider.DonePlaying().Notify(true)
}

// Playing implements the QueueEntry interface
func (e *CommonQueueEntry) Playing() bool {
	return !e.startedPlaying.IsZero() && !e.played
}

// PlayedFor implements the QueueEntry interface
func (e *CommonQueueEntry) PlayedFor() time.Duration {
	if !e.overrider.Playing() {
		return e.stoppedPlaying.Sub(e.startedPlaying)
	}
	return time.Since(e.startedPlaying)
}

// DonePlaying implements the QueueEntry interface
func (e *CommonQueueEntry) DonePlaying() event.NoArgEvent {
	return e.donePlaying
}

// RequestedBy implements the QueueEntry interface
func (e *CommonQueueEntry) RequestedBy() auth.User {
	return e.requestedBy
}

func (e *CommonQueueEntry) SetRequestedBy(user auth.User) {
	e.requestedBy = user
}

// RequestCost implements the QueueEntry interface
func (e *CommonQueueEntry) RequestCost() payment.Amount {
	return e.requestCost
}

func (e *CommonQueueEntry) SetRequestCost(amount payment.Amount) {
	e.requestCost = amount
}

// RequestedAt implements the QueueEntry interface
func (e *CommonQueueEntry) RequestedAt() time.Time {
	return e.requestedAt
}

func (e *CommonQueueEntry) SetRequestedAt(requestedAt time.Time) {
	e.requestedAt = requestedAt
}

// Unskippable implements the QueueEntry interface
func (e *CommonQueueEntry) Unskippable() bool {
	return e.unskippable
}

func (e *CommonQueueEntry) SetUnskippable(unskippable bool) {
	e.unskippable = unskippable
}

// Concealed implements the QueueEntry interface
func (e *CommonQueueEntry) Concealed() bool {
	return e.concealed
}

func (e *CommonQueueEntry) SetConcealed(concealed bool) {
	e.concealed = concealed
}

// WasMovedBy implements the QueueEntry interface
func (e *CommonQueueEntry) WasMovedBy(user auth.User) bool {
	if user.IsUnknown() {
		return false
	}
	_, present := e.movedBy[user.Address()]
	return present
}

// SetAsMovedBy implements the QueueEntry interface
func (e *CommonQueueEntry) SetAsMovedBy(user auth.User) {
	if !user.IsUnknown() {
		e.movedBy[user.Address()] = struct{}{}
	}
}

// MovedBy implements the QueueEntry interface
func (e *CommonQueueEntry) MovedBy() []string {
	return maps.Keys(e.movedBy)
}

func (e *CommonQueueEntry) BaseProducePlayedMedia(mediaType types.MediaType, mediaID string, mediaInfo interface{}) (*types.PlayedMedia, error) {
	playedMedia := &types.PlayedMedia{
		ID:          e.overrider.QueueID(),
		EnqueuedAt:  e.overrider.RequestedAt(),
		MediaLength: types.Duration(e.mediaInfo.Length()),
		MediaOffset: types.Duration(e.mediaInfo.Offset()),
		RequestedBy: e.overrider.RequestedBy().Address(),
		RequestCost: e.overrider.RequestCost().Decimal(),
		Unskippable: e.overrider.Unskippable(),
		MediaType:   mediaType,
		MediaID:     mediaID,
	}

	if mediaInfo != nil {
		var err error
		playedMedia.MediaInfo, err = sonic.Marshal(mediaInfo)
		if err != nil {
			return nil, stacktrace.Propagate(err, "")
		}
	}

	return playedMedia, nil
}

func (e *CommonQueueEntry) FillMediaQueueEntryFields(requestedBy auth.User, requestCost payment.Amount, unskippable, concealed bool, queueID string) {
	e.SetRequestedBy(requestedBy)
	e.SetRequestCost(requestCost)
	e.SetUnskippable(unskippable)
	e.SetConcealed(concealed)
	e.SetQueueID(queueID)
	e.SetRequestedAt(time.Now())
}
