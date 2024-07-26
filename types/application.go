package types

import (
	"database/sql/driver"
	"time"

	sq "github.com/Masterminds/squirrel"
	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/utils/transaction"
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

// UnmarshalJSON implements the json.Unmarshaler interface
func (d *ApplicationVersion) UnmarshalJSON(b []byte) error {
	var t time.Time
	err := t.UnmarshalJSON(b)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	*d = ApplicationVersion(t)
	return nil
}

// MarshalJSON implements the json.Marshaler interface
func (d ApplicationVersion) MarshalJSON() ([]byte, error) {
	return time.Time(d).MarshalJSON()
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

func GetApplications(ctx transaction.WrappingContext, filter string, pagParams *PaginationParams) ([]*Application, uint64, error) {
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
	return GetWithSelectAndCount[*Application](ctx, s)
}

// GetApplicationsWithIDs returns the latest version of the applications with the specified IDs
func GetApplicationsWithIDs(ctx transaction.WrappingContext, ids []string) (map[string]*Application, error) {
	s := sdb.Select().
		Where(subQueryEq(
			"application.updated_at",
			sq.Select("MAX(d.updated_at)").From("application d").Where("d.id = application.id"),
		)).
		Where(sq.Eq{"application.id": ids})
	items, err := GetWithSelect[*Application](ctx, s)
	if err != nil {
		return map[string]*Application{}, stacktrace.Propagate(err, "")
	}

	result := make(map[string]*Application, len(items))
	for i := range items {
		result[items[i].ID] = items[i]
	}
	return result, nil
}

// GetApplicationWalletAddress resolves an application's wallet address based on their ID
// The application must have been launched at least once before
func GetApplicationWalletAddress(ctx transaction.WrappingContext, id string) (string, error) {
	ctx, err := transaction.Begin(ctx)
	if err != nil {
		return "", stacktrace.Propagate(err, "")
	}
	defer ctx.Commit() // read-only tx

	var address string
	err = sdb.Select("address").
		From("chat_user").
		Where(sq.Eq{"chat_user.application_id": id}).
		RunWith(ctx).QueryRowContext(ctx).Scan(&address)
	if err != nil {
		return "", stacktrace.Propagate(err, "")
	}
	return address, nil
}

// GetEarliestVersionOfApplication returns the earliest version of the application with the specified ID
func GetEarliestVersionOfApplication(ctx transaction.WrappingContext, id string) (ApplicationVersion, error) {
	ctx, err := transaction.Begin(ctx)
	if err != nil {
		return ApplicationVersion{}, stacktrace.Propagate(err, "")
	}
	defer ctx.Commit() // read-only tx

	var version ApplicationVersion
	err = sdb.Select("MIN(application.updated_at)").
		From("application").
		Where(sq.Eq{"application.id": id}).
		RunWith(ctx).QueryRowContext(ctx).Scan(&version)
	if err != nil {
		return ApplicationVersion{}, stacktrace.Propagate(err, "")
	}
	return version, nil
}

// Update updates or inserts the Application
func (obj *Application) Update(ctx transaction.WrappingContext) error {
	return Update(ctx, obj)
}

// Delete deletes the Application
func (obj *Application) Delete(ctx transaction.WrappingContext) error {
	return Delete(ctx, obj)
}

func (obj *Application) deleteExtra(ctx transaction.WrappingContext, preSelf bool) error {
	if !preSelf {
		return nil
	}
	// delete files
	builder := sdb.Delete("application_file").Where(sq.Eq{"application_file.application_id": obj.ID})
	logger.Println(builder.ToSql())
	_, err := builder.RunWith(ctx).ExecContext(ctx)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	// delete values
	err = ClearApplicationValuesForApplication(ctx, obj.ID)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	// delete all other versions of the application
	builder = sdb.Delete("application").Where(sq.Eq{"application.id": obj.ID})
	logger.Println(builder.ToSql())
	_, err = builder.RunWith(ctx).ExecContext(ctx)
	return stacktrace.Propagate(err, "")
}
