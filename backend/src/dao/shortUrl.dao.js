import urlSchema from "../models/shortUrl.model.js";

export const saveShortUrl = async (shortUrl, fullUrl, userId) => {
	console.log("data in dao", shortUrl, fullUrl, userId)
  try {
    const newUrl = new urlSchema({
      shortUrl,
      fullUrl,
    });
    if (userId) {
      newUrl.userId = userId;
    }

    await newUrl.save();
  } catch (err) {
		if(err.code === 11000){
			throw new ConflictError("Short url already exists")
		}
    throw new Error(err.message);
  }
};

export const getUrlFromShortUrl = async (shortUrl) => {
  try {
    const url = await urlSchema.findOneAndUpdate(
      { shortUrl },
      { $inc: { clicks: 1 } }
    );
    return url.fullUrl;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const getCustomShortUrl = async(slug)=>{
	return  await urlSchema.findOne({shortUrl: slug})
}
