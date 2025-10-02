import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { getAllUserUrls } from "../controller/user.controller.js";

const router = Router()

router.get("/urls", authMiddleware,getAllUserUrls)

export default router
