package configurationmanager

import (
	"context"
	"sync"

	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/utils/event"
)

// ConfigurationKey represents a type of configuration
type ConfigurationKey int

const (
	// ApplicationName is an override of the application's name
	ApplicationName ConfigurationKey = iota
	// LogoURL is an override of the application's logo
	LogoURL
	// FaviconURL is an override of the application's favicon
	FaviconURL
	// SidebarTabs allows applications to present pages as sidebar tabs
	SidebarTabs
)

// Manager manages configuration set by the application framework
type Manager struct {
	clientConfigs                map[ConfigurationKey]ClientConfigurable
	serverConfigs                map[ConfigurationKey]Configurable
	configs                      map[ConfigurationKey]Configurable
	onClientConfigurationChanged event.Event[*proto.ConfigurationChange]
}

// New returns a new configuration manager
func New(ctx context.Context) *Manager {
	clientConfigs := map[ConfigurationKey]ClientConfigurable{
		ApplicationName: newClientConfigurable("", func(v string) *proto.ConfigurationChange {
			return &proto.ConfigurationChange{
				ConfigurationChange: &proto.ConfigurationChange_ApplicationName{
					ApplicationName: v,
				},
			}
		}),
		LogoURL: newClientConfigurable("", func(v string) *proto.ConfigurationChange {
			return &proto.ConfigurationChange{
				ConfigurationChange: &proto.ConfigurationChange_LogoUrl{
					LogoUrl: v,
				},
			}
		}),
		FaviconURL: newClientConfigurable("", func(v string) *proto.ConfigurationChange {
			return &proto.ConfigurationChange{
				ConfigurationChange: &proto.ConfigurationChange_FaviconUrl{
					FaviconUrl: v,
				},
			}
		}),
		SidebarTabs: newClientCollectionConfigurable(
			func(v SidebarTabData) *proto.ConfigurationChange {
				return &proto.ConfigurationChange{
					ConfigurationChange: &proto.ConfigurationChange_OpenSidebarTab{
						OpenSidebarTab: &proto.ConfigurationChangeSidebarTabOpen{
							TabId:         v.TabID,
							ApplicationId: v.ApplicationID,
							PageId:        v.PageID,
							TabTitle:      v.Title,
							BeforeTabId:   v.BeforeTabID,
						},
					},
				}
			},
			func(v SidebarTabData) *proto.ConfigurationChange {
				return &proto.ConfigurationChange{
					ConfigurationChange: &proto.ConfigurationChange_CloseSidebarTab{
						CloseSidebarTab: v.TabID,
					},
				}
			}),
	}

	serverConfigs := map[ConfigurationKey]Configurable{}

	configs := map[ConfigurationKey]Configurable{}
	for k, c := range clientConfigs {
		configs[k] = c
	}
	for k, c := range serverConfigs {
		configs[k] = c
	}

	onConfigChange := event.New[*proto.ConfigurationChange]()

	wg := sync.WaitGroup{}
	wg.Add(1)
	go func() {
		for _, config := range clientConfigs {
			defer config.OnValueUpdated().SubscribeUsingCallback(event.BufferLatest, func(arg *proto.ConfigurationChange) {
				onConfigChange.Notify(arg, false)
			})()
		}
		wg.Done()
		<-ctx.Done()
	}()
	wg.Wait()

	return &Manager{
		clientConfigs:                clientConfigs,
		serverConfigs:                serverConfigs,
		configs:                      configs,
		onClientConfigurationChanged: onConfigChange,
	}
}

// RemoveApplicationConfigs removes all configurations set by the specified application
func (m *Manager) RemoveApplicationConfigs(applicationID string) {
	for _, c := range m.configs {
		c.Remove(applicationID)
	}
}

// AllClientConfigurationChanges produces a set with all currently applicable configuration changes for the client
func (m *Manager) AllClientConfigurationChanges() []*proto.ConfigurationChange {
	changes := []*proto.ConfigurationChange{}
	for _, c := range m.clientConfigs {
		changes = append(changes, c.ValueToProtoIfNonDefault()...)
	}
	return changes
}

// ClientConfigurationChanged returns the event that is fired when a new configuration change should be made available to clients
func (m *Manager) ClientConfigurationChanged() event.Event[*proto.ConfigurationChange] {
	return m.onClientConfigurationChanged
}

// ResetConfigurable is called by an application environment to unset value for a configurable (as far as that application is concerned)
func (m *Manager) ResetConfigurable(key ConfigurationKey, applicationID string) error {
	configurable, ok := m.configs[key]
	if !ok {
		return stacktrace.NewError("unknown configurable")
	}

	configurable.Remove(applicationID)
	return nil
}

// SetConfigurable is called by an application environment to set the value for a configurable
func SetConfigurable[T comparable](m *Manager, key ConfigurationKey, applicationID string, value T) (bool, error) {
	configurableInterface, ok := m.configs[key]
	if !ok {
		return false, stacktrace.NewError("unknown configurable")
	}

	configurable, ok := configurableInterface.(SettableConfigurable[T])
	if !ok {
		return false, stacktrace.NewError("wrong value type for configurable")
	}

	return configurable.Set(applicationID, value), nil
}
