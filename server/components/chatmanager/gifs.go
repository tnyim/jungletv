package chatmanager

import (
	"context"
	"net/http"

	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/server/auth"
	"github.com/tnyim/jungletv/server/components/chatmanager/tenorclient"
	"github.com/tnyim/jungletv/server/stores/chat"
)

type GifSearchResult struct {
	ID                 string
	Title              string
	PreviewURL         string
	PreviewFallbackURL string
	Width              int
	Height             int
}

func (c *Manager) GifSearch(ctx context.Context, user auth.User, query string, pos string) ([]*GifSearchResult, string, error) {
	_, _, _, ok, err := c.gifSearchRateLimiter.Take(ctx, user.Address())
	if err != nil {
		return nil, "", stacktrace.Propagate(err, "")
	}
	if !ok {
		return nil, "", stacktrace.NewError("rate limit reached")
	}

	low := tenorclient.Low
	params := &tenorclient.SearchParams{
		Q:             tenorclient.Q(query),
		Contentfilter: (*tenorclient.SearchParamsContentfilter)(&low),
	}

	if pos != "" {
		params.Pos = (*tenorclient.Pos)(&pos)
	}
	response, err := c.tenorClient.SearchWithResponse(ctx, params)
	if err != nil {
		return nil, "", stacktrace.Propagate(err, "")
	}
	if response.StatusCode() != http.StatusOK {
		return nil, "", stacktrace.NewError("non-200 response from Tenor API")
	}

	results := []*GifSearchResult{}
	for _, gifObject := range response.JSON200.Results {
		if len(gifObject.Media) == 0 {
			continue
		}

		previewURL := ""
		fallbackURL := ""
		var width, height int
		if gifObject.Media[0].Nanowebm != nil {
			previewURL = gifObject.Media[0].Nanowebm.Url
			if gifObject.Media[0].Nanomp4 != nil {
				fallbackURL = gifObject.Media[0].Nanomp4.Url
			}
			width = gifObject.Media[0].Nanowebm.Dims[0]
			height = gifObject.Media[0].Nanowebm.Dims[1]
		} else if gifObject.Media[0].Tinywebm != nil {
			previewURL = gifObject.Media[0].Tinywebm.Url
			if gifObject.Media[0].Tinymp4 != nil {
				fallbackURL = gifObject.Media[0].Tinymp4.Url
			}
			width = gifObject.Media[0].Tinywebm.Dims[0]
			height = gifObject.Media[0].Tinywebm.Dims[1]
		} else {
			continue
		}

		cacheEntry := produceTenorGifCacheEntry(gifObject)
		if cacheEntry == nil {
			// no point in including in the results an entry we can't work with later on
			continue
		}
		c.tenorGifCache.SetDefault(gifObject.Id, cacheEntry)

		results = append(results, &GifSearchResult{
			ID:                 gifObject.Id,
			Title:              gifObject.ContentDescription,
			PreviewURL:         previewURL,
			PreviewFallbackURL: fallbackURL,
			Width:              width,
			Height:             height,
		})
	}
	next := string(response.JSON200.Next)
	if next == "0" {
		next = ""
	}
	return results, next, nil
}

func produceTenorGifCacheEntry(gifObject tenorclient.GifObject) *chat.MessageAttachmentTenorGifView {
	url := ""
	fallbackURL := ""
	var width, height int
	if gifObject.Media[0].Webm != nil {
		url = gifObject.Media[0].Webm.Url
		if gifObject.Media[0].Mp4 != nil {
			fallbackURL = gifObject.Media[0].Mp4.Url
		}
		width = gifObject.Media[0].Webm.Dims[0]
		height = gifObject.Media[0].Webm.Dims[1]
	} else if gifObject.Media[0].Mp4 != nil {
		url = gifObject.Media[0].Mp4.Url
		width = gifObject.Media[0].Mp4.Dims[0]
		height = gifObject.Media[0].Mp4.Dims[1]
	} else {
		return nil
	}

	return &chat.MessageAttachmentTenorGifView{
		ID:               gifObject.Id,
		VideoURL:         url,
		VideoFallbackURL: fallbackURL,
		Title:            gifObject.ContentDescription,
		Width:            width,
		Height:           height,
	}
}

func (c *Manager) getTenorGifInfo(ctx context.Context, id string) (*chat.MessageAttachmentTenorGifView, error) {
	v, err, _ := c.getTenorGifInfoSingleflightGroup.Do(id, func() (interface{}, error) {
		info, present := c.tenorGifCache.Get(id)
		if present {
			return info, nil
		}

		params := &tenorclient.GifsParams{
			Ids: (*tenorclient.Ids)(&id),
		}

		response, err := c.tenorClient.GifsWithResponse(ctx, params)
		if err != nil {
			return nil, stacktrace.Propagate(err, "")
		}
		if response.StatusCode() != http.StatusOK {
			return nil, stacktrace.NewError("non-200 response from Tenor API")
		}
		if len(response.JSON200.Results) == 0 {
			return nil, stacktrace.NewError("no results in response from Tenor API")
		}

		gifObject := response.JSON200.Results[0]
		cacheEntry := produceTenorGifCacheEntry(gifObject)
		if cacheEntry == nil {
			return nil, stacktrace.NewError("failed to produce cache entry")
		}
		c.tenorGifCache.SetDefault(gifObject.Id, cacheEntry)
		return cacheEntry, nil
	})
	if v == nil {
		return nil, stacktrace.Propagate(err, "")
	}
	return v.(*chat.MessageAttachmentTenorGifView), stacktrace.Propagate(err, "")
}
