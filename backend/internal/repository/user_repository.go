package repository

import (
	"context"

	"github.com/mohammedbilalns/shrinklink/internal/model"
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

	FindById(
		ctx context.Context,
		id string,
	) (*model.User, error)

	Delete(
		ctx context.Context,
		id string,
	) error

}
