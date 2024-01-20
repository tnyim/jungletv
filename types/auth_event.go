package types

import (
	"time"

	"github.com/gbl08ma/sqalx"
	"github.com/jmoiron/sqlx/types"
)

// AuthEvent is an authentication or authorization event
type AuthEvent struct {
	Address         string    `dbKey:"true"`
	AuthenticatedAt time.Time `dbKey:"true"`
	Reason          AuthReason
	ReasonInfo      types.JSONText
	Method          AuthMethod
	MethodInfo      types.JSONText
}

// AuthReason represents the type of motivation for authentication or authorization
type AuthReason string

// AuthReasonSignIn is used with events associated with signing in
const AuthReasonSignIn AuthReason = "sign_in"

// AuthReasonAuthorizeThirdParty is used with events associated with authorizing a third party application
const AuthReasonAuthorizeThirdParty AuthReason = "authorize_third_party"

// AuthReasonSpecialSignIn is used with events where a non-standard sign-in method was used
const AuthReasonSpecialSignIn AuthReason = "special_sign_in"

// AuthMethod represents the method used for authentication or authorization
type AuthMethod string

// AuthMethodAddressRepresentativeChange is used with events where representative changes were used as the authentication method
const AuthMethodRepresentativeChange AuthMethod = "account_representative_change"

// AuthMethodAccountSignature is used with events where a unique message signed by the account's address was used as the authentication method
const AuthMethodAccountSignature AuthMethod = "account_public_key_signature"

// AuthMethodInteractiveConsent is used with events where a third party application is authorized after interactive user consent
const AuthMethodInteractiveConsent AuthMethod = "interactive_consent"

// AuthMethodExternal is used with events where a trusted external system authenticated the user
const AuthMethodExternal AuthMethod = "external"

// Update updates or inserts the AuthEvent
func (obj *AuthEvent) Update(node sqalx.Node) error {
	return Update(node, obj)
}
