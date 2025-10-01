import axiosInstance from "../utils/axiosInstance"

export const loginUser = async (email, password) =>{
	const {data} = await axiosInstance.post('/auth/login', {email, password})
	return data 
}

export const registerUser = async(name, email , password) => {
	const {data} = await axiosInstance.post('/auth/register', {name, email , password})
	console.log("api ", data)
	return data
}

export const logoutUser = async()=> {
	const {data} = await axiosInstance.get('/auth/logut')
	return data 
}
