package types

import (
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
	column      string
	value       interface{}
	key         bool
	ignore      bool
	specialType reflect.Type // a customDBtype
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
	if rv.Kind() == reflect.Ptr {
		rv = rv.Elem()
	}

	if s, specifiesTableName := t.(tableNameSpecifier); specifiesTableName {
		tableName = s.tableName()
	} else {
		tableName = strcase.ToSnake(rv.Type().Name())
	}

	for i := 0; i < rv.NumField(); i++ {
		field := rv.Field(i)
		fieldType := rv.Type().Field(i)

		columnName, ignore, key, specialType := parseFieldTag(fieldType.Tag, fieldType.Name)
		if ignore {
			fields = append(fields, structDBfield{ignore: true})
			continue
		}

		f := structDBfield{
			column:      columnName,
			key:         key,
			specialType: specialType,
		}

		if !field.CanInterface() {
			// probably unexported
			field = reflect.NewAt(field.Type(), unsafe.Pointer(field.UnsafeAddr())).Elem()
		}
		f.value = field.Interface()

		fields = append(fields, f)
	}

	return fields, tableName
}

func parseFieldTag(tag reflect.StructTag, fieldName string) (columnName string, mustIgnore bool, isKey bool, specialType reflect.Type) {
	if tag.Get(dbIgnoreTagName) == "true" {
		return "", true, false, nil
	}
	columnName = strcase.ToSnake(fieldName)
	if tn := tag.Get(dbColumnTagName); tn != "" {
		columnName = tn
	}
	isKey = tag.Get(dbKeyTagName) == "true"
	return columnName, false, isKey, dbTypes[tag.Get(dbTypeTagName)]
}

// GetWithSelect returns a slice with all values that match the conditions in sbuilder and that have the same type as t
// Returns a slice where all elements are of type t (so make sure to pass a pointer type if that's what you want)
func GetWithSelect(node sqalx.Node, t interface{}, sbuilder sq.SelectBuilder, withGlobalCount bool) ([]interface{}, uint64, error) {
	tx, err := node.Beginx()
	if err != nil {
		return []interface{}{}, 0, stacktrace.Propagate(err, "")
	}
	defer tx.Commit() // read-only tx

	fields, tableName := getStructInfo(t)

	columns := []string{}
	for _, f := range fields {
		if !f.ignore {
			columns = append(columns, tableName+"."+f.column)
		}
	}
	if withGlobalCount {
		columns = append(columns, "count(*) OVER() AS types_global_count")
	}

	query := sbuilder.Columns(columns...).From(tableName)
	logger.Println(query.ToSql())

	rows, err := query.RunWith(tx).Query()
	if err != nil {
		return []interface{}{}, 0, stacktrace.Propagate(err, "")
	}

	rt := reflect.TypeOf(t)
	if rt.Kind() == reflect.Ptr {
		rt = rt.Elem()
	}
	values := []interface{}{}
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
			return []interface{}{}, 0, stacktrace.Propagate(err, "")
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

		values = append(values, rv.Addr().Interface())
	}
	if !withGlobalCount {
		globalCount = uint64(len(values))
	}

	rows.Close()

	if _, hasExtra := t.(extraDataHandler); hasExtra {
		for i := range values {
			v := values[i].(extraDataHandler)
			err = v.queryExtra(tx)
			if err != nil {
				return values, globalCount, stacktrace.Propagate(err, "")
			}
		}
	}

	return values, globalCount, nil
}

// Update updates or inserts value t in the database
func Update(node sqalx.Node, t interface{}) error {
	tx, err := node.Beginx()
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	defer tx.Rollback()

	if ev, hasExtra := t.(extraDataHandler); hasExtra {
		err = ev.updateExtra(tx, true)
		if err != nil {
			return stacktrace.Propagate(err, "")
		}
	}

	fields, tableName := getStructInfo(t)
	columns := []string{}
	values := []interface{}{}
	for i := range fields {
		if !fields[i].ignore {
			columns = append(columns, fields[i].column)
			if fields[i].specialType != nil {
				// convert special types
				converted := reflect.New(fields[i].specialType).Interface().(customDBType)
				converted.convertToDB(fields[i].value)
				fields[i].value = converted
			}
			values = append(values, fields[i].value)
		}
	}

	suffixStr := ""
	suffixArgs := []interface{}{}
	keyFields := []*structDBfield{}
	keyFieldNames := []string{}
	for _, field := range fields {
		if field.key {
			keyFields = append(keyFields, &field)
			keyFieldNames = append(keyFieldNames, field.column)
		}
	}
	if len(keyFields) > 0 {
		suffixStr = "ON CONFLICT (" + strings.Join(keyFieldNames, ", ") + ") DO UPDATE SET "
		for _, field := range fields {
			if !field.key && !field.ignore {
				suffixStr += field.column + " = ?,"
				suffixArgs = append(suffixArgs, field.value)
			}
		}
		if len(suffixArgs) == 0 {
			// all columns on this table are part of the primary key
			suffixStr = suffixStr[:len(suffixStr)-len("UPDATE SET ")] + "NOTHING"
		} else {
			suffixStr = suffixStr[:len(suffixStr)-1]
		}
	}

	builder := sdb.Insert(tableName).Columns(columns...).
		Values(values...).
		Suffix(suffixStr, suffixArgs...)
	logger.Println(builder.ToSql())

	_, err = builder.RunWith(tx).Exec()
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	// call updateExtra again, this time with preSelf == false
	if ev, hasExtra := t.(extraDataHandler); hasExtra {
		err = ev.updateExtra(tx, false)
		if err != nil {
			return stacktrace.Propagate(err, "")
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

// Delete deletes value t from the database
func Delete(node sqalx.Node, t interface{}) error {
	tx, err := node.Beginx()
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	defer tx.Rollback()

	fields, tableName := getStructInfo(t)
	deleteEqs := make(map[string]interface{})
	for _, field := range fields {
		if field.key {
			deleteEqs[field.column] = field.value
		}
	}

	if len(deleteEqs) == 0 {
		return stacktrace.NewError("type does not have any known keys")
	}

	builder := sdb.Delete(tableName).
		Where(deleteEqs)
	logger.Println(builder.ToSql())
	_, err = builder.RunWith(tx).Exec()
	if err != nil {
		return stacktrace.Propagate(err, "")
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
