package app

import (
	"github.com/mohammedbilalns/shrinklink/internal/cache"
	"github.com/mohammedbilalns/shrinklink/internal/config"
	"github.com/mohammedbilalns/shrinklink/internal/repository"
	"github.com/mohammedbilalns/shrinklink/internal/services"
	"github.com/redis/go-redis/v9"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

type App struct {
	Config config.Config

	Mongo        *mongo.Client
	Redis        *redis.Client
	UserRepo     repository.UserRepository
	ShortURLRepo repository.ShortURLRepository
	OTPCache     cache.OTPCache
	URLCache     cache.URLCache
	MailService  services.MailService
	AuthService  services.AuthService
	URLService   services.URLService
}
