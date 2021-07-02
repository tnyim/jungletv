module github.com/tnyim/jungletv

go 1.16

require (
	github.com/bwmarrin/snowflake v0.3.0
	github.com/desertbit/timer v0.0.0-20180107155436-c41aec40b27f // indirect
	github.com/dgrijalva/jwt-go v3.2.0+incompatible
	github.com/emirpasic/gods v1.12.0
	github.com/gbl08ma/keybox v0.0.0-20180718235424-285a9d753c87
	github.com/gbl08ma/ssoclient v0.0.0-20180119211306-11586264f66c
	github.com/go-errors/errors v1.4.0 // indirect
	github.com/gorilla/mux v1.8.0
	github.com/gorilla/sessions v1.2.1
	github.com/grpc-ecosystem/go-grpc-middleware v1.3.0
	github.com/hectorchu/gonano v0.1.15
	github.com/improbable-eng/grpc-web v0.14.0
	github.com/mwitkow/go-conntrack v0.0.0-20190716064945-2f068394615f // indirect
	github.com/palantir/stacktrace v0.0.0-20161112013806-78658fd2d177
	github.com/rickb777/date v1.15.3
	github.com/rs/cors v1.7.0 // indirect
	github.com/satori/go.uuid v1.2.0
	github.com/sethvargo/go-limiter v0.6.0
	golang.org/x/crypto v0.0.0-20201221181555-eec23a3978ad
	google.golang.org/api v0.46.0
	google.golang.org/grpc v1.37.1
	google.golang.org/protobuf v1.26.0
	gopkg.in/alexcesaro/statsd.v2 v2.0.0
	nhooyr.io/websocket v1.8.7 // indirect
)

replace github.com/hectorchu/gonano v0.1.15 => github.com/gbl08ma/gonano v0.1.16-0.20210701223933-4588b0df0a78
