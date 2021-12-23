package types

import (
	sq "github.com/Masterminds/squirrel"
	"github.com/gbl08ma/sqalx"
	"github.com/palantir/stacktrace"
)

// UserProfile represents a user profile
type UserProfile struct {
	Address       string `dbKey:"true"`
	Biography     string
	FeaturedMedia *string
}

// getUserProfileWithSelect returns a slice with all user profiles that match the conditions in sbuilder
func getUserProfileWithSelect(node sqalx.Node, sbuilder sq.SelectBuilder) ([]*UserProfile, uint64, error) {
	values, totalCount, err := GetWithSelect(node, &UserProfile{}, sbuilder, true)
	if err != nil {
		return nil, totalCount, stacktrace.Propagate(err, "")
	}

	converted := make([]*UserProfile, len(values))
	for i := range values {
		converted[i] = values[i].(*UserProfile)
	}

	return converted, totalCount, nil
}

// GetUserProfileForAddress returns the user profile for the specified address.
// If a profile does not exist, an empty one is returned
func GetUserProfileForAddress(node sqalx.Node, address string) (*UserProfile, error) {
	s := sdb.Select().
		Where(sq.Eq{"user_profile.address": address})
	items, _, err := getUserProfileWithSelect(node, s)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	if len(items) == 0 {
		return &UserProfile{
			Address: address,
		}, nil
	}

	return items[0], nil
}

// Update updates or inserts the UserProfile
func (obj *UserProfile) Update(node sqalx.Node) error {
	return Update(node, obj)
}

// Delete deletes the UserProfile
func (obj *UserProfile) Delete(node sqalx.Node) error {
	return Delete(node, obj)
}
