import { redisClient } from "../config/redis.config.js";
import urlSchema from "../models/shortUrl.model.js";

export const saveShortUrl = async (shortUrl, fullUrl, userId) => {
  try {
    const newUrl = new urlSchema({
      shortUrl,
      fullUrl,
    });
    if (userId) {
      newUrl.userId = userId;
    }

		await newUrl.save();
		if (userId) await deleteUsersCache(userId)
	} catch (err) {
		if(err.code === 11000){
			throw new ConflictError("Short url already exists")
		}
    throw new Error(err.message);
  }
};

export const getUrlFromShortUrl = async (shortUrl, userId) => {
  try {
    const url = await urlSchema.findOneAndUpdate(
      { shortUrl },
      { $inc: { clicks: 1 } }
    );
		if(userId) await deleteUsersCache(userId)
    return url.fullUrl;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const getCustomShortUrl = async(slug)=>{
	return  await urlSchema.findOne({shortUrl: slug})
}

export const getAllUrlsByUser = async(userId, skip, limit) =>{

  const cacheKey = `user:${userId}:urls:${skip}:${limit}`;	
	const cachedData = await redisClient.get(cacheKey)

	if(cachedData) return JSON.parse(cachedData)

	const [urls, totalCount ] = await Promise.all([urlSchema.find({userId}).skip(skip).limit(limit).sort({createdAt: -1}).lean(),urlSchema.countDocuments({userId})])
	const result = {urls, totalCount}
	await redisClient.setex(cacheKey, 500, JSON.stringify(result))
	return result 
}

export const getExistingUrl= async(userId, url) => {
 return await urlSchema.findOne({userId, fullUrl: url})	
}


const deleteUsersCache = async (userId) => {
	const keys = await redisClient.keys(`user:${userId}:urls:*`);
	if (keys.length > 0) {
		await redisClient.del(...keys);
	}
};

