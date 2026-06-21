package db

import (
	"context"

	"github.com/redis/go-redis/v9"
)


func ConnectRedis(uri string ) (*redis.Client, error){

	opt, err := redis.ParseURL(uri)
	if err != nil {
		return nil, err 
	}

	client := redis.NewClient(opt)

	if err := client.Ping(context.Background()).Err(); err != nil {
		return nil, err 
	}

	return client, err 

}
