package mongo

import (
	"context"

	"github.com/mohammedbilalns/shrinklink/internal/model"
	"github.com/mohammedbilalns/shrinklink/internal/repository"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

type MongoShortURLRepository struct {
	collection *mongo.Collection
}

func (r *MongoShortURLRepository) Create(
	ctx context.Context,
	shortURL *model.ShortURL,
) error {
	panic("not implemented")
}

func (r *MongoShortURLRepository) FindByShortURL(
	ctx context.Context,
	shortURL string,
) (*model.ShortURL, error) {
	panic("not implemented")
}

func (r *MongoShortURLRepository) FindAllByUser(
	ctx context.Context,
	userId string,
	skip int,
	limit int,
)([]model.ShortURL, error){
	panic("not implemented")
}

func NewShortURLRepository(
	db *mongo.Database,
) repository.ShortURLRepository{
	return &MongoShortURLRepository{
		collection: db.Collection("shortUrl"),
	}
}
