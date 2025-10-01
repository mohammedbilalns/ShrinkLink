import express from "express";
import { redirectUrl } from "../controller/shortUrl.controller.js";
const router = express.Router()

router.get("/:id", redirectUrl)

export default router
