package httpserver

import (
	"bytes"
	"context"
	"html/template"
	"log"
	"math"
	"net/http"
	"time"

	"github.com/Yiling-J/theine-go"
	"github.com/palantir/stacktrace"
	uuid "github.com/satori/go.uuid"
	"github.com/tnyim/jungletv/buildconfig"
	"github.com/tnyim/jungletv/server/interceptors/version"
	"github.com/tnyim/jungletv/utils/event"
)

type templateCache struct {
	log                *log.Logger
	websiteURL         string
	versionInterceptor *version.VersionInterceptor
	template           *template.Template
	cacheClient        *theine.LoadingCache[string, []byte]
	cleanup            []func()
}

func newTemplateCache(log *log.Logger, versionInterceptor *version.VersionInterceptor, websiteURL string) (*templateCache, error) {
	c := &templateCache{
		log:                log,
		versionInterceptor: versionInterceptor,
		websiteURL:         websiteURL,
	}
	c.reloadTemplate()

	cacheClient, err := theine.NewBuilder[string, []byte](100).Loading(c.cacheLoader).Build()
	if err != nil {
		return nil, stacktrace.Propagate(err, "failed to create cache")
	}
	c.cacheClient = cacheClient
	c.cleanup = append(c.cleanup, cacheClient.Close)

	c.cleanup = append(c.cleanup, versionInterceptor.VersionHashUpdated().SubscribeUsingCallback(event.BufferFirst, func(_ string) {
		c.reloadTemplate()
		c.clearCache()
	}))
	return c, nil
}

func (c *templateCache) Close() {
	for _, f := range c.cleanup {
		f()
	}
}

func (c *templateCache) reloadTemplate() {
	c.template = template.Must(template.New("index.html").ParseGlob("app/public/*.template"))
}

func (c *templateCache) clearCache() {
	keys := []string{}
	c.cacheClient.Range(func(key string, _ []byte) bool {
		keys = append(keys, key)
		return true
	})
	for _, key := range keys {
		c.cacheClient.Delete(key)
	}
}

func (c *templateCache) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	body, err := c.cacheClient.Get(r.Context(), r.URL.Path)
	if err != nil {
		c.log.Println(stacktrace.Propagate(err, ""))
		w.WriteHeader(http.StatusInternalServerError)
	}
	_, err = w.Write(body)
	if err != nil {
		c.log.Println(stacktrace.Propagate(err, ""))
		w.WriteHeader(http.StatusInternalServerError)
	}
}

func (c *templateCache) VersionHashBuilder() string {
	v := c.versionInterceptor.VersionHash()
	if buildconfig.DEBUG {
		v += "***" + uuid.NewV4().String()
	}
	return v
}

func (c *templateCache) cacheLoader(ctx context.Context, path string) (theine.Loaded[[]byte], error) {
	if buildconfig.DEBUG {
		c.reloadTemplate()
	}
	templateData := struct {
		VersionHash string
		FullURL     string
	}{
		FullURL:     c.websiteURL + path,
		VersionHash: c.VersionHashBuilder(),
	}
	buf := &bytes.Buffer{}
	err := c.template.ExecuteTemplate(buf, "index.template", templateData)
	if err != nil {
		return theine.Loaded[[]byte]{}, stacktrace.Propagate(err, "")
	}

	cost := int64(1)
	if buildconfig.DEBUG {
		cost = math.MaxInt64 // never cache
	}
	return theine.Loaded[[]byte]{Value: buf.Bytes(), Cost: cost, TTL: 10 * time.Minute}, nil
}
