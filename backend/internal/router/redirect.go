package router

import (
	"net/http"

	"github.com/mohammedbilalns/shrinklink/internal/app"
	"github.com/mohammedbilalns/shrinklink/internal/handler"
)

func RedirectRouter(app app.App) *http.ServeMux {
	mux := http.NewServeMux()
	redirectHandler := handler.NewRedirectHandler(app.URLService)
	mux.HandleFunc("GET /{id}", redirectHandler.RedirectURI)
	return mux
}
