package keyedstack

import (
	"sync"

	"github.com/samber/lo"
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

// GetOfKey returns the topmost value for the specified key
func (s *KeyedStack[K, V]) GetOfKey(key K) V {
	s.mu.RLock()
	defer s.mu.RUnlock()

	for _, e := range s.stack {
		if e.key == key {
			return e.value
		}
	}
	return s.defaultValue
}

// GetAll returns the complete stack values
func (s *KeyedStack[K, V]) GetAll(includeDefaultValue bool) []V {
	s.mu.RLock()
	defer s.mu.RUnlock()

	if len(s.stack) == 0 && includeDefaultValue {
		return []V{s.defaultValue}
	}
	es := make([]V, len(s.stack))
	for i, e := range s.stack {
		es[i] = e.value
	}
	return es
}

// GetAllOfKey returns all values for the specified key
func (s *KeyedStack[K, V]) GetAllOfKey(key K) []V {
	s.mu.RLock()
	defer s.mu.RUnlock()

	return lo.FilterMap[entry[K, V], V](
		s.stack,
		func(e entry[K, V], _ int) (V, bool) {
			return e.value, e.key == key
		})
}

// Len returns the number of items in the stack
func (s *KeyedStack[K, V]) Len() int {
	s.mu.RLock()
	defer s.mu.RUnlock()

	return len(s.stack)
}

// Push updates the current value, replacing any value that the provided key has already set
// Returns true and the previous value for the key, if the value was replaced
func (s *KeyedStack[K, V]) Push(key K, value V) (V, bool) {
	s.mu.Lock()
	defer s.mu.Unlock()

	removedValue, removed := s.remove(key, false)
	s.stack = append([]entry[K, V]{{
		key:   key,
		value: value,
	}}, s.stack...)
	s.currentValueUpdated.Notify(value, false)
	return removedValue, removed
}

func (s *KeyedStack[K, V]) remove(key K, notify bool) (V, bool) {
	for i, v := range s.stack {
		if v.key == key {
			s.stack = slices.Delete(s.stack, i, i+1)
			if i == 0 && notify {
				s.currentValueUpdated.Notify(s.get(), false)
			}
			return v.value, true
		}
	}
	var v V
	return v, false
}

// Remove removes a value by key.
// Returns true and the previous value for the key, if the value was present
func (s *KeyedStack[K, V]) Remove(key K) (V, bool) {
	s.mu.Lock()
	defer s.mu.Unlock()
	return s.remove(key, true)
}

// OnValueUpdated returns the event that is fired when the value at the top of the stack is updated
func (s *KeyedStack[K, V]) OnValueUpdated() event.Event[V] {
	return s.currentValueUpdated
}
