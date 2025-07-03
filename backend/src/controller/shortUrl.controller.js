import { getUrlFromShortUrl } from "../dao/shortUrl.js";
import { createShortUrWithoutUser } from "../services/shortUrl.service.js";
import { wrapAsync } from "../utils/tryCatchWrapper.js";

export const createShortUrl = wrapAsync(async (req, res) => {
  const { url } = req.body;
  const shortUrl = await createShortUrWithoutUser(url);
  res.send(process.env.APP_URL + shortUrl);
});

export const redirectUrl = wrapAsync(async (req, res) => {
  const { id } = req.params;
  const url = await getUrlFromShortUrl(id);
  if (!url) throw new Error("Short url is not found");
  res.redirect(url);
});
