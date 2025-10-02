import { accessCookieOptions, refreshCookieOptions } from "../config/cookie.config.js";
import { loginUser, refreshTokens, registerUser, resendOtp, verifyUser } from "../services/auth.service.js";
import { UnAuthorizedError } from "../utils/errorHandler.js";
import { wrapAsync } from "../utils/tryCatchWrapper.js";

export const register = wrapAsync(async (req,res)=>{
	const {name, email , password} = req.body 
	if(!name.trim() || !email.trim() || !password.trim()){
		throw new Error("Invalid data ")	
	}
  await registerUser(name, email,password)
	res.status(200).json({ success: true, message:"Otp Sent to your email"})
})

export const verify = wrapAsync(async (req,res)=>{
  const {email, otp} = req.body
  if(!email.trim() || !otp.trim()){
    throw new Error("Invalid data")
  }
  const {user, accessToken, refreshToken} = await verifyUser(email, otp)
	req.user = user 

	res.cookie("accessToken", accessToken, accessCookieOptions)
	res.cookie("refreshToken", refreshToken, refreshCookieOptions)
	res.status(200).json({user, succes: true,  message:"Login success"})
	
})
export const resend = wrapAsync(async (req,res)=>{
	const {email} = req.body
	if(!email.trim()){
		throw new Error("Invalid data")
	}
  await resendOtp(email)

	res.status(200).json({ succes: true,  message:"Resend OTP success"})
})

export const login = wrapAsync(async (req,res)=>{
	const {email,password} = req.body
	if( !email.trim() || !password.trim()){
		throw new Error("Invalid data")	
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
