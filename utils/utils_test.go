package utils_test

import (
	"regexp"
	"strings"
	"testing"

	"github.com/tnyim/jungletv/utils"

	"github.com/stretchr/testify/require"
)

func TestGetUniquifiedIP(t *testing.T) {
	// maps input to expected result
	testCases := map[string]string{
		"200.123.34.5":                          "200.123.34.5",
		"1.2.3.4":                               "1.2.3.4",
		"f8cb:5e0a:2445:dfdb:5f20:2bf:f9c3:f2c": "f8cb:5e0a:2445:dfdb::",
		"2600:1010:b10c:2d4::":                  "2600:1010:b10c:2d4::",
		"2600:1010:b10c:2d4::1":                 "2600:1010:b10c:2d4::",
		"invalid":                               "invalid",
	}
	for input, expected := range testCases {
		require.Equal(t, expected, utils.GetUniquifiedIP(input))
	}
}

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
