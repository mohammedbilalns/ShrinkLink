package main

import (
	"context"
	"log"
	"net/http"

	"github.com/joho/godotenv"
	"github.com/mohammedbilalns/shrinklink/internal/app"
	"github.com/mohammedbilalns/shrinklink/internal/cache"
	"github.com/mohammedbilalns/shrinklink/internal/config"
	"github.com/mohammedbilalns/shrinklink/internal/db"
	"github.com/mohammedbilalns/shrinklink/internal/middleware"
	"github.com/mohammedbilalns/shrinklink/internal/repository/mongo"
	"github.com/mohammedbilalns/shrinklink/internal/router"
	serviceimpl "github.com/mohammedbilalns/shrinklink/internal/services/impl"
)

func main() {

	if err := godotenv.Load(); err != nil {
		log.Println(".env file not found, using system environment")
	}

	cfg := config.Load()

	log.Println("Config Loaded")

	mongoClient, err := db.ConnectMongo(cfg.MongoURI)
	if err != nil {
		log.Fatal(err)
	}
	defer mongoClient.Disconnect(context.Background())

	log.Println("Mongo Connected")

	redisClient, err := db.ConnectRedis(cfg.RedisURI)
	if err != nil {
		log.Fatal(err)
	}
	defer redisClient.Close()

	log.Println("Redis Connected")

	app := &app.App{
		Config: cfg,
		Mongo:  mongoClient,
		Redis:  redisClient,
	}

	database := mongoClient.Database("shrinklink")
	userRepo := mongo.NewUserRepository(database)
	shortURLRepo := mongo.NewShortURLRepository(database)
	otpCache := cache.NewOTPCache(redisClient)
	urlCache := cache.NewURLCache(redisClient)
	mailService := serviceimpl.NewMailService(cfg)
	authService := serviceimpl.NewAuthService(userRepo, otpCache, mailService, cfg.JWTSecret)
	urlService := serviceimpl.NewURLService(shortURLRepo, cfg.AppURL)

	app.UserRepo = userRepo
	app.ShortURLRepo = shortURLRepo
	app.OTPCache = otpCache
	app.URLCache = urlCache
	app.MailService = mailService
	app.AuthService = authService
	app.URLService = urlService

	mux := router.Register(app)

	handler := middleware.Logger(mux)
	handler = middleware.Recovery(handler)
	handler = middleware.Security(handler)
	handler = middleware.CORS(cfg.FrontendURL)(handler)

	server := &http.Server{
		Addr:    ":" + cfg.Port,
		Handler: handler,
	}

	log.Printf("Server listening on %s", server.Addr)

	if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Fatal(err)

	}
}
