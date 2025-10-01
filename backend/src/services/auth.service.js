import { createUser, findUserByEmail } from "../dao/user.dao.js"
import { ConflictError, NotFoundError } from "../utils/errorHandler.js"
import { comparePassword, hashPassword, signToken } from "../utils/helper.js"

export const registerUser = async (name, email, password)=>{
	const user = await findUserByEmail(email)
	if(user) throw new ConflictError("User already exists")
	const hashedPassword = await hashPassword(password)
	const newUser = await createUser(name, email,hashedPassword)
	const token  = signToken({id: newUser._id, name: newUser.name}) 
	return {user,token} 
}


export const loginUser = async (email, password) =>{
	const user = await findUserByEmail(email)
	if(!user) throw new NotFoundError("User not found")
	const isValidPassword = await comparePassword(password, user.password )
	if(!isValidPassword) throw new AppError("Invalid credentials") 
	const token = signToken({id: user._id, name: user.name})
	return {user, token }
}
