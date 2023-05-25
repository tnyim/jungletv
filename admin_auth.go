package main

import (
	"net"
	"net/http"
	"time"

	"github.com/gbl08ma/ssoclient"
	"github.com/gorilla/sessions"
	"github.com/palantir/stacktrace"
	uuid "github.com/satori/go.uuid"
	"github.com/tnyim/jungletv/server/auth"
	"github.com/tnyim/jungletv/utils"
)

var (
	sessionStore     *sessions.CookieStore
	daClient         *ssoclient.SSOClient
	websiteURL       string
	basicAuthChecker func(ip, username, password string) bool
)

// directUnsafeAuthHandler authenticates anyone who asks as admin and is only used for development
func directUnsafeAuthHandler(w http.ResponseWriter, r *http.Request) {
	adminToken, expiration, err := jwtManager.Generate(r.Context(), "DEBUG_USER", auth.AdminPermissionLevel, "")
	if err != nil {
		authLog.Println("Error generating admin JWT:", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:     "auth-token",
		Value:    adminToken,
		Path:     "/",
		MaxAge:   int(time.Until(expiration).Seconds()),
		Expires:  expiration,
		Secure:   true,
		SameSite: http.SameSiteStrictMode,
	})
	http.Redirect(w, r, "/moderate", http.StatusTemporaryRedirect)
}

// basicAuthHandler authenticates users as admin based on basic auth
func basicAuthHandler(w http.ResponseWriter, r *http.Request) {
	rewardAddress := getCurrentRewardAddress(r)
	if rewardAddress == "" {
		w.WriteHeader(http.StatusUnauthorized)
		w.Write([]byte("You must register to receive rewards first"))
		return
	}

	ip, _, err := net.SplitHostPort(r.RemoteAddr)
	if err != nil {
		authLog.Println(stacktrace.Propagate(err, ""))
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	if cfIP := r.Header.Get("cf-connecting-ip"); cfIP != "" {
		ip = cfIP
	}
	ip = utils.GetUniquifiedIP(ip)

	username, password, ok := r.BasicAuth()
	if !ok || !basicAuthChecker(ip, username, password) {
		w.Header().Add("WWW-Authenticate", `Basic realm="Enter username and password"`)
		w.WriteHeader(http.StatusUnauthorized)
		w.Write([]byte(`Incorrect credentials`))
		return
	}

	adminToken, expiration, err := jwtManager.Generate(r.Context(), rewardAddress, auth.AdminPermissionLevel, rewardAddress[:14])
	if err != nil {
		authLog.Println("Error generating admin JWT:", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:     "auth-token",
		Value:    adminToken,
		Path:     "/",
		MaxAge:   int(time.Until(expiration).Seconds()),
		Expires:  expiration,
		Secure:   true,
		SameSite: http.SameSiteStrictMode,
	})
	http.Redirect(w, r, "/moderate", http.StatusTemporaryRedirect)
}

// authInitHandler serves the initial authentication request
func authInitHandler(w http.ResponseWriter, r *http.Request) {
	session, _ := sessionStore.Get(r, "sso_process")

	id := uuid.NewV4()
	session.Values["id"] = id.String()
	rewardAddress := getCurrentRewardAddress(r)
	if rewardAddress != "" {
		session.Values["rewardAddress"] = rewardAddress
	}

	url, rid, err := daClient.InitLogin(websiteURL+"/admin/auth", false, "", nil, id.String(), websiteURL)
	if err != nil {
		authLog.Println("Error initiating SSO login:", err)
	}

	session.Values["rid"] = rid
	session.Options.SameSite = http.SameSiteNoneMode
	session.Options.Secure = true
	session.Options.HttpOnly = true
	err = session.Save(r, w)
	if err != nil {
		authLog.Println("Error saving session:", err)
	}

	http.Redirect(w, r, url, http.StatusFound)
}

func getCurrentRewardAddress(r *http.Request) string {
	accessTokenCookie, err := r.Cookie("auth-token")
	if err != nil {
		return ""
	}
	accessToken := accessTokenCookie.Value
	if accessToken == "" {
		return ""
	}

	claims, err := jwtManager.Verify(r.Context(), accessToken)
	if err != nil {
		return ""
	}

	return claims.RewardAddress
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

	rewardAddress := "ban_1hchsy8diurojzok64ymaaw5cthgwy4wa18r7dcim9wp4nfrz88pyrgcxbdt"
	if v, ok := session.Values["rewardAddress"]; ok {
		rewardAddress = v.(string)
	}
	adminToken, expiration, err := jwtManager.Generate(r.Context(), rewardAddress, auth.AdminPermissionLevel, login.UserID)
	if err != nil {
		authLog.Println("Error generating admin JWT:", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:     "auth-token",
		Value:    adminToken,
		Path:     "/",
		MaxAge:   int(time.Until(expiration).Seconds()),
		Expires:  expiration,
		Secure:   true,
		SameSite: http.SameSiteStrictMode,
	})
	http.Redirect(w, r, "/moderate", http.StatusTemporaryRedirect)
}
