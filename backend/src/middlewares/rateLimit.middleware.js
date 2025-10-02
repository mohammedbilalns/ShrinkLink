import { redisClient } from "../config/redis.config.js"

export function rateLimiter(limit, windowSec, strategy){
	return async (req, res,next)=>{
		try{
			let keyParts = ["rateLimit"]
			if(strategy.includes("ip")) keyParts.push(req.ip)
			if(strategy.includes("route")) keyParts.push(req.path)
			if(strategy.includes("global")) keyParts.push("global")

			const key = keyParts.join(":")
			const count = await redisClient.incr(key)

			if(count === 1){
				await redisClient.expire(key, windowSec)
			}

			if(count > limit){
				return res.status(429).json({message: "Too many requests"})
			}

			return next()

		}catch(err){
			console.log("Rate limit error", err)
			return res.status(500).json({message: "Internal server error"})
		}
	}
}
