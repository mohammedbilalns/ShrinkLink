package services

import (
	"context"
	"errors"

	"github.com/mohammedbilalns/shrinklink/internal/cache"
	"github.com/mohammedbilalns/shrinklink/internal/model"
	"github.com/mohammedbilalns/shrinklink/internal/repository"
	"github.com/mohammedbilalns/shrinklink/internal/utils"
)


type authService struct {
	userRepo repository.UserRepository
	otpCache cache.OTPCache
	jwtSecret string
}

func NewAuthService(
	userRepo repository.UserRepository,
	otpCache cache.OTPCache,
	jwtSecret string,
) AuthService {
	
	return &authService{
		userRepo: userRepo,
		otpCache: otpCache,
		jwtSecret: jwtSecret,
	}
} 

func (s *authService) generateTokens(
	user *model.User,
) (*TokenResponse, error) {

	accessToken, err := utils.GenerateAccessToken(
		user.ID.Hex(),
		user.Name,
		s.jwtSecret,
	)

	if err != nil {
		return nil, err
	}

	refreshToken, err := utils.GenerateRefreshToken(
		user.ID.Hex(),
		s.jwtSecret,
	)

	if err != nil {
		return nil, err
	}

	return &TokenResponse{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
	}, nil
}

func (s *authService) RegisterUser(
	ctx context.Context,
	name string,
	email string,
	password string,
) error {

	user, _ := s.userRepo.FindByEmail(
		ctx,
		email,
	)

	if user != nil {

		if user.IsVerified {
			return errors.New(
				"user already exists",
			)
		}

		if err := s.userRepo.Delete(
			ctx,
			user.ID,
		); err != nil {
			return err
		}
	}

	hash, err := utils.HashPassword(
		password,
	)

	if err != nil {
		return err
	}

	newUser := &model.User{
		Name:       name,
		Email:      email,
		Password:   hash,
		IsVerified: false,
	}

	if err := s.userRepo.Create(
		ctx,
		newUser,
	); err != nil {
		return err
	}

	otp:= utils.GenerateOTP(6)

	if err != nil {
		return err
	}

	if err := s.otpCache.Save(
		ctx,
		newUser.ID.Hex(),
		otp,
	); err != nil {
		return err
	}

	// TODO send email

	return nil
}


