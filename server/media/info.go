package media

import "time"

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
