import axiosInstance from "../utils/axiosInstance"

export const loginUser = async (email, password) =>{
	const {data} = await axiosInstance.post('/api/auth/login', {email, password})
	return data 
}

export const registerUser = async(name, email , password) => {
	const {data} = await axiosInstance.post('/api/auth/register', {name, email , password})
	return data
}

export const verifyOtp = async(email, otp) => {
	const {data} = await axiosInstance.post('/api/auth/verify', {email, otp})
	return data
}

export const resendOtp = async(email) => {
	const {data} = await axiosInstance.post('/api/auth/resend', {email})
	return data
}

export const logoutUser = async()=> {
	const {data} = await axiosInstance.get('/api/auth/logout')
	return data 
}

export const getCurrentUser = async()=> {
	const {data} = await axiosInstance.get('/api/auth/me')
	return data 
}

export const getAllUserUrls = async( page = 1, limit = 10) => {
	const {data} = await axiosInstance.get(`/api/user/urls?page=${page}&limit=${limit}`)
	return data
}



