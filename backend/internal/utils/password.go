package utils

import "github.com/alexedwards/argon2id"


func HashPassword(password string) (string, error){
	return  argon2id.CreateHash(
		password,
		argon2id.DefaultParams,
		)
}

func ComparePassword(hash string, password string) error {
	_, err := argon2id.ComparePasswordAndHash(
		password,
		hash,
		)
	return  err
}
