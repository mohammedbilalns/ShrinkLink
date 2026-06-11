package main

import (
	"context"
	"log"

	"github.com/joho/godotenv"
	"github.com/mohammedbilalns/shrinklink/internal/config"
	"github.com/mohammedbilalns/shrinklink/internal/db"
)


func main(){

	err := godotenv.Load()

	if err != nil {
		log.Println(".env file not found ")
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
}
