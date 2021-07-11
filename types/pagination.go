package types

import sq "github.com/Masterminds/squirrel"

// PaginationParams contains parameters needed for pagination
type PaginationParams struct {
	Offset uint64
	Limit  uint64
}

func applyPaginationParameters(s sq.SelectBuilder, pagParams *PaginationParams) sq.SelectBuilder {
	if pagParams != nil {
		s = s.Offset(pagParams.Offset).Limit(pagParams.Limit)
	}
	return s
}
