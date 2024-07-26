package types

import (
	sq "github.com/Masterminds/squirrel"
	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/utils/transaction"
)

// UserProfile represents a user profile
type UserProfile struct {
	Address       string `dbKey:"true"`
	Biography     string
	FeaturedMedia *string
}

// GetUserProfileForAddress returns the user profile for the specified address.
// If a profile does not exist, an empty one is returned
func GetUserProfileForAddress(ctx transaction.WrappingContext, address string) (*UserProfile, error) {
	s := sdb.Select().
		Where(sq.Eq{"user_profile.address": address})
	items, err := GetWithSelect[*UserProfile](ctx, s)
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
func (obj *UserProfile) Update(ctx transaction.WrappingContext) error {
	return Update(ctx, obj)
}

// Delete deletes the UserProfile
func (obj *UserProfile) Delete(ctx transaction.WrappingContext) error {
	return Delete(ctx, obj)
}
