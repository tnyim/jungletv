package simplelogger

import (
	"fmt"
	"log"
	"os"
)

type SimpleLogger struct {
	*log.Logger
	debug bool
}

func New(l *log.Logger, debug bool) *SimpleLogger {
	return &SimpleLogger{l, debug}
}

func (l *SimpleLogger) Debug(args ...interface{}) {
	if l.debug {
		l.Println("[DEBUG]", args)
	}
}
func (l *SimpleLogger) Info(args ...interface{}) {
	l.Println("[INFO]", args)
}
func (l *SimpleLogger) Warn(args ...interface{}) {
	l.Println("[WARN]", args)
}
func (l *SimpleLogger) Error(args ...interface{}) {
	l.Println("[ERROR]", args)
}
func (l *SimpleLogger) Fatal(args ...interface{}) {
	l.Println("[FATAL]", args)
	os.Exit(-1)
}
func (l *SimpleLogger) Panic(args ...interface{}) {
	panic(fmt.Sprintln("[PANIC]", args))
}

func (l *SimpleLogger) Debugf(format string, args ...interface{}) {
	if l.debug {
		l.Printf("[DEBUG] "+format, args)
	}
}
func (l *SimpleLogger) Infof(format string, args ...interface{}) {
	l.Printf("[INFO] "+format, args)
}
func (l *SimpleLogger) Warnf(format string, args ...interface{}) {
	l.Printf("[WARN] "+format, args)
}
func (l *SimpleLogger) Errorf(format string, args ...interface{}) {
	l.Printf("[ERROR] "+format, args)
}
func (l *SimpleLogger) Fatalf(format string, args ...interface{}) {
	l.Printf("[FATAL] "+format, args)
	os.Exit(-1)
}
func (l *SimpleLogger) Panicf(format string, args ...interface{}) {
	panic(fmt.Sprintf("[PANIC] "+format, args))
}
