package server

import (
	"fmt"
	"log"
	"os"
)

type simpleLogger struct {
	*log.Logger
	debug bool
}

func newSimpleLogger(l *log.Logger, debug bool) *simpleLogger {
	return &simpleLogger{l, debug}
}

func (l *simpleLogger) Debug(args ...interface{}) {
	if l.debug {
		l.Println("[DEBUG]", args)
	}
}
func (l *simpleLogger) Info(args ...interface{}) {
	l.Println("[INFO]", args)
}
func (l *simpleLogger) Warn(args ...interface{}) {
	l.Println("[WARN]", args)
}
func (l *simpleLogger) Error(args ...interface{}) {
	l.Println("[ERROR]", args)
}
func (l *simpleLogger) Fatal(args ...interface{}) {
	l.Println("[FATAL]", args)
	os.Exit(-1)
}
func (l *simpleLogger) Panic(args ...interface{}) {
	panic(fmt.Sprintln("[PANIC]", args))
}

func (l *simpleLogger) Debugf(format string, args ...interface{}) {
	if l.debug {
		l.Printf("[DEBUG] "+format, args)
	}
}
func (l *simpleLogger) Infof(format string, args ...interface{}) {
	l.Printf("[INFO] "+format, args)
}
func (l *simpleLogger) Warnf(format string, args ...interface{}) {
	l.Printf("[WARN] "+format, args)
}
func (l *simpleLogger) Errorf(format string, args ...interface{}) {
	l.Printf("[ERROR] "+format, args)
}
func (l *simpleLogger) Fatalf(format string, args ...interface{}) {
	l.Printf("[FATAL] "+format, args)
	os.Exit(-1)
}
func (l *simpleLogger) Panicf(format string, args ...interface{}) {
	panic(fmt.Sprintf("[PANIC] "+format, args))
}
