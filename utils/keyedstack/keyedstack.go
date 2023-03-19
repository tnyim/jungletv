package keyedstack

import (
	"sync"

	"github.com/tnyim/jungletv/utils/event"
	"golang.org/x/exp/slices"
)

// KeyedStack is a last-in-first-out container where entries are unique per key
// This container is goroutine-safe
type KeyedStack[K comparable, V any] struct {
	mu                  sync.RWMutex
	defaultValue        V
	stack               []entry[K, V]
	currentValueUpdated event.Event[V]
}

type entry[K comparable, V any] struct {
	key   K
	value V
}

// New returns a new KeyedStack with the specified base/default value
func New[K comparable, V any](baseValue V) *KeyedStack[K, V] {
	return &KeyedStack[K, V]{
		defaultValue:        baseValue,
		currentValueUpdated: event.New[V](),
	}
}

// Get returns the current value
func (s *KeyedStack[K, V]) get() V {
	if len(s.stack) == 0 {
		return s.defaultValue
	}
	return s.stack[0].value
}

// Get returns the current value at the top of the stack
func (s *KeyedStack[K, V]) Get() V {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return s.get()
}

// Push updates the current value, replacing any value that the provided key has already set
func (s *KeyedStack[K, V]) Push(key K, value V) {
	s.mu.Lock()
	defer s.mu.Unlock()

	s.remove(key, false)
	s.stack = append([]entry[K, V]{{
		key:   key,
		value: value,
	}}, s.stack...)
	s.currentValueUpdated.Notify(value, false)
}

func (s *KeyedStack[K, V]) remove(key K, notify bool) {
	for i := range s.stack {
		if s.stack[i].key == key {
			s.stack = slices.Delete(s.stack, i, i+1)
			if i == 0 && notify {
				s.currentValueUpdated.Notify(s.get(), false)
			}
			break
		}
	}
}

// Remove removes a value by key
func (s *KeyedStack[K, V]) Remove(key K) {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.remove(key, true)
}

// OnValueUpdated returns the event that is fired when the current value is updated
func (s *KeyedStack[K, V]) OnValueUpdated() event.Event[V] {
	return s.currentValueUpdated
}
