package services

import (
	"context"

	"github.com/mohammedbilalns/shrinklink/internal/model"
)

type AuthService interface {
	RegisterUser(
		ctx context.Context,
		name string,
		email string,
		password string,
	) error

	ResendOTP(
		ctx context.Context,
		email string,
	) error

	VerifyUser(
		ctx context.Context,
		email string,
		otp string,
	) (*LoginResponse, error)

	LoginUser(
		ctx context.Context,
		email string,
		password string,
	) (*LoginResponse, error)

	RefreshTokens(
		ctx context.Context,
		token string,
	) (*TokenResponse, error)

	CurrentUser(
		ctx context.Context,
		token string,
	) (*model.User, error)
}

type TokenResponse struct {
	AccessToken  string
	RefreshToken string
}

type LoginResponse struct {
	User         *model.User
	AccessToken  string
	RefreshToken string
}
