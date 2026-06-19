package handler

import "net/http"



func Register(w http.ResponseWriter, r *http.Request){}

func VerifyOTP(w http.ResponseWriter, r *http.Request){}

func ResendOTP(w http.ResponseWriter, r *http.Request){}

func Login(w http.ResponseWriter, r *http.Request){}

func RefreshToken(w http.ResponseWriter, r *http.Request){}

func GetSession(w http.ResponseWriter, r *http.Request){}

func Logout(w http.ResponseWriter, r * http.Request){}
