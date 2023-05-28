#!/bin/sh
GOFLAGS="-trimpath" gox -osarch="linux/amd64" -tags="release lab" -ldflags="$(govvv -flags)" -output="jungletv"