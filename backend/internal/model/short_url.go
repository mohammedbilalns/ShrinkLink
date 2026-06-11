package model

import (
	"time"

	"go.mongodb.org/mongo-driver/v2/bson"
)

type ShortURL struct {
	ID bson.ObjectID `bson:"_id,omitempty"`
	FullURL string `bson:"fullUrl"`
	ShortURL string `bson:"shortUrl"`
	Clicks int `bson:"clicks"`
	UserId bson.ObjectID `bson:"userId"`

	CreatedAt time.Time `bson:"createdAt"`
	UpdatedAt time.Time `bson:"udpatedAt"`
}
