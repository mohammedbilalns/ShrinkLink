package utils

import "crypto/rand"

const slugChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

func GenerateSlug(length int) string {
	if length <= 0 {
		length = 8
	}

	bytes := make([]byte, length)
	if _, err := rand.Read(bytes); err != nil {
		panic(err)
	}

	slug := make([]byte, length)
	for i, b := range bytes {
		slug[i] = slugChars[int(b)%len(slugChars)]
	}

	return string(slug)
}
