package apperrors

import "errors"

var (
	ErrUserAlreadyExists     = errors.New("user already exists")
	ErrUserNotFound          = errors.New("user not found")
	ErrUserAlreadyVerified   = errors.New("user is already verified")
	ErrOTPExpiredOrInvalid   = errors.New("otp expired or invalid")
	ErrInvalidOTP            = errors.New("invalid otp")
	ErrInvalidEmailOrPassword = errors.New("invalid email or password")
	ErrEmailNotVerified      = errors.New("email is not verified")
	ErrRefreshTokenNotFound  = errors.New("refresh token not found")
	ErrAccessTokenNotFound   = errors.New("access token not found")
	ErrAuthenticationRequired = errors.New("authentication required")
	ErrInvalidURL            = errors.New("invalid url")
	ErrSlugRequired          = errors.New("slug is required")
	ErrSlugInvalid           = errors.New("slug may only contain letters, numbers, hyphens, and underscores")
	ErrShortURLAlreadyExists = errors.New("short url already exists")
	ErrURLNotFound           = errors.New("url not found")
	ErrMailNotConfigured     = errors.New("mail service is not configured")
)
