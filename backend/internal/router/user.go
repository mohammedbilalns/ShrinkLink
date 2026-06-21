package router

import (
	"net/http"

	"github.com/mohammedbilalns/shrinklink/internal/app"
	"github.com/mohammedbilalns/shrinklink/internal/handler"
)

func UserRouter(app *app.App) *http.ServeMux {

	mux := http.NewServeMux()
	userHandler := handler.NewUserHandler(app.AuthService, app.URLService)
	mux.HandleFunc("GET /urls", userHandler.GetUserURIs)

	return mux
}
