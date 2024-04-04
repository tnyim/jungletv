package configurationmanager

// ProfileTabData contains data for the ProfileTabs configurable
type ProfileTabData struct {
	TabID         string
	ApplicationID string
	PageID        string
	Title         string
	BeforeTabID   string // represents the ID of the tab before which this tab should open. Empty to open the tab at the end of the list.
}
