package configurationmanager

import (
	"sync"

	"github.com/samber/lo"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/utils/event"
	"github.com/tnyim/jungletv/utils/keyedstack"
)

// Configurable defines how the application behaves or presents itself, on the server or the client
type Configurable interface {
	UndoApplicationChanges(applicationID string)
}

// ClientConfigurable defines how the application behaves or presents itself on the client
type ClientConfigurable interface {
	Configurable
	ValueToProtoIfNonDefault() []*proto.ConfigurationChange
	OnValueUpdated() event.Event[*proto.ConfigurationChange]
}

// SettableConfigurable defines the interface configurables should conform to so they can be set using SetConfigurable
type SettableConfigurable[T comparable] interface {
	Configurable
	Set(applicationID string, value T) bool
}

var _ SettableConfigurable[struct{}] = &clientConfigurable[struct{}]{}
var _ SettableConfigurable[struct{}] = &clientCollectionConfigurable[struct{}]{}
var _ SettableConfigurable[struct{}] = &serverMapConfigurable[struct{}, struct{}]{}

// UnsettableConfigurable defines the interface configurables should conform to so they can be unset using UnsetConfigurable
type UnsettableConfigurable[T comparable] interface {
	Configurable
	Unset(applicationID string, value T) bool
}

var _ UnsettableConfigurable[struct{}] = &serverMapConfigurable[struct{}, struct{}]{}

// GettableConfigurable defines the interface configurables should conform to so they can be retrieved using GetConfigurable.
// It is meant for configurables whose current value at any point is a single value
type GettableConfigurable[T comparable] interface {
	Configurable
	Get() T
	GetAsSetByApplication(applicationID string) T
}

var _ GettableConfigurable[struct{}] = &clientConfigurable[struct{}]{}

// GettableCollectionConfigurable defines the interface configurables should conform to so they can be retrieved using GetCollectionConfigurable
// It is meant for configurables whose current value at any point is a collection
type GettableCollectionConfigurable[T comparable] interface {
	Configurable
	Get() []T
	GetAsSetByApplication(applicationID string) []T
}

var _ GettableCollectionConfigurable[struct{}] = &clientCollectionConfigurable[struct{}]{}
var _ GettableCollectionConfigurable[struct{}] = &serverMapConfigurable[struct{}, struct{}]{}

type GettableByKeyConfigurable[K, V comparable] interface {
	Configurable
	GetByKey(key K) (V, bool)
}

var _ GettableByKeyConfigurable[struct{ a string }, struct{ b string }] = &serverMapConfigurable[struct{ a string }, struct{ b string }]{}

type clientConfigurable[T comparable] struct {
	stack        *keyedstack.KeyedStack[string, T]
	defaultValue T
	updated      event.Event[*proto.ConfigurationChange]
	mapper       func(v T) *proto.ConfigurationChange
}

func newClientConfigurable[T comparable](defaultValue T, mapper func(v T) *proto.ConfigurationChange) ClientConfigurable {
	s := keyedstack.New[string](defaultValue)
	return &clientConfigurable[T]{
		stack:        s,
		defaultValue: defaultValue,
		updated:      event.Adapt(s.OnValueUpdated(), mapper, nil),
		mapper:       mapper,
	}
}

func (c *clientConfigurable[T]) ValueToProtoIfNonDefault() []*proto.ConfigurationChange {
	v := c.stack.Get()
	if v == c.defaultValue {
		return nil
	}
	return []*proto.ConfigurationChange{c.mapper(v)}
}

func (c *clientConfigurable[T]) OnValueUpdated() event.Event[*proto.ConfigurationChange] {
	return c.updated
}

func (c *clientConfigurable[T]) Set(applicationID string, value T) bool {
	c.stack.Push(applicationID, value)
	return true
}

func (c *clientConfigurable[T]) UndoApplicationChanges(applicationID string) {
	c.stack.Remove(applicationID)
}

func (c *clientConfigurable[T]) Get() T {
	return c.stack.Get()
}

func (c *clientConfigurable[T]) GetAsSetByApplication(applicationID string) T {
	return c.stack.GetOfKey(applicationID)
}

type clientCollectionConfigurable[T comparable] struct {
	stack             *keyedstack.KeyedStack[string, T]
	updated           event.Event[*proto.ConfigurationChange]
	itemAddedMapper   func(v T) *proto.ConfigurationChange
	itemRemovedMapper func(v T) *proto.ConfigurationChange
}

func newClientCollectionConfigurable[T comparable](itemAddedMapper, itemRemovedMapper func(v T) *proto.ConfigurationChange) ClientConfigurable {
	var v T
	s := keyedstack.New[string](v)
	return &clientCollectionConfigurable[T]{
		stack:             s,
		updated:           event.New[*proto.ConfigurationChange](),
		itemAddedMapper:   itemAddedMapper,
		itemRemovedMapper: itemRemovedMapper,
	}
}

func (c *clientCollectionConfigurable[T]) ValueToProtoIfNonDefault() []*proto.ConfigurationChange {
	v := c.stack.GetAll(false)
	mapped := make([]*proto.ConfigurationChange, len(v))
	for i := range v {
		mapped[i] = c.itemAddedMapper(v[i])
	}
	return mapped
}

func (c *clientCollectionConfigurable[T]) OnValueUpdated() event.Event[*proto.ConfigurationChange] {
	return c.updated
}

func (c *clientCollectionConfigurable[T]) Set(applicationID string, value T) bool {
	replacedValue, replaced := c.stack.Push(applicationID, value)
	if replaced {
		c.updated.Notify(c.itemRemovedMapper(replacedValue), false)
	}
	c.updated.Notify(c.itemAddedMapper(value), false)
	return true
}

func (c *clientCollectionConfigurable[T]) UndoApplicationChanges(applicationID string) {
	removedValue, removed := c.stack.Remove(applicationID)
	if removed {
		c.updated.Notify(c.itemRemovedMapper(removedValue), false)
	}
}

func (c *clientCollectionConfigurable[T]) Get() []T {
	return c.stack.GetAll(false)
}

func (c *clientCollectionConfigurable[T]) GetAsSetByApplication(applicationID string) []T {
	return c.stack.GetAllOfKey(applicationID)
}

type serverMapConfigurable[K, V comparable] struct {
	keyer          func(V) K
	mu             sync.RWMutex
	stacks         map[K]*keyedstack.KeyedStack[string, V]
	perApplication map[string]map[K]V
}

func newServerUnionOfSetsConfigurable[K, V comparable](keyer func(V) K) Configurable {
	return &serverMapConfigurable[K, V]{
		stacks:         map[K]*keyedstack.KeyedStack[string, V]{},
		perApplication: map[string]map[K]V{},
		keyer:          keyer,
	}
}

func (c *serverMapConfigurable[K, V]) UndoApplicationChanges(applicationID string) {
	c.mu.Lock()
	defer c.mu.Unlock()

	for k := range c.perApplication[applicationID] {
		if stack, ok := c.stacks[k]; ok {
			stack.Remove(applicationID)
			if stack.Len() == 0 {
				delete(c.stacks, k)
			}
		}
	}
	delete(c.perApplication, applicationID)
}

func (c *serverMapConfigurable[K, V]) Set(applicationID string, value V) bool {
	c.mu.Lock()
	defer c.mu.Unlock()

	keyed := c.keyer(value)

	if _, ok := c.stacks[keyed]; !ok {
		c.stacks[keyed] = keyedstack.New[string](*new(V))
	}
	c.stacks[keyed].Push(applicationID, value)

	if _, ok := c.perApplication[applicationID]; !ok {
		c.perApplication[applicationID] = map[K]V{}
	}
	c.perApplication[applicationID][keyed] = value

	return true
}

func (c *serverMapConfigurable[K, V]) Unset(applicationID string, value V) bool {
	c.mu.Lock()
	defer c.mu.Unlock()

	keyed := c.keyer(value)

	stack, ok := c.stacks[keyed]
	if !ok {
		return false
	}

	_, ok = c.stacks[keyed].Remove(applicationID)
	if stack.Len() == 0 {
		delete(c.stacks, keyed)
	}

	delete(c.perApplication[applicationID], keyed)
	if len(c.perApplication[applicationID]) == 0 {
		delete(c.perApplication, applicationID)
	}

	return ok
}

func (c *serverMapConfigurable[K, V]) Get() []V {
	c.mu.RLock()
	defer c.mu.RUnlock()

	var result []V
	for _, stack := range c.stacks {
		result = append(result, stack.Get())
	}

	return result
}

func (c *serverMapConfigurable[K, V]) GetAsSetByApplication(applicationID string) []V {
	c.mu.RLock()
	defer c.mu.RUnlock()

	return lo.Values(c.perApplication[applicationID])
}

func (c *serverMapConfigurable[K, V]) GetByKey(key K) (V, bool) {
	c.mu.RLock()
	defer c.mu.RUnlock()

	stack, ok := c.stacks[key]
	if !ok {
		return *new(V), false
	}
	return stack.Get(), true
}
