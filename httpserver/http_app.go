package httpserver

import (
	"bytes"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/types"
	"github.com/tnyim/jungletv/utils/transaction"
)

func (s *HTTPServer) ApplicationFile(w http.ResponseWriter, r *http.Request) error {
	vars := mux.Vars(r)

	applicationID := vars["app"]
	fileName := vars["file"]

	err := s.appRunner.ServeFile(r.Context(), applicationID, fileName, w, r)
	return stacktrace.Propagate(err, "")
}

func (s *HTTPServer) ApplicationPage(w http.ResponseWriter, r *http.Request) error {
	ctx, err := transaction.Begin(r.Context())
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	defer ctx.Commit() //read-only tx

	vars := mux.Vars(r)

	applicationID := vars["app"]
	pageID := vars["page"][1:]

	fileInfo, version, ok := s.appRunner.ResolvePage(applicationID, pageID)
	if !ok {
		http.NotFound(w, r)
		return nil
	}
	fileName := fileInfo.File

	files, err := types.GetApplicationFilesWithNamesForApplicationAtVersion(ctx, applicationID, version, []string{fileName})
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	file, ok := files[fileName]
	if !ok || !file.Public {
		http.NotFound(w, r)
		return nil
	}

	w.Header().Add("Content-Type", file.Type)
	w.Header().Set("X-Frame-Options", "sameorigin")
	for k, v := range fileInfo.Header {
		w.Header()[k] = v
	}
	http.ServeContent(w, r, "", file.UpdatedAt, bytes.NewReader(file.Content))
	return nil
}

func (s *HTTPServer) AppbridgeJS(w http.ResponseWriter, r *http.Request) error {
	http.Redirect(w, r, "/build/appbridge.js?v="+s.templateCache.VersionHashBuilder(), http.StatusFound)
	return nil
}
