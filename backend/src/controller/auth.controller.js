import { accessCookieOptions, refreshCookieOptions } from "../config/cookie.config.js";
import { loginUser, refreshTokens, registerUser } from "../services/auth.service.js";
import { UnAuthorizedError } from "../utils/errorHandler.js";
import { wrapAsync } from "../utils/tryCatchWrapper.js";

export const register = wrapAsync(async (req,res)=>{
	const {name, email , password} = req.body 
	if(!name.trim() || !email.trim() || !password.trim()){
		throw new Error("Invalid data ")	
	}
	const {user, accessToken, refreshToken} = await registerUser(name, email,password)
	req.user = user 
	res.cookie("accessToken", accessToken, accessCookieOptions)
	res.cookie("refreshToken", refreshToken, refreshCookieOptions)
	res.status(200).json({ user, message:"Login success"}) 

})

export const login = wrapAsync(async (req,res)=>{
	const {email,password} = req.body
	if( !email.trim() || !password.trim()){
		throw new Error("Invalid data ")	
	}
	const {user, accessToken, refreshToken} = await loginUser(email, password)
	res.cookie("accessToken", accessToken, accessCookieOptions)
	res.cookie("refreshToken", refreshToken, refreshCookieOptions)
	req.user = user 
	res.status(200).json({user, succes: true,  message:"Login success"}) 
})

export const getMe = wrapAsync(async (req,res)=>{
	res.status(200).json({user:req.user}) 
})


export const logout = wrapAsync(async (_req,res)=>{
	res.clearCookie("accessToken")
	res.clearCookie("refreshToken")
	res.status(200).json({ success: true, message:"Logged out successfully"}) 
})

export const refresh = wrapAsync(async (req,res)=>{
	const token = req.cookies.refreshToken
	if(!token) throw new UnAuthorizedError()
	const {accessToken, refreshToken} = await refreshTokens(token)
	res.cookie("accessToken", accessToken, accessCookieOptions)
	res.cookie("refreshToken", refreshToken, refreshCookieOptions)
	res.status(200).json({success: true, message:"Refreshed successfully"})
})
