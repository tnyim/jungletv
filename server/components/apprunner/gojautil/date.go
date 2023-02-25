package gojautil

import (
	"time"

	"github.com/dop251/goja"
)

func ToJSDate(vm *goja.Runtime, d time.Time) goja.Value {
	val, err := vm.New(vm.Get("Date").ToObject(vm), vm.ToValue(d.UnixNano()/1e6))
	if err != nil {
		return goja.Undefined()
	}
	return val
}
