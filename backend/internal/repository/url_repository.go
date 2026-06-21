package repository

import (
	"context"

	"github.com/mohammedbilalns/shrinklink/internal/model"
	"go.mongodb.org/mongo-driver/v2/bson"
)

type ShortURLRepository interface {
	Create(
		ctx context.Context,
		shortURL *model.ShortURL,
	) error

	FindByShortURL(
		ctx context.Context,
		shortURL string,
	) (*model.ShortURL, error)

	FindByShortURLAndIncrementClicks(
		ctx context.Context,
		shortURL string,
	) (*model.ShortURL, error)

	FindByUser(
		ctx context.Context,
		userId bson.ObjectID,
		skip int64,
		limit int64,
	) ([]model.ShortURL, int64, error)

	FindExistingURL(
		ctx context.Context,
		userID bson.ObjectID,
		fullURL string,
	) (*model.ShortURL, error)

	FindByShortSlug(
		ctx context.Context,
		shortURL string,
	) (*model.ShortURL, error)
}
