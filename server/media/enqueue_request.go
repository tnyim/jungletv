package media

import "github.com/tnyim/jungletv/server/auth"

// EnqueueRequest is a request to create an EnqueueTicket
type EnqueueRequest interface {
	RequestedBy() auth.User
	Unskippable() bool
	Concealed() bool
	ActionableMediaInfo() ActionableInfo
}

// EnqueueRequestCreationResult contains the result of creating a media enqueue request
type EnqueueRequestCreationResult int

const (
	EnqueueRequestCreationSucceeded EnqueueRequestCreationResult = iota
	EnqueueRequestCreationFailed
	EnqueueRequestCreationFailedMediumNotFound
	EnqueueRequestCreationFailedMediumAgeRestricted
	EnqueueRequestCreationFailedMediumIsUpcomingLiveBroadcast
	EnqueueRequestCreationFailedMediumIsUnpopularLiveBroadcast
	EnqueueRequestCreationFailedMediumIsNotEmbeddable
	EnqueueRequestCreationFailedMediumIsTooLong
	EnqueueRequestCreationFailedMediumIsAlreadyInQueue
	EnqueueRequestCreationFailedMediumPlayedTooRecently
	EnqueueRequestCreationFailedMediumIsDisallowed
	EnqueueRequestCreationFailedMediumIsNotATrack
)
