package apprunner

import (
	"sync"
	"time"

	"github.com/google/btree"
	"golang.org/x/exp/slices"
)

// ApplicationLog represents the log of a single application
type ApplicationLog interface {
	LogEntries(beforeOrAt time.Time, maxCount int, levels []ApplicationLogLevel) []ApplicationLogEntry
}

// ApplicationLogEntry represents an entry in the log of an application
type ApplicationLogEntry interface {
	CreatedAt() time.Time
	Message() string
	LogLevel() ApplicationLogLevel
}

type appLogEntry struct {
	createdAt time.Time
	message   string
	level     ApplicationLogLevel
}

func (e appLogEntry) CreatedAt() time.Time {
	return e.createdAt
}

func (e appLogEntry) Message() string {
	return e.message
}

func (e appLogEntry) LogLevel() ApplicationLogLevel {
	return e.level
}

// ApplicationLogLevel represents the log level of an application log entry
type ApplicationLogLevel int

const (
	ApplicationLogLevelJSLog ApplicationLogLevel = iota
	ApplicationLogLevelJSWarn
	ApplicationLogLevelJSError
	ApplicationLogLevelRuntimeLog
	ApplicationLogLevelRuntimeError
)

type appLogger struct {
	entries *btree.BTreeG[appLogEntry]
	mu      sync.RWMutex
}

func NewAppLogger() *appLogger {
	return &appLogger{
		entries: btree.NewG(32, appLogEntryLess),
	}
}

func appLogEntryLess(a, b appLogEntry) bool {
	return a.createdAt.Before(b.createdAt)
}

func (p *appLogger) LogEntries(beforeOrAt time.Time, maxCount int, levels []ApplicationLogLevel) []ApplicationLogEntry {
	p.mu.RLock()
	defer p.mu.RUnlock()

	entries := []ApplicationLogEntry{}
	p.entries.DescendLessOrEqual(appLogEntry{createdAt: beforeOrAt}, func(entry appLogEntry) bool {
		if len(levels) == 0 || slices.Contains(levels, entry.level) {
			entries = append(entries, entry)
		}
		return len(entries) < maxCount
	})

	return entries
}

func (p *appLogger) Log(s string) {
	p.mu.Lock()
	defer p.mu.Unlock()
	p.entries.ReplaceOrInsert(appLogEntry{
		createdAt: time.Now(),
		message:   s,
		level:     ApplicationLogLevelJSLog,
	})
}

func (p *appLogger) Warn(s string) {
	p.mu.Lock()
	defer p.mu.Unlock()
	p.entries.ReplaceOrInsert(appLogEntry{
		createdAt: time.Now(),
		message:   s,
		level:     ApplicationLogLevelJSWarn,
	})
}

func (p *appLogger) Error(s string) {
	p.mu.Lock()
	defer p.mu.Unlock()
	p.entries.ReplaceOrInsert(appLogEntry{
		createdAt: time.Now(),
		message:   s,
		level:     ApplicationLogLevelJSError,
	})
}

func (p *appLogger) RuntimeLog(s string) {
	p.mu.Lock()
	defer p.mu.Unlock()
	p.entries.ReplaceOrInsert(appLogEntry{
		createdAt: time.Now(),
		message:   s,
		level:     ApplicationLogLevelRuntimeLog,
	})
}

func (p *appLogger) RuntimeError(err error) {
	p.mu.Lock()
	defer p.mu.Unlock()
	p.entries.ReplaceOrInsert(appLogEntry{
		createdAt: time.Now(),
		message:   err.Error(),
		level:     ApplicationLogLevelRuntimeError,
	})
}
