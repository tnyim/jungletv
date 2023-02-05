package apprunner

import (
	"bytes"
	"fmt"
)

type consolePrinter struct {
	consoleBuffer *bytes.Buffer
}

func newPrinter() *consolePrinter {
	return &consolePrinter{
		consoleBuffer: new(bytes.Buffer),
	}
}

func (p *consolePrinter) Log(s string) {
	fmt.Fprintln(p.consoleBuffer, "[LOG]", s)
}

func (p *consolePrinter) Warn(s string) {
	fmt.Fprintln(p.consoleBuffer, "[WARN]", s)
}

func (p *consolePrinter) Error(s string) {
	fmt.Fprintln(p.consoleBuffer, "[ERROR]", s)
}
