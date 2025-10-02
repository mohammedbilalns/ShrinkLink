import axiosInstance from "../utils/axiosInstance"

export const loginUser = async (email, password) =>{
	const {data} = await axiosInstance.post('/auth/login', {email, password})
	return data 
}

export const registerUser = async(name, email , password) => {
	const {data} = await axiosInstance.post('/auth/register', {name, email , password})
	return data
}

export const verifyOtp = async(email, otp) => {
	const {data} = await axiosInstance.post('/auth/verify', {email, otp})
	return data
}

export const resendOtp = async(email) => {
	const {data} = await axiosInstance.post('/auth/resend', {email})
	return data
}

export const logoutUser = async()=> {
	const {data} = await axiosInstance.get('/auth/logout')
	return data 
}

export const getCurrentUser = async()=> {
	const {data} = await axiosInstance.get('/auth/me')
	return data 
}

export const getAllUserUrls = async( page = 1, limit = 10) => {
	const {data} = await axiosInstance.get(`/api/user/urls?page=${page}&limit=${limit}`)
	return data
}



