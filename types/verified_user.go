package types

import (
	"time"

	sq "github.com/Masterminds/squirrel"
	"github.com/gbl08ma/sqalx"
	"github.com/palantir/stacktrace"
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

// getVerifiedUserWithSelect returns a slice with all blocked users that match the conditions in sbuilder
func getVerifiedUserWithSelect(node sqalx.Node, sbuilder sq.SelectBuilder) ([]*VerifiedUser, uint64, error) {
	values, totalCount, err := GetWithSelect(node, &VerifiedUser{}, sbuilder, true)
	if err != nil {
		return nil, totalCount, stacktrace.Propagate(err, "")
	}

	converted := make([]*VerifiedUser, len(values))
	for i := range values {
		converted[i] = values[i].(*VerifiedUser)
	}

	return converted, totalCount, nil
}

// GetVerifiedUsers returns all registered user verifications, starting with the most recent one
func GetVerifiedUsers(node sqalx.Node, filter string, pagParams *PaginationParams) ([]*VerifiedUser, uint64, error) {
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
	return getVerifiedUserWithSelect(node, s)
}

// GetVerifiedUserWithIDs returns the user verifications with the specified IDs
func GetVerifiedUserWithIDs(node sqalx.Node, ids []string) (map[string]*VerifiedUser, error) {
	s := sdb.Select().
		Where(sq.Eq{"verified_user.id": ids})
	items, _, err := getVerifiedUserWithSelect(node, s)
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
func (obj *VerifiedUser) Update(node sqalx.Node) error {
	return Update(node, obj)
}

// Delete deletes the VerifiedUser
func (obj *VerifiedUser) Delete(node sqalx.Node) error {
	return Delete(node, obj)
}
