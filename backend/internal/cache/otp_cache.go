package cache

import "context"


type OTPCache interface {
	Save(
		ctx context.Context,
		userID string,
		otp string,
	) error

	Get(
		ctx context.Context,
		userID string,
	)(string, error )

	Delete(
		ctx context.Context,
		userID string,
	) error

	Update(
		ctx context.Context,
		userID string,
		otp string,
	) error
}

