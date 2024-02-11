package httpserver

import (
	"bytes"
	"net/http"

	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/types"
	"github.com/tnyim/jungletv/utils/transaction"
	"github.com/uptrace/bunrouter"
)

func (s *HTTPServer) ApplicationFile(w http.ResponseWriter, r bunrouter.Request) error {
	applicationID := r.Param("app")
	fileName := r.Param("part")

	err := s.appRunner.ServeFile(r.Context(), applicationID, fileName, w, r.Request)
	return stacktrace.Propagate(err, "")
}

func (s *HTTPServer) ApplicationPage(w http.ResponseWriter, r bunrouter.Request) error {
	ctx, err := transaction.Begin(r.Context())
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	defer ctx.Commit() //read-only tx

	applicationID := r.Param("app")
	pageID := r.Param("part")[1:]

	fileInfo, version, ok := s.appRunner.ResolvePage(applicationID, pageID)
	if !ok {
		http.NotFound(w, r.Request)
		return nil
	}
	fileName := fileInfo.File

	files, err := types.GetApplicationFilesWithNamesForApplicationAtVersion(ctx, applicationID, version, []string{fileName})
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	file, ok := files[fileName]
	if !ok || !file.Public {
		http.NotFound(w, r.Request)
		return nil
	}

	w.Header().Add("Content-Type", file.Type)
	w.Header().Set("X-Frame-Options", "sameorigin")
	for k, v := range fileInfo.Header {
		w.Header()[k] = v
	}
	http.ServeContent(w, r.Request, "", file.UpdatedAt, bytes.NewReader(file.Content))
	return nil
}

func (s *HTTPServer) AppbridgeJS(w http.ResponseWriter, r bunrouter.Request) error {
	http.Redirect(w, r.Request, "/build/appbridge.js?v="+s.templateCache.VersionHashBuilder(), http.StatusFound)
	return nil
}
