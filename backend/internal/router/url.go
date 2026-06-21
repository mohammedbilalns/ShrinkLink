package router

import (
	"net/http"

	"github.com/mohammedbilalns/shrinklink/internal/app"
	"github.com/mohammedbilalns/shrinklink/internal/handler"
)

func UrlRouter(app *app.App) *http.ServeMux {

	mux := http.NewServeMux()
	urlHandler := handler.NewURLHandler(app.URLService, app.AuthService)
	mux.HandleFunc("POST /create", urlHandler.CreateShortURI)
	mux.HandleFunc("POST /custom", urlHandler.CreateCustomURI)
	return mux
}
