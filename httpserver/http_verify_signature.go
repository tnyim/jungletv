package httpserver

import (
	"encoding/hex"
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/palantir/stacktrace"
)

func (s *HTTPServer) VerifySignature(w http.ResponseWriter, r *http.Request) error {
	w.Header().Set("Access-Control-Allow-Origin", "https://thebananostand.com")
	w.Header().Set("Access-Control-Allow-Methods", http.MethodPut)
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	if r.Method == http.MethodOptions {
		return nil
	}

	var request struct {
		BananoAddress string `json:"banano_address"`
		Message       string `json:"message"`
		Signature     string `json:"signature"`
	}
	err := json.NewDecoder(r.Body).Decode(&request)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return stacktrace.Propagate(err, "")
	}

	signatureBytes, err := hex.DecodeString(request.Signature)
	if err != nil || len(signatureBytes) == 0 {
		w.WriteHeader(http.StatusBadRequest)
		return stacktrace.Propagate(err, "")
	}

	vars := mux.Vars(r)
	processID, ok := vars["processID"]
	if !ok || processID == "" {
		w.WriteHeader(http.StatusBadRequest)
		return stacktrace.Propagate(err, "")
	}

	type response struct {
		Success bool   `json:"success"`
		Message string `json:"message"`
	}
	sendResponse := func(resp response) error {
		b, err := json.Marshal(resp)
		if err != nil {
			return stacktrace.Propagate(err, "")
		}
		_, err = w.Write(b)
		return stacktrace.Propagate(err, "")
	}

	err = s.signatureVerifier.VerifySignature(r.Context(), processID, signatureBytes, "http_callback")
	if err != nil {
		err = sendResponse(response{
			Message: "Failed to verify signature! Confirm that the authentication process did not expire.",
		})
		return stacktrace.Propagate(err, "")
	}
	err = sendResponse(response{
		Success: true,
		Message: "Successfully verified address ownership! You may now close this tab and return to JungleTV.",
	})
	return stacktrace.Propagate(err, "")
}
