package handler

import (
	"log"
	"net/http"
	"strings"

	"github.com/mohammedbilalns/shrinklink/internal/httpx"
)

type apiError struct {
	Message string `json:"message"`
}

const genericErrorMessage = "Something went wrong"


func writeError(w http.ResponseWriter, status int, message string) {
	message = strings.TrimSpace(message)
	if message == "" {
		message = genericErrorMessage
	}

	log.Printf("backend error (status=%d): %s", status, message)

	if status >= http.StatusInternalServerError || !isClientSafeMessage(message) {
		httpx.WriteJSON(w, http.StatusInternalServerError, apiError{Message: genericErrorMessage})
		return
	}

	httpx.WriteJSON(w, status, apiError{Message: message})
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
