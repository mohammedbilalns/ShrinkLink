import { generateNanoId } from "../utils/helper.js";
import { getAllUrlsByUser, getCustomShortUrl, getExistingUrl, saveShortUrl } from "../dao/shortUrl.dao.js";

export const createShortUrWithoutUser = async (url) => {
  const shortUrl = generateNanoId(7);
  if(!shortUrl) throw new Error("Url is not generated")
  await saveShortUrl(shortUrl, url);
  return shortUrl;
};

export const createShortUrWithUser = async (url, userId ) => {
	const exists = await getExistingUrl(userId, url)
	if(exists) return exists.shortUrl
  const shortUrl =  generateNanoId(7);
  await saveShortUrl(shortUrl, url, userId);
  return shortUrl;
};

export const createCustomShortUrlWithUser = async (url,userId, slug) =>{
	const exists = await getCustomShortUrl(slug)
	if(exists) throw new Error("This custom url already exists")
	await saveShortUrl(slug, url, userId)
	return slug 
}

export const getUserShortUrls = async (userId, page, limit) => {
	const skip = (page-1) * limit
	const {urls, totalCount}=  await getAllUrlsByUser(userId, skip, limit)
	const totalPages = Math.ceil(totalCount/limit)
	return {urls, totalPages}
}
