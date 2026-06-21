package handler

import (
	"net/http"
	"strconv"

	"github.com/mohammedbilalns/shrinklink/internal/services"
	"go.mongodb.org/mongo-driver/v2/bson"
)

type UserHandler struct {
	authService services.AuthService
	urlService  services.URLService
}

func NewUserHandler(authService services.AuthService, urlService services.URLService) *UserHandler {
	return &UserHandler{
		authService: authService,
		urlService:  urlService,
	}
}

func (h *UserHandler) authenticatedUser(r *http.Request) (*bson.ObjectID, error) {
	token := getCookieValue(r, "accessToken")
	if token == "" {
		return nil, http.ErrNoCookie
	}

	user, err := h.authService.CurrentUser(r.Context(), token)
	if err != nil {
		return nil, err
	}

	id := user.ID
	return &id, nil
}

func (h *UserHandler) GetUserURIs(w http.ResponseWriter, r *http.Request) {
	userID, err := h.authenticatedUser(r)
	if err != nil {
		writeError(w, http.StatusUnauthorized, "authentication required")
		return
	}

	page, _ := strconv.ParseInt(r.URL.Query().Get("page"), 10, 64)
	limit, _ := strconv.ParseInt(r.URL.Query().Get("limit"), 10, 64)
	if page <= 0 {
		page = 1
	}
	if limit <= 0 {
		limit = 10
	}

	urls, totalCount, err := h.urlService.GetUserURLs(r.Context(), *userID, page, limit)
	if err != nil {
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}

	totalPages := int64(1)
	if totalCount > 0 {
		totalPages = (totalCount + limit - 1) / limit
	}

	writeJSON(w, http.StatusOK, map[string]any{
		"urls":       urls,
		"page":       page,
		"limit":      limit,
		"totalCount": totalCount,
		"totalPages": totalPages,
	})
}
