package repository

import (
	"context"

	"github.com/mohammedbilalns/shrinklink/internal/model"
	"go.mongodb.org/mongo-driver/v2/bson"
)

type UserRepository interface {
	Create(
		ctx context.Context,
		user *model.User,
	) error

	FindByEmail(
		ctx context.Context,
		email string,
	) (*model.User, error)

	FindByID(
		ctx context.Context,
		id bson.ObjectID,
	) (*model.User, error)

	Delete(
		ctx context.Context,
		id bson.ObjectID,
	) error

}
