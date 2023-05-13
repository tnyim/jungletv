package types

import (
	"database/sql/driver"
	"time"

	sq "github.com/Masterminds/squirrel"
	"github.com/gbl08ma/sqalx"
	"github.com/palantir/stacktrace"
)

// ApplicationVersion represents the version of an application
type ApplicationVersion time.Time

// Scan implements the sql.Scanner interface.
func (d *ApplicationVersion) Scan(value interface{}) error {
	if value == nil {
		return nil
	}
	b, ok := value.(time.Time)
	if !ok {
		return stacktrace.NewError("Scan: Invalid val type for scanning")
	}
	*d = ApplicationVersion(b)
	return nil
}

// Value implements the driver.Valuer interface.
func (d ApplicationVersion) Value() (driver.Value, error) {
	return time.Time(d), nil
}

// Application represents an application
type Application struct {
	ID               string             `dbKey:"true"`
	UpdatedAt        ApplicationVersion `dbKey:"true"`
	UpdatedBy        string
	EditMessage      string
	AllowLaunching   bool
	AllowFileEditing bool
	Autorun          bool
	RuntimeVersion   int
}

func GetApplications(node sqalx.Node, filter string, pagParams *PaginationParams) ([]*Application, uint64, error) {
	s := sdb.Select().
		Where(subQueryEq(
			"application.updated_at",
			sq.Select("MAX(d.updated_at)").From("application d").Where("d.id = application.id"),
		)).
		OrderBy("application.id ASC")
	if filter != "" {
		s = s.Where(
			sq.Expr("UPPER(application.id) LIKE '%' || UPPER(?) || '%'", filter),
		)
	}
	s = applyPaginationParameters(s, pagParams)
	return GetWithSelectAndCount[*Application](node, s)
}

// GetApplicationsWithIDs returns the latest version of the applications with the specified IDs
func GetApplicationsWithIDs(node sqalx.Node, ids []string) (map[string]*Application, error) {
	s := sdb.Select().
		Where(subQueryEq(
			"application.updated_at",
			sq.Select("MAX(d.updated_at)").From("application d").Where("d.id = application.id"),
		)).
		Where(sq.Eq{"application.id": ids})
	items, err := GetWithSelect[*Application](node, s)
	if err != nil {
		return map[string]*Application{}, stacktrace.Propagate(err, "")
	}

	result := make(map[string]*Application, len(items))
	for i := range items {
		result[items[i].ID] = items[i]
	}
	return result, nil
}

// GetEarliestVersionOfApplication returns the earliest version of the application with the specified ID
func GetEarliestVersionOfApplication(node sqalx.Node, id string) (ApplicationVersion, error) {
	tx, err := node.Beginx()
	if err != nil {
		return ApplicationVersion{}, stacktrace.Propagate(err, "")
	}
	defer tx.Commit() // read-only tx

	var version ApplicationVersion
	err = sdb.Select("MIN(application.updated_at)").
		From("application").
		Where(sq.Eq{"application.id": id}).
		RunWith(tx).QueryRow().Scan(&version)
	if err != nil {
		return ApplicationVersion{}, stacktrace.Propagate(err, "")
	}
	return version, nil
}

// Update updates or inserts the Application
func (obj *Application) Update(node sqalx.Node) error {
	return Update(node, obj)
}

// Delete deletes the Application
func (obj *Application) Delete(node sqalx.Node) error {
	return Delete(node, obj)
}

func (obj *Application) deleteExtra(node sqalx.Node, preSelf bool) error {
	if !preSelf {
		return nil
	}
	// delete files
	builder := sdb.Delete("application_file").Where(sq.Eq{"application_file.application_id": obj.ID})
	logger.Println(builder.ToSql())
	_, err := builder.RunWith(node).Exec()
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	// delete values
	err = ClearApplicationValuesForApplication(node, obj.ID)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	// delete all other versions of the application
	builder = sdb.Delete("application").Where(sq.Eq{"application.id": obj.ID})
	logger.Println(builder.ToSql())
	_, err = builder.RunWith(node).Exec()
	return stacktrace.Propagate(err, "")
}
