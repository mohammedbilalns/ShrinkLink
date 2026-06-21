package router

import (
	"net/http"

	"github.com/mohammedbilalns/shrinklink/internal/app"
	"github.com/mohammedbilalns/shrinklink/internal/handler"
)

func AuthRouter(app *app.App) *http.ServeMux {

	mux := http.NewServeMux()
	authHandler := handler.NewAuthHandler(app.AuthService, app.Config)
	mux.HandleFunc("POST /register", authHandler.Register)
	mux.HandleFunc("POST /verify", authHandler.VerifyOTP)
	mux.HandleFunc("POST /resend", authHandler.ResendOTP)
	mux.HandleFunc("POST /login", authHandler.Login)
	mux.HandleFunc("POST /refresh", authHandler.RefreshToken)
	mux.HandleFunc("GET /me", authHandler.GetSession)
	mux.HandleFunc("GET /logout", authHandler.Logout)

	return mux
}
