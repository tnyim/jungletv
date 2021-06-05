package server

import "math/big"

type Amount struct {
	*big.Int
}

func (a Amount) SerializeForAPI() string {
	return a.String()
}
