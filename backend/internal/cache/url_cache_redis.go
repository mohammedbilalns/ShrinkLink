package cache

import (
	"context"
	"fmt"

	"github.com/redis/go-redis/v9"
)

type RedisURLCache struct {
	client *redis.Client
}

func NewURLCache(
	client *redis.Client,
) URLCache {
	return &RedisURLCache{
		client: client,
	}
}

func (c *RedisURLCache) DeleteUserURLs(
	ctx context.Context,
	userID string,
) error {

	pattern :=  fmt.Sprintf(
		"user:%s:urls:*",
		userID,
		)

	keys, err := c.client.Keys(
		ctx,
		pattern,
		).Result()

	if err != nil {
		return err
	}

	if len(keys) == 0 {
		return nil 
	}

	return c.client.Del(
		ctx,
		keys...,
		).Err()
}
