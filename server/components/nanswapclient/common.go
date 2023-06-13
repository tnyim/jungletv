package nanswapclient

import (
	"bytes"
	"context"
	"net/http"
	"net/url"
	"path"

	"github.com/bytedance/sonic"
	"github.com/google/go-querystring/query"
	"github.com/palantir/stacktrace"
)

func doGetRequest[RequestType any, ResponseType any](ctx context.Context, c *Client, requestPath string, requestFields RequestType) (ResponseType, error) {
	var response ResponseType
	url, err := url.Parse(c.endpoint)
	if err != nil {
		return response, stacktrace.Propagate(err, "")
	}
	url.Path = path.Join(url.Path, requestPath)

	v, err := query.Values(requestFields)
	if err != nil {
		return response, stacktrace.Propagate(err, "")
	}
	url.RawQuery = v.Encode()

	request, err := http.NewRequestWithContext(ctx, http.MethodGet, url.String(), nil)
	if err != nil {
		return response, stacktrace.Propagate(err, "")
	}

	request.Header.Add("Accept", "application/json")
	request.Header.Add("nanswap-api-key", c.apiKey)

	httpResponse, err := c.httpClient.Do(request)
	if err != nil {
		return response, stacktrace.Propagate(err, "")
	}

	defer httpResponse.Body.Close()

	if httpResponse.StatusCode >= 400 {
		return response, stacktrace.NewError("non-success HTTP status code")
	}

	err = sonic.ConfigDefault.NewDecoder(httpResponse.Body).Decode(&response)
	if err != nil {
		return response, stacktrace.Propagate(err, "")
	}

	return response, nil
}

func doPostRequest[RequestType any, ResponseType any](ctx context.Context, c *Client, requestPath string, requestFields RequestType) (ResponseType, error) {
	var response ResponseType
	url, err := url.Parse(c.endpoint)
	if err != nil {
		return response, stacktrace.Propagate(err, "")
	}
	url.Path = path.Join(url.Path, requestPath)

	v, err := query.Values(requestFields)
	if err != nil {
		return response, stacktrace.Propagate(err, "")
	}
	url.RawQuery = v.Encode()

	payload := new(bytes.Buffer)
	err = sonic.ConfigDefault.NewEncoder(payload).Encode(requestFields)
	if err != nil {
		return response, stacktrace.Propagate(err, "")
	}

	request, err := http.NewRequestWithContext(ctx, http.MethodPost, url.String(), payload)
	if err != nil {
		return response, stacktrace.Propagate(err, "")
	}

	request.Header.Add("Content-Type", "application/json")
	request.Header.Add("Accept", "application/json")
	request.Header.Add("nanswap-api-key", c.apiKey)

	httpResponse, err := c.httpClient.Do(request)
	if err != nil {
		return response, stacktrace.Propagate(err, "")
	}

	defer httpResponse.Body.Close()

	if httpResponse.StatusCode >= 400 {
		return response, stacktrace.NewError("non-success HTTP status code")
	}

	err = sonic.ConfigDefault.NewDecoder(httpResponse.Body).Decode(&response)
	if err != nil {
		return response, stacktrace.Propagate(err, "")
	}

	return response, nil
}
