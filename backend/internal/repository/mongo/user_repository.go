package mongo

import (
	"context"
	"errors"
	"time"

	"github.com/mohammedbilalns/shrinklink/internal/model"
	"github.com/mohammedbilalns/shrinklink/internal/repository"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

type MongoUserRepository struct {
	collection *mongo.Collection
}

func (r *MongoUserRepository) Create(
	ctx context.Context,
	user *model.User,
) error {
	now := time.Now().UTC()

	if user.ID == (bson.ObjectID{}) {
		user.ID = bson.NewObjectID()
	}

	user.CreatedAt = now
	user.UpdatedAt = now

	_, err := r.collection.InsertOne(
		ctx,
		user,
	)
	if err != nil {
		if isDuplicateKeyError(err) {
			return repository.ErrDuplicateEmail
		}
	}
	return err
}

func isDuplicateKeyError(err error) bool {
	var writeErr mongo.WriteException
	if errors.As(err, &writeErr) && writeErr.HasErrorCode(11000) {
		return true
	}

	var bulkErr mongo.BulkWriteException
	if errors.As(err, &bulkErr) && bulkErr.HasErrorCode(11000) {
		return true
	}

	return false
}

func (r *MongoUserRepository) FindByEmail(
	ctx context.Context,
	email string,
) (*model.User, error) {

	var user model.User

	err := r.collection.FindOne(
		ctx,
		bson.M{
			"email": email,
		},
	).Decode(&user)

	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, nil
		}
		return nil, err
	}

	return &user, nil
}

func (r *MongoUserRepository) FindByID(
	ctx context.Context,
	id bson.ObjectID,
) (*model.User, error) {

	var user model.User

	err := r.collection.FindOne(
		ctx,
		bson.M{
			"_id": id,
		},
	).Decode(&user)

	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, nil
		}
		return nil, err
	}
	return &user, nil
}

func (r *MongoUserRepository) Delete(
	ctx context.Context,
	id bson.ObjectID,
) error {

	_, err := r.collection.DeleteOne(
		ctx,
		bson.M{
			"_id": id,
		},
	)

	return err
}

func (r *MongoUserRepository) UpdateVerification(
	ctx context.Context,
	id bson.ObjectID,
	verified bool,
) error {
	_, err := r.collection.UpdateOne(
		ctx,
		bson.M{"_id": id},
		bson.M{
			"$set": bson.M{
				"isVerified": verified,
				"updatedAt":  time.Now().UTC(),
			},
		},
	)

	return err
}

func NewUserRepository(
	db *mongo.Database,
) (repository.UserRepository, error) {
	repo := &MongoUserRepository{
		collection: db.Collection("users"),
	}

	_, err := repo.collection.Indexes().CreateOne(
		context.Background(),
		mongo.IndexModel{
			Keys: bson.D{{Key: "email", Value: 1}},
			Options: options.Index().
				SetUnique(true).
				SetName("uniq_users_email"),
		},
	)
	if err != nil {
		return nil, err
	}

	return repo, nil
}
