package types

import (
	"time"

	sq "github.com/Masterminds/squirrel"
	"github.com/gbl08ma/sqalx"
	"github.com/palantir/stacktrace"
)

// ApplicationFile represents one of the files used by an application
type ApplicationFile struct {
	ApplicationID string    `dbKey:"true"`
	Name          string    `dbKey:"true"`
	UpdatedAt     time.Time `dbKey:"true"`
	UpdatedBy     string
	EditMessage   string
	Deleted       bool
	Public        bool // whether the file should be served over http
	Type          string
	Content       []byte
}

// ApplicationFileMetadata represents metadata about one of the files used by an application
// This is the same as the ApplicationFile, minus the content, so that listing files does not require bringing their contents from the database.
// Always use ApplicationFile when performing updates/deletes/insertions on a file
type ApplicationFileMetadata struct {
	ApplicationID string    `dbKey:"true"`
	Name          string    `dbKey:"true"`
	UpdatedAt     time.Time `dbKey:"true"`
	UpdatedBy     string
	EditMessage   string
	Deleted       bool
	Public        bool // whether the file should be served over http
	Type          string
}

func (obj *ApplicationFileMetadata) tableName() string {
	return "application_file"
}

type ApplicationFileLike interface {
	*ApplicationFile | *ApplicationFileMetadata
}

// GetApplicationFilesForApplication returns the latest version of all the non-deleted files of an application
func GetApplicationFilesForApplication[T ApplicationFileLike](node sqalx.Node, applicationID, filter string, pagParams *PaginationParams) ([]T, uint64, error) {
	s := sdb.Select().
		Where(sq.Eq{"application_file.application_id": applicationID}).
		Where(sq.Eq{"application_file.deleted": false}).
		Where(subQueryEq(
			"application_file.updated_at",
			sq.Select("MAX(a.updated_at)").
				From("application_file a").
				Where("a.application_id = application_file.application_id").
				Where("a.name = application_file.name"),
		)).
		OrderBy("application_file.name")
	if filter != "" {
		s = s.Where(
			sq.Expr("UPPER(application_file.name) LIKE '%' || UPPER(?) || '%'", filter),
		)
	}
	s = applyPaginationParameters(s, pagParams)
	return GetWithSelectAndCount[T](node, s)
}

// GetApplicationFilesForApplication returns all the non-deleted files of an application, at the specified version
func GetApplicationFilesForApplicationAtVersion[T ApplicationFileLike](node sqalx.Node, applicationID string, version ApplicationVersion, filter string, pagParams *PaginationParams) ([]T, uint64, error) {
	s := sdb.Select().
		Where(sq.Eq{"application_file.application_id": applicationID}).
		Where(sq.Eq{"application_file.deleted": false}).
		Where(subQueryEq(
			"application_file.updated_at",
			sq.Select("MAX(a.updated_at)").
				From("application_file a").
				Where("a.application_id = application_file.application_id").
				Where("a.name = application_file.name").
				Where(sq.LtOrEq{"a.updated_at": version}),
		)).
		OrderBy("application_file.name")
	if filter != "" {
		s = s.Where(
			sq.Expr("UPPER(application_file.name) LIKE '%' || UPPER(?) || '%'", filter),
		)
	}
	s = applyPaginationParameters(s, pagParams)
	return GetWithSelectAndCount[T](node, s)
}

// GetApplicationFilesWithNamesForApplicationAtVersion returns the files with the specified names for an application, at the specified version
func GetApplicationFilesWithNamesForApplicationAtVersion(node sqalx.Node, applicationID string, version ApplicationVersion, names []string) (map[string]*ApplicationFile, error) {
	s := sdb.Select().
		Where(sq.Eq{"application_file.application_id": applicationID}).
		Where(sq.Eq{"application_file.deleted": false}).
		Where(subQueryEq(
			"application_file.updated_at",
			sq.Select("MAX(a.updated_at)").
				From("application_file a").
				Where("a.application_id = application_file.application_id").
				Where("a.name = application_file.name").
				Where(sq.LtOrEq{"a.updated_at": version}),
		)).
		Where(sq.Eq{"application_file.name": names})
	items, err := GetWithSelect[*ApplicationFile](node, s)
	if err != nil {
		return map[string]*ApplicationFile{}, stacktrace.Propagate(err, "")
	}

	result := make(map[string]*ApplicationFile, len(items))
	for i := range items {
		result[items[i].Name] = items[i]
	}
	return result, nil
}

// GetApplicationFilesWithNamesForApplication returns the latest version of the files with the specified names for an application
func GetApplicationFilesWithNamesForApplication(node sqalx.Node, applicationID string, names []string) (map[string]*ApplicationFile, error) {
	s := sdb.Select().
		Where(sq.Eq{"application_file.application_id": applicationID}).
		Where(sq.Eq{"application_file.deleted": false}).
		Where(subQueryEq(
			"application_file.updated_at",
			sq.Select("MAX(a.updated_at)").
				From("application_file a").
				Where("a.application_id = application_file.application_id").
				Where("a.name = application_file.name"),
		)).
		Where(sq.Eq{"application_file.name": names})
	items, err := GetWithSelect[*ApplicationFile](node, s)
	if err != nil {
		return map[string]*ApplicationFile{}, stacktrace.Propagate(err, "")
	}

	result := make(map[string]*ApplicationFile, len(items))
	for i := range items {
		result[items[i].Name] = items[i]
	}
	return result, nil
}

// Update updates or inserts the ApplicationFile
func (obj *ApplicationFile) Update(node sqalx.Node) error {
	return Update(node, obj)
}
