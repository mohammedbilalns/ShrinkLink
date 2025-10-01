import { createUser, findUserByEmail, findUserById, findUserWithPasswordByEmail } from "../dao/user.dao.js"
import { ConflictError, NotFoundError, UnAuthorizedError } from "../utils/errorHandler.js"
import { comparePassword, hashPassword, signToken, verifyToken } from "../utils/helper.js"


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
	const {accessToken, refreshToken} = generateTokens(newUser)
	return {user: {_id: newUser._id, name: newUser.name, email: newUser.email}, accessToken, refreshToken}
}


export const loginUser = async (email, password) =>{
	const user = await findUserWithPasswordByEmail(email)
	if(!user) throw new NotFoundError("User not found")
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
