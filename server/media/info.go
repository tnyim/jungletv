package media

import "time"

// CommonInfo contains the common implementation of some Info functionality
type CommonInfo struct {
	title        string
	thumbnailURL string
	duration     time.Duration
	offset       time.Duration
}

// Title implements the Info interface
func (e *CommonInfo) Title() string {
	return e.title
}

func (e *CommonInfo) SetTitle(title string) {
	e.title = title
}

// ThumbnailURL implements the Info interface
func (e *CommonInfo) ThumbnailURL() string {
	return e.thumbnailURL
}

func (e *CommonInfo) SetThumbnailURL(url string) {
	e.thumbnailURL = url
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
