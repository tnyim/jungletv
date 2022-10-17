package nanswapclient

import (
	"net/http"
	"time"
)

// Client is a client for the Nanswap API
type Client struct {
	endpoint   string
	apiKey     string
	httpClient http.Client
}

// New returns a new initialized Client
func New(endpoint, apiKey string) *Client {
	return &Client{
		endpoint: endpoint,
		apiKey:   apiKey,
		httpClient: http.Client{
			Timeout: time.Second * 5,
		},
	}
}

// Ticker represents the ticker for a Nanswap-supported currency
type Ticker string

var (
	TickerNano   Ticker = "XNO"
	TickerBanano Ticker = "BAN"
)
