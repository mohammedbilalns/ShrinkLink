import { cookieOptions } from "../config/cookie.config.js";
import { loginUser, registerUser } from "../services/auth.service.js";
import { AppError } from "../utils/errorHandler.js";
import { wrapAsync } from "../utils/tryCatchWrapper.js";

export const register = wrapAsync(async (req,res)=>{
	const {name, email , password} = req.body 
	if(!name.trim() || !email.trim() || !password.trim()){
		throw new AppError("Invalid data ")	
	}
	const {user, token} = await registerUser(name, email,password)
	req.user = user 
	res.cookie("accessToken", token, cookieOptions)
	res.status(200).json({message:"Login success"}) 

})

export const login = wrapAsync(async (req,res)=>{
	const {email,password} = req.body
	if( !email.trim() || !password.trim()){
		throw new AppError("Invalid data ")	
	}
	const {user,token} = await loginUser(email,password)
	req.user = user 
	res.cookie("accessToken",token, cookieOptions)
	res.status(200).json({message:"Login success"}) 
})


export const refresh = wrapAsync(async (req,res)=>{

})
