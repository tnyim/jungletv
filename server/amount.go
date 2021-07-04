package server

import "math/big"

type Amount struct {
	*big.Int
}

func (a Amount) SerializeForAPI() string {
	if a.Int == nil {
		return "0"
	}
	return a.String()
}
