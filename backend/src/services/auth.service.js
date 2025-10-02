import { createUser, deleteOtp, findUserByEmail, findUserById, findUserWithPasswordByEmail, getOtp, saveOtp, updateOtp } from "../dao/user.dao.js"
import { ConflictError, NotFoundError, UnAuthorizedError } from "../utils/errorHandler.js"
import { comparePassword, hashPassword, signToken, verifyToken } from "../utils/helper.js"
import { generateOtp, sendOtp } from "../utils/otp.js"


function generateTokens(user) {
	const accessToken = signToken({id: user._id, name: user.name}) 
	const refreshToken = signToken({id: user._id})
	return {accessToken, refreshToken}
}

export const registerUser = async (name, email, password)=>{
	const user = await findUserByEmail(email)
	if(user) throw new ConflictError("User already exists")
	const hashedPassword = await hashPassword(password)
	const newUser = await createUser(name, email,hashedPassword)
	const otp = generateOtp() 
	await Promise.all([sendOtp(email,otp), saveOtp(newUser._id, otp)])
	return true 
}
export const resendOtp = async (email) =>{
	const user = await findUserByEmail(email)
	if(!user) throw new NotFoundError("User not found")
	const otp =  generateOtp()
	await Promise.all([sendOtp(email,otp), updateOtp(user._id, otp)])
	return true 
}

export const verifyUser = async (email, otp) =>{
	const user = await findUserByEmail(email)
	if(!user) throw new NotFoundError("User not found")
	const otpFromStore = await getOtp(user._id)
	if(otp !== otpFromStore) throw new UnAuthorizedError("Invalid otp")
	user.isVerified = true
	await Promise.all([user.save(), deleteOtp(user._id)])
	const {accessToken, refreshToken} = generateTokens(user)
	return {user, accessToken, refreshToken}
}

export const loginUser = async (email, password) =>{
	const user = await findUserWithPasswordByEmail(email)
	if(!user || !user.isVerified ) throw new NotFoundError("User not found")
	const isValidPassword = await comparePassword(password, user.password )
	if(!isValidPassword) throw new UnAuthorizedError("Invalid credentials") 
	const {accessToken, refreshToken} = generateTokens(user)
	return {user:{_id: user._id, name: user.name,email:  user.email}, accessToken, refreshToken }
}

export const refreshTokens  = async (token) =>{
	const decoded =  verifyToken(token)
	const user = await findUserById(decoded.id)
	if(!user) throw new NotFoundError("User not found")
	const {accessToken, refreshToken} = generateTokens(user)
	return {accessToken, refreshToken}
}
