package app

import (
	"github.com/mohammedbilalns/shrinklink/internal/config"
	"github.com/redis/go-redis/v9"
	"go.mongodb.org/mongo-driver/v2/mongo"
)


type App struct {
	Config config.Config

	Mongo *mongo.Client
	Redis *redis.Client
}

