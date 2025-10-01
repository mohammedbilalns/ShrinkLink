export const cookieOptions = {
	httpOnly: true , 
	secure: process.env.NODE_ENV == "production",
	sameSite: "Lax",
	maxAge: 1000* 60 * 5
}

export const refreshTokenOptions = {
	httpOnly: true , 
	secure: process.env.NODE_ENV == "production",
	sameSite: "Lax",
	maxAge: 1000* 60 * 60 * 24 * 30
}
