package router

import (
	"net/http"

	"github.com/mohammedbilalns/shrinklink/internal/app"
	"github.com/mohammedbilalns/shrinklink/internal/handler"
)


func UserRouter(app *app.App ) *http.ServeMux{

	mux := http.NewServeMux()

	mux.HandleFunc("/urls", handler.GetUserURIs)

	return mux 
}
