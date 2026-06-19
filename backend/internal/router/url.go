package router

import (
	"net/http"

	"github.com/mohammedbilalns/shrinklink/internal/app"
	"github.com/mohammedbilalns/shrinklink/internal/handler"
)

func UrlRouter( app *app.App ) *http.ServeMux {

	mux := http.NewServeMux()
	mux.HandleFunc("POST /create", handler.CreateShortURI)
	mux.HandleFunc("POST /custom", handler.CreateCustomURI)
	return mux 
}
