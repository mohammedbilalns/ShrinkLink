import axiosInstance from "../utils/axiosInstance"

export const createShortUrl = async(url, slug) =>{
	if(!url) throw new Error("Url is required")
	if(!slug){
		const {data} =  await axiosInstance.post("/api/url/create", { url })
		return data
	}

	const {data } = await axiosInstance.post("/api/url/custom", { url, slug })
	return data 
}
