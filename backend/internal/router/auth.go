package router

import (
	"net/http"

	"github.com/mohammedbilalns/shrinklink/internal/app"
	"github.com/mohammedbilalns/shrinklink/internal/handler"
)

func AuthRouter(   app *app.App) *http.ServeMux {

	mux := http.NewServeMux()
	mux.HandleFunc("POST /register", handler.Register)
	mux.HandleFunc("POST /verify", handler.VerifyOTP)
	mux.HandleFunc("POST /resend", handler.ResendOTP)
	mux.HandleFunc("POST /login", handler.Login)
	mux.HandleFunc("POST /refresh", handler.RefreshToken)
	mux.HandleFunc("GET /me", handler.GetSession)
	mux.HandleFunc("GET /logout", handler.Logout)

	return mux 
}
