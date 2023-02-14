module github.com/tnyim/jungletv

go 1.18

require (
	github.com/DisgoOrg/disgohook v1.4.4
	github.com/JohannesKaufmann/html-to-markdown v1.3.5
	github.com/Masterminds/squirrel v1.5.3
	github.com/RobinUS2/golang-moving-average v1.0.0
	github.com/anthonynsimon/bild v0.13.0
	github.com/btcsuite/btcd v0.22.0-beta
	github.com/bwmarrin/snowflake v0.3.0
	github.com/deepmap/oapi-codegen v1.11.0
	github.com/dgrijalva/jwt-go v3.2.0+incompatible
	github.com/disintegration/imaging v1.6.2
	github.com/dop251/goja v0.0.0-20230203172422-5460598cfa32
	github.com/dop251/goja_nodejs v0.0.0-20230207183254-2229640ea097
	github.com/dyson/certman v0.3.0
	github.com/fogleman/gg v1.3.0
	github.com/gbl08ma/keybox v0.0.0-20180718235424-285a9d753c87
	github.com/gbl08ma/sqalx v0.5.3
	github.com/gbl08ma/ssoclient v0.0.0-20180119211306-11586264f66c
	github.com/google/btree v1.1.2
	github.com/google/go-querystring v1.1.0
	github.com/gorilla/mux v1.8.0
	github.com/gorilla/sessions v1.2.1
	github.com/grpc-ecosystem/go-grpc-middleware v1.3.0
	github.com/hectorchu/gonano v0.1.17
	github.com/iancoleman/strcase v0.2.0
	github.com/icza/gox v0.0.0-20220812133721-0fbf7a534d8e
	github.com/improbable-eng/grpc-web v0.15.1-0.20220120022325-080bc5c98763
	github.com/jamesog/iptoasn v0.1.0
	github.com/jmoiron/sqlx v1.3.5
	github.com/lann/builder v0.0.0-20180802200727-47ae307949d0
	github.com/lib/pq v1.10.6
	github.com/palantir/stacktrace v0.0.0-20161112013806-78658fd2d177
	github.com/patrickmn/go-cache v2.1.0+incompatible
	github.com/rickb777/date v1.20.0
	github.com/satori/go.uuid v1.2.0
	github.com/sethvargo/go-limiter v0.7.2
	github.com/shopspring/decimal v1.3.1
	github.com/stretchr/testify v1.8.0
	github.com/vburenin/nsync v0.0.0-20160822015540-9a75d1c80410
	github.com/vechain/go-ecvrf v0.0.0-20220525125849-96fa0442e765
	golang.org/x/exp v0.0.0-20220827204233-334a2380cb91
	golang.org/x/image v0.0.0-20220902085622-e7cb96979f69
	golang.org/x/oauth2 v0.0.0-20220822191816-0ebed06d0094
	golang.org/x/sync v0.0.0-20220923202941-7f9b1623fab7
	google.golang.org/api v0.94.0
	google.golang.org/grpc v1.49.0
	google.golang.org/protobuf v1.28.1
	gopkg.in/alexcesaro/statsd.v2 v2.0.0
)

require (
	cloud.google.com/go/compute v1.9.0 // indirect
	github.com/DisgoOrg/log v1.1.3 // indirect
	github.com/DisgoOrg/restclient v1.2.8 // indirect
	github.com/FactomProject/basen v0.0.0-20150613233007-fe3947df716e // indirect
	github.com/FactomProject/btcutilecc v0.0.0-20130527213604-d3a63a5752ec // indirect
	github.com/cenkalti/backoff/v4 v4.1.3 // indirect
	github.com/davecgh/go-spew v1.1.1 // indirect
	github.com/decred/dcrd/dcrec/secp256k1/v4 v4.1.0 // indirect
	github.com/desertbit/timer v0.0.0-20180107155436-c41aec40b27f // indirect
	github.com/dlclark/regexp2 v1.7.0 // indirect
	github.com/fsnotify/fsnotify v1.6.0 // indirect
	github.com/go-errors/errors v1.4.2 // indirect
	github.com/go-sourcemap/sourcemap v2.1.3+incompatible // indirect
	github.com/golang/freetype v0.0.0-20170609003504-e2365dfdc4a0 // indirect
	github.com/golang/groupcache v0.0.0-20210331224755-41bb18bfe9da // indirect
	github.com/golang/protobuf v1.5.2 // indirect
	github.com/google/uuid v1.3.0 // indirect
	github.com/googleapis/enterprise-certificate-proxy v0.1.0 // indirect
	github.com/googleapis/gax-go/v2 v2.5.1 // indirect
	github.com/gorilla/securecookie v1.1.1 // indirect
	github.com/klauspost/compress v1.15.9 // indirect
	github.com/lann/ps v0.0.0-20150810152359-62de8c46ede0 // indirect
	github.com/pkg/errors v0.9.1 // indirect
	github.com/pmezard/go-difflib v1.0.0 // indirect
	github.com/rickb777/plural v1.4.1 // indirect
	github.com/rogpeppe/fastuuid v1.2.0 // indirect
	github.com/rs/cors v1.8.2 // indirect
	github.com/tyler-smith/go-bip39 v1.1.0 // indirect
	go.opencensus.io v0.23.0 // indirect
	golang.org/x/crypto v0.0.0-20220829220503-c86fa9a7ed90 // indirect
	golang.org/x/net v0.4.0 // indirect
	golang.org/x/sys v0.3.0 // indirect
	golang.org/x/text v0.5.0 // indirect
	google.golang.org/appengine v1.6.7 // indirect
	google.golang.org/genproto v0.0.0-20220902135211-223410557253 // indirect
	gopkg.in/yaml.v3 v3.0.1 // indirect
	nhooyr.io/websocket v1.8.7 // indirect
)

replace github.com/hectorchu/gonano v0.1.17 => github.com/gbl08ma/gonano v0.1.16-0.20220412210215-42f9df6ebebe

replace github.com/palantir/stacktrace v0.0.0-20161112013806-78658fd2d177 => github.com/gsgalloway/stacktrace v0.0.0-20200507040314-ca3802f754c7

replace github.com/patrickmn/go-cache v2.1.0+incompatible => github.com/sschiz/go-cache v0.0.0-20220324204139-133b774867fa
