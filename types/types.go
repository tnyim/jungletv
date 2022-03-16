package types

import (
	"database/sql"
	"fmt"
	"io/ioutil"
	"log"
	"reflect"
	"strings"
	"unsafe"

	sq "github.com/Masterminds/squirrel"
	"github.com/gbl08ma/sqalx"
	"github.com/iancoleman/strcase"
	"github.com/palantir/stacktrace"
)

const dbColumnTagName = "dbColumn"
const dbColumnRawTagName = "dbColumnRaw"
const dbIgnoreTagName = "dbIgnore"
const dbKeyTagName = "dbKey"
const dbTypeTagName = "dbType"

var logger = log.New(ioutil.Discard, "", log.LstdFlags)

var sdb sq.StatementBuilderType
var dbTypes = make(map[string]reflect.Type)

func init() {
	sdb = sq.StatementBuilder.PlaceholderFormat(sq.Dollar)
}

func registerCustomDBtype(t customDBType) {
	rt := reflect.TypeOf(t)
	dbTypes[rt.Elem().Name()] = rt.Elem()
}

type structDBfield struct {
	column        string
	value         interface{}
	key           bool
	ignore        bool
	rawColumnName bool
	specialType   reflect.Type // a customDBtype
}

type tableNameSpecifier interface {
	tableName() string
}

type extraDataHandler interface {
	queryExtra(sqalx.Node) error
	// updateExtra is called twice: once, before updating the main type, and again, after updating it (this helps dealing with foreign keys/row dependencies)
	updateExtra(node sqalx.Node, preSelf bool) error
}

type customDBType interface {
	convertToDB(origValue interface{})
	convertFromDB() interface{}
}

func getStructInfo(t interface{}) (fields []structDBfield, tableName string) {
	rv := reflect.ValueOf(t)
	rt := reflect.TypeOf(t)
	if rt.Kind() == reflect.Ptr {
		rv = rv.Elem()
		rt = rt.Elem()
	}

	if s, specifiesTableName := t.(tableNameSpecifier); specifiesTableName {
		tableName = s.tableName()
	} else {
		tableName = strcase.ToSnake(rt.Name())
	}

	for i := 0; i < rt.NumField(); i++ {
		fieldType := rt.Field(i)

		columnName, rawColumnName, ignore, key, specialType := parseFieldTag(fieldType.Tag, fieldType.Name)
		if ignore {
			fields = append(fields, structDBfield{ignore: true})
			continue
		}

		f := structDBfield{
			column:        columnName,
			rawColumnName: rawColumnName,
			key:           key,
			specialType:   specialType,
		}

		if rv.IsValid() {
			field := rv.Field(i)
			if !field.CanInterface() {
				// probably unexported
				field = reflect.NewAt(field.Type(), unsafe.Pointer(field.UnsafeAddr())).Elem()
			}
			f.value = field.Interface()
		}

		fields = append(fields, f)
	}

	return fields, tableName
}

func parseFieldTag(tag reflect.StructTag, fieldName string) (columnName string, isRawColumnName, mustIgnore bool, isKey bool, specialType reflect.Type) {
	if tag.Get(dbIgnoreTagName) == "true" {
		return "", true, false, false, nil
	}
	columnName = strcase.ToSnake(fieldName)
	if tn := tag.Get(dbColumnRawTagName); tn != "" {
		columnName = tn
		isRawColumnName = true
	}
	if tn := tag.Get(dbColumnTagName); tn != "" {
		columnName = tn
	}
	isKey = tag.Get(dbKeyTagName) == "true"
	return columnName, isRawColumnName, false, isKey, dbTypes[tag.Get(dbTypeTagName)]
}

func getWithSelect[T any](node sqalx.Node, sbuilder sq.SelectBuilder, withGlobalCount bool) ([]T, uint64, error) {
	tx, err := node.Beginx()
	if err != nil {
		return []T{}, 0, stacktrace.Propagate(err, "")
	}
	defer tx.Commit() // read-only tx

	var t T
	fields, tableName := getStructInfo(t)

	columns := []string{}
	for _, f := range fields {
		if !f.ignore {
			if f.rawColumnName {
				columns = append(columns, f.column)
			} else {
				columns = append(columns, tableName+"."+f.column)
			}

		}
	}
	if withGlobalCount {
		columns = append(columns, "count(*) OVER() AS types_global_count")
	}

	query := sbuilder.Columns(columns...).From(tableName)
	logger.Println(query.ToSql())

	rows, err := query.RunWith(tx).Query()
	if err != nil {
		return []T{}, 0, stacktrace.Propagate(err, "")
	}

	rt := reflect.TypeOf(t)
	if rt.Kind() == reflect.Ptr {
		rt = rt.Elem()
	}
	values := []T{}
	var globalCount uint64
	for rows.Next() {
		rv := reflect.New(rt).Elem()
		valueFields := []interface{}{}
		for i := 0; i < rv.NumField(); i++ {
			if fields[i].ignore {
				continue
			}
			if fields[i].specialType == nil {
				field := rv.Field(i)
				if !field.Addr().CanInterface() {
					// probably unexported
					field = reflect.NewAt(field.Type(), unsafe.Pointer(field.UnsafeAddr())).Elem()
				}
				valueFields = append(valueFields, field.Addr().Interface())
			} else {
				valueFields = append(valueFields, reflect.New(fields[i].specialType).Interface())
			}
		}
		if withGlobalCount {
			valueFields = append(valueFields, &globalCount)
		}

		err = rows.Scan(valueFields...)
		if err != nil {
			rows.Close()
			return []T{}, 0, stacktrace.Propagate(err, "")
		}

		// convert special types to the type wanted by the struct
		j := 0
		for i := 0; i < rv.NumField(); i++ {
			if fields[i].ignore {
				continue
			}
			if fields[i].specialType != nil {
				vf := valueFields[j].(customDBType)
				field := rv.Field(i)
				field.Set(reflect.ValueOf(vf.convertFromDB()))
			}
			j++
		}

		values = append(values, rv.Addr().Interface().(T))
	}
	if !withGlobalCount {
		globalCount = uint64(len(values))
	}

	rows.Close()

	if _, hasExtra := (any)(t).(extraDataHandler); hasExtra {
		for i := range values {
			v := (any)(values[i]).(extraDataHandler)
			err = v.queryExtra(tx)
			if err != nil {
				return values, globalCount, stacktrace.Propagate(err, "")
			}
		}
	}

	return values, globalCount, nil
}

// GetWithSelect returns a slice of all values for the generic type that match the conditions in sbuilder
func GetWithSelect[T any](node sqalx.Node, sbuilder sq.SelectBuilder) ([]T, error) {
	items, _, err := getWithSelect[T](node, sbuilder, false)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	return items, nil
}

// GetWithSelect returns a slice of all values for the generic type that match the conditions in sbuilder
// along with a count of all values ignoring LIMIT or OFFSET clauses
func GetWithSelectAndCount[T any](node sqalx.Node, sbuilder sq.SelectBuilder) ([]T, uint64, error) {
	return getWithSelect[T](node, sbuilder, true)
}

// Update updates or inserts values t in the database. All t must be of the same type
func Update(node sqalx.Node, t ...interface{}) error {
	return stacktrace.Propagate(updateOrInsert(node, true, t), "")
}

// Insert inserts values t in the database. All t must be of the same type
func Insert(node sqalx.Node, t ...interface{}) error {
	return stacktrace.Propagate(updateOrInsert(node, false, t), "")
}

// updateOrInsert updates or inserts values t in the database. All t must be of the same type
func updateOrInsert(node sqalx.Node, allowUpdate bool, t []interface{}) error {
	if len(t) == 0 {
		return nil
	}
	tx, err := node.Beginx()
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	defer tx.Rollback()

	columns := []string{}
	rows := [][]interface{}{}
	fields := []structDBfield{}
	tableName := ""
	_, hasExtra := t[0].(extraDataHandler)
	for rowIdx, ti := range t {
		if hasExtra {
			err = ti.(extraDataHandler).updateExtra(tx, true)
			if err != nil {
				return stacktrace.Propagate(err, "")
			}
		}

		fields, tableName = getStructInfo(ti)

		values := []interface{}{}
		for i := range fields {
			if !fields[i].ignore {
				if rowIdx == 0 {
					columns = append(columns, fields[i].column)
				}
				if fields[i].specialType != nil {
					// convert special types
					converted := reflect.New(fields[i].specialType).Interface().(customDBType)
					converted.convertToDB(fields[i].value)
					fields[i].value = converted
				}
				values = append(values, fields[i].value)
			}
		}
		rows = append(rows, values)
	}

	suffixStr := ""
	keyFields := []*structDBfield{}
	keyFieldNames := []string{}
	for _, field := range fields {
		if field.key {
			keyFields = append(keyFields, &field)
			keyFieldNames = append(keyFieldNames, field.column)
		}
	}
	if allowUpdate && len(keyFields) > 0 {
		suffixStr = "ON CONFLICT (" + strings.Join(keyFieldNames, ", ") + ") DO UPDATE SET "
		updateFields := 0
		for _, field := range fields {
			if !field.key && !field.ignore {
				suffixStr += fmt.Sprintf("%s = EXCLUDED.%s,", field.column, field.column)
				updateFields++
			}
		}
		if updateFields == 0 {
			// all columns on this table are part of the primary key
			suffixStr = suffixStr[:len(suffixStr)-len("UPDATE SET ")] + "NOTHING"
		} else {
			suffixStr = suffixStr[:len(suffixStr)-1]
		}
	}

	builder := sdb.Insert(tableName).Columns(columns...)
	for _, values := range rows {
		builder = builder.Values(values...)
	}
	builder = builder.Suffix(suffixStr)
	logger.Println(builder.ToSql())

	_, err = builder.RunWith(tx).Exec()
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	// call updateExtra again, this time with preSelf == false
	if hasExtra {
		for _, ti := range t {
			err = ti.(extraDataHandler).updateExtra(tx, false)
			if err != nil {
				return stacktrace.Propagate(err, "")
			}
		}
	}

	return stacktrace.Propagate(tx.Commit(), "")
}

// DeleteCustom deletes the values with the same type as t which match the conditions in dbuilder
func DeleteCustom(node sqalx.Node, t interface{}, dbuilder sq.DeleteBuilder) error {
	tx, err := node.Beginx()
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	defer tx.Rollback()

	_, tableName := getStructInfo(t)

	builder := dbuilder.From(tableName)
	logger.Println(builder.ToSql())
	_, err = builder.RunWith(tx).Exec()
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	return stacktrace.Propagate(tx.Commit(), "")
}

// Delete deletes values t from the database.  All t must be of the same type
func Delete(node sqalx.Node, t ...interface{}) error {
	return stacktrace.Propagate(deleteValues(node, false, t), "")
}

// MustDelete deletes values t from the database.  All t must be of the same type
// MustDelete is like Delete but returns an error when no rows were deleted
func MustDelete(node sqalx.Node, t ...interface{}) error {
	return stacktrace.Propagate(deleteValues(node, true, t), "")
}

// delete deletes values t from the database.  All t must be of the same type
func deleteValues(node sqalx.Node, errorOnNothingDeleted bool, t []interface{}) error {
	tx, err := node.Beginx()
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	defer tx.Rollback()

	or := sq.Or{}

	tableName := ""
	for _, ti := range t {
		var fields []structDBfield
		fields, tableName = getStructInfo(ti)
		deleteEqs := make(map[string]interface{})
		for _, field := range fields {
			if field.key {
				deleteEqs[field.column] = field.value
			}
		}

		if len(deleteEqs) == 0 {
			return stacktrace.NewError("type does not have any known keys")
		}
		or = append(or, sq.Eq(deleteEqs))
	}

	builder := sdb.Delete(tableName).Where(or)
	logger.Println(builder.ToSql())
	result, err := builder.RunWith(tx).Exec()
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	if errorOnNothingDeleted {
		rowsAffected, err := result.RowsAffected()
		if err != nil {
			return stacktrace.Propagate(err, "")
		}
		if rowsAffected == 0 {
			return sql.ErrNoRows
		}
	}
	return stacktrace.Propagate(tx.Commit(), "")
}

// SetLogger sets the logger that will be used for verbose output of the functions in this package
func SetLogger(l *log.Logger) {
	logger = l
}

func subQueryEq(property string, query sq.SelectBuilder) sq.Sqlizer {
	sql, args, _ := query.ToSql()
	subQuery := fmt.Sprintf("%s = (%s)", property, sql)
	return sq.Expr(subQuery, args...)
}
