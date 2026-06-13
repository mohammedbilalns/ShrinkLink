package mongo

import (
	"context"

	"github.com/mohammedbilalns/shrinklink/internal/model"
	"github.com/mohammedbilalns/shrinklink/internal/repository"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

type MongoUserRepository struct {
	collection *mongo.Collection
}

func (r *MongoUserRepository) Create(
	ctx context.Context,
	user *model.User,
) error {
	panic("not implemented")
}

func (r *MongoUserRepository) FindByEmail(
	ctx context.Context,
	email string,
)(*model.User, error){
	panic("not implemented")
}

func (r *MongoUserRepository) FindByID(
	ctx context.Context,
	id string,
)(*model.User , error) {
	panic("not implemented")
}
func (r *MongoUserRepository) Delete(
	ctx context.Context,
	id string,
) error {

	panic("not implemented")
}

func NewUserRepository(
	db *mongo.Database,
) repository.UserRepository {
	return &MongoUserRepository{
		collection: db.Collection("users"),
	}
}
