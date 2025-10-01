import axiosInstance from "../utils/axiosInstance"

export const createShortUrl = async(url) =>{
		if(!url) throw new Error("Url is required")
    const {data} =  await axiosInstance.post("/api/url/create", { url })
    return data
}
