package types

import (
	"errors"

	sq "github.com/Masterminds/squirrel"
	"github.com/gbl08ma/sqalx"
	"github.com/palantir/stacktrace"
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
func GetApplicationValue(node sqalx.Node, applicationID, key string) (*ApplicationValue, error) {
	s := sdb.Select().
		Where(sq.Eq{"application_value.application_id": applicationID}).
		Where(sq.Eq{"application_value.key": key})
	items, err := GetWithSelect[*ApplicationValue](node, s)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	if len(items) == 0 {
		return nil, ErrApplicationValueNotFound
	}
	return items[0], nil
}

// GetApplicationValueByIndex returns the application value at the Nth index (zero-based)
func GetApplicationValueByIndex(node sqalx.Node, applicationID string, index uint64) (*ApplicationValue, error) {
	s := sdb.Select().
		Where(sq.Eq{"application_value.application_id": applicationID}).
		OrderBy("application_value.application_id", "application_value.key").
		Offset(index).Limit(1)
	items, err := GetWithSelect[*ApplicationValue](node, s)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	if len(items) == 0 {
		return nil, ErrApplicationValueNotFound
	}
	return items[0], nil
}

// CountApplicationValuesForApplication returns the number of application values for the specified application
func CountApplicationValuesForApplication(node sqalx.Node, applicationID string) (int, error) {
	tx, err := node.Beginx()
	if err != nil {
		return 0, stacktrace.Propagate(err, "")
	}
	defer tx.Commit() // read-only tx

	var count int
	err = sdb.Select("COUNT(*)").
		From("application_value").
		Where(sq.Eq{"application_value.application_id": applicationID}).
		RunWith(tx).QueryRow().Scan(&count)
	if err != nil {
		return 0, stacktrace.Propagate(err, "")
	}
	return count, nil
}

// ClearApplicationValuesForApplication clears all the values for the specified application
func ClearApplicationValuesForApplication(node sqalx.Node, applicationID string) error {
	builder := sdb.Delete("application_value").Where(sq.Eq{"application_value.application_id": applicationID})
	logger.Println(builder.ToSql())
	_, err := builder.RunWith(node).Exec()
	return stacktrace.Propagate(err, "")
}

// Update updates or inserts the ApplicationValue
func (obj *ApplicationValue) Update(node sqalx.Node) error {
	return Update(node, obj)
}

// Update deletes the ApplicationValue
func (obj *ApplicationValue) Delete(node sqalx.Node) error {
	return Delete(node, obj)
}
