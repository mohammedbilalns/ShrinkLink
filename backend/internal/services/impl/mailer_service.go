package impl

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/mohammedbilalns/shrinklink/internal/config"
	services "github.com/mohammedbilalns/shrinklink/internal/services"
)

type mailService struct {
	apiURL  string
	apiKey  string
	from    string
	appName string
	client  *http.Client
}

func NewMailService(cfg config.Config) services.MailService {
	apiURL := strings.TrimSpace(cfg.BrevoAPIURL)
	if apiURL == "" {
		apiURL = "https://api.brevo.com/v3/smtp/email"
	}

	return &mailService{
		apiURL:  apiURL,
		apiKey:  strings.TrimSpace(cfg.BrevoAPIKey),
		from:    strings.TrimSpace(cfg.MailFrom),
		appName: "ShrinkLink",
		client: &http.Client{
			Timeout: 15 * time.Second,
		},
	}
}

type brevoEmailRequest struct {
	Sender struct {
		Email string `json:"email"`
		Name  string `json:"name"`
	} `json:"sender"`
	To []struct {
		Email string `json:"email"`
		Name  string `json:"name"`
	} `json:"to"`
	Subject     string `json:"subject"`
	HTMLContent string `json:"htmlContent"`
	TextContent string `json:"textContent"`
}

func (s *mailService) SendVerificationEmail(
	ctx context.Context,
	toEmail string,
	toName string,
	otp string,
) error {
	if s.apiKey == "" || s.from == "" {
		return errors.New("mail service is not configured")
	}

	payload := brevoEmailRequest{
		Subject:     "Verify your ShrinkLink account",
		HTMLContent: buildVerificationEmailHTML(toName, otp),
		TextContent: fmt.Sprintf("Your ShrinkLink verification code is %s. It expires in 5 minutes.", otp),
	}
	payload.Sender.Email = s.from
	payload.Sender.Name = s.appName
	payload.To = []struct {
		Email string `json:"email"`
		Name  string `json:"name"`
	}{{Email: toEmail, Name: toName}}

	body, err := json.Marshal(payload)
	if err != nil {
		return err
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, s.apiURL, bytes.NewReader(body))
	if err != nil {
		return err
	}
	req.Header.Set("accept", "application/json")
	req.Header.Set("content-type", "application/json")
	req.Header.Set("api-key", s.apiKey)

	resp, err := s.client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return fmt.Errorf("brevo send failed: %s", resp.Status)
	}

	return nil
}

func buildVerificationEmailHTML(name string, otp string) string {
	safeName := strings.TrimSpace(name)
	if safeName == "" {
		safeName = "there"
	}

	return fmt.Sprintf(`
		<!doctype html>
		<html>
		<head>
			<meta charset="utf-8">
			<meta name="viewport" content="width=device-width, initial-scale=1">
		</head>
		<body style="margin:0;padding:0;font-family:Arial,sans-serif;background:#f6f7fb;color:#111827;">
			<div style="max-width:600px;margin:0 auto;padding:32px 20px;">
				<div style="background:#ffffff;border-radius:16px;padding:32px;border:1px solid #e5e7eb;">
					<h1 style="margin:0 0 16px;font-size:28px;line-height:1.2;">Verify your email</h1>
					<p style="margin:0 0 16px;font-size:16px;line-height:1.6;">Hi %s, use the verification code below to finish creating your ShrinkLink account.</p>
					<div style="font-size:32px;letter-spacing:6px;font-weight:700;padding:16px 20px;background:#f3f4f6;border-radius:12px;display:inline-block;margin:8px 0 16px;">%s</div>
					<p style="margin:0;color:#6b7280;font-size:14px;line-height:1.6;">This code expires in 5 minutes. If you did not request this, you can ignore this email.</p>
				</div>
			</div>
		</body>
		</html>`, safeName, otp)
}
