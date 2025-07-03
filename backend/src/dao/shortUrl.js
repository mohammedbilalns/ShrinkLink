import urlSchmea from "../models/shortUrl.model.js";

export const saveShortUrl = async (shortUrl, fullUrl, userId) => {
  try {
    const newUrl = new urlSchmea({
      shortUrl,
      fullUrl,
    });
    if (userId) {
      newUrl.userId = userId;
    }

    await newUrl.save();
  } catch (err) {
    throw new Error(err.message);
  }
};

export const getUrlFromShortUrl = async (shortUrl) => {
  try {
    const url = await urlSchmea.findOneAndUpdate(
      { shortUrl },
      { $inc: { clicks: 1 } }
    );
    return url.fullUrl;
  } catch (err) {
    throw new Error(err.message);
  }
};
