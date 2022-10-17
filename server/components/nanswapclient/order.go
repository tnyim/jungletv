package nanswapclient

import (
	"context"
	"encoding/json"
	"time"

	"github.com/palantir/stacktrace"
	"github.com/shopspring/decimal"
)

// OrderStatus represents the status of an order
type OrderStatus string

var (
	OrderStatusWaiting    OrderStatus = "waiting"
	OrderStatusExchanging OrderStatus = "exchanging"
	OrderStatusSending    OrderStatus = "sending"
	OrderStatusCompleted  OrderStatus = "completed"
	OrderStatusError      OrderStatus = "error"
)

type getOrderRequest struct {
	ID string `url:"id"`
}

// GetOrderResponse represents the response to a GetOrder request
type GetOrderResponse struct {
	ID                 string          `json:"id"`
	Status             OrderStatus     `json:"status"`
	From               Ticker          `json:"from"`
	To                 Ticker          `json:"to"`
	ExpectedAmountFrom decimal.Decimal `json:"expectedAmountFrom"`
	ExpectedAmountTo   decimal.Decimal `json:"expectedAmountTo"`
	FromAmount         decimal.Decimal `json:"fromAmount"`
	ToAmount           decimal.Decimal `json:"toAmount"`
	PayinAddress       string          `json:"payinAddress"`
	PayoutAddress      string          `json:"payoutAddress"`
	SenderAddress      string          `json:"senderAddress"`
	PayinHash          string          `json:"payinHash"`
	PayoutHash         string          `json:"payoutHash"`
}

// GetOrder returns data of an order
func (c *Client) GetOrder(ctx context.Context, id string) (GetOrderResponse, error) {
	response, err := doGetRequest[getOrderRequest, GetOrderResponse](ctx, c, "get-order", getOrderRequest{
		ID: id,
	})
	if err != nil {
		return GetOrderResponse{}, stacktrace.Propagate(err, "")
	}
	return response, nil
}

type createOrderRequest struct {
	From               Ticker      `json:"from"`
	To                 Ticker      `json:"to"`
	Amount             json.Number `json:"amount"`
	ToAddress          string      `json:"toAddress"`
	MaxDurationSeconds int         `json:"maxDurationSeconds"`
}

// CreateOrderResponse represents the response to a CreateOrder request
type CreateOrderResponse struct {
	ID                 string          `json:"id"`
	From               Ticker          `json:"from"`
	To                 Ticker          `json:"to"`
	ExpectedAmountFrom decimal.Decimal `json:"expectedAmountFrom"`
	ExpectedAmountTo   decimal.Decimal `json:"expectedAmountTo"`
	PayinAddress       string          `json:"payinAddress"`
	PayoutAddress      string          `json:"payoutAddress"`
}

// CreateOrder creates a new order and returns order data
func (c *Client) CreateOrder(ctx context.Context, from, to Ticker, amount decimal.Decimal, toAddress string, maxDuration time.Duration) (CreateOrderResponse, error) {
	response, err := doPostRequest[createOrderRequest, CreateOrderResponse](ctx, c, "create-order", createOrderRequest{
		From:               from,
		To:                 to,
		Amount:             json.Number(amount.String()),
		ToAddress:          toAddress,
		MaxDurationSeconds: int(maxDuration / time.Second),
	})
	if err != nil {
		return CreateOrderResponse{}, stacktrace.Propagate(err, "")
	}
	return response, nil
}
