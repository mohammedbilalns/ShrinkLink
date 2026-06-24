package middleware

import (
	"context"
	"net/http"

	"github.com/mohammedbilalns/shrinklink/internal/apperrors"
	"github.com/mohammedbilalns/shrinklink/internal/httpx"
	"github.com/mohammedbilalns/shrinklink/internal/services"
)

func Auth(authService services.AuthService) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			token := httpx.CookieValue(r, "accessToken")
			if token == "" {
				writeUnauthorized(w)
				return
			}

			user, err := authService.CurrentUser(r.Context(), token)
			if err != nil {
				writeUnauthorized(w)
				return
			}

			ctx := context.WithValue(r.Context(), UserContextKey, user)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

func writeUnauthorized(w http.ResponseWriter) {
	httpx.WriteJSON(w, http.StatusUnauthorized, map[string]string{
		"message": apperrors.ErrAuthenticationRequired.Error(),
	})
}
