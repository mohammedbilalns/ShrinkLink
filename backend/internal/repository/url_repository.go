package repository

import (
	"context"

	"github.com/mohammedbilalns/shrinklink/internal/model"
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

	FindAllByUser(
		ctx context.Context,
		userId string,
		skip int,
		limit int, 
	) ([]model.ShortURL, error)

}
