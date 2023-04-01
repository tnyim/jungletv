package configurationmanager

// SidebarTabData contains data for the SidebarTabs configurable
type SidebarTabData struct {
	TabID         string
	ApplicationID string
	PageID        string
	Title         string
	BeforeTabID   string // represents the ID of the tab before which this tab should open. Empty to open the tab at the end of the list.
}
