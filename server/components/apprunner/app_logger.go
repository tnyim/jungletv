package apprunner

import (
	"fmt"
	"math/rand"
	"sync"
	"time"

	"github.com/DisgoOrg/disgohook/api"
	"github.com/bwmarrin/snowflake"
	"github.com/google/btree"
	"github.com/oklog/ulid/v2"
	"github.com/tnyim/jungletv/utils"
	"github.com/tnyim/jungletv/utils/event"
)

// ApplicationLog represents the log of a single application
type ApplicationLog interface {
	// LogEntries returns log entries older than offset, sorted from newest to oldest
	LogEntries(offset ulid.ULID, maxCount int, levels []ApplicationLogLevel) ([]ApplicationLogEntry, bool)

	// LogEntriesSince returns log entries newer than offset, sorted from oldest to newest
	LogEntriesSince(offset ulid.ULID, levels []ApplicationLogLevel) []ApplicationLogEntry

	// LogEntryAdded is notified when a new log entry is added
	LogEntryAdded() event.Event[ApplicationLogEntry]
}

// ApplicationLogEntry represents an entry in the log of an application
type ApplicationLogEntry interface {
	Cursor() ulid.ULID
	CreatedAt() time.Time
	Message() string
	LogLevel() ApplicationLogLevel
}

type appLogEntry struct {
	sortKey ulid.ULID
	message string
	level   ApplicationLogLevel
}

func (e appLogEntry) Cursor() ulid.ULID {
	return e.sortKey
}

func (e appLogEntry) CreatedAt() time.Time {
	return ulid.Time(e.sortKey.Time())
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
	entries       *btree.BTreeG[appLogEntry]
	mu            sync.RWMutex
	onEntryAdded  event.Event[ApplicationLogEntry]
	snowflakeNode *snowflake.Node
	modLogWebhook api.WebhookClient
	applicationID string
}

func NewAppLogger(modLogWebhook api.WebhookClient, applicationID string) *appLogger {
	node, _ := snowflake.NewNode(rand.Int63n(1000))
	return &appLogger{
		entries: btree.NewG(32, func(a, b appLogEntry) bool {
			return a.sortKey.Compare(b.sortKey) < 0
		}),
		onEntryAdded:  event.New[ApplicationLogEntry](),
		snowflakeNode: node,
		modLogWebhook: modLogWebhook,
		applicationID: applicationID,
	}
}

func (p *appLogger) LogEntries(offset ulid.ULID, maxCount int, levels []ApplicationLogLevel) ([]ApplicationLogEntry, bool) {
	p.mu.RLock()
	defer p.mu.RUnlock()

	entries := []ApplicationLogEntry{}
	levelsSet := utils.SliceToSet(levels)
	cursor := appLogEntry{
		sortKey: offset,
	}
	p.entries.DescendLessOrEqual(cursor, func(entry appLogEntry) bool {
		if entry.sortKey.Compare(offset) == 0 {
			// skip first entry because the semantics are entries < offset, not entries <= offset
			return true
		}
		if _, ok := levelsSet[entry.LogLevel()]; ok || len(levels) == 0 {
			entries = append(entries, entry)
		}
		return len(entries) <= maxCount
	})
	hasMore := len(entries) > maxCount
	if hasMore {
		entries = entries[:maxCount]
	}
	return entries, hasMore
}

func (p *appLogger) LogEntriesSince(offset ulid.ULID, levels []ApplicationLogLevel) []ApplicationLogEntry {
	p.mu.RLock()
	defer p.mu.RUnlock()

	entries := []ApplicationLogEntry{}
	levelsSet := utils.SliceToSet(levels)
	cursor := appLogEntry{
		sortKey: offset,
	}
	p.entries.AscendGreaterOrEqual(cursor, func(entry appLogEntry) bool {
		if entry.sortKey.Compare(offset) == 0 {
			// skip first entry because the semantics are entries > offset, not entries >= offset
			return true
		}
		if _, ok := levelsSet[entry.LogLevel()]; ok || len(levels) == 0 {
			entries = append(entries, entry)
		}
		return true
	})
	return entries
}

func (p *appLogger) LogEntryAdded() event.Event[ApplicationLogEntry] {
	return p.onEntryAdded
}

func (p *appLogger) addLogEntry(message string, logLevel ApplicationLogLevel) {
	p.mu.Lock()
	defer p.mu.Unlock()
	entry := appLogEntry{
		sortKey: ulid.Make(),
		message: message,
		level:   logLevel,
	}
	p.entries.ReplaceOrInsert(entry)
	p.onEntryAdded.Notify(entry, false)
}

func (p *appLogger) Log(s string) {
	p.addLogEntry(s, ApplicationLogLevelJSLog)
}

func (p *appLogger) Warn(s string) {
	p.addLogEntry(s, ApplicationLogLevelJSWarn)
}

func (p *appLogger) Error(s string) {
	p.addLogEntry(s, ApplicationLogLevelJSError)
}

func (p *appLogger) RuntimeLog(s string) {
	p.addLogEntry(s, ApplicationLogLevelRuntimeLog)
}

func (p *appLogger) RuntimeAuditLog(s string) {
	p.addLogEntry(s, ApplicationLogLevelRuntimeLog)
	if p.modLogWebhook != nil {
		_, err := p.modLogWebhook.SendContent(
			fmt.Sprintf("Application `%s` %s",
				p.applicationID, s))
		if err != nil {
			p.RuntimeError(fmt.Sprint("Failed to send mod log webhook:", err))
		}
	}
}

func (p *appLogger) RuntimeError(s string) {
	p.addLogEntry(s, ApplicationLogLevelRuntimeError)
}
