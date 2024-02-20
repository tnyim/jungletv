package configurationmanager

// VIPUser contains data for the VIPUsers configurable
type VIPUser struct {
	Address    string
	Appearance VIPUserAppearance
}

// VIPUserAppearance defines the user-visible appearance changes of a VIP user
type VIPUserAppearance int

const (
	// VIPUserAppearanceNormal is used when the VIP user should keep the appearance of a regular user
	VIPUserAppearanceNormal VIPUserAppearance = iota

	// VIPUserAppearanceModerator is used when the VIP user should appear as a moderator
	VIPUserAppearanceModerator

	// VIPUserAppearanceVIP is used when the VIP user should appear as a VIP
	VIPUserAppearanceVIP

	// VIPUserAppearanceVIPModerator is used when the VIP user should appear as a VIP moderator
	VIPUserAppearanceVIPModerator
)
