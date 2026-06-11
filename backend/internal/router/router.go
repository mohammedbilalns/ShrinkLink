package router

import (
	"net/http"

	"github.com/mohammedbilalns/shrinklink/internal/app"
	"github.com/mohammedbilalns/shrinklink/internal/handler"
)

func Register(app *app.App) *http.ServeMux {

	mux := http.NewServeMux()

	mux.HandleFunc("/health", handler.Health)

	return mux 
}

