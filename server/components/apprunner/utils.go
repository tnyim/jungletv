package apprunner

import (
	"github.com/dop251/goja"
	"github.com/dop251/goja_nodejs/eventloop"
)

func runOnLoop(loop *eventloop.EventLoop, f func(vm *goja.Runtime) error) error {
	var err error
	loop.RunOnLoop(func(vm *goja.Runtime) {
		err = f(vm)
	})
	// purposefully do not append to stacktrace here to minimize number of useless hops in stacktraces
	return err
}
