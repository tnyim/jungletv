package main

type authorizer struct{}

func (a *authorizer) IsRewardAddressAllowed(rewardAddr string) bool {
	return true
}
func (a *authorizer) IsRemoteAddressAllowed(remoteAddr string) bool {
	return true
}
