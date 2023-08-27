package bananomessagesigning_test

import (
	"encoding/hex"
	"testing"

	"github.com/stretchr/testify/require"
	"github.com/tnyim/jungletv/utils/bananomessagesigning"
)

func TestVerifyMessage(t *testing.T) {
	testCases := []struct {
		account      string
		signatureHex string
		message      []byte
		valid        bool
	}{
		{
			account:      "ban_1ykbhczjzx6yjnhcyuggtmw3hjxkwrzhbomf96uxyo5kyrj64po6hi4zoxrc",
			signatureHex: "BB0D6BD040364306464F55ADCDDB6C9C11C0E7CC5A93FA6998244792B37937EA698496F2191E8D062839E0CA9B2FB30C2A018D14911114032AEE3E51CDF9970E",
			message:      []byte("This is a test message"),
			valid:        true,
		},
		{
			account:      "ban_1ykbhczjzx6yjnhcyuggtmw3hjxkwrzhbomf96uxyo5kyrj64po6hi4zoxrc",
			signatureHex: "36D74FF171BC3EA7DD15B339A4269338668A5E256DCF0894B8E1E9BB4113C56AFDED83CE41EE8690F6BB65F916E4327B3805414D27B85607736B3C25B9A58601",
			message:      []byte("0"),
			valid:        true,
		},
		{
			account:      "ban_39dus5sfxc736uyoumbt65xb9ktk4b5b4o5necdwpaupq7opdw6pswyqmm5y",
			signatureHex: "8B1A6AD5AA1BFCE9ABAC9EFE34AE932A4DB9534E6A99E5536948D32D804B12E8FB0F6BD1A914E254C6BF5E6EBAD96700753FD5C889E50E888FDFB7E0311FA80C",
			message:      []byte("Banano Banini Banoni Banano Banini Banoni Banano Banini Banoni Banano Banini Banoni Banano Banini Banoni Banano Banini Banoni"),
			valid:        true,
		},
		{
			account:      "ban_1ykbhczjzx6yjnhcyuggtmw3hjxkwrzhbomf96uxyo5kyrj64po6hi4zoxrc",
			signatureHex: "36D74FF171BC3EA7DD15B339A4269338668A5E256DCF0894B8E1E9BB4113C56AFDED83CE41EE8690F6BB65F916E4327B3805414D27B85607736B3C25B9A58601",
			message:      []byte("1"),
			valid:        false,
		},
	}

	for _, testCase := range testCases {
		signature, err := hex.DecodeString(testCase.signatureHex)
		require.NoError(t, err)

		result, err := bananomessagesigning.VerifyMessage(testCase.account, testCase.message, signature)
		require.NoError(t, err)
		require.Equal(t, testCase.valid, result)
	}
}
