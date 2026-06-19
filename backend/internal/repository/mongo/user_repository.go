package mongo

import (
	"context"

	"github.com/mohammedbilalns/shrinklink/internal/model"
	"github.com/mohammedbilalns/shrinklink/internal/repository"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

type MongoUserRepository struct {
	collection *mongo.Collection
}

func (r *MongoUserRepository) Create(
	ctx context.Context,
	user *model.User,
) error {

	_, err := r.collection.InsertOne(
		ctx,
		user,
		)
	return  err 
}

func (r *MongoUserRepository) FindByEmail(
	ctx context.Context,
	email string,
)(*model.User, error){

	var user model.User

	err := r.collection.FindOne(
		ctx,
		bson.M{
			"email": email,
		},
		).Decode(&user)

	if err != nil {
		return nil, err 
	}

	return &user, nil 
}

func (r *MongoUserRepository) FindByID(
	ctx context.Context,
	id bson.ObjectID,
)(*model.User , error) {

	var user model.User

	err := r.collection.FindOne(
		ctx,
		bson.M{
			"_id": id,
		},
		).Decode(&user)

	if err != nil {
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

func NewUserRepository(
	db *mongo.Database,
) repository.UserRepository {
	return &MongoUserRepository{
		collection: db.Collection("users"),
	}
}
