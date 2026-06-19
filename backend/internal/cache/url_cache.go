package cache

import "context"

type URLCache interface {
	DeleteUserURLs(
		ctx context.Context,
		userID string,
	) error
}

