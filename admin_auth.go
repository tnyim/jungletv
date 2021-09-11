package main

import (
	"net/http"
	"time"

	"github.com/gbl08ma/ssoclient"
	"github.com/gorilla/sessions"
	uuid "github.com/satori/go.uuid"
)

var (
	sessionStore *sessions.CookieStore
	daClient     *ssoclient.SSOClient
	websiteURL   string
)

// directUnsafeAuthHandler authenticates anyone who asks as admin and is only used for development
func directUnsafeAuthHandler(w http.ResponseWriter, r *http.Request) {
	expiry := time.Now().Add(180 * 24 * 60 * 60 * time.Second)
	adminToken, err := jwtManager.GenerateAdminToken("DEBUG_USER", expiry)
	if err != nil {
		authLog.Println("Error generating admin JWT:", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:    "auth-token",
		Value:   adminToken,
		Path:    "/",
		MaxAge:  int(time.Until(expiry).Seconds()),
		Expires: expiry,
		Secure:  true,
	})
	http.Redirect(w, r, "/moderate", http.StatusTemporaryRedirect)
}

// authInitHandler serves the initial authentication request
func authInitHandler(w http.ResponseWriter, r *http.Request) {
	session, _ := sessionStore.Get(r, "sso_process")

	id := uuid.NewV4()
	session.Values["id"] = id.String()

	url, rid, err := daClient.InitLogin(websiteURL+"/admin/auth", false, "", nil, id.String(), websiteURL)
	if err != nil {
		authLog.Println("Error initiating SSO login:", err)
	}

	session.Values["rid"] = rid
	err = session.Save(r, w)
	if err != nil {
		authLog.Println("Error saving session:", err)
	}

	http.Redirect(w, r, url, http.StatusFound)
}

// authHandler serves requests from users that come from the SSO login page
func authHandler(w http.ResponseWriter, r *http.Request) {
	if r.URL.Query().Get("from_sso_server") != "1" {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	session, _ := sessionStore.Get(r, "sso_process")
	if session.IsNew || session.Values["id"] == nil || session.Values["rid"] == nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	ssoID := r.URL.Query().Get("sso_id")
	ssoID2 := r.URL.Query().Get("sso_id2")
	rid := session.Values["rid"].(string)
	login, err := daClient.GetLogin(ssoID, 7*24*60*60, nil, ssoID2, rid)
	if err != nil {
		authLog.Println("Error getting SSO login:", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	if login.RecoveredInfo != session.Values["id"].(string) {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	if !login.Admin && !login.TagMap["sso_admin"] && !login.TagMap["jungletv_admin"] {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	expiry := time.Now().Add(7 * 24 * 60 * 60 * time.Second)
	adminToken, err := jwtManager.GenerateAdminToken(login.UserID, expiry)
	if err != nil {
		authLog.Println("Error generating admin JWT:", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:    "auth-token",
		Value:   adminToken,
		Path:    "/",
		MaxAge:  int(time.Until(expiry).Seconds()),
		Expires: expiry,
		Secure:  true,
	})
	http.Redirect(w, r, "/moderate", http.StatusTemporaryRedirect)
}
