package utils_test

import (
	"regexp"
	"strings"
	"testing"

	"github.com/tnyim/jungletv/utils"

	"github.com/stretchr/testify/require"
)

func TestReplaceAllStringSubmatchFuncExcludingInside(t *testing.T) {
	// what we want: convert every capital letter to lowercase except what's inside double-quotes or triple-double-quotes
	match := regexp.MustCompile(`[A-Z]+`)
	exclude := regexp.MustCompile(`""".*?"""|".*?"`)
	repl := func(matches []string) string {
		return strings.ToLower(matches[0])
	}

	output := utils.ReplaceAllStringSubmatchFuncExcludingInside(
		match,
		exclude,
		`234AA 456A"BB DDD B"CC 56C """NOPE"""abc DEF`,
		repl)
	require.Equal(t, `234aa 456a"BB DDD B"cc 56c """NOPE"""abc def`, output)

	output = utils.ReplaceAllStringSubmatchFuncExcludingInside(
		match,
		exclude,
		`"""NOPE"""`,
		repl)
	require.Equal(t, `"""NOPE"""`, output)

	output = utils.ReplaceAllStringSubmatchFuncExcludingInside(
		match,
		exclude,
		`EVERYTHING`,
		repl)
	require.Equal(t, `everything`, output)

	output = utils.ReplaceAllStringSubmatchFuncExcludingInside(
		match,
		exclude,
		`""EVERYTHING""`,
		repl)
	require.Equal(t, `""everything""`, output)

	output = utils.ReplaceAllStringSubmatchFuncExcludingInside(
		match,
		exclude,
		`"EVERYTHING`,
		repl)
	require.Equal(t, `"everything`, output)
}
