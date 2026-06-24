package router

import (
	"net/http"

	"github.com/mohammedbilalns/shrinklink/internal/app"
	"github.com/mohammedbilalns/shrinklink/internal/handler"
	"github.com/mohammedbilalns/shrinklink/internal/middleware"
)

func Register(application *app.App) *http.ServeMux {

	mux := http.NewServeMux()
	authHandler := handler.NewAuthHandler(application.AuthService, application.Config)
	urlHandler := handler.NewURLHandler(application.URLService, application.AuthService)
	userHandler := handler.NewUserHandler(application.URLService)
	redirectHandler := handler.NewRedirectHandler(application.URLService)

	mux.HandleFunc("GET /health", handler.Health)

	authMux := http.NewServeMux()
	authMux.HandleFunc("POST /register", authHandler.Register)
	authMux.HandleFunc("POST /verify", authHandler.VerifyOTP)
	authMux.HandleFunc("POST /resend", authHandler.ResendOTP)
	authMux.HandleFunc("POST /login", authHandler.Login)
	authMux.HandleFunc("POST /refresh", authHandler.RefreshToken)
	authMux.HandleFunc("GET /me", authHandler.GetSession)
	authMux.HandleFunc("GET /logout", authHandler.Logout)

	urlMux := http.NewServeMux()
	urlMux.HandleFunc("POST /create", urlHandler.CreateShortURI)
	urlMux.HandleFunc("POST /custom", urlHandler.CreateCustomURI)

	userMux := http.NewServeMux()
	userMux.HandleFunc("GET /urls", userHandler.GetUserURIs)

	authMiddleware := middleware.Auth(application.AuthService)

	mux.Handle("/auth/", http.StripPrefix("/auth", authMux))
	mux.Handle("/api/url/", http.StripPrefix("/api/url", urlMux))
	mux.Handle("/api/user/", http.StripPrefix("/api/user", authMiddleware(userMux)))
	mux.HandleFunc("GET /{id}", redirectHandler.RedirectURI)

	return mux
}
