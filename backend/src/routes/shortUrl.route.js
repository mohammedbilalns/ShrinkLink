import express from "express";
import {
  createShortUrl,
} from "../controller/shortUrl.controller.js";

const router = express.Router();

router.post("/create", createShortUrl);

export default router;
