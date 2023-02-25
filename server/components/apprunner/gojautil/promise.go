package gojautil

import (
	"github.com/dop251/goja"
)

// AsyncCallback is a function that should run asynchronously
type AsyncCallback[T any] func() T

// AsyncCallbackWithTransformer is a function that should run asynchronously
// and returns a PromiseResultTransformer
type AsyncCallbackWithTransformer[T any] func() (T, PromiseResultTransformer[T])

// PromiseResultTransformer is a function that runs synchronously in the JS event loop
// and transforms the result of an asynchronous promise before it is provided to the JS runtime
type PromiseResultTransformer[T any] func(*goja.Runtime, T) interface{}

// ScheduleFunction is a function that may be called to add tasks to an application's event loop
type ScheduleFunction func(func(vm *goja.Runtime) error)

// ScheduleFunctionNoError is a function that may be called to add tasks to an application's event loop
type ScheduleFunctionNoError func(func(vm *goja.Runtime))

// DoAsync schedules a function to run asynchronously and returns a Promise to track it
func DoAsync[T any](runtime *goja.Runtime, runOnLoop ScheduleFunctionNoError, cb AsyncCallback[T]) goja.Value {
	promise, resolve, reject := runtime.NewPromise()

	go func() {
		var rejectReason interface{}
		var result T
		func() {
			defer func() {
				rejectReason = recover()
			}()
			result = cb()
		}()

		runOnLoop(func(r *goja.Runtime) {
			if rejectReason == nil {
				resolve(result)
			} else {
				reject(rejectReason)
			}
		})
	}()
	return runtime.ToValue(promise)
}

// DoAsyncWithTransformer schedules a function to run asynchronously and returns a Promise to track it
// The transformer returned by the async function will be run synchronously in the goja event loop
func DoAsyncWithTransformer[T any](runtime *goja.Runtime, runOnLoop ScheduleFunctionNoError, cb AsyncCallbackWithTransformer[T]) goja.Value {
	promise, resolve, reject := runtime.NewPromise()

	go func() {
		var rejectReason interface{}
		var result T
		var transformer PromiseResultTransformer[T]
		func() {
			defer func() {
				rejectReason = recover()
			}()
			result, transformer = cb()
		}()

		runOnLoop(func(r *goja.Runtime) {
			if rejectReason == nil {
				resolve(transformer(r, result))
			} else {
				reject(rejectReason)
			}
		})
	}()
	return runtime.ToValue(promise)
}
