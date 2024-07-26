package types

import (
	"time"

	sq "github.com/Masterminds/squirrel"
	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/utils/transaction"
)

// VerifiedUser represents a blocked user
type VerifiedUser struct {
	ID                            string `dbKey:"true"`
	Address                       string
	CreatedAt                     time.Time
	SkipClientIntegrityChecks     bool
	SkipIPAddressReputationChecks bool `dbColumn:"skip_ip_address_reputation_checks"`
	ReduceHardChallengeFrequency  bool
	Reason                        string
	ModeratorAddress              string
	ModeratorName                 string
}

// GetVerifiedUsers returns all registered user verifications, starting with the most recent one
func GetVerifiedUsers(ctx transaction.WrappingContext, filter string, pagParams *PaginationParams) ([]*VerifiedUser, uint64, error) {
	s := sdb.Select().
		OrderBy("verified_user.created_at DESC, verified_user.id ASC")
	if filter != "" {
		s = s.Where(sq.Or{
			sq.Eq{"verified_user.id": filter},
			sq.Expr("UPPER(verified_user.address) LIKE '%' || UPPER(?) || '%'", filter),
			sq.Expr("UPPER(verified_user.reason) LIKE '%' || UPPER(?) || '%'", filter),
		})
	}
	s = applyPaginationParameters(s, pagParams)
	return GetWithSelectAndCount[*VerifiedUser](ctx, s)
}

// GetVerifiedUserWithIDs returns the user verifications with the specified IDs
func GetVerifiedUserWithIDs(ctx transaction.WrappingContext, ids []string) (map[string]*VerifiedUser, error) {
	s := sdb.Select().
		Where(sq.Eq{"verified_user.id": ids})
	items, err := GetWithSelect[*VerifiedUser](ctx, s)
	if err != nil {
		return map[string]*VerifiedUser{}, stacktrace.Propagate(err, "")
	}

	result := make(map[string]*VerifiedUser, len(items))
	for i := range items {
		result[items[i].ID] = items[i]
	}
	return result, nil
}

// Update updates or inserts the VerifiedUser
func (obj *VerifiedUser) Update(ctx transaction.WrappingContext) error {
	return Update(ctx, obj)
}

// Delete deletes the VerifiedUser
func (obj *VerifiedUser) Delete(ctx transaction.WrappingContext) error {
	return Delete(ctx, obj)
}
