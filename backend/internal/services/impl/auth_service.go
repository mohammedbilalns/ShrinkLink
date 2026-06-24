package impl

import (
	"context"
	"errors"
	"strings"

	"github.com/mohammedbilalns/shrinklink/internal/apperrors"
	"github.com/mohammedbilalns/shrinklink/internal/cache"
	"github.com/mohammedbilalns/shrinklink/internal/model"
	"github.com/mohammedbilalns/shrinklink/internal/repository"
	services "github.com/mohammedbilalns/shrinklink/internal/services"
	"github.com/mohammedbilalns/shrinklink/internal/utils"
	"go.mongodb.org/mongo-driver/v2/bson"
)


type authService struct {
	userRepo  repository.UserRepository
	otpCache  cache.OTPCache
	mailer    services.MailService
	jwtSecret string
}

func NewAuthService(
	userRepo repository.UserRepository,
	otpCache cache.OTPCache,
	mailer services.MailService,
	jwtSecret string,
) services.AuthService {
	return &authService{
		userRepo:  userRepo,
		otpCache:  otpCache,
		mailer:    mailer,
		jwtSecret: jwtSecret,
	}
}

func (s *authService) generateTokens(
	user *model.User,
) (*services.TokenResponse, error) {
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

	return &services.TokenResponse{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
	}, nil
}

func (s *authService) issueLoginResponse(
	user *model.User,
) (*services.LoginResponse, error) {
	tokens, err := s.generateTokens(user)
	if err != nil {
		return nil, err
	}

	return &services.LoginResponse{
		User:         user,
		AccessToken:  tokens.AccessToken,
		RefreshToken: tokens.RefreshToken,
	}, nil
}

func (s *authService) RegisterUser(
	ctx context.Context,
	name string,
	email string,
	password string,
) error {
	email = strings.TrimSpace(strings.ToLower(email))
	name = strings.TrimSpace(name)

	user, err := s.userRepo.FindByEmail(ctx, email)
	if err != nil {
		return err
	}

	if user != nil {
		if user.IsVerified {
			return apperrors.ErrUserAlreadyExists
		}

		if err := s.userRepo.Delete(ctx, user.ID); err != nil {
			return err
		}
	}

	hash, err := utils.HashPassword(password)
	if err != nil {
		return err
	}

	newUser := &model.User{
		Name:       name,
		Email:      email,
		Password:   hash,
		IsVerified: false,
	}

	if err := s.userRepo.Create(ctx, newUser); err != nil {
		if errors.Is(err, repository.ErrDuplicateEmail) {
			return apperrors.ErrUserAlreadyExists 
		}
		return err
	}

	otp := utils.GenerateOTP(6)
	if err := s.otpCache.Save(ctx, newUser.ID.Hex(), otp); err != nil {
		return err
	}

	if err := s.mailer.SendVerificationEmail(ctx, email, name, otp); err != nil {
		_ = s.otpCache.Delete(ctx, newUser.ID.Hex())
		_ = s.userRepo.Delete(ctx, newUser.ID)
		return err
	}

	return nil
}

func (s *authService) ResendOTP(
	ctx context.Context,
	email string,
) error {
	email = strings.TrimSpace(strings.ToLower(email))

	user, err := s.userRepo.FindByEmail(ctx, email)
	if err != nil {
		return err
	}
	if user == nil {
		return apperrors.ErrUserNotFound 
	}
	if user.IsVerified {
		return apperrors.ErrUserAlreadyExists 
	}

	otp := utils.GenerateOTP(6)
	if err := s.otpCache.Update(ctx, user.ID.Hex(), otp); err != nil {
		return err
	}

	return s.mailer.SendVerificationEmail(ctx, email, user.Name, otp)
}

func (s *authService) VerifyUser(
	ctx context.Context,
	email string,
	otp string,
) (*services.LoginResponse, error) {
	email = strings.TrimSpace(strings.ToLower(email))

	user, err := s.userRepo.FindByEmail(ctx, email)
	if err != nil {
		return nil, err
	}
	if user == nil {
		return nil, errors.New("user not found")
	}
	if user.IsVerified {
		return nil, errors.New("user already verified")
	}

	storedOTP, err := s.otpCache.Get(ctx, user.ID.Hex())
	if err != nil {
		return nil, errors.New("otp expired or invalid")
	}
	if storedOTP != strings.ToUpper(strings.TrimSpace(otp)) {
		return nil, errors.New("invalid otp")
	}

	if err := s.userRepo.UpdateVerification(ctx, user.ID, true); err != nil {
		return nil, err
	}
	if err := s.otpCache.Delete(ctx, user.ID.Hex()); err != nil {
		return nil, err
	}

	user.IsVerified = true
	return s.issueLoginResponse(user)
}

func (s *authService) LoginUser(
	ctx context.Context,
	email string,
	password string,
) (*services.LoginResponse, error) {
	email = strings.TrimSpace(strings.ToLower(email))

	user, err := s.userRepo.FindByEmail(ctx, email)
	if err != nil {
		return nil, err
	}
	if user == nil {
		return nil, apperrors.ErrInvalidEmailOrPassword 
	}
	if !user.IsVerified {
		return nil, apperrors.ErrEmailNotVerified 
	}

	if err := utils.ComparePassword(user.Password, password); err != nil {
		return nil, apperrors.ErrInvalidEmailOrPassword 
	}

	return s.issueLoginResponse(user)
}

func (s *authService) RefreshTokens(
	ctx context.Context,
	token string,
) (*services.TokenResponse, error) {
	claims, err := utils.VerifyToken(token, s.jwtSecret)
	if err != nil {
		return nil, err
	}

	userID, err := bson.ObjectIDFromHex(claims.UserID)
	if err != nil {
		return nil, err
	}

	user, err := s.userRepo.FindByID(ctx, userID)
	if err != nil {
		return nil, err
	}
	if user == nil || !user.IsVerified {
		return nil, errors.New("user not found")
	}

	return s.generateTokens(user)
}

func (s *authService) CurrentUser(
	ctx context.Context,
	token string,
) (*model.User, error) {
	claims, err := utils.VerifyToken(token, s.jwtSecret)
	if err != nil {
		return nil, err
	}

	userID, err := bson.ObjectIDFromHex(claims.UserID)
	if err != nil {
		return nil, err
	}

	user, err := s.userRepo.FindByID(ctx, userID)
	if err != nil {
		return nil, err
	}
	if user == nil {
		return nil, apperrors.ErrUserNotFound 
	}

	return user, nil
}
