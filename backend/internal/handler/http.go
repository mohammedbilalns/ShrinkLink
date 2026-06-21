package handler

import (
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"strings"
)

type apiError struct {
	Message string `json:"message"`
}

const genericErrorMessage = "Something went wrong"

func writeJSON(w http.ResponseWriter, status int, payload any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(payload)
}

func writeError(w http.ResponseWriter, status int, message string) {
	message = strings.TrimSpace(message)
	if message == "" {
		message = genericErrorMessage
	}

	log.Printf("backend error (status=%d): %s", status, message)

	if status >= http.StatusInternalServerError || !isClientSafeMessage(message) {
		writeJSON(w, http.StatusInternalServerError, apiError{Message: genericErrorMessage})
		return
	}

	writeJSON(w, status, apiError{Message: message})
}

func isClientSafeMessage(message string) bool {
	switch strings.ToLower(strings.TrimSpace(message)) {
	case
		"invalid request body",
		"name, email, and password are required",
		"user already exists",
		"user not found",
		"user is already verified",
		"otp expired or invalid",
		"invalid otp",
		"invalid email or password",
		"email is not verified",
		"refresh token not found",
		"access token not found",
		"authentication required",
		"invalid url",
		"slug is required",
		"slug may only contain letters, numbers, hyphens, and underscores",
		"short url already exists",
		"url not found":
		return true
	default:
		return false
	}
}

func parseJSONBody(r *http.Request, dst any) error {
	defer r.Body.Close()
	if err := json.NewDecoder(r.Body).Decode(dst); err != nil {
		return errors.New("invalid request body")
	}
	return nil
}

func getCookieValue(r *http.Request, name string) string {
	cookie, err := r.Cookie(name)
	if err != nil {
		return ""
	}
	return strings.TrimSpace(cookie.Value)
}
