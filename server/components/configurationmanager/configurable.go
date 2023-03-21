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

type clientConfigurable[T comparable] struct {
	*keyedstack.KeyedStack[string, T]
	defaultValue T
	updated      event.Event[*proto.ConfigurationChange]
	mapper       func(v T) *proto.ConfigurationChange
}

func newClientConfigurable[T comparable](defaultValue T, mapper func(v T) *proto.ConfigurationChange) ClientConfigurable {
	s := keyedstack.New[string](defaultValue)
	return &clientConfigurable[T]{
		KeyedStack:   s,
		defaultValue: defaultValue,
		updated:      event.Adapt(s.OnValueUpdated(), mapper, nil),
		mapper:       mapper,
	}
}

func (c *clientConfigurable[T]) ValueToProtoIfNonDefault() []*proto.ConfigurationChange {
	v := c.Get()
	if v == c.defaultValue {
		return nil
	}
	return []*proto.ConfigurationChange{c.mapper(v)}
}

func (c *clientConfigurable[T]) OnValueUpdated() event.Event[*proto.ConfigurationChange] {
	return c.updated
}

func (c *clientConfigurable[T]) Set(applicationID string, value T) bool {
	c.Push(applicationID, value)
	return true
}
