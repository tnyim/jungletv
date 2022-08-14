package event_test

import (
	"math/rand"
	"testing"

	"github.com/tnyim/jungletv/utils/event"
)

func BenchmarkSubscribeAtLeastOnce(b *testing.B) {
	e := event.New[int]()

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		e.Subscribe(event.AtLeastOnceGuarantee)
	}
	b.StopTimer()
}

func BenchmarkSubscribeAtLeastOnceAmortized(b *testing.B) {
	e := event.New[int]()

	unsubFns := []func(){}
	for i := 0; i < b.N; i++ {
		_, unsubFn := e.Subscribe(event.AtLeastOnceGuarantee)
		unsubFns = append(unsubFns, unsubFn)
	}

	for _, fn := range unsubFns {
		fn()
	}

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		e.Subscribe(event.AtLeastOnceGuarantee)
	}
	b.StopTimer()
}

func BenchmarkUnsubscribe(b *testing.B) {
	b.StopTimer()
	e := event.New[int]()

	unsubFns := []func(){}
	for i := 0; i < b.N; i++ {
		_, unsubFn := e.Subscribe(event.AtLeastOnceGuarantee)
		unsubFns = append(unsubFns, unsubFn)
	}

	b.ResetTimer()
	b.StartTimer()

	for _, fn := range unsubFns {
		fn()
	}
}

func BenchmarkUnsubscribeRandomWalk(b *testing.B) {
	e := event.New[int]()

	unsubFns := make(map[int]func())
	for i := 0; i < b.N; i++ {
		_, unsubFn := e.Subscribe(event.AtLeastOnceGuarantee)
		unsubFns[i] = unsubFn
	}

	order := make([]int, b.N)
	for i := range order {
		order[i] = i
	}

	rand.Seed(2034923598)

	rand.Shuffle(b.N, func(i, j int) {
		order[i], order[j] = order[j], order[i]
	})

	b.ResetTimer()
	b.StartTimer()

	for i := range order {
		unsubFns[i]()
	}
}

func BenchmarkSubscribeUnsubscribe(b *testing.B) {
	b.StopTimer()
	e := event.New[int]()

	unsubFns := []func(){}
	rand.Seed(345978324923)
	for i := 0; i < b.N; i++ {
		numSubs := rand.Intn(10)
		numUnsubs := rand.Intn(6)

		for j := 0; j < numSubs; j++ {
			b.StartTimer()
			_, unsubFn := e.Subscribe(event.AtLeastOnceGuarantee)
			b.StopTimer()
			unsubFns = append(unsubFns, unsubFn)
		}
		for j := 0; j < numUnsubs; j++ {
			l := len(unsubFns)
			if l == 0 {
				return
			}
			idx := rand.Intn(l)
			b.StartTimer()
			unsubFns[idx]()
			b.StopTimer()

			newLen := len(unsubFns) - 1
			unsubFns[idx] = unsubFns[newLen]
			unsubFns = unsubFns[:newLen]
		}
	}
}

func BenchmarkNotifyAtLeastOnce(b *testing.B) {
	b.StopTimer()

	e := event.New[int]()
	for i := 0; i < 20000; i++ {
		e.Subscribe(event.AtLeastOnceGuarantee)
	}

	b.ResetTimer()
	b.StartTimer()

	for i := 0; i < b.N; i++ {
		e.Notify(i, false)
	}
}
