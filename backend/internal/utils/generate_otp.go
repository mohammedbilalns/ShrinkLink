package utils

import "crypto/rand"

const otpChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
func GenerateOTP(length int8) string {

	bytes := make([]byte, length)

	_, err := rand.Read(bytes)
	if err != nil {
		panic(err)
	}

	otp := make([]byte, length)

	for i , b := range bytes {
		otp[i] = otpChars[int(b)%len(otpChars)]
	}

	return string(otp)

}
