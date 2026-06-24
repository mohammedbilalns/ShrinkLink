package handler

import (
	"net/http"

	"github.com/mohammedbilalns/shrinklink/internal/apperrors"
	"github.com/mohammedbilalns/shrinklink/internal/httpx"
	"github.com/mohammedbilalns/shrinklink/internal/middleware"
	"github.com/mohammedbilalns/shrinklink/internal/services"
)

type UserHandler struct {
	urlService  services.URLService
}

func NewUserHandler( urlService services.URLService) *UserHandler {
	return &UserHandler{
		urlService:  urlService,
	}
}


func (h *UserHandler) GetUserURIs(w http.ResponseWriter, r *http.Request) {

	user := middleware.UserFromContext(
		r.Context(),
		)

	if user == nil {
		writeError(
			w,
			http.StatusUnauthorized,
			apperrors.ErrAuthenticationRequired.Error(),
			)
		return 
	}

	pagination := httpx.ParsePagination(r)

	urls, totalCount, err := h.urlService.GetUserURLs(r.Context(), user.ID, pagination.Page,pagination.Limit)
	if err != nil {
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}

	totalPages := int64(1)
	if totalCount > 0 {
		totalPages = (totalCount + pagination.Limit - 1) / pagination.Limit
	}

	httpx.WriteJSON(w, http.StatusOK, map[string]any{
		"urls":       urls,
		"page":       pagination.Page,
		"limit": 			pagination.Limit,
		"totalCount": totalCount,
		"totalPages": totalPages,
	})
}
