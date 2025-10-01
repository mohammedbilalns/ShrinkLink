import { nanoid } from "nanoid"
import jwt from "jsonwebtoken"
import argon2 from "argon2"

export const generateNanoId = (length) =>{
    return nanoid(length)
}

export const  signToken = (payload) =>{
	return jwt.sign(payload,process.env.JWT_SECRET, {expiresIn: "5m"})  
}

export const verifyToken = (token)=>{
	return jwt.verify(token, process.env.JWT_SECRET)
}

export const  hashPassword = async (password) =>{
	return  await  argon2.hash(password) 
}

export const comparePassword =  async (password, savedPassword) =>{
	return await argon2.verify(savedPassword, password)
}
