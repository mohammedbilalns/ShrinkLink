package cache

import (
	"context"
	"fmt"
	"time"

	"github.com/redis/go-redis/v9"
)

type RedisOTPCache struct {
	client *redis.Client
}

func NewOTPCache(
	client *redis.Client,
) OTPCache {
	return &RedisOTPCache{
		client: client,
	}
}

func (c *RedisOTPCache) Save(
	ctx context.Context,
	userID string,
	otp string,
) error {

	key := fmt.Sprintf(
		"user:%s:otp",
		userID,
		)

	return c.client.Set(
		ctx,
		key,
		otp,
		5 *time.Minute,
		).Err()
}

func (c *RedisOTPCache) Get(
	ctx context.Context,
	userID string,
)(string, error){

	key := fmt.Sprintf(
		"user:%s:otp",
		userID,
		)

	return c.client.Get(
		ctx,
		key,
		).Result()
}

func ( c*RedisOTPCache) Delete(
	ctx context.Context,
	userID string,
) error {
	key := fmt.Sprintf(
		"user:%s:otp",
		userID,
		)

	return c.client.Del(
		ctx,
		key,
		).Err()
}

func (c *RedisOTPCache) Update(
	ctx context.Context,
	userID string,
	otp string,
) error {

	return c.Save(
		ctx,
		userID,
		otp,
		)
}
