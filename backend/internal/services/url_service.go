package services

import (
	"context"

	"github.com/mohammedbilalns/shrinklink/internal/model"
	"go.mongodb.org/mongo-driver/v2/bson"
)

type URLService interface {
	CreateShortURL(
		ctx context.Context,
		fullURL string,
		userID *bson.ObjectID,
	) (string, error)

	CreateCustomURL(
		ctx context.Context,
		fullURL string,
		slug string,
		userID bson.ObjectID,
	) (string, error)

	GetUserURLs(
		ctx context.Context,
		userID bson.ObjectID,
		page int64,
		limit int64,
	) ([]model.ShortURL, int64, error)

	ResolveShortURL(
		ctx context.Context,
		slug string,
	) (*model.ShortURL, error)
}
