package server

import "net/http"

func (s *grpcServer) wrapHTTPHandler(h func(w http.ResponseWriter, r *http.Request) error) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		err := h(w, r)
		if err != nil {
			s.log.Println("HTTP handler error:", err)
		}
	}
}
