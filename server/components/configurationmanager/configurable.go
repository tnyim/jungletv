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
	ValueToProtoIfNonDefault() proto.IsConfigurationChange_ConfigurationChange
	OnValueUpdated() event.Event[proto.IsConfigurationChange_ConfigurationChange]
}

// SettableConfigurable defines the interface configurables should conform to so they can be set using SetClientConfigurable
type SettableConfigurable[T comparable] interface {
	Configurable
	Push(applicationID string, value T)
}

type clientConfigurable[T comparable] struct {
	*keyedstack.KeyedStack[string, T]
	defaultValue T
	updated      event.Event[proto.IsConfigurationChange_ConfigurationChange]
	mapper       func(v T) proto.IsConfigurationChange_ConfigurationChange
}

func newClientConfigurable[T comparable](defaultValue T, mapper func(v T) proto.IsConfigurationChange_ConfigurationChange) ClientConfigurable {
	s := keyedstack.New[string](defaultValue)
	return &clientConfigurable[T]{
		KeyedStack:   s,
		defaultValue: defaultValue,
		updated:      event.Adapt(s.OnValueUpdated(), mapper, nil),
		mapper:       mapper,
	}
}

func (c *clientConfigurable[T]) ValueToProtoIfNonDefault() proto.IsConfigurationChange_ConfigurationChange {
	v := c.Get()
	if v == c.defaultValue {
		return nil
	}
	return c.mapper(v)
}

func (c *clientConfigurable[T]) OnValueUpdated() event.Event[proto.IsConfigurationChange_ConfigurationChange] {
	return c.updated
}
