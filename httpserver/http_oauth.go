package httpserver

import (
	"net/http"

	"github.com/palantir/stacktrace"
	"github.com/uptrace/bunrouter"
)

func (s *HTTPServer) OAuthCallback(w http.ResponseWriter, r bunrouter.Request) error {
	state := r.FormValue("state")
	code := r.FormValue("code")

	err := s.oauthManager.CompleteFlow(r.Context(), state, code)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return stacktrace.Propagate(err, "")
	}

	http.Redirect(w, r.Request, s.websiteURL+"/rewards", http.StatusFound)

	return nil
}
