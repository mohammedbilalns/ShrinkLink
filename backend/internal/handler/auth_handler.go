package handler

import (
	"net/http"
	"strings"

	"github.com/mohammedbilalns/shrinklink/internal/config"
	"github.com/mohammedbilalns/shrinklink/internal/services"
)

type AuthHandler struct {
	service services.AuthService
	secure  bool
}

func NewAuthHandler(service services.AuthService, cfg config.Config) *AuthHandler {
	return &AuthHandler{
		service: service,
		secure:  strings.HasPrefix(cfg.AppURL, "https://"),
	}
}

type registerRequest struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

type verifyRequest struct {
	Email string `json:"email"`
	OTP   string `json:"otp"`
}

type loginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func (h *AuthHandler) setAuthCookies(w http.ResponseWriter, accessToken, refreshToken string) {
	http.SetCookie(w, config.AccessTokenCookie(accessToken, h.secure))
	http.SetCookie(w, config.RefreshTokenCookie(refreshToken, h.secure))
}

func (h *AuthHandler) clearAuthCookies(w http.ResponseWriter) {
	http.SetCookie(w, &http.Cookie{
		Name:     "accessToken",
		Value:    "",
		Path:     "/",
		HttpOnly: true,
		Secure:   h.secure,
		SameSite: http.SameSiteLaxMode,
		MaxAge:   -1,
	})
	http.SetCookie(w, &http.Cookie{
		Name:     "refreshToken",
		Value:    "",
		Path:     "/",
		HttpOnly: true,
		Secure:   h.secure,
		SameSite: http.SameSiteLaxMode,
		MaxAge:   -1,
	})
}

func (h *AuthHandler) Register(w http.ResponseWriter, r *http.Request) {
	var req registerRequest
	if err := parseJSONBody(r, &req); err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}

	if strings.TrimSpace(req.Name) == "" || strings.TrimSpace(req.Email) == "" || strings.TrimSpace(req.Password) == "" {
		writeError(w, http.StatusBadRequest, "name, email, and password are required")
		return
	}

	if err := h.service.RegisterUser(r.Context(), req.Name, req.Email, req.Password); err != nil {
		status := http.StatusBadRequest
		if strings.Contains(strings.ToLower(err.Error()), "already exists") {
			status = http.StatusConflict
		}
		writeError(w, status, err.Error())
		return
	}

	writeJSON(w, http.StatusCreated, map[string]string{
		"message": "Registration successful! Please verify your email.",
	})
}

func (h *AuthHandler) VerifyOTP(w http.ResponseWriter, r *http.Request) {
	var req verifyRequest
	if err := parseJSONBody(r, &req); err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}

	response, err := h.service.VerifyUser(r.Context(), req.Email, req.OTP)
	if err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}

	h.setAuthCookies(w, response.AccessToken, response.RefreshToken)
	writeJSON(w, http.StatusOK, map[string]any{
		"message": "Email verified successfully!",
		"user":    response.User,
	})
}

func (h *AuthHandler) ResendOTP(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Email string `json:"email"`
	}
	if err := parseJSONBody(r, &req); err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}

	if err := h.service.ResendOTP(r.Context(), req.Email); err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, http.StatusOK, map[string]string{
		"message": "OTP has been resent",
	})
}

func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	var req loginRequest
	if err := parseJSONBody(r, &req); err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}

	response, err := h.service.LoginUser(r.Context(), req.Email, req.Password)
	if err != nil {
		writeError(w, http.StatusUnauthorized, err.Error())
		return
	}

	h.setAuthCookies(w, response.AccessToken, response.RefreshToken)
	writeJSON(w, http.StatusOK, map[string]any{
		"message": "Login successful!",
		"user":    response.User,
	})
}

func (h *AuthHandler) RefreshToken(w http.ResponseWriter, r *http.Request) {
	refreshToken := getCookieValue(r, "refreshToken")
	if refreshToken == "" {
		writeError(w, http.StatusUnauthorized, "refresh token not found")
		return
	}

	response, err := h.service.RefreshTokens(r.Context(), refreshToken)
	if err != nil {
		writeError(w, http.StatusUnauthorized, err.Error())
		return
	}

	h.setAuthCookies(w, response.AccessToken, response.RefreshToken)
	writeJSON(w, http.StatusOK, map[string]string{
		"message": "token refreshed",
	})
}

func (h *AuthHandler) GetSession(w http.ResponseWriter, r *http.Request) {
	accessToken := getCookieValue(r, "accessToken")
	if accessToken == "" {
		writeError(w, http.StatusUnauthorized, "access token not found")
		return
	}

	user, err := h.service.CurrentUser(r.Context(), accessToken)
	if err != nil {
		writeError(w, http.StatusUnauthorized, err.Error())
		return
	}

	writeJSON(w, http.StatusOK, map[string]any{
		"user": user,
	})
}

func (h *AuthHandler) Logout(w http.ResponseWriter, r *http.Request) {
	h.clearAuthCookies(w)
	writeJSON(w, http.StatusOK, map[string]string{
		"message": "Logged out successfully",
	})
}
