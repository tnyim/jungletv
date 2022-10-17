package nanswapclient

import (
	"context"

	"github.com/palantir/stacktrace"
	"github.com/shopspring/decimal"
)

type getLimitsRequest struct {
	From Ticker `url:"from"`
	To   Ticker `url:"to"`
}

// GetLimitsResponse represents the response to a GetLimits request
type GetLimitsResponse struct {
	From Ticker          `json:"from"`
	To   Ticker          `json:"to"`
	Min  decimal.Decimal `json:"min"`
	Max  decimal.Decimal `json:"max"`
}

// GetLimits returns minimum and maximum from amount for a given pair. Maximum amount depends of current liquidity
func (c *Client) GetLimits(ctx context.Context, from, to Ticker) (GetLimitsResponse, error) {
	response, err := doGetRequest[getLimitsRequest, GetLimitsResponse](ctx, c, "get-limits", getLimitsRequest{
		From: from,
		To:   to,
	})
	if err != nil {
		return GetLimitsResponse{}, stacktrace.Propagate(err, "")
	}
	return response, nil
}
