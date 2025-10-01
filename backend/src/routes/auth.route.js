import { Router } from "express";
import { register,login, refresh, getMe } from "../controller/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
const router = Router()

router.post("/register", register)
router.post("/login", login)
router.post("/refresh", refresh)
router.get("/me", authMiddleware,getMe)


export default router
