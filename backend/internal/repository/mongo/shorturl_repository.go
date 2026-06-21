package mongo

import (
	"context"
	"time"

	"github.com/mohammedbilalns/shrinklink/internal/model"
	"github.com/mohammedbilalns/shrinklink/internal/repository"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

type MongoShortURLRepository struct {
	collection *mongo.Collection
}

func (r *MongoShortURLRepository) Create(
	ctx context.Context,
	shortURL *model.ShortURL,
) error {
	now := time.Now().UTC()

	if shortURL.ID == (bson.ObjectID{}) {
		shortURL.ID = bson.NewObjectID()
	}

	shortURL.CreatedAt = now
	shortURL.UpdatedAt = now

	_, err := r.collection.InsertOne(
		ctx,
		shortURL,
	)

	return err
}

func (r *MongoShortURLRepository) FindByShortURL(
	ctx context.Context,
	shortURL string,
) (*model.ShortURL, error) {

	var url model.ShortURL

	err := r.collection.FindOne(
		ctx,
		bson.M{
			"shortUrl": shortURL,
		},
	).Decode(&url)

	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, nil
		}
		return nil, err
	}
	return &url, nil
}

func (r *MongoShortURLRepository) FindByShortURLAndIncrementClicks(
	ctx context.Context,
	shortURL string,
) (*model.ShortURL, error) {

	var url model.ShortURL

	opts := options.FindOneAndUpdate().SetReturnDocument(options.After)

	err := r.collection.FindOneAndUpdate(
		ctx,
		bson.M{
			"shortUrl": shortURL,
		},
		bson.M{
			"$inc": bson.M{
				"clicks": 1,
			},
		},
		opts,
	).Decode(&url)

	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, nil
		}
		return nil, err
	}

	return &url, nil
}

func (r *MongoShortURLRepository) FindExistingURL(
	ctx context.Context,
	userID bson.ObjectID,
	fullURL string,
) (*model.ShortURL, error) {

	var url model.ShortURL

	err := r.collection.FindOne(
		ctx,
		bson.M{
			"userId":  userID,
			"fullUrl": fullURL,
		},
	).Decode(&url)

	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, nil
		}
		return nil, err
	}

	return &url, nil
}

func (r *MongoShortURLRepository) FindByUser(
	ctx context.Context,
	userId bson.ObjectID,
	skip int64,
	limit int64,
) ([]model.ShortURL, int64, error) {

	filter := bson.M{
		"userId": userId,
	}

	totalCount, err := r.collection.CountDocuments(
		ctx,
		filter,
	)

	if err != nil {
		return nil, 0, err
	}

	opts := options.Find().SetSkip(skip).SetLimit(limit).SetSort(bson.D{
		{Key: "createdAt", Value: -1},
	})

	cursor, err := r.collection.Find(
		ctx,
		filter,
		opts,
	)

	if err != nil {
		return nil, 0, err
	}

	defer cursor.Close(ctx)

	var urls []model.ShortURL

	if err := cursor.All(ctx, &urls); err != nil {
		return nil, 0, err
	}

	return urls, totalCount, nil
}

func (r *MongoShortURLRepository) FindByShortSlug(
	ctx context.Context,
	shortURL string,
) (*model.ShortURL, error) {
	return r.FindByShortURL(ctx, shortURL)
}

func NewShortURLRepository(
	db *mongo.Database,
) repository.ShortURLRepository {
	return &MongoShortURLRepository{
		collection: db.Collection("shortUrl"),
	}
}
