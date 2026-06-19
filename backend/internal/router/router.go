package router

import (
	"net/http"

	"github.com/mohammedbilalns/shrinklink/internal/app"
	"github.com/mohammedbilalns/shrinklink/internal/handler"
)

func Register(app *app.App) *http.ServeMux {

	mux := http.NewServeMux()

	mux.HandleFunc("/health", handler.Health)

	mux.Handle("/api/auth/", http.StripPrefix("/api/auth", AuthRouter(app)))
	mux.Handle("/api/url" , http.StripPrefix("/api/url", UrlRouter(app) ))
	mux.Handle("/api/user", http.StripPrefix("/api/user", UserRouter(app)))


	return mux 
}

