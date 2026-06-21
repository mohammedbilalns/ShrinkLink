package model

import (
	"time"

	"go.mongodb.org/mongo-driver/v2/bson"
)

type ShortURL struct {
	ID        bson.ObjectID `bson:"_id,omitempty" json:"_id,omitempty"`
	FullURL   string        `bson:"fullUrl" json:"fullUrl"`
	ShortURL  string        `bson:"shortUrl" json:"shortUrl"`
	Clicks    int           `bson:"clicks" json:"clicks"`
	UserID    bson.ObjectID `bson:"userId,omitempty" json:"userId,omitempty"`
	CreatedAt time.Time     `bson:"createdAt" json:"createdAt"`
	UpdatedAt time.Time     `bson:"updatedAt" json:"updatedAt"`
}
