package httpx

import (
	"net/http"
)

func CookieValue(
	r *http.Request,
	name string,
) string {

	cookie, err := r.Cookie(name)

	if err != nil {
		return ""
	}

	return cookie.Value
}
