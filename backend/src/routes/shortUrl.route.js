import express from "express";
import {
	createCustomShortUrl,
	createShortUrl,
} from "../controller/shortUrl.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/create", createShortUrl);
router.post("/custom",authMiddleware, createCustomShortUrl )

export default router;
