import User from "../models/user.model.js"
import { redisClient } from "../config/redis.config.js"

export const findUserByEmail = async(email)=>{
	return await User.findOne({email})
}

export const findUserWithPasswordByEmail = async(email)=>{
	return await User.findOne({email}).select("+password")
}

export const findUserById = async(id) =>{
	return await User.findById(id)
}

export const createUser = async (name, email , password)=>{
	const newUser = User.create({name, email, password})
	return newUser
}
export const deleteUser = async (id) =>{
 	return await User.findByIdAndDelete(id)
}

export const saveOtp = async (userId, otp) =>{
	const otpKey = `user:${userId}:otp`
	await redisClient.setex(otpKey, 300, otp)
	return otpKey
}

export const getOtp = async (userId) =>{
	const otpKey = `user:${userId}:otp`
	return await redisClient.get(otpKey)
}

export const deleteOtp = async (userId) =>{
	const otpKey = `user:${userId}:otp`
	await redisClient.del(otpKey)
	return otpKey
}
export const updateOtp = async (userId, otp) =>{
	const otpKey = `user:${userId}:otp`
	await redisClient.setex(otpKey, 300, otp)
	return otpKey
}




