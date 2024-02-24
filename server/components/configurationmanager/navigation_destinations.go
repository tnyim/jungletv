package configurationmanager

// NavigationDestination contains data for the NavigationDestinations configurable
type NavigationDestination struct {
	DestinationID       string
	Label               string
	Icon                string
	Href                string
	Color               string
	BeforeDestinationID string
}
