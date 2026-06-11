package main

import (
	"log"

	"github.com/joho/godotenv"
	"github.com/mohammedbilalns/shrinklink/internal/config"
)


func main(){

	err := godotenv.Load()

	if err != nil {
		log.Println(".env file not found ")
	}
	cfg := config.Load()
}
