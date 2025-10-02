import { getUrlFromShortUrl } from "../dao/shortUrl.dao.js";
import { createCustomShortUrlWithUser, createShortUrWithoutUser, createShortUrWithUser } from "../services/shortUrl.service.js";
import { wrapAsync } from "../utils/tryCatchWrapper.js";

export const createShortUrl = wrapAsync(async (req, res) => {
	const { url } = req.body;
	if(!url) throw new Error("Inavlid data")
	let shortUrl  
	if(req.user){
		shortUrl = await createShortUrWithUser(url, req.user._id)	
	}else {
		shortUrl = await createShortUrWithoutUser(url);
	}
	res.send(process.env.APP_URL + shortUrl);
});

export const redirectUrl = wrapAsync(async (req, res) => {
  const { id } = req.params
  const url = await getUrlFromShortUrl(id,req.user._id);
  if (!url) throw new Error("Short url is not found");
  res.redirect(url);
});


export const createCustomShortUrl = wrapAsync(async (req,res)=>{
	const {url, slug} =req.body 
	
	if(!url || !slug) throw new Error("Inalid data")
	const user = req.user 
	const shortUrl = await createCustomShortUrlWithUser(url, user.id,slug)
	res.status(200).send(process.env.APP_URL + shortUrl)
})

