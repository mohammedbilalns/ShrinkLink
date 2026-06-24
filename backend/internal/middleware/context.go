package middleware

import (
	"context"

	"github.com/mohammedbilalns/shrinklink/internal/model"
)

type contextKey string

const UserContextKey contextKey = "user"

func UserFromContext(ctx context.Context) *model.User {
	user, _ := ctx.Value(UserContextKey).(*model.User)
	return user
}
