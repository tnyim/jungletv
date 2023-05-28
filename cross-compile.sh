#!/bin/sh
GOFLAGS="-trimpath" gox -osarch="linux/amd64" -tags="release" -ldflags="$(govvv -flags)" -output="jungletv"