module github.com/tnyim/jungletv

go 1.16

require (
	github.com/DisgoOrg/disgohook v1.4.4
	github.com/DisgoOrg/log v1.1.2 // indirect
	github.com/JohannesKaufmann/html-to-markdown v1.3.2
	github.com/Masterminds/squirrel v1.5.2
	github.com/RobinUS2/golang-moving-average v1.0.0
	github.com/btcsuite/btcd v0.22.0-beta
	github.com/bwmarrin/snowflake v0.3.0
	github.com/cenkalti/backoff/v4 v4.1.2 // indirect
	github.com/dgrijalva/jwt-go v3.2.0+incompatible
	github.com/disintegration/imaging v1.6.2
	github.com/fogleman/gg v1.3.0
	github.com/gbl08ma/keybox v0.0.0-20180718235424-285a9d753c87
	github.com/gbl08ma/sqalx v0.5.3
	github.com/gbl08ma/ssoclient v0.0.0-20180119211306-11586264f66c
	github.com/go-errors/errors v1.4.2 // indirect
	github.com/golang/freetype v0.0.0-20170609003504-e2365dfdc4a0 // indirect
	github.com/golang/groupcache v0.0.0-20210331224755-41bb18bfe9da // indirect
	github.com/gorilla/mux v1.8.0
	github.com/gorilla/sessions v1.2.1
	github.com/grpc-ecosystem/go-grpc-middleware v1.3.0
	github.com/hectorchu/gonano v0.1.15
	github.com/iancoleman/strcase v0.2.0
	github.com/icza/gox v0.0.0-20210726201659-cd40a3f8d324
	github.com/improbable-eng/grpc-web v0.15.1-0.20220120022325-080bc5c98763
	github.com/jmoiron/sqlx v1.3.4
	github.com/lann/builder v0.0.0-20180802200727-47ae307949d0
	github.com/lib/pq v1.10.4
	github.com/palantir/stacktrace v0.0.0-20161112013806-78658fd2d177
	github.com/patrickmn/go-cache v2.1.0+incompatible
	github.com/rickb777/date v1.17.0
	github.com/rs/cors v1.8.2 // indirect
	github.com/satori/go.uuid v1.2.0
	github.com/sethvargo/go-limiter v0.7.2
	github.com/shopspring/decimal v1.3.1
	github.com/vburenin/nsync v0.0.0-20160822015540-9a75d1c80410
	github.com/vechain/go-ecvrf v0.0.0-20200326080414-5b7e9ee61906
	golang.org/x/crypto v0.0.0-20220112180741-5e0467b6c7ce // indirect
	golang.org/x/image v0.0.0-20211028202545-6944b10bf410
	golang.org/x/net v0.0.0-20220121210141-e204ce36a2ba // indirect
	golang.org/x/oauth2 v0.0.0-20211104180415-d3ed0bb246c8
	golang.org/x/sys v0.0.0-20220114195835-da31bd327af9 // indirect
	google.golang.org/api v0.65.0
	google.golang.org/genproto v0.0.0-20220118154757-00ab72f36ad5 // indirect
	google.golang.org/grpc v1.43.0
	google.golang.org/protobuf v1.27.1
	gopkg.in/alexcesaro/statsd.v2 v2.0.0
)

replace github.com/hectorchu/gonano v0.1.15 => github.com/gbl08ma/gonano v0.1.16-0.20220219121042-f284aae8926a

replace github.com/palantir/stacktrace v0.0.0-20161112013806-78658fd2d177 => github.com/gsgalloway/stacktrace v0.0.0-20200507040314-ca3802f754c7
