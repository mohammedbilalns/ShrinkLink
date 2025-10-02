import { Router } from "express";
import { register,login, refresh, getMe, logout, verify, resend } from "../controller/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { rateLimiter } from "../middlewares/rateLimit.middleware.js";
const router = Router()

router.post("/register",rateLimiter(5,60,["ip", "route"]), register)
router.post("/verify",rateLimiter(5,60,["ip", "route"]), verify)
router.post("/resend",rateLimiter(5,60,["ip", "route"]), resend)
router.post("/login",rateLimiter(5,60,["ip", "route"]), login)
router.post("/refresh",rateLimiter(5,60, ["ip", "route"]), refresh)
router.get("/me", authMiddleware,getMe)
router.get("/logout",logout)


export default router
