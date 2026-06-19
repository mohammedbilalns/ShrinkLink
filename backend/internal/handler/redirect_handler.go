package handler

import (
	"net/http"

)

func CreateShortURI(w http.ResponseWriter, r *http.Request){}

func RedirectURI(w http.ResponseWriter, r *http.Request){
	id := r.PathValue("id")
	// validate the id 	

}

func CreateCustomURI(w http.ResponseWriter, r *http.Request){}

