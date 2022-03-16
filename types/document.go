package types

import (
	"time"

	sq "github.com/Masterminds/squirrel"
	"github.com/gbl08ma/sqalx"
	"github.com/palantir/stacktrace"
)

// Document represents a document
type Document struct {
	ID        string    `dbKey:"true"`
	UpdatedAt time.Time `dbKey:"true"`
	UpdatedBy string
	Public    bool
	Format    string
	Content   string
}

// GetDocumentsWithIDs returns the latest version of the documents with the specified IDs
func GetDocumentsWithIDs(node sqalx.Node, ids []string) (map[string]*Document, error) {
	s := sdb.Select().
		Where(subQueryEq(
			"document.updated_at",
			sq.Select("MAX(d.updated_at)").From("document d").Where("d.id = document.id"),
		)).
		Where(sq.Eq{"document.id": ids})
	items, err := GetWithSelect[*Document](node, s)
	if err != nil {
		return map[string]*Document{}, stacktrace.Propagate(err, "")
	}

	result := make(map[string]*Document, len(items))
	for i := range items {
		result[items[i].ID] = items[i]
	}
	return result, nil
}

// Update updates or inserts the Document
func (obj *Document) Update(node sqalx.Node) error {
	return Update(node, obj)
}

// Delete deletes the Document
func (obj *Document) Delete(node sqalx.Node) error {
	return Delete(node, obj)
}
