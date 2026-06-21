package handler

import (
	"net/http"
	"strings"

	"github.com/mohammedbilalns/shrinklink/internal/httpx"
	"github.com/mohammedbilalns/shrinklink/internal/services"
	"go.mongodb.org/mongo-driver/v2/bson"
)

type URLHandler struct {
	urlService  services.URLService
	authService services.AuthService
}

type RedirectHandler struct {
	urlService services.URLService
}

func NewURLHandler(urlService services.URLService, authService services.AuthService) *URLHandler {
	return &URLHandler{
		urlService:  urlService,
		authService: authService,
	}
}

func NewRedirectHandler(urlService services.URLService) *RedirectHandler {
	return &RedirectHandler{urlService: urlService}
}

type createURLRequest struct {
	URL  string `json:"url"`
	Slug string `json:"slug"`
}

func (h *URLHandler) currentUserID(r *http.Request, required bool) (*bson.ObjectID, error) {
	token :=httpx.CookieValue(r, "accessToken")
	if token == "" {
		if required {
			return nil, http.ErrNoCookie
		}
		return nil, nil
	}

	user, err := h.authService.CurrentUser(r.Context(), token)
	if err != nil {
		if required {
			return nil, err
		}
		return nil, nil
	}

	id := user.ID
	return &id, nil
}

func (h *URLHandler) CreateShortURI(w http.ResponseWriter, r *http.Request) {
	var req createURLRequest
	if err := httpx.ParseJSON(r, &req); err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}

	userID, _ := h.currentUserID(r, false)
	shortURL, err := h.urlService.CreateShortURL(r.Context(), req.URL, userID)
	if err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}

	httpx.WriteJSON(w, http.StatusCreated, shortURL)
}

func (h *URLHandler) CreateCustomURI(w http.ResponseWriter, r *http.Request) {
	var req createURLRequest
	if err := httpx.ParseJSON(r, &req); err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}

	userID, err := h.currentUserID(r, true)
	if err != nil || userID == nil {
		writeError(w, http.StatusUnauthorized, "authentication required")
		return
	}

	shortURL, err := h.urlService.CreateCustomURL(r.Context(), req.URL, req.Slug, *userID)
	if err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}

	httpx.WriteJSON(w, http.StatusCreated, shortURL)
}

func (h *RedirectHandler) RedirectURI(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	if strings.TrimSpace(id) == "" {
		writeError(w, http.StatusBadRequest, "invalid url")
		return
	}

	shortURL, err := h.urlService.ResolveShortURL(r.Context(), id)
	if err != nil {
		writeError(w, http.StatusNotFound, err.Error())
		return
	}

	http.Redirect(w, r, shortURL.FullURL, http.StatusFound)
}
