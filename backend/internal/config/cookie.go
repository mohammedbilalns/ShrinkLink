package config

import "net/http"

func AccessTokenCookie(token string, secure bool) *http.Cookie {
	return  &http.Cookie{
		Name: "accessToken",
		Value: token,
		Path:"/",
		HttpOnly: true,
		Secure: secure,
		SameSite: http.SameSiteLaxMode,
		MaxAge: 60 *5 ,
	}
}



func RefreshTokenCookie(token string, secure bool) *http.Cookie {
	return &http.Cookie{
		Name:     "refreshToken",
		Value:    token,
		Path:     "/",
		HttpOnly: true,
		Secure:   secure,
		SameSite: http.SameSiteLaxMode,
		MaxAge:   60 * 60 * 24 * 7,
	}
}
