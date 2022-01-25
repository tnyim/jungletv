package utils

import "net"

// GetUniquifiedIP returns a uniquified version of an IP address
// (sets the lower bits of a IPv6 to zero, leaves IPv4 untouched)
func GetUniquifiedIP(remoteAddress string) string {
	ip := net.ParseIP(remoteAddress)
	if ip == nil {
		return remoteAddress
	}
	if ip.To4() != nil || len(ip) != net.IPv6len {
		return remoteAddress
	}
	for i := net.IPv6len / 2; i < net.IPv6len; i++ {
		ip[i] = 0
	}
	return ip.String()
}
