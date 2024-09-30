package types

import (
	"errors"

	sq "github.com/Masterminds/squirrel"
	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/utils/transaction"
)

// ApplicationValue represents one of the entries in an application's key-value store
type ApplicationValue struct {
	ApplicationID string `dbKey:"true"`
	Key           string `dbKey:"true"`
	Value         string
}

// ErrApplicationValueNotFound is returned when we can not find the specified application value
var ErrApplicationValueNotFound = errors.New("application value not found")

// GetApplicationValue returns the application value for the specified application and key
func GetApplicationValue(ctx transaction.WrappingContext, applicationID, key string) (*ApplicationValue, error) {
	s := sdb.Select().
		Where(sq.Eq{"application_value.application_id": applicationID}).
		Where(sq.Eq{"application_value.key": key})
	items, err := GetWithSelect[*ApplicationValue](ctx, s)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	if len(items) == 0 {
		return nil, ErrApplicationValueNotFound
	}
	return items[0], nil
}

// GetApplicationValueByIndex returns the application value at the Nth index (zero-based)
func GetApplicationValueByIndex(ctx transaction.WrappingContext, applicationID string, index uint64) (*ApplicationValue, error) {
	s := sdb.Select().
		Where(sq.Eq{"application_value.application_id": applicationID}).
		OrderBy("application_value.application_id", "application_value.key").
		Offset(index).Limit(1)
	items, err := GetWithSelect[*ApplicationValue](ctx, s)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	if len(items) == 0 {
		return nil, ErrApplicationValueNotFound
	}
	return items[0], nil
}

// GetApplicationValuesAfterIndex returns up to `count` application values after the Nth `index` (zero-based)
func GetApplicationValuesAfterIndex(ctx transaction.WrappingContext, applicationID string, index uint64, count uint64) ([]*ApplicationValue, error) {
	s := sdb.Select().
		Where(sq.Eq{"application_value.application_id": applicationID}).
		OrderBy("application_value.application_id", "application_value.key").
		Offset(index).Limit(count)
	items, err := GetWithSelect[*ApplicationValue](ctx, s)
	return items, stacktrace.Propagate(err, "")
}

// CountApplicationValuesForApplication returns the number of application values for the specified application
func CountApplicationValuesForApplication(ctx transaction.WrappingContext, applicationID string) (int, error) {
	ctx, err := transaction.Begin(ctx)
	if err != nil {
		return 0, stacktrace.Propagate(err, "")
	}
	defer ctx.Commit() // read-only tx

	var count int
	err = sdb.Select("COUNT(*)").
		From("application_value").
		Where(sq.Eq{"application_value.application_id": applicationID}).
		RunWith(ctx).QueryRowContext(ctx).Scan(&count)
	if err != nil {
		return 0, stacktrace.Propagate(err, "")
	}
	return count, nil
}

// ClearApplicationValuesForApplication clears all the values for the specified application
func ClearApplicationValuesForApplication(ctx transaction.WrappingContext, applicationID string) error {
	builder := sdb.Delete("application_value").Where(sq.Eq{"application_value.application_id": applicationID})
	logger.Println(builder.ToSql())
	_, err := builder.RunWith(ctx).ExecContext(ctx)
	return stacktrace.Propagate(err, "")
}

// Update updates or inserts the ApplicationValue
func (obj *ApplicationValue) Update(ctx transaction.WrappingContext) error {
	return Update(ctx, obj)
}

// Update deletes the ApplicationValue
func (obj *ApplicationValue) Delete(ctx transaction.WrappingContext) error {
	return Delete(ctx, obj)
}
