// SPDX-License-Identifier: MIT
// Based on https://github.com/meyskens/go-turnstile
package turnstileclient

import (
	"io"
	"net/http"
	"net/url"
	"time"

	"github.com/bytedance/sonic"
	"github.com/palantir/stacktrace"
)

type Turnstile struct {
	secret       string
	turnstileURL string
	httpClient   http.Client
}

type Response struct {
	// Success indicates if the challenge was passed
	Success bool `json:"success"`
	// ChallengeTs is the timestamp of the captcha
	ChallengeTs string `json:"challenge_ts"`
	// Hostname is the hostname of the passed captcha
	Hostname string `json:"hostname"`
	// ErrorCodes contains error codes returned by hCaptcha (optional)
	ErrorCodes []string `json:"error-codes"`
	// Action  is the customer widget identifier passed to the widget on the client side
	Action string `json:"action"`
	// CData is the customer data passed to the widget on the client side
	CData string `json:"cdata"`
}

func New(secret string, timeout time.Duration) *Turnstile {
	return &Turnstile{
		secret:       secret,
		turnstileURL: "https://challenges.cloudflare.com/turnstile/v0/siteverify",
		httpClient: http.Client{
			Timeout: timeout,
		},
	}
}

// Verify verifies a "h-captcha-response" data field, with an optional remote IP set.
func (t *Turnstile) Verify(response, remoteip string) (*Response, error) {
	values := url.Values{"secret": {t.secret}, "response": {response}}
	if remoteip != "" {
		values.Set("remoteip", remoteip)
	}
	resp, err := http.PostForm(t.turnstileURL, values)
	if err != nil {
		return nil, stacktrace.Propagate(err, "http error")
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, stacktrace.Propagate(err, "response read error")
	}

	r := Response{}
	err = sonic.Unmarshal(body, &r)
	if err != nil {
		return nil, stacktrace.Propagate(err, "json decode error")
	}

	return &r, nil
}
