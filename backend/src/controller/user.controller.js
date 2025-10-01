import {getUserShortUrls} from "../services/shortUrl.service.js";
import { wrapAsync } from "../utils/tryCatchWrapper.js";

export const getAllUserUrls = wrapAsync(async (req,res)=>{
	const {_id}  = req.user 
	const {page , limit} = req.query
	const urls = await getUserShortUrls(_id, page, limit)
	res.status(200).json({success: true, messag: "Urls fetched successfully", urls})
})
