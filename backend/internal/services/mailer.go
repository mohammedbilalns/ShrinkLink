package services

import "context"

type MailService interface {
	SendVerificationEmail(
		ctx context.Context,
		toEmail string,
		toName string,
		otp string,
	) error
}
