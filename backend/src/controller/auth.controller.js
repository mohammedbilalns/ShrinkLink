import { cookieOptions } from "../config/cookie.config.js";
import { loginUser, registerUser } from "../services/auth.service.js";
import { wrapAsync } from "../utils/tryCatchWrapper.js";

export const register = wrapAsync(async (req,res)=>{
	const {name, email , password} = req.body 
	if(!name.trim() || !email.trim() || !password.trim()){
		throw new Error("Invalid data ")	
	}
	const {user, token} = await registerUser(name, email,password)
	req.user = user 
	res.cookie("accessToken", token, cookieOptions)
	res.status(200).json({ user, message:"Login success"}) 

})

export const login = wrapAsync(async (req,res)=>{
	const {email,password} = req.body
	if( !email.trim() || !password.trim()){
		throw new Error("Invalid data ")	
	}
	const {user,token} = await loginUser(email,password)
	req.user = user 
	res.cookie("accessToken",token, cookieOptions)
	res.status(200).json({user, succes: true,  message:"Login success"}) 
})

export const getMe = wrapAsync(async (req,res)=>{
	res.status(200).json({user:req.user}) 
})


export const logout = wrapAsync(async (_req,res)=>{
	res.clearCookie("accessToken")
	res.status(200).json({message:"Logged out successfully"}) 
})

export const refresh = wrapAsync(async (_req,res)=>{

})
