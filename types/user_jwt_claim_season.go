package types

import (
	"errors"
	"time"

	sq "github.com/Masterminds/squirrel"
	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/utils/transaction"
)

// UserJWTClaimSeason is the JWT claims season of a user
type UserJWTClaimSeason struct {
	Address   string `dbKey:"true"`
	Season    int
	UpdatedAt time.Time
}

// ErrJWTClaimSeasonNotFound is returned when a JWT claim season for a specified user is not found
var ErrJWTClaimSeasonNotFound = errors.New("JWT claim season not found")

// GetUserJWTClaimSeason returns the UserJWTClaimSeason for the specified user address
func GetUserJWTClaimSeason(ctx transaction.WrappingContext, address string) (*UserJWTClaimSeason, error) {
	s := sdb.Select().
		Where(sq.Eq{"user_jwt_claim_season.address": address})
	items, err := GetWithSelect[*UserJWTClaimSeason](ctx, s)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}

	if len(items) < 1 {
		return nil, stacktrace.Propagate(ErrJWTClaimSeasonNotFound, "")
	}

	return items[0], nil
}

// Update updates or inserts the UserJWTClaimSeason
func (obj *UserJWTClaimSeason) Update(ctx transaction.WrappingContext) error {
	return Update(ctx, obj)
}

// Delete deletes the UserJWTClaimSeason
func (obj *UserJWTClaimSeason) Delete(ctx transaction.WrappingContext) error {
	return Delete(ctx, obj)
}
