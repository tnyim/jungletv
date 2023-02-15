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
	ctx, err := transaction.Begin(r.Context())
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	defer ctx.Commit() //read-only tx

	vars := mux.Vars(r)

	applicationID := vars["app"]
	fileName := vars["file"]

	running, version, _ := s.appRunner.IsRunning(applicationID)

	if !running {
		w.WriteHeader(http.StatusNotFound)
		return nil
	}

	files, err := types.GetApplicationFilesWithNamesForApplicationAtVersion(ctx, applicationID, version, []string{fileName})
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	file, ok := files[fileName]
	if !ok || !file.Public {
		w.WriteHeader(http.StatusNotFound)
		return nil
	}

	w.Header().Add("Content-Type", file.Type)
	http.ServeContent(w, r, "", file.UpdatedAt, bytes.NewReader(file.Content))
	return nil
}
