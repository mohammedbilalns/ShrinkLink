package model

import (
	"time"

	"go.mongodb.org/mongo-driver/v2/bson"
)

type User struct {
	ID bson.ObjectID `bson:"_id,omitempty"` 
	Name string `bson:"name"`
	Email string `bson:"email"`
	Password string `bson:"password"`
	IsVerified bool `bson:"isVerified"`
	CreatedAt time.Time `bson:"createdAt"`
	UpdatedAt time.Time `bson:"updatedAt"`
}
