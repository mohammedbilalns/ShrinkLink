import { generateNanoId } from "../utils/helper.js";
import { saveShortUrl } from "../dao/shortUrl.js";

export const createShortUrWithoutUser = async (url) => {
  const shortUrl = generateNanoId(7);
  if(!shortUrl) throw new Error("Url is not generated")
  await saveShortUrl(shortUrl, url);
  return shortUrl;
};

export const createShortUrWithoUser = async (url, userId) => {
  const shortUrl = generateNanoId(7);
  await saveShortUrl(shortUrl, url, userId);
  return shortUrl;
};
