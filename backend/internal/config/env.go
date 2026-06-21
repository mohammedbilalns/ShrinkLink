package config

import (
	"fmt"
	"os"
)

type Config struct {
	Port        string
	AppURL      string
	BrevoAPIKey string
	BrevoAPIURL string
	FrontendURL string
	JWTSecret   string
	MailFrom    string
	MongoURI    string
	RedisURI    string
}

func Load() Config {
	cfg := Config{
		Port:        os.Getenv("PORT"),
		AppURL:      os.Getenv("APP_URL"),
		BrevoAPIKey: os.Getenv("BREVO_API_KEY"),
		BrevoAPIURL: os.Getenv("BREVO_API_URL"),
		FrontendURL: os.Getenv("FRONTEND_URL"),
		JWTSecret:   os.Getenv("JWT_SECRET"),
		MailFrom:    os.Getenv("MAIL_FROM"),
		MongoURI:    os.Getenv("MONGO_URI"),
		RedisURI:    os.Getenv("REDIS_URI"),
	}

	required := map[string]string{
		"PORT":          cfg.Port,
		"APP_URL":       cfg.AppURL,
		"BREVO_API_KEY": cfg.BrevoAPIKey,
		"FRONTEND_URL":  cfg.FrontendURL,
		"JWT_SECRET":    cfg.JWTSecret,
		"MAIL_FROM":     cfg.MailFrom,
		"MONGO_URI":     cfg.MongoURI,
		"REDIS_URI":     cfg.RedisURI,
	}

	if cfg.BrevoAPIURL == "" {
		cfg.BrevoAPIURL = "https://api.brevo.com/v3/smtp/email"
	}

	for key, value := range required {
		if value == "" {
			panic(fmt.Sprintf("%s is required", key))
		}
	}
	return cfg
}
