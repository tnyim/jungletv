package media

import (
	"time"

	"github.com/tnyim/jungletv/types"
)

// CommonInfo contains the common implementation of some Info functionality
type CommonInfo struct {
	title    string
	duration time.Duration
	offset   time.Duration
}

// Title implements the Info interface
func (e *CommonInfo) Title() string {
	return e.title
}

func (e *CommonInfo) SetTitle(title string) {
	e.title = title
}

// Length implements the Info interface
func (e *CommonInfo) Length() time.Duration {
	return e.duration
}

func (e *CommonInfo) SetLength(length time.Duration) {
	e.duration = length
}

// Offset implements the Info interface
func (e *CommonInfo) Offset() time.Duration {
	return e.offset
}

func (e *CommonInfo) SetOffset(offset time.Duration) {
	e.offset = offset
}

// CommonMediaInfoFromPlayedMedia returns a CommonInfo from a played media and the specified title
func CommonMediaInfoFromPlayedMedia(playedMedia *types.PlayedMedia, title string) CommonInfo {
	return CommonInfo{
		title:    title,
		duration: time.Duration(playedMedia.MediaLength),
		offset:   time.Duration(playedMedia.MediaOffset),
	}
}
