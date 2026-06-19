package router

import (
	"net/http"

	"github.com/mohammedbilalns/shrinklink/internal/app"
	"github.com/mohammedbilalns/shrinklink/internal/handler"
)

func RedirectRouter( app app.App) *http.ServeMux {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /{id}", handler.RedirectURI)
	return mux
}
