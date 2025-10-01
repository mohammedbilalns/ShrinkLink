import axios from "axios";

const axiosInstance = axios.create({
	baseURL:"http://localhost:5000"
	,timeout:10000,
	withCredentials: true
})

axiosInstance.interceptors.response.use(
	(response) =>{
		return response
	},
	(error) => {
		if(error.response){
			const {status, data} = error.response
			switch(status){
				case 400:
					console.error("Bad request", data)
					break ;
				case 401: 
					console.error("Unauthorized", data)
					break 
				case 403:
					console.error("Forbidden", data)
					break
				case 404: 
					console.error("Not found", data)
					break
				case 500:
					console.error("Server error", data)
					break 
				default:
					console.error(`Error ${status}`, data)
			}
		}else if(error.request){
			console.error("Network Error: No response recieved",error.request)
		}else {
			console.error("Error", error.message)
		}
		throw error 
	}
)

export default axiosInstance
