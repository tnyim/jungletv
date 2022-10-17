package nanswapclient

import (
	"context"

	"github.com/palantir/stacktrace"
	"github.com/shopspring/decimal"
)

type getEstimateRequest struct {
	From   Ticker `url:"from"`
	To     Ticker `url:"to"`
	Amount string `url:"amount"`
}

// GetEstimateResponse represents the response to a GetEstimate or GetEstimateReverse request
type GetEstimateResponse struct {
	From       Ticker          `json:"from"`
	To         Ticker          `json:"to"`
	AmountFrom decimal.Decimal `json:"amountFrom"`
	AmountTo   decimal.Decimal `json:"amountTo"`
}

// GetEstimate gets estimated exchange amount
func (c *Client) GetEstimate(ctx context.Context, from, to Ticker, fromAmount decimal.Decimal) (GetEstimateResponse, error) {
	response, err := doGetRequest[getEstimateRequest, GetEstimateResponse](ctx, c, "get-estimate", getEstimateRequest{
		From:   from,
		To:     to,
		Amount: fromAmount.String(),
	})
	if err != nil {
		return GetEstimateResponse{}, stacktrace.Propagate(err, "")
	}
	return response, nil
}

// GetEstimateReverse takes toAmount and returns the fromAmount estimation
func (c *Client) GetEstimateReverse(ctx context.Context, from, to Ticker, toAmount decimal.Decimal) (GetEstimateResponse, error) {
	response, err := doGetRequest[getEstimateRequest, GetEstimateResponse](ctx, c, "get-estimate-reverse", getEstimateRequest{
		From:   from,
		To:     to,
		Amount: toAmount.String(),
	})
	if err != nil {
		return GetEstimateResponse{}, stacktrace.Propagate(err, "")
	}
	return response, nil
}
