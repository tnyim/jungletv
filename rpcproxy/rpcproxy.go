package main

import (
	"context"
	"crypto/tls"
	"encoding/hex"
	"encoding/json"
	"log"
	"net"
	"net/http"
	"net/http/httputil"
	"net/netip"
	"net/url"
	"os"
	"slices"
	"strings"
	"time"

	"github.com/dyson/certman"
	"github.com/improbable-eng/grpc-web/go/grpcweb"
	"github.com/palantir/stacktrace"
	"github.com/quic-go/quic-go"
	"github.com/quic-go/quic-go/http3"
	"github.com/samber/lo"
	"github.com/tnyim/jungletv/rpcproxy/tokens"
)

var mainLog = log.New(os.Stdout, "", log.Ldate|log.Ltime)

type proxy struct {
	tokenParser               *tokens.Parser
	expectedOrigins           []string
	expectedHosts             []string
	reverseProxy              *httputil.ReverseProxy
	serveOptionsResponse      bool
	handlerForOptionsRequests http.Handler
	http3Server               *http3.Server
}

func NewProxy(
	target *url.URL,
	tlsHandshakeTimeout, responseHeaderTimeout time.Duration,
	insecureTLS bool,
	tlsServerName string,
	tokenSecret []byte,
	expectedOrigins, expectedHosts []string,
	serveOptionsResponse bool,
	allowedRequestsHeaders []string,
	http3Server *http3.Server) *proxy {
	wrappedServer := grpcweb.WrapServer(nil,
		grpcweb.WithOriginFunc(func(origin string) bool {
			return slices.Contains(expectedOrigins, origin)
		}),
		grpcweb.WithAllowedRequestHeaders(allowedRequestsHeaders),
		// this allows us to use the wrapped server enough to support CORS OPTIONS requests despite not having a backing gRPC server:
		grpcweb.WithCorsForRegisteredEndpointsOnly(false),
	)

	return &proxy{
		tokenParser:               tokens.NewParser(tokenSecret),
		expectedOrigins:           expectedOrigins,
		expectedHosts:             expectedHosts,
		serveOptionsResponse:      serveOptionsResponse,
		handlerForOptionsRequests: wrappedServer,
		http3Server:               http3Server,
		reverseProxy: &httputil.ReverseProxy{
			Rewrite: func(pr *httputil.ProxyRequest) {
				pr.Out.URL.Scheme = target.Scheme
				pr.Out.URL.Host = target.Host
				if pr.Out.Method != http.MethodOptions {
					pr.Out.Header.Add("cf-ipcountry", pr.Out.Context().Value(countryCodeContextKey{}).(string))
				}
				clientIP, _, err := net.SplitHostPort(pr.In.RemoteAddr)
				if err == nil {
					pr.Out.Header.Set("cf-connecting-ip", clientIP)
				}
				pr.SetXForwarded()
			},
			ErrorLog: mainLog,
			Transport: &http.Transport{
				TLSHandshakeTimeout:   tlsHandshakeTimeout,
				IdleConnTimeout:       0,
				ResponseHeaderTimeout: responseHeaderTimeout,
				ExpectContinueTimeout: responseHeaderTimeout,
				ForceAttemptHTTP2:     true,
				TLSClientConfig: &tls.Config{
					InsecureSkipVerify: insecureTLS,
					ServerName:         tlsServerName,
				},
			},
		},
	}
}

func (p *proxy) parseRemoteAddr(remoteAddr string) string {
	addrPort, err := netip.ParseAddrPort(remoteAddr)
	if err == nil {
		return addrPort.Addr().Unmap().WithZone("").String()
	}
	addr, err := netip.ParseAddr(remoteAddr)
	if err != nil {
		return ""
	}
	return addr.Unmap().WithZone("").String()
}

func (p *proxy) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	if p.http3Server != nil && r.ProtoMajor < 3 {
		err := p.http3Server.SetQUICHeaders(w.Header())
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
	}
	if origin := r.Header.Get("Origin"); !slices.Contains(p.expectedOrigins, origin) {
		w.WriteHeader(http.StatusForbidden)
		return
	}
	if !slices.Contains(p.expectedHosts, r.Host) {
		w.WriteHeader(http.StatusForbidden)
		return
	}
	if r.Method != http.MethodOptions && r.Method != http.MethodPost {
		w.WriteHeader(http.StatusForbidden)
		return
	}
	if !strings.HasPrefix(r.URL.Path, "/jungletv.JungleTV/") {
		w.WriteHeader(http.StatusForbidden)
		return
	}

	if r.Method == http.MethodPost {
		if !strings.HasPrefix(r.Header.Get("Content-Type"), "application/grpc-web") {
			w.WriteHeader(http.StatusForbidden)
			return
		}

		tokenString := r.Header.Get(tokens.HeaderName)
		countryCode, err := p.tokenParser.Parse(tokenString, p.parseRemoteAddr(r.RemoteAddr), r.Header.Get("User-Agent"))
		if err != nil {
			w.WriteHeader(http.StatusForbidden)
			return
		}

		newCtx := context.WithValue(r.Context(), countryCodeContextKey{}, countryCode)
		r = r.WithContext(newCtx)
	} else if p.serveOptionsResponse {
		p.handlerForOptionsRequests.ServeHTTP(w, r)
		return
	}
	p.reverseProxy.ServeHTTP(w, r)
}

type countryCodeContextKey struct{}

type config struct {
	ListenAddr string `json:"listenAddr"`
	Hosts      map[string]struct {
		CertificateFile string `json:"certificateFile"`
		KeyFile         string `json:"keyFile"`
	}

	Target                string `json:"target"`
	TLSHandshakeTimeout   int    `json:"tlsHandshakeTimeout"`
	ResponseHeaderTimeout int    `json:"responseHeaderTimeout"`
	InsecureTLS           bool   `json:"insecureTLS"`
	TLSServerName         string `json:"tlsServerName"`

	TokenSecret     string   `json:"tokenSecret"`
	ExpectedOrigins []string `json:"expectedOrigins"`

	ServeCORSResponseDirectly bool     `json:"serveCORSResponseDirectly"`
	CORSAllowedRequestHeaders []string `json:"corsAllowedRequestHeaders"`

	EnableHTTP3 bool `json:"enableHTTP3"`
}

func readConfig(file string) (config, error) {
	data, err := os.ReadFile(file)
	if err != nil {
		return config{}, stacktrace.Propagate(err, "could not read %s", file)
	}
	var cfg config
	err = json.Unmarshal(data, &cfg)
	if err != nil {
		return config{}, stacktrace.Propagate(err, "")
	}
	return cfg, nil
}

func main() {
	c, err := readConfig("config.json")
	if err != nil {
		mainLog.Fatalln(stacktrace.Propagate(err, "failed to read configuration"))
	}
	target, err := url.Parse(c.Target)
	if err != nil {
		mainLog.Fatalln(stacktrace.Propagate(err, "failed to parse target"))
	}

	secret, err := hex.DecodeString(c.TokenSecret)
	if err != nil {
		mainLog.Fatalln(stacktrace.Propagate(err, "failed to decode token secret"))
	}

	cmForHosts := make(map[string]*certman.CertMan)
	tlsConfig := &tls.Config{
		GetCertificate: func(chi *tls.ClientHelloInfo) (*tls.Certificate, error) {
			cm, ok := cmForHosts[chi.ServerName]
			if !ok {
				return nil, stacktrace.NewError("missing certificate")
			}
			cert, err := cm.GetCertificate(chi)
			if err != nil {
				return nil, stacktrace.Propagate(err, "")
			}
			return cert, nil
		},
	}

	var httpServer *http.Server
	var http3Server *http3.Server
	if c.EnableHTTP3 {
		http3Server = &http3.Server{
			ConnContext: func(ctx context.Context, c quic.Connection) context.Context {
				// putting the http.ServerContextKey in the context makes it so that the httputil.ReverseProxy won't log the message
				// "suppressing panic for copyResponse error in test; copy error: context canceled"
				// every time a request is cancelled (which always happens at the end of gRPC-web streaming requests)
				// see the implementation of shouldPanicOnCopyError inside the httputil.ReverseProxy and Go issue https://github.com/golang/go/issues/23643
				// to understand why this happens and why this suppresses the message
				return context.WithValue(ctx, http.ServerContextKey, httpServer)
			},
			Addr: c.ListenAddr,
			// Handler is set after proxy is created
			TLSConfig:  tlsConfig,
			QUICConfig: &quic.Config{},
		}
	}

	proxy := NewProxy(target,
		time.Duration(c.TLSHandshakeTimeout)*time.Millisecond,
		time.Duration(c.ResponseHeaderTimeout)*time.Millisecond,
		c.InsecureTLS,
		c.TLSServerName,
		secret,
		c.ExpectedOrigins,
		lo.Keys(c.Hosts),
		c.ServeCORSResponseDirectly,
		c.CORSAllowedRequestHeaders,
		http3Server,
	)

	if http3Server != nil {
		http3Server.Handler = proxy

		go func() {
			if err := http3Server.ListenAndServe(); err != nil {
				mainLog.Fatalln(stacktrace.Propagate(err, "failed starting http3 server"))
			}
		}()
	}

	for host, hostConfig := range c.Hosts {
		cm, err := certman.New(hostConfig.CertificateFile, hostConfig.KeyFile)
		if err != nil {
			mainLog.Fatalln(stacktrace.Propagate(err, ""))
		}
		err = cm.Watch()
		if err != nil {
			mainLog.Fatalln(stacktrace.Propagate(err, ""))
		}
		defer cm.Stop()

		host, _, err := net.SplitHostPort(host)
		if err != nil {
			mainLog.Fatalln(stacktrace.Propagate(err, ""))
		}
		cmForHosts[host] = cm
	}

	httpServer = &http.Server{
		Addr:      c.ListenAddr,
		Handler:   proxy,
		TLSConfig: tlsConfig,
	}
	if err := httpServer.ListenAndServeTLS("", ""); err != nil {
		mainLog.Fatalln(stacktrace.Propagate(err, "failed starting http2 server"))
	}
}
