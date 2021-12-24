package server

import (
	"github.com/tnyim/jungletv/proto"
	"github.com/tnyim/jungletv/types"
)

type requestWithPaginationParams interface {
	GetPaginationParams() *proto.PaginationParameters
}

func readPaginationParameters(r requestWithPaginationParams) *types.PaginationParams {
	params := r.GetPaginationParams()
	if params != nil {
		offset := params.Offset
		limit := params.Limit
		if limit == 0 && offset == 0 {
			return nil
		}
		return &types.PaginationParams{
			Offset: offset,
			Limit:  limit,
		}
	}
	return nil
}

func readOffset(r requestWithPaginationParams) uint64 {
	params := r.GetPaginationParams()
	if params != nil {
		return params.Offset
	}
	return 0
}
