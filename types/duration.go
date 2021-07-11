package types

import (
	"database/sql/driver"
	"fmt"
	"strings"
	"time"

	"github.com/palantir/stacktrace"
)

// Duration wraps a time.Duration with custom methods for serialization
type Duration time.Duration

// Scan implements the sql.Scanner interface.
func (d *Duration) Scan(value interface{}) error {
	if value == nil {
		return nil
	}
	b, ok := value.([]byte)
	if !ok {
		return stacktrace.NewError("Scan: Invalid val type for scanning")
	}
	ss := strings.Split(string(b), ":")
	var hour, minute, second int
	fmt.Sscanf(ss[0], "%d", &hour)
	fmt.Sscanf(ss[1], "%d", &minute)
	fmt.Sscanf(ss[2], "%d", &second)
	*d = Duration(time.Duration(hour)*time.Hour + time.Duration(minute)*time.Minute + time.Duration(second)*time.Second)
	return nil
}

// Value implements the driver.Valuer interface.
func (d Duration) Value() (driver.Value, error) {
	return time.Duration(d).String(), nil
}
