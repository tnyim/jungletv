package configurationmanager

import (
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/utils/event"
	"github.com/tnyim/jungletv/utils/keyedstack"
)

// Configurable defines how the application behaves or presents itself, on the server or the client
type Configurable interface {
	Remove(applicationID string)
}

// ClientConfigurable defines how the application behaves or presents itself on the client
type ClientConfigurable interface {
	Configurable
	ValueToProtoIfNonDefault() []*proto.ConfigurationChange
	OnValueUpdated() event.Event[*proto.ConfigurationChange]
}

// SettableConfigurable defines the interface configurables should conform to so they can be set using SetClientConfigurable
type SettableConfigurable[T comparable] interface {
	Configurable
	Set(applicationID string, value T) bool
}

var _ SettableConfigurable[struct{}] = &clientConfigurable[struct{}]{}
var _ SettableConfigurable[struct{}] = &clientCollectionConfigurable[struct{}]{}

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

func (c *clientConfigurable[T]) Remove(applicationID string) {
	c.stack.Remove(applicationID)
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

func (c *clientCollectionConfigurable[T]) Remove(applicationID string) {
	removedValue, removed := c.stack.Remove(applicationID)
	if removed {
		c.updated.Notify(c.itemRemovedMapper(removedValue), false)
	}
}
